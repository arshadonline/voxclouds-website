import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM blog_posts WHERE id = ?', [id])
  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(rows[0])
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { title, slug, excerpt, content, meta_title, meta_description, meta_keywords, cover_image, author, status } = body

  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 })
  }

  // Check slug uniqueness (excluding current post)
  const [existing] = await db.query<RowDataPacket[]>('SELECT id FROM blog_posts WHERE slug = ? AND id != ?', [slug, id])
  if (existing.length) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
  }

  // Set published_at when first published
  const [current] = await db.query<RowDataPacket[]>('SELECT status, published_at FROM blog_posts WHERE id = ?', [id])
  let publishedAt = current[0]?.published_at
  if (status === 'published' && current[0]?.status === 'draft') {
    publishedAt = new Date()
  }

  await db.query<ResultSetHeader>(
    `UPDATE blog_posts SET title=?, slug=?, excerpt=?, content=?, meta_title=?, meta_description=?, meta_keywords=?, cover_image=?, author=?, status=?, published_at=?
     WHERE id=?`,
    [title, slug, excerpt || '', content, meta_title || title, meta_description || excerpt || '', meta_keywords || '', cover_image || '', author || 'VoxClouds', status || 'draft', publishedAt, id]
  )

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.type !== -1) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await db.query<ResultSetHeader>('DELETE FROM blog_posts WHERE id = ?', [id])
  return NextResponse.json({ ok: true })
}
