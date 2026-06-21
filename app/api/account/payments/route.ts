import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [payments] = await db.query<RowDataPacket[]>(
    `SELECT id, amount, payment_method, actual_amount, date
     FROM payment_transaction WHERE accountid=? ORDER BY date DESC LIMIT 50`,
    [session.accountId]
  )

  return NextResponse.json({ payments })
}
