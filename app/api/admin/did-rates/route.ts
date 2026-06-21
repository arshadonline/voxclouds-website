import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

// GET — admin DID rates with cost + margins
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session || session.type !== -1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
    `SELECT id, country_name, country_code, number_type, prefix, city,
            monthly_cost, monthly_price, setup_cost, setup_price,
            per_min_cost, per_min_price, channels, features, provider
     FROM did_rates ${where}
     ORDER BY country_name, number_type`,
    params
  )

  return NextResponse.json({ rates: rows })
}

// POST — add new DID rate
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.type !== -1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO did_rates (country_id, country_name, country_code, number_type, prefix, city,
     monthly_cost, monthly_price, setup_cost, setup_price, per_min_cost, per_min_price,
     channels, features, provider) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      body.country_id || 0, body.country_name, body.country_code, body.number_type || 'local',
      body.prefix || '', body.city || '',
      body.monthly_cost || 0, body.monthly_price || 0,
      body.setup_cost || 0, body.setup_price || 0,
      body.per_min_cost || 0, body.per_min_price || 0,
      body.channels || 2, body.features || 'Voice', body.provider || 'Telnyx',
    ]
  )

  return NextResponse.json({ id: result.insertId })
}

// PATCH — update DID rate
export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session || session.type !== -1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  await db.query(
    `UPDATE did_rates SET country_name=?, country_code=?, number_type=?, prefix=?, city=?,
     monthly_cost=?, monthly_price=?, setup_cost=?, setup_price=?,
     per_min_cost=?, per_min_price=?, channels=?, features=?, provider=?
     WHERE id=?`,
    [
      body.country_name, body.country_code, body.number_type,
      body.prefix || '', body.city || '',
      body.monthly_cost || 0, body.monthly_price || 0,
      body.setup_cost || 0, body.setup_price || 0,
      body.per_min_cost || 0, body.per_min_price || 0,
      body.channels || 2, body.features || 'Voice', body.provider || 'Telnyx',
      body.id,
    ]
  )

  return NextResponse.json({ ok: true })
}

// DELETE — remove DID rate
export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session || session.type !== -1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  await db.query('DELETE FROM did_rates WHERE id=?', [id])
  return NextResponse.json({ ok: true })
}
