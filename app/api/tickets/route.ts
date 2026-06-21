import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { sendMail, adminTicketNotification } from '@/lib/mail'

// Customer: get own tickets
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT id, subject, status, priority, unread_customer, last_message_at, created_at
     FROM support_tickets WHERE accountid = ?
     ORDER BY last_message_at DESC`,
    [session.accountId]
  )

  return NextResponse.json({ tickets: rows })
}

// Customer: create new ticket
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { subject, message } = await req.json()
  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 })
  }

  const conn = await db.getConnection()
  try {
    await conn.beginTransaction()

    const [result] = await conn.query<ResultSetHeader>(
      `INSERT INTO support_tickets (accountid, subject, message, status, priority, last_message_at, unread_admin, unread_customer)
       VALUES (?, ?, ?, 'open', 'medium', NOW(), 1, 0)`,
      [session.accountId, subject.trim(), message.trim()]
    )

    await conn.query<ResultSetHeader>(
      `INSERT INTO ticket_messages (ticket_id, sender_type, sender_id, message)
       VALUES (?, 'customer', ?, ?)`,
      [result.insertId, session.accountId, message.trim()]
    )

    await conn.commit()

    // Notify admin via email (non-blocking)
    const [acct] = await db.query<RowDataPacket[]>(
      'SELECT first_name, last_name, email FROM accounts WHERE id = ?', [session.accountId]
    )
    if (acct.length) {
      const name = `${acct[0].first_name} ${acct[0].last_name}`.trim()
      const notif = adminTicketNotification(name, acct[0].email || '', result.insertId, subject.trim(), message.trim(), false)
      sendMail('sales@voxclouds.com', notif.subject, notif.html).catch(() => {})
    }

    return NextResponse.json({ id: result.insertId })
  } catch (e) {
    await conn.rollback()
    throw e
  } finally {
    conn.release()
  }
}
