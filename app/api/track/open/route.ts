import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

// 1x1 transparent GIF
const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')

export async function GET(req: NextRequest) {
  const trackId = req.nextUrl.searchParams.get('t')

  if (trackId) {
    try {
      await db.query(
        `UPDATE email_log SET opened_at = COALESCE(opened_at, NOW()), open_count = open_count + 1 WHERE track_id = ?`,
        [trackId]
      )
    } catch {}
  }

  return new NextResponse(PIXEL, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  })
}
