import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'
import { sendMail, customerEmail } from '@/lib/mail'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const { subject, message } = body

  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 })
  }

  const [[account]] = await db.query<RowDataPacket[]>(
    'SELECT id, first_name, last_name, email FROM accounts WHERE id=? AND deleted=0',
    [id]
  )
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!account.email) return NextResponse.json({ error: 'Customer has no email address' }, { status: 400 })

  const name = `${account.first_name} ${account.last_name || ''}`.trim()
  // Convert newlines to <br> for HTML
  const messageHtml = message.trim().replace(/\n/g, '<br>')
  const email = customerEmail(name, subject.trim(), messageHtml)

  await sendMail(account.email, email.subject, email.html)

  return NextResponse.json({ success: true })
}
