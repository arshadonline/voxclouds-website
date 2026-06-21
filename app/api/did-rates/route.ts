import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'

// Public DID rates — no auth, only shows sell prices
export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search') || ''
  const type = req.nextUrl.searchParams.get('type') || ''

  let where = 'WHERE status = 0'
  const params: (string | number)[] = []

  if (search.trim()) {
    where += ' AND (country_name LIKE ? OR country_code LIKE ? OR prefix LIKE ?)'
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }

  if (type) {
    where += ' AND number_type = ?'
    params.push(type)
  }

  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT country_name, country_code, number_type, prefix,
            monthly_price, setup_price, per_min_price, channels, features
     FROM did_rates ${where}
     ORDER BY country_name, number_type`,
    params
  )

  // Get unique countries for filter
  const [countries] = await db.query<RowDataPacket[]>(
    `SELECT DISTINCT country_name, country_code FROM did_rates WHERE status = 0 ORDER BY country_name`
  )

  return NextResponse.json({
    rates: rows,
    countries: countries.map(c => ({ name: c.country_name, code: c.country_code })),
  })
}
