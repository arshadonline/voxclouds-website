import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { ResultSetHeader } from 'mysql2'

// POST /api/admin/dialer/[id]/numbers — add numbers (single or CSV bulk)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()

  let added = 0

  if (body.numbers && Array.isArray(body.numbers)) {
    // Bulk add: [{phone_number, name?}, ...]
    for (const entry of body.numbers) {
      const phone = String(entry.phone_number || entry.phone || entry.number || '').replace(/[\s\-\(\)]/g, '')
      if (!phone) continue
      const name = entry.name || ''
      await db.query<ResultSetHeader>(
        'INSERT INTO dialer_numbers (campaign_id, phone_number, name) VALUES (?, ?, ?)',
        [id, phone, name]
      )
      added++
    }
  } else if (body.phone_number) {
    // Single add
    const phone = String(body.phone_number).replace(/[\s\-\(\)]/g, '')
    await db.query<ResultSetHeader>(
      'INSERT INTO dialer_numbers (campaign_id, phone_number, name) VALUES (?, ?, ?)',
      [id, phone, body.name || '']
    )
    added = 1
  } else if (body.csv) {
    // CSV text: parse lines — format: phone_number,name (name optional)
    const lines = String(body.csv).split('\n').map(l => l.trim()).filter(Boolean)
    for (const line of lines) {
      // Skip header row
      if (line.toLowerCase().includes('phone') && line.toLowerCase().includes('name')) continue
      const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''))
      const phone = (parts[0] || '').replace(/[\s\-\(\)]/g, '')
      if (!phone || !/^\+?\d{7,15}$/.test(phone)) continue
      const name = parts[1] || ''
      await db.query<ResultSetHeader>(
        'INSERT INTO dialer_numbers (campaign_id, phone_number, name) VALUES (?, ?, ?)',
        [id, phone, name]
      )
      added++
    }
  }

  // Update total count
  await db.query(
    `UPDATE dialer_campaigns SET total_numbers=(SELECT COUNT(*) FROM dialer_numbers WHERE campaign_id=?) WHERE id=?`,
    [id, id]
  )

  return NextResponse.json({ added })
}

// PATCH /api/admin/dialer/[id]/numbers — reset number status (for redial/retry)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()

  if (body.resetCallLater) {
    // Reset all "call_later" numbers back to pending
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE dialer_numbers SET status='pending', dtmf_response='', hangup_cause='' WHERE campaign_id=? AND dtmf_response='call_later'",
      [id]
    )
    return NextResponse.json({ reset: result.affectedRows })
  }

  if (body.numberId) {
    // Reset a single number
    await db.query(
      "UPDATE dialer_numbers SET status=?, dtmf_response=?, hangup_cause='' WHERE id=? AND campaign_id=?",
      [body.status || 'pending', body.dtmf_response || '', body.numberId, id]
    )
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}

// DELETE /api/admin/dialer/[id]/numbers — clear all numbers or delete specific
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params
  const { searchParams } = new URL(req.url)
  const numberId = searchParams.get('numberId')

  if (numberId) {
    await db.query('DELETE FROM dialer_numbers WHERE id=? AND campaign_id=?', [numberId, id])
  } else {
    await db.query('DELETE FROM dialer_numbers WHERE campaign_id=?', [id])
  }

  await db.query(
    `UPDATE dialer_campaigns SET total_numbers=(SELECT COUNT(*) FROM dialer_numbers WHERE campaign_id=?) WHERE id=?`,
    [id, id]
  )

  return NextResponse.json({ ok: true })
}
