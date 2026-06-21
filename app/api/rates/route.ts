import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'

// Public rate lookup — no auth required, only returns sell rates (no cost/margin)
export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search') || ''

  if (!search.trim()) {
    return NextResponse.json({ rates: [] })
  }

  // Detect if search is a phone number
  const digits = search.replace(/[\s\-\(\)\+]/g, '')
  const isNumber = /^\d+$/.test(digits)

  let rows: RowDataPacket[]

  if (isNumber) {
    // Match number against route patterns
    const [matched] = await db.query<RowDataPacket[]>(
      `SELECT r5.comment, r5.cost AS sell_rate, r5.pattern
       FROM routes r5
       WHERE r5.pricelist_id = 5 AND r5.status = 0
       AND ? REGEXP r5.pattern
       AND r5.comment NOT LIKE '%Premium%' AND r5.comment NOT LIKE '%Voip%'
       ORDER BY LENGTH(r5.pattern) DESC
       LIMIT 1`,
      [digits]
    )

    if (matched.length > 0) {
      const country = matched[0].comment
        .replace(/ Cellular.*/, '').replace(/ Mobile.*/, '')
        .replace(/ National.*/, '').replace(/ Proper.*/, '')
        .split(/[,]/)[0].trim()

      const [countryRates] = await db.query<RowDataPacket[]>(
        `SELECT comment, cost AS sell_rate, pattern
         FROM routes
         WHERE pricelist_id = 5 AND status = 0
         AND comment LIKE ?
         AND comment NOT LIKE '%Premium%' AND comment NOT LIKE '%Voip%'
         GROUP BY comment, pattern
         ORDER BY comment`,
        [`${country}%`]
      )
      rows = countryRates
    } else {
      rows = []
    }
  } else {
    const [results] = await db.query<RowDataPacket[]>(
      `SELECT comment, cost AS sell_rate, pattern
       FROM routes
       WHERE pricelist_id = 5 AND status = 0
       AND comment LIKE ?
       AND comment NOT LIKE '%Premium%' AND comment NOT LIKE '%Voip%'
       GROUP BY comment, pattern
       ORDER BY comment`,
      [`%${search}%`]
    )
    rows = results
  }

  const rates = rows.map(r => ({
    comment: r.comment,
    sell_rate: Number(r.sell_rate),
    prefix: (r.pattern || '').replace(/[\^.*$\\]/g, ''),
  }))

  const matched = isNumber && rates.length > 0 ? digits : undefined

  return NextResponse.json({ rates, matched })
}
