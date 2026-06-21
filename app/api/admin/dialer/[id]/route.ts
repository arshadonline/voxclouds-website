import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

// GET /api/admin/dialer/[id] — campaign detail with numbers
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params

  const [[campaign]] = await db.query<RowDataPacket[]>(
    'SELECT * FROM dialer_campaigns WHERE id=?', [id]
  )
  if (!campaign) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const [numbers] = await db.query<RowDataPacket[]>(
    'SELECT * FROM dialer_numbers WHERE campaign_id=? ORDER BY id', [id]
  )

  return NextResponse.json({ campaign, numbers })
}

// PATCH /api/admin/dialer/[id] — update campaign (status, settings)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()

  const allowed = ['name', 'description', 'caller_id', 'agent_extension', 'status', 'max_concurrent', 'ring_timeout']
  const sets: string[] = []
  const vals: unknown[] = []

  for (const key of allowed) {
    if (body[key] !== undefined) {
      sets.push(`${key}=?`)
      vals.push(body[key])
    }
  }

  if (sets.length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  // If starting campaign, update counters
  if (body.status === 'running') {
    const [[counts]] = await db.query<RowDataPacket[]>(
      `SELECT
        COUNT(*) as total,
        SUM(status='answered') as answered,
        SUM(status IN ('no_answer','busy','failed')) as failed,
        SUM(status NOT IN ('pending','skipped')) as dialed
       FROM dialer_numbers WHERE campaign_id=?`, [id]
    )
    await db.query(
      `UPDATE dialer_campaigns SET total_numbers=?, dialed=?, answered=?, failed=? WHERE id=?`,
      [counts.total, counts.dialed || 0, counts.answered || 0, counts.failed || 0, id]
    )
  }

  vals.push(id)
  await db.query<ResultSetHeader>(
    `UPDATE dialer_campaigns SET ${sets.join(', ')} WHERE id=?`, vals
  )

  return NextResponse.json({ ok: true })
}

// DELETE /api/admin/dialer/[id] — delete campaign and its numbers
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params

  await db.query('DELETE FROM dialer_numbers WHERE campaign_id=?', [id])
  await db.query('DELETE FROM dialer_campaigns WHERE id=?', [id])

  return NextResponse.json({ ok: true })
}
