import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { sendMail, ticketReplyEmail } from '@/lib/mail'

// Admin: send a reply
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { message } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

  await db.query<ResultSetHeader>(
    'INSERT INTO ticket_messages (ticket_id, sender_type, sender_id, message) VALUES (?, ?, ?, ?)',
    [id, 'admin', session.accountId, message.trim()]
  )

  // Update ticket: mark as in_progress if open, mark unread for customer
  await db.query(
    `UPDATE support_tickets SET last_message_at = NOW(), unread_customer = 1,
     status = IF(status = 'open', 'in_progress', status) WHERE id = ?`,
    [id]
  )

  // Email the customer (non-blocking)
  const [ticketInfo] = await db.query<RowDataPacket[]>(
    'SELECT t.subject, a.first_name, a.last_name, a.email FROM support_tickets t JOIN accounts a ON a.id = t.accountid WHERE t.id = ?',
    [id]
  )
  if (ticketInfo.length && ticketInfo[0].email) {
    const name = `${ticketInfo[0].first_name} ${ticketInfo[0].last_name}`.trim()
    const reply = ticketReplyEmail(name, Number(id), ticketInfo[0].subject, message.trim())
    sendMail(ticketInfo[0].email, reply.subject, reply.html).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
