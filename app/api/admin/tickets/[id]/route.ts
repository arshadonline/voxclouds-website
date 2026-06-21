import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'

// Get ticket detail with customer info
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const [tickets] = await db.query<RowDataPacket[]>(
    `SELECT t.*,
            a.number as account_number, a.balance,
            CONCAT(COALESCE(a.first_name,''), ' ', COALESCE(a.last_name,'')) as customer_name,
            a.email as customer_email,
            t.sender_email, t.sender_name, t.source
     FROM support_tickets t
     LEFT JOIN accounts a ON a.id = t.accountid
     WHERE t.id = ?`,
    [id]
  )
  if (!tickets.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Mark as read by admin
  await db.query('UPDATE support_tickets SET unread_admin = 0 WHERE id = ?', [id])

  // Get messages
  const [messages] = await db.query<RowDataPacket[]>(
    'SELECT id, sender_type, sender_id, message, created_at FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC',
    [id]
  )

  // Get customer's recent tickets count
  const [ticketCount] = await db.query<RowDataPacket[]>(
    'SELECT COUNT(*) as total FROM support_tickets WHERE accountid = ?',
    [tickets[0].accountid]
  )

  return NextResponse.json({
    ticket: tickets[0],
    messages,
    customer_ticket_count: ticketCount[0].total,
  })
}

// Delete ticket and all its messages
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await db.query('DELETE FROM ticket_messages WHERE ticket_id = ?', [id])
  await db.query('DELETE FROM support_tickets WHERE id = ?', [id])

  return NextResponse.json({ ok: true })
}

// Update ticket status/priority
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { status, priority } = body

  const updates: string[] = []
  const vals: (string | number)[] = []

  if (status) { updates.push('status = ?'); vals.push(status) }
  if (priority) { updates.push('priority = ?'); vals.push(priority) }

  if (!updates.length) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

  vals.push(parseInt(id))
  await db.query(`UPDATE support_tickets SET ${updates.join(', ')} WHERE id = ?`, vals)

  return NextResponse.json({ ok: true })
}
