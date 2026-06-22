import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'
import crypto from 'crypto'
import { sendMail, passwordResetEmail } from '@/lib/mail'

const ASTPP_PRIVATE_KEY = '8YSDaBtDHAB3EQkxPAyTz2I5DttzA9uR'
const AES_KEY = crypto.createHash('sha256').update(ASTPP_PRIVATE_KEY).digest().slice(0, 32)

function encodePassword(value: string): string {
  const pad = 16 - (Buffer.byteLength(value) % 16)
  const padded = Buffer.concat([Buffer.from(value), Buffer.alloc(pad, pad)])
  const cipher = crypto.createCipheriv('aes-256-ecb', AES_KEY, null)
  cipher.setAutoPadding(false)
  const encrypted = Buffer.concat([cipher.update(padded), cipher.final()])
  return encrypted.toString('base64').replace(/\+/g, '-').replace(/\//g, '$').replace(/=+$/, '')
}

function generatePassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let pw = ''
  for (let i = 0; i < 10; i++) pw += chars[Math.floor(Math.random() * chars.length)]
  return pw
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const newPassword = body.password || generatePassword()

  const [[account]] = await db.query<RowDataPacket[]>(
    'SELECT id, number, first_name, last_name, email FROM accounts WHERE id=? AND deleted=0',
    [id]
  )
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const encoded = encodePassword(newPassword)

  // Update account password
  await db.query('UPDATE accounts SET password=? WHERE id=?', [encoded, id])

  // Update SIP device password (dir_params contains password)
  const [sipDevices] = await db.query<RowDataPacket[]>(
    'SELECT id, dir_params FROM sip_devices WHERE accountid=?', [id]
  )
  for (const sip of sipDevices as RowDataPacket[]) {
    try {
      const params = JSON.parse(sip.dir_params || '{}')
      params.password = newPassword
      await db.query('UPDATE sip_devices SET dir_params=? WHERE id=?', [JSON.stringify(params), sip.id])
    } catch {}
  }

  // Send email if customer has one
  if (account.email) {
    const name = `${account.first_name} ${account.last_name || ''}`.trim()
    const email = passwordResetEmail(name, account.number, newPassword)
    sendMail(account.email, email.subject, email.html, { accountId: account.id, template: 'password_reset' }).catch(err => {
      console.error('Password reset email failed:', err)
    })
  }

  return NextResponse.json({ success: true, newPassword, emailSent: !!account.email })
}
