import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

type Props = { params: Promise<{ slug: string }> }

async function getPost(slug: string) {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM blog_posts WHERE slug = ? AND status = 'published' LIMIT 1`,
    [slug]
  )
  return rows[0] || null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.meta_keywords,
    alternates: { canonical: `https://voxclouds.com/blog/${post.slug}` },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: `https://voxclouds.com/blog/${post.slug}`,
      siteName: 'VoxClouds',
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author],
      ...(post.cover_image ? { images: [{ url: post.cover_image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
    },
  }
}

export const revalidate = 60

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    author: { '@type': 'Organization', name: post.author || 'VoxClouds' },
    publisher: { '@type': 'Organization', name: 'VoxClouds', url: 'https://voxclouds.com' },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    url: `https://voxclouds.com/blog/${post.slug}`,
    ...(post.cover_image ? { image: post.cover_image } : {}),
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <SiteHeader />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="pt-16 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-400 transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">{post.title}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-500 mt-4">
              <span>{post.author}</span>
              <span>&bull;</span>
              <time dateTime={post.published_at}>
                {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </div>
          </header>

          {post.cover_image && (
            <div className="mb-10 rounded-2xl overflow-hidden">
              <img src={post.cover_image} alt={post.title} className="w-full h-auto" />
            </div>
          )}

          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-p:text-slate-300 prose-p:leading-relaxed
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-ul:text-slate-300 prose-ol:text-slate-300
              prose-li:text-slate-300
              prose-blockquote:border-blue-500 prose-blockquote:text-slate-400
              prose-code:text-blue-300 prose-code:bg-navy-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-navy-800 prose-pre:border prose-pre:border-slate-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-16 pt-8 border-t border-slate-800">
            <div className="bg-navy-900 border border-slate-800 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-white">Ready to get started with VoxClouds?</h3>
              <p className="mt-2 text-slate-400">Cloud PBX, virtual numbers, and cheap international calls.</p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
                  Sign Up Free
                </Link>
                <Link href="/pricing" className="bg-navy-800 hover:bg-navy-700 border border-slate-700 text-slate-200 font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <SiteFooter />
    </div>
  )
}
