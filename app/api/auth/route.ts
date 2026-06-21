import { NextRequest, NextResponse } from 'next/server'
import { createSession, COOKIE_NAME } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'
import crypto from 'crypto'

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

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  if (!username || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
  }

  const encoded = encodePassword(password)

  // Try 1: account login (account number/email + account password)
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT id, number, first_name, last_name, type
     FROM accounts
     WHERE (number=? OR email=?) AND password=? AND deleted=0 AND status=0
     LIMIT 1`,
    [username, username, encoded]
  )

  // Try 2: SIP device login (device username + device password)
  let deviceUsername: string | undefined
  if (!rows.length) {
    const [sipRows] = await db.query<RowDataPacket[]>(
      `SELECT sd.username, sd.dir_params, a.id, a.number, a.first_name, a.last_name, a.type
       FROM sip_devices sd
       JOIN accounts a ON a.id = sd.accountid
       WHERE sd.username=? AND sd.status=0 AND a.deleted=0 AND a.status=0
       LIMIT 1`,
      [username]
    )
    if (sipRows.length) {
      let devicePass = ''
      try { devicePass = JSON.parse(sipRows[0].dir_params || '{}').password || '' } catch {}
      if (devicePass === password) {
        rows.push(sipRows[0])
        deviceUsername = sipRows[0].username
      }
    }
  }

  if (!rows.length) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
  }

  const acct = rows[0]
  const name = [acct.first_name, acct.last_name].filter(Boolean).join(' ') || acct.number

  const token = await createSession({
    accountId: acct.id,
    number: acct.number,
    name,
    type: acct.type,
    deviceUsername,
  })

  const res = NextResponse.json({ ok: true, name, type: acct.type })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 86400,
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(COOKIE_NAME)
  return res
}
