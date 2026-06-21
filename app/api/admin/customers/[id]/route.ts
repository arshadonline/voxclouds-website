import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params

  const [[account]] = await db.query<RowDataPacket[]>(
    `SELECT a.id, a.number, a.first_name, a.last_name, a.email, a.balance, a.credit_limit, a.status, a.creation,
            a.company_name, a.telephone_1, a.telephone_2, a.address_1, a.city, a.province, a.postal_code,
            a.maxchannels, a.currency_id, a.type, a.country_id, c.country AS country_name
     FROM accounts a LEFT JOIN countrycode c ON a.country_id = c.id
     WHERE a.id=? AND a.deleted=0`,
    [id]
  )

  if (!account) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const [sipDevices] = await db.query<RowDataPacket[]>(
    'SELECT id, username, alias, status, codec, creation_date FROM sip_devices WHERE accountid=?',
    [id]
  )

  const [cdrs] = await db.query<RowDataPacket[]>(
    `SELECT callerid, callednum, billseconds, debit, cost, disposition, callstart, call_direction
     FROM cdrs WHERE accountid=? ORDER BY callstart DESC LIMIT 50`,
    [id]
  )

  const [payments] = await db.query<RowDataPacket[]>(
    'SELECT id, amount, payment_method, actual_amount, date FROM payment_transaction WHERE accountid=? ORDER BY date DESC LIMIT 50',
    [id]
  )

  const [recharges] = await db.query<RowDataPacket[]>(
    'SELECT id, amount, currency, payment_method, payment_reference, status, notes, created_at, review_note FROM recharge_requests WHERE accountid=? ORDER BY created_at DESC',
    [id]
  )

  return NextResponse.json({ account, sipDevices, cdrs, payments, recharges })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()

  const allowed = ['first_name', 'last_name', 'email', 'company_name', 'telephone_1', 'telephone_2',
                   'address_1', 'city', 'province', 'postal_code', 'maxchannels', 'credit_limit', 'status', 'country_id']
  const sets: string[] = []
  const vals: any[] = []

  for (const key of allowed) {
    if (body[key] !== undefined) {
      sets.push(`${key}=?`)
      vals.push(body[key])
    }
  }

  if (sets.length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  vals.push(id)
  await db.query(`UPDATE accounts SET ${sets.join(', ')} WHERE id=? AND deleted=0`, vals)

  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params

  // Don't allow deleting admin account
  const [[account]] = await db.query<RowDataPacket[]>('SELECT type FROM accounts WHERE id=?', [id])
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (account.type === -1) return NextResponse.json({ error: 'Cannot delete admin account' }, { status: 403 })

  // Soft delete
  await db.query('UPDATE accounts SET deleted=1, status=1 WHERE id=?', [id])
  // Disable SIP devices
  await db.query('UPDATE sip_devices SET status=1 WHERE accountid=?', [id])

  return NextResponse.json({ success: true })
}
