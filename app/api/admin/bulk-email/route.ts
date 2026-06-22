import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'
import { sendMail, customerEmail } from '@/lib/mail'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { customerIds, subject, message } = await req.json()

  if (!Array.isArray(customerIds) || customerIds.length === 0) {
    return NextResponse.json({ error: 'No customers selected' }, { status: 400 })
  }
  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Subject and message required' }, { status: 400 })
  }
  if (customerIds.length > 50) {
    return NextResponse.json({ error: 'Max 50 emails per batch' }, { status: 400 })
  }

  const placeholders = customerIds.map(() => '?').join(',')
  const [customers] = await db.query<RowDataPacket[]>(
    `SELECT id, first_name, last_name, email FROM accounts WHERE id IN (${placeholders}) AND deleted = 0 AND email IS NOT NULL AND email != ''`,
    customerIds
  )

  let sent = 0
  let failed = 0

  for (const cust of customers) {
    const name = `${cust.first_name} ${cust.last_name || ''}`.trim()
    const messageHtml = message.trim().replace(/\n/g, '<br>')
    const email = customerEmail(name, subject.trim(), messageHtml)

    try {
      await sendMail(cust.email, email.subject, email.html, {
        accountId: cust.id,
        template: 'bulk',
      })
      sent++
      // 2-second delay between emails
      if (sent < customers.length) await new Promise(r => setTimeout(r, 2000))
    } catch {
      failed++
    }
  }

  return NextResponse.json({ sent, failed, total: customers.length })
}
