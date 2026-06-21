import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // If logged in with a specific device, use that device; otherwise use first active device
  const query = session.deviceUsername
    ? `SELECT sd.username, sd.alias, sd.dir_params
       FROM sip_devices sd
       JOIN accounts a ON a.id = sd.accountid
       WHERE sd.username = ? AND sd.accountid = ? AND sd.status = 0 AND a.deleted = 0
       LIMIT 1`
    : `SELECT sd.username, sd.alias, sd.dir_params
       FROM sip_devices sd
       JOIN accounts a ON a.id = sd.accountid
       WHERE sd.accountid = ? AND sd.status = 0 AND a.deleted = 0
       LIMIT 1`
  const params = session.deviceUsername
    ? [session.deviceUsername, session.accountId]
    : [session.accountId]
  const [rows] = await db.query<RowDataPacket[]>(query, params)

  if (!rows.length) {
    return NextResponse.json({ error: 'No SIP device found' }, { status: 404 })
  }

  let password = ''
  try {
    const dirParams = JSON.parse(rows[0].dir_params || '{}')
    password = dirParams.password || ''
  } catch {
    return NextResponse.json({ error: 'Invalid SIP config' }, { status: 500 })
  }

  return NextResponse.json({
    username: rows[0].username,
    alias: rows[0].alias || '',
    password,
    domain: '84.247.187.198',
    server: 'wss://pbx.voxclouds.com/wss',
    iceServers: [
      { urls: 'stun:84.247.187.198:3478' },
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'turn:84.247.187.198:3478?transport=udp', username: 'voxturn', credential: 'dd4fa56c59a81423134b066f78c2d043' },
      { urls: 'turn:84.247.187.198:3478?transport=tcp', username: 'voxturn', credential: 'dd4fa56c59a81423134b066f78c2d043' },
      { urls: 'turns:84.247.187.198:5349?transport=tcp', username: 'voxturn', credential: 'dd4fa56c59a81423134b066f78c2d043' },
    ],
  })
}
