import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session || session.type !== -1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const search = req.nextUrl.searchParams.get('search') || ''

  if (!search.trim()) {
    // Return list of unique countries
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT DISTINCT
        CASE
          WHEN comment LIKE '% Cellular%' THEN SUBSTRING_INDEX(comment, ' Cellular', 1)
          WHEN comment LIKE '% Premium%' THEN SUBSTRING_INDEX(comment, ' Premium', 1)
          WHEN comment LIKE '% National%' THEN SUBSTRING_INDEX(comment, ' National', 1)
          WHEN comment LIKE '%,%' THEN SUBSTRING_INDEX(comment, ',', 1)
          ELSE comment
        END as country
       FROM routes WHERE pricelist_id = 5 AND status = 0
       ORDER BY country`
    )
    return NextResponse.json({ countries: rows.map(r => r.country) })
  }

  // Detect if search is a phone number (digits, optional leading +)
  const digits = search.replace(/[\s\-\(\)\+]/g, '')
  const isNumber = /^\d+$/.test(digits)

  let sellRates: RowDataPacket[]

  if (isNumber) {
    // Match number against route patterns (regex), best match first
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT r5.comment, r5.cost AS sell_rate, r5.pattern,
              COALESCE(r1.cost, 0) AS cost_rate,
              LENGTH(r5.pattern) as pattern_len
       FROM routes r5
       LEFT JOIN routes r1 ON r1.pattern = r5.pattern AND r1.pricelist_id = 1 AND r1.status = 0
       WHERE r5.pricelist_id = 5 AND r5.status = 0
       AND ? REGEXP r5.pattern
       AND r5.comment NOT LIKE '%Premium%' AND r5.comment NOT LIKE '%Voip%'
       ORDER BY LENGTH(r5.pattern) DESC
       LIMIT 1`,
      [digits]
    )

    if (rows.length > 0) {
      // Got the best match — now fetch all rates for that country
      const bestMatch = rows[0].comment
      const country = bestMatch
        .replace(/ Cellular.*/, '').replace(/ Mobile.*/, '')
        .replace(/ National.*/, '').replace(/ Proper.*/, '')
        .split(/[,]/)[0].trim()

      const [countryRates] = await db.query<RowDataPacket[]>(
        `SELECT r5.comment, r5.cost AS sell_rate, r5.pattern,
                COALESCE(r1.cost, 0) AS cost_rate
         FROM routes r5
         LEFT JOIN routes r1 ON r1.pattern = r5.pattern AND r1.pricelist_id = 1 AND r1.status = 0
         WHERE r5.pricelist_id = 5 AND r5.status = 0
         AND r5.comment LIKE ?
         AND r5.comment NOT LIKE '%Premium%' AND r5.comment NOT LIKE '%Voip%'
         GROUP BY r5.comment, r5.pattern
         ORDER BY r5.comment`,
        [`${country}%`]
      )
      sellRates = countryRates
    } else {
      sellRates = []
    }
  } else {
    // Search by country name
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT r5.comment, r5.cost AS sell_rate, r5.pattern,
              COALESCE(r1.cost, 0) AS cost_rate
       FROM routes r5
       LEFT JOIN routes r1 ON r1.pattern = r5.pattern AND r1.pricelist_id = 1 AND r1.status = 0
       WHERE r5.pricelist_id = 5 AND r5.status = 0
       AND r5.comment LIKE ?
       AND r5.comment NOT LIKE '%Premium%' AND r5.comment NOT LIKE '%Voip%'
       GROUP BY r5.comment, r5.pattern
       ORDER BY r5.comment`,
      [`%${search}%`]
    )
    sellRates = rows
  }

  const rates = sellRates.map(r => ({
    comment: r.comment,
    sell_rate: Number(r.sell_rate),
    cost_rate: Number(r.cost_rate),
    prefix: (r.pattern || '').replace(/[\^.*$\\]/g, ''),
  }))

  const matched = isNumber && rates.length > 0 ? digits : undefined

  return NextResponse.json({ rates, matched })
}
