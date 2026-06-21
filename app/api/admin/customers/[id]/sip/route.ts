import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import crypto from 'crypto'

const ASTPP_KEY = '8YSDaBtDHAB3EQkxPAyTz2I5DttzA9uR'

function astppEncrypt(text: string): string {
  const cipher = crypto.createCipheriv('aes-256-ecb', Buffer.from(ASTPP_KEY), null)
  cipher.setAutoPadding(true)
  let enc = cipher.update(text, 'utf8', 'base64')
  enc += cipher.final('base64')
  return enc
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const { password } = body

  // Get account number for username prefix
  const [[account]] = await db.query<RowDataPacket[]>(
    'SELECT number FROM accounts WHERE id=?', [id]
  )
  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 })
  }

  // Find next available suffix: accountNumber-1, accountNumber-2, etc.
  const [existingDevices] = await db.query<RowDataPacket[]>(
    'SELECT username FROM sip_devices WHERE accountid=? ORDER BY id', [id]
  )
  let nextSuffix = 1
  for (const d of existingDevices as RowDataPacket[]) {
    const match = String(d.username).match(new RegExp(`^${account.number}-(\\d+)$`))
    if (match) {
      const num = parseInt(match[1])
      if (num >= nextSuffix) nextSuffix = num + 1
    }
  }
  // If the first device uses just the account number (from signup), start at -2
  const hasBaseDevice = (existingDevices as RowDataPacket[]).some(d => d.username === account.number)
  if (hasBaseDevice && nextSuffix === 1) nextSuffix = 2

  const username = `${account.number}-${nextSuffix}`
  const devicePassword = password || crypto.randomBytes(5).toString('hex')

  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO sip_devices (username, accountid, dir_params, dir_vars, status, codec, creation_date)
     VALUES (?, ?, ?, ?, 0, 'ulaw,alaw,g729', NOW())`,
    [
      username, id,
      JSON.stringify({ password: devicePassword, 'vm-enabled': 'true' }),
      JSON.stringify({ 'effective_caller_id_name': '', 'effective_caller_id_number': '', 'user_context': 'default' }),
    ]
  )

  // Auto-increase max channels if needed
  const [allDevices] = await db.query<RowDataPacket[]>(
    'SELECT COUNT(*) as cnt FROM sip_devices WHERE accountid=?', [id]
  )
  const deviceCount = (allDevices as RowDataPacket[])[0].cnt
  await db.query('UPDATE accounts SET maxchannels = GREATEST(maxchannels, ?) WHERE id=?', [deviceCount, id])

  return NextResponse.json({ success: true, id: result.insertId, username, password: devicePassword })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params
  const { searchParams } = new URL(req.url)
  const sipId = searchParams.get('sipId')

  if (!sipId) {
    return NextResponse.json({ error: 'sipId required' }, { status: 400 })
  }

  // Verify the SIP device belongs to this account
  const [[device]] = await db.query<RowDataPacket[]>(
    'SELECT id FROM sip_devices WHERE id=? AND accountid=?', [sipId, id]
  )
  if (!device) {
    return NextResponse.json({ error: 'SIP device not found' }, { status: 404 })
  }

  await db.query('DELETE FROM sip_devices WHERE id=? AND accountid=?', [sipId, id])

  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const { sipId, action, codec, status, password } = body

  if (!sipId) {
    return NextResponse.json({ error: 'sipId required' }, { status: 400 })
  }

  // Verify the SIP device belongs to this account
  const [[device]] = await db.query<RowDataPacket[]>(
    'SELECT id, dir_params FROM sip_devices WHERE id=? AND accountid=?', [sipId, id]
  )
  if (!device) {
    return NextResponse.json({ error: 'SIP device not found' }, { status: 404 })
  }

  if (action === 'reset-password') {
    const newPassword = password || crypto.randomBytes(5).toString('hex')
    let dirParams: Record<string, string> = {}
    try {
      dirParams = typeof device.dir_params === 'string' ? JSON.parse(device.dir_params) : device.dir_params || {}
    } catch { dirParams = {} }
    dirParams.password = newPassword
    await db.query('UPDATE sip_devices SET dir_params=?, last_modified_date=NOW() WHERE id=?',
      [JSON.stringify(dirParams), sipId])
    return NextResponse.json({ success: true, newPassword })
  }

  if (action === 'toggle-status') {
    const newStatus = status === 0 ? 1 : 0
    await db.query('UPDATE sip_devices SET status=?, last_modified_date=NOW() WHERE id=?', [newStatus, sipId])
    return NextResponse.json({ success: true, newStatus })
  }

  if (action === 'edit') {
    const updates: string[] = []
    const values: any[] = []
    if (body.alias !== undefined) { updates.push('alias=?'); values.push(body.alias || null) }
    if (codec !== undefined) { updates.push('codec=?'); values.push(codec) }
    if (updates.length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }
    updates.push('last_modified_date=NOW()')
    values.push(sipId)
    await db.query(`UPDATE sip_devices SET ${updates.join(', ')} WHERE id=?`, values)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
