import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session || session.type !== -1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = req.nextUrl.searchParams.get('status') || ''
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit

  let where = '1=1'
  const params: (string | number)[] = []
  if (status) { where += ' AND status = ?'; params.push(status) }

  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT id, title, slug, status, author, published_at, scheduled_at, created_at
     FROM blog_posts WHERE ${where}
     ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  )

  const [countRows] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM blog_posts WHERE ${where}`,
    params
  )

  return NextResponse.json({
    posts: rows,
    total: countRows[0].total,
    page,
    pages: Math.ceil(countRows[0].total / limit),
  })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.type !== -1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, slug, excerpt, content, meta_title, meta_description, meta_keywords, cover_image, author, status, scheduled_at } = body

  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 })
  }

  // Check slug uniqueness
  const [existing] = await db.query<RowDataPacket[]>('SELECT id FROM blog_posts WHERE slug = ?', [slug])
  if (existing.length) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
  }

  const finalStatus = scheduled_at ? 'scheduled' : (status || 'draft')
  const publishedAt = finalStatus === 'published' ? new Date() : null
  const scheduledAt = scheduled_at ? new Date(scheduled_at) : null

  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO blog_posts (title, slug, excerpt, content, meta_title, meta_description, meta_keywords, cover_image, author, status, published_at, scheduled_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, slug, excerpt || '', content, meta_title || title, meta_description || excerpt || '', meta_keywords || '', cover_image || '', author || 'VoxClouds', finalStatus, publishedAt, scheduledAt]
  )

  return NextResponse.json({ id: result.insertId, slug })
}
