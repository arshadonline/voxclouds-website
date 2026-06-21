import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
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

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const url = req.nextUrl
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '20')
  const search = url.searchParams.get('search') || ''
  const offset = (page - 1) * limit

  let where = 'a.type IN (0,1,3) AND a.deleted=0'
  const params: (string | number)[] = []

  if (search) {
    where += ' AND (a.number LIKE ? OR a.first_name LIKE ? OR a.last_name LIKE ? OR a.email LIKE ? OR a.telephone_1 LIKE ?)'
    const s = `%${search}%`
    params.push(s, s, s, s, s)
  }

  const [[countRow]] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM accounts a WHERE ${where}`,
    params
  )
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT a.id, a.number, a.first_name, a.last_name, a.email, a.balance, a.credit_limit, a.status, a.creation, a.company_name, a.telephone_1, a.maxchannels, a.type, a.country_id, c.country AS country_name
     FROM accounts a LEFT JOIN countrycode c ON a.country_id = c.id
     WHERE ${where}
     ORDER BY a.creation DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  )

  return NextResponse.json({
    customers: rows,
    total: countRow.total,
    page,
    totalPages: Math.ceil(countRow.total / limit),
  })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const body = await req.json()
  const { number, firstName, lastName, email, password, balance, creditLimit, maxchannels } = body

  if (!number || !firstName || !password) {
    return NextResponse.json({ error: 'Number, first name, and password are required' }, { status: 400 })
  }

  // Check if number already exists
  const [existing] = await db.query<RowDataPacket[]>(
    'SELECT id FROM accounts WHERE number=? AND deleted=0', [number]
  )
  if ((existing as RowDataPacket[]).length > 0) {
    return NextResponse.json({ error: 'Account number already exists' }, { status: 409 })
  }

  const encoded = encodePassword(password)

  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO accounts (number, first_name, last_name, email, password, balance, credit_limit, type, status, creation, maxchannels, currency_id, pricelist_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, NOW(), ?, 1, 5)`,
    [number, firstName, lastName || '', email || '', encoded, balance || 0, creditLimit || 0, maxchannels || 1]
  )

  const accountId = result.insertId

  // Create SIP device
  await db.query(
    `INSERT INTO sip_devices (username, accountid, dir_params, status, creation_date)
     VALUES (?, ?, ?, 0, NOW())`,
    [number, accountId, JSON.stringify({ password })]
  )

  return NextResponse.json({ ok: true, accountId })
}
