import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { sendMail, adminTicketNotification } from '@/lib/mail'

// Customer: get messages for a ticket
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  // Verify ticket belongs to customer
  const [ticket] = await db.query<RowDataPacket[]>(
    'SELECT id FROM support_tickets WHERE id = ? AND accountid = ?',
    [id, session.accountId]
  )
  if (!ticket.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Mark as read by customer
  await db.query('UPDATE support_tickets SET unread_customer = 0 WHERE id = ?', [id])

  const [messages] = await db.query<RowDataPacket[]>(
    'SELECT id, sender_type, message, created_at FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC',
    [id]
  )

  return NextResponse.json({ messages })
}

// Customer: send a message
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { message } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

  // Verify ticket belongs to customer
  const [ticket] = await db.query<RowDataPacket[]>(
    'SELECT id, status FROM support_tickets WHERE id = ? AND accountid = ?',
    [id, session.accountId]
  )
  if (!ticket.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.query<ResultSetHeader>(
    'INSERT INTO ticket_messages (ticket_id, sender_type, sender_id, message) VALUES (?, ?, ?, ?)',
    [id, 'customer', session.accountId, message.trim()]
  )

  // Update ticket: reopen if closed, mark unread for admin
  await db.query(
    `UPDATE support_tickets SET last_message_at = NOW(), unread_admin = 1,
     status = IF(status = 'closed', 'open', status) WHERE id = ?`,
    [id]
  )

  // Notify admin via email (non-blocking)
  const [ticketInfo] = await db.query<RowDataPacket[]>(
    'SELECT t.subject, a.first_name, a.last_name, a.email FROM support_tickets t JOIN accounts a ON a.id = t.accountid WHERE t.id = ?',
    [id]
  )
  if (ticketInfo.length) {
    const name = `${ticketInfo[0].first_name} ${ticketInfo[0].last_name}`.trim()
    const notif = adminTicketNotification(name, ticketInfo[0].email || '', Number(id), ticketInfo[0].subject, message.trim(), true)
    sendMail('sales@voxclouds.com', notif.subject, notif.html).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
