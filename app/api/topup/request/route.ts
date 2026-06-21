import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'
import { sendMail, customerEmail } from '@/lib/mail'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { amount, payment_method, payment_reference, notes } = await req.json()

  if (!amount || parseFloat(amount) <= 0) {
    return NextResponse.json({ error: 'Valid amount required' }, { status: 400 })
  }
  if (!payment_method) {
    return NextResponse.json({ error: 'Payment method required' }, { status: 400 })
  }

  await db.query(
    `INSERT INTO recharge_requests (accountid, amount, currency, payment_method, payment_reference, notes, status, created_at)
     VALUES (?, ?, 'USD', ?, ?, ?, 'pending', NOW())`,
    [session.accountId, parseFloat(amount), payment_method, payment_reference || '', notes || '']
  )

  // Get customer details
  const [[account]] = await db.query<RowDataPacket[]>(
    'SELECT first_name, last_name, email, number FROM accounts WHERE id=?',
    [session.accountId]
  )

  const customerName = account ? `${account.first_name} ${account.last_name || ''}`.trim() : 'Customer'

  // Send bank details to customer
  if (account?.email) {
    const bankEmail = customerEmail(
      customerName,
      `VoxClouds account ${account.number} — bank transfer details`,
      `Thank you for your recharge request of <strong>$${parseFloat(amount).toFixed(2)} USD</strong>.<br><br>` +
      `Please use the following bank details to complete your wire transfer:<br><br>` +
      `<table style="border-collapse:collapse;width:100%">` +
      `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0;color:#64748b;font-size:14px;width:140px">Bank Name</td><td style="padding:8px 12px;border:1px solid #e2e8f0;color:#1a1a2e;font-size:14px;font-weight:600">Meezan Bank Limited</td></tr>` +
      `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0;color:#64748b;font-size:14px">Account Title</td><td style="padding:8px 12px;border:1px solid #e2e8f0;color:#1a1a2e;font-size:14px;font-weight:600">ARSHAD ALI</td></tr>` +
      `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0;color:#64748b;font-size:14px">Account Number</td><td style="padding:8px 12px;border:1px solid #e2e8f0;color:#1a1a2e;font-size:14px;font-weight:600;font-family:monospace">02330108303858</td></tr>` +
      `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0;color:#64748b;font-size:14px">IBAN</td><td style="padding:8px 12px;border:1px solid #e2e8f0;color:#1a1a2e;font-size:14px;font-weight:600;font-family:monospace">PK91MEZN0002330108303858</td></tr>` +
      `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0;color:#64748b;font-size:14px">Swift Code</td><td style="padding:8px 12px;border:1px solid #e2e8f0;color:#1a1a2e;font-size:14px;font-weight:600">MEZNPKKA</td></tr>` +
      `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0;color:#64748b;font-size:14px">Reference</td><td style="padding:8px 12px;border:1px solid #e2e8f0;color:#1a1a2e;font-size:14px;font-weight:600">${account.number}</td></tr>` +
      `</table><br>` +
      `Please include your VoxClouds account number (<strong>${account.number}</strong>) as the payment reference so we can match your transfer.<br><br>` +
      `Once we receive your payment, your balance will be updated and you will receive a confirmation email. This usually takes 1-2 business days for international transfers.<br><br>` +
      `If you have questions about the transfer, reply to this email.`
    )
    sendMail(account.email, bankEmail.subject, bankEmail.html).catch(err => {
      console.error('Bank details email failed:', err)
    })
  }

  // Notify admin
  const adminSubject = `Bank transfer request — ${customerName} (${account?.number || session.accountId})`
  const adminBody = `Customer <strong>${customerName}</strong> (${account?.email || 'no email'}) has requested bank transfer details.<br><br>` +
    `Account: ${account?.number || session.accountId}<br>` +
    `Amount: $${parseFloat(amount).toFixed(2)} USD<br>` +
    `Method: ${payment_method}<br><br>` +
    `Bank details email has been sent to the customer.`

  sendMail(
    'arshadonline1@gmail.com',
    adminSubject,
    `<div style="font-family:sans-serif;font-size:14px;color:#333;line-height:1.6">${adminBody}</div>`
  ).catch(err => {
    console.error('Admin bank request notification failed:', err)
  })

  return NextResponse.json({ ok: true })
}
