import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params

  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT id, subject, template, sent_at, opened_at, open_count
     FROM email_log WHERE accountid = ?
     ORDER BY sent_at DESC LIMIT 50`,
    [id]
  )

  // Summary stats
  const total = rows.length
  const opened = rows.filter(r => r.opened_at).length
  const lastOpen = rows.find(r => r.opened_at)?.opened_at || null

  return NextResponse.json({ emails: rows, stats: { total, opened, lastOpen } })
}
