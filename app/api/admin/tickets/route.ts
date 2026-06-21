import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session || session.type !== -1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = req.nextUrl.searchParams.get('status') || ''
  const search = req.nextUrl.searchParams.get('search') || ''

  let where = '1=1'
  const params: (string | number)[] = []

  if (status) { where += ' AND t.status = ?'; params.push(status) }
  if (search) {
    where += ' AND (t.subject LIKE ? OR a.number LIKE ? OR CONCAT(a.first_name, " ", a.last_name) LIKE ?)'
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }

  if (search) {
    where += ' OR (t.sender_email LIKE ? OR t.sender_name LIKE ?)'
    params.push(`%${search}%`, `%${search}%`)
  }

  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT t.id, t.subject, t.status, t.priority, t.unread_admin, t.last_message_at, t.created_at,
            t.accountid, t.sender_email, t.sender_name, t.source,
            a.number as account_number,
            CONCAT(COALESCE(a.first_name,''), ' ', COALESCE(a.last_name,'')) as customer_name
     FROM support_tickets t
     LEFT JOIN accounts a ON a.id = t.accountid
     WHERE ${where}
     ORDER BY
       CASE WHEN t.unread_admin = 1 THEN 0 ELSE 1 END,
       t.last_message_at DESC
     LIMIT 100`,
    params
  )

  // Get unread count
  const [unread] = await db.query<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM support_tickets WHERE unread_admin = 1'
  )

  return NextResponse.json({ tickets: rows, unread_count: unread[0].count })
}
