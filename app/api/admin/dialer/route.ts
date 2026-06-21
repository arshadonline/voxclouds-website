import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

// GET /api/admin/dialer — list campaigns + SIP accounts
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const [campaigns] = await db.query<RowDataPacket[]>(
    `SELECT * FROM dialer_campaigns ORDER BY created_at DESC`
  )

  // Also return SIP accounts for campaign creation dropdowns
  const [sipAccounts] = await db.query<RowDataPacket[]>(
    `SELECT sd.id, sd.username, sd.accountid, a.first_name, a.last_name, a.number
     FROM sip_devices sd
     JOIN accounts a ON sd.accountid=a.id
     WHERE sd.status=0 AND a.deleted=0
     ORDER BY a.first_name`
  )

  return NextResponse.json({ campaigns, sipAccounts })
}

// POST /api/admin/dialer — create campaign
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { name, description, caller_id, agent_extension, max_concurrent, ring_timeout, mode, script, voice } = await req.json()

  if (!name || !caller_id || !agent_extension) {
    return NextResponse.json({ error: 'Name, caller ID, and agent extension are required' }, { status: 400 })
  }

  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO dialer_campaigns (name, description, caller_id, agent_extension, mode, script, voice, max_concurrent, ring_timeout, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, description || '', caller_id, agent_extension, mode || 'robocall', script || 'english', voice || 'female', max_concurrent || 1, ring_timeout || 30, session.accountId]
  )

  return NextResponse.json({ id: result.insertId })
}
