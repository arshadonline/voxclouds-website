import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { sendMail, trialCreditEmail } from '@/lib/mail'

const TRIAL_AMOUNT = 0.50

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params

  const [[account]] = await db.query<RowDataPacket[]>(
    'SELECT id, first_name, last_name, email, balance, trial_balance, trial_credited_at FROM accounts WHERE id=? AND type=0 AND deleted=0',
    [id]
  )
  if (!account) return NextResponse.json({ error: 'Customer not found' }, { status: 404 })

  if (account.trial_credited_at) {
    return NextResponse.json({ error: 'Trial credit already given to this customer' }, { status: 400 })
  }

  // Add trial balance + update main balance
  await db.query(
    'UPDATE accounts SET balance = balance + ?, trial_balance = ?, trial_credited_at = NOW() WHERE id = ?',
    [TRIAL_AMOUNT, TRIAL_AMOUNT, account.id]
  )

  // Log the payment
  await db.query<ResultSetHeader>(
    `INSERT INTO payments (accountid, amount, payment_method, date)
     VALUES (?, ?, 'trial_credit', NOW())`,
    [account.id, TRIAL_AMOUNT]
  )

  // Send email if they have one
  const name = `${account.first_name} ${account.last_name || ''}`.trim()
  if (account.email) {
    const email = trialCreditEmail(name)
    sendMail(account.email, email.subject, email.html, {
      accountId: account.id,
      template: 'trial_credit',
    }).catch(() => {})
  }

  return NextResponse.json({
    success: true,
    newBalance: Number(account.balance) + TRIAL_AMOUNT,
    emailSent: !!account.email,
  })
}
