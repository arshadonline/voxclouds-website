import { NextRequest, NextResponse } from 'next/server'

const TELNYX_API_KEY = process.env.TELNYX_API_KEY || ''
const TELNYX_API = 'https://api.telnyx.com/v2/available_phone_numbers'

// Markup multiplier on Telnyx cost (e.g. 2.5x = Telnyx $1 → we charge $2.50)
const MONTHLY_MARKUP = 2.5
const SETUP_MARKUP = 2.0
// Minimum sell prices
const MIN_MONTHLY = 5.0
const MIN_SETUP = 5.0

// Country code to ISO mapping
const COUNTRY_ISO: Record<string, string> = {
  US: '1', GB: '44', DE: '49', IT: '39', FR: '33', CA: '1', AU: '61',
  PK: '92', NL: '31', ES: '34', IE: '353', PL: '48', SE: '46', BE: '32',
  CH: '41', BR: '55', MX: '52', SG: '65', HK: '852', JP: '81',
  ZA: '27', NG: '234', PT: '351', AT: '43', DK: '45', NO: '47',
  FI: '358', NZ: '64', IL: '972', CZ: '420', RO: '40',
}

const COUNTRY_NAME: Record<string, string> = {
  US: 'United States', GB: 'United Kingdom', DE: 'Germany', IT: 'Italy',
  FR: 'France', CA: 'Canada', AU: 'Australia', PK: 'Pakistan',
  NL: 'Netherlands', ES: 'Spain', IE: 'Ireland', PL: 'Poland',
  SE: 'Sweden', BE: 'Belgium', CH: 'Switzerland', BR: 'Brazil',
  MX: 'Mexico', SG: 'Singapore', HK: 'Hong Kong', JP: 'Japan',
  ZA: 'South Africa', NG: 'Nigeria', PT: 'Portugal', AT: 'Austria',
  DK: 'Denmark', NO: 'Norway', FI: 'Finland', NZ: 'New Zealand',
  IL: 'Israel', CZ: 'Czech Republic', RO: 'Romania',
}

export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get('country') || 'US'
  const type = req.nextUrl.searchParams.get('type') || ''
  const state = req.nextUrl.searchParams.get('state') || ''
  const city = req.nextUrl.searchParams.get('city') || ''
  const areaCode = req.nextUrl.searchParams.get('area_code') || ''
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '20'), 40)

  if (!TELNYX_API_KEY) {
    return NextResponse.json({ error: 'Telnyx API not configured' }, { status: 500 })
  }

  const params = new URLSearchParams()
  params.set('filter[country_code]', country)
  params.set('filter[limit]', String(limit))

  if (type) params.set('filter[phone_number_type]', type)
  if (state) params.set('filter[administrative_area]', state)
  if (city) params.set('filter[locality]', city)
  if (areaCode) params.set('filter[national_destination_code]', areaCode)

  try {
    const res = await fetch(`${TELNYX_API}?${params}`, {
      headers: { Authorization: `Bearer ${TELNYX_API_KEY}` },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: 'Failed to fetch inventory', detail: err }, { status: res.status })
    }

    const data = await res.json()
    const numbers = (data.data || []).map((n: Record<string, unknown>) => {
      const cost = n.cost_information as Record<string, string> | undefined
      const monthlyCost = parseFloat(cost?.monthly_cost || '0')
      const setupCost = parseFloat(cost?.upfront_cost || '0')

      // Extract region info
      const regions = (n.region_information as Array<Record<string, string>>) || []
      const location = regions.find(r => r.region_type === 'location')?.region_name || ''
      const stateInfo = regions.find(r => r.region_type === 'state')?.region_name || ''
      const countryCode = regions.find(r => r.region_type === 'country_code')?.region_name || country

      // Extract features
      const featureList = ((n.features as Array<Record<string, string>>) || [])
        .map(f => f.name)
        .filter(f => ['voice', 'sms', 'mms', 'fax', 'hd_voice'].includes(f))
        .map(f => f === 'hd_voice' ? 'HD Voice' : f.toUpperCase())

      return {
        phone_number: n.phone_number,
        number_type: n.phone_number_type,
        country: COUNTRY_NAME[countryCode] || countryCode,
        country_code: COUNTRY_ISO[countryCode] || '',
        location: location,
        state: stateInfo,
        features: featureList,
        monthly_price: Math.max(MIN_MONTHLY, Math.ceil(monthlyCost * MONTHLY_MARKUP * 100) / 100),
        setup_price: Math.max(MIN_SETUP, Math.ceil(setupCost * SETUP_MARKUP * 100) / 100),
        reservable: n.reservable,
        quickship: n.quickship,
      }
    })

    return NextResponse.json({
      numbers,
      total: data.meta?.total_results || numbers.length,
      country: COUNTRY_NAME[country] || country,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to connect to Telnyx' }, { status: 500 })
  }
}
