import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10')
  const offset = (page - 1) * limit

  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT id, title, slug, excerpt, cover_image, author, published_at
     FROM blog_posts WHERE status = 'published'
     ORDER BY published_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  )

  const [countRows] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM blog_posts WHERE status = 'published'`
  )

  return NextResponse.json({
    posts: rows,
    total: countRows[0].total,
    page,
    pages: Math.ceil(countRows[0].total / limit),
  })
}
