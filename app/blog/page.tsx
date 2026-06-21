import Link from 'next/link'
import type { Metadata } from 'next'
import db from '@/lib/db'
import { RowDataPacket } from 'mysql2'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'VoxClouds Blog — VoIP Tips, Cloud PBX Guides & Telecom News',
  description: 'Learn about cloud PBX, VoIP technology, international calling tips, and business communication strategies. Expert guides for businesses in Africa, Middle East, and South Asia.',
  keywords: 'VoIP blog, cloud PBX guide, international calling tips, business phone tips, telecom news, VoIP Africa, SIP trunking guide',
  alternates: { canonical: 'https://voxclouds.com/blog' },
  openGraph: {
    title: 'VoxClouds Blog — VoIP & Cloud PBX Insights',
    description: 'Expert guides on cloud PBX, VoIP, and business communications.',
    url: 'https://voxclouds.com/blog',
    siteName: 'VoxClouds',
    type: 'website',
  },
}

async function getPosts() {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT id, title, slug, excerpt, cover_image, author, published_at
     FROM blog_posts WHERE status = 'published'
     ORDER BY published_at DESC LIMIT 20`
  )
  return rows
}

export const revalidate = 60

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-navy-950">
      <SiteHeader />

      <section className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">VoxClouds Blog</h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Expert guides on cloud PBX, VoIP technology, international calling, and business communication strategies.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-navy-800 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-slate-400 text-lg">No posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Featured post — first one, large layout */}
              {posts.length > 0 && (
                <article className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors group">
                  <Link href={`/blog/${posts[0].slug}`} className="block">
                    {posts[0].cover_image && (
                      <div className="relative w-full h-64 sm:h-80 overflow-hidden">
                        <img
                          src={posts[0].cover_image}
                          alt={posts[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />
                      </div>
                    )}
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                        <span>{posts[0].author}</span>
                        <span>&bull;</span>
                        <time dateTime={posts[0].published_at}>
                          {new Date(posts[0].published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {posts[0].title}
                      </h2>
                      {posts[0].excerpt && (
                        <p className="mt-3 text-slate-400 line-clamp-2">{posts[0].excerpt}</p>
                      )}
                      <span className="inline-block mt-4 text-blue-400 text-sm font-medium">
                        Read more &rarr;
                      </span>
                    </div>
                  </Link>
                </article>
              )}

              {/* Remaining posts — image + text side by side */}
              {posts.slice(1).map((post: RowDataPacket) => (
                <article key={post.id} className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors group">
                  <Link href={`/blog/${post.slug}`} className="block sm:flex">
                    {post.cover_image && (
                      <div className="relative w-full sm:w-72 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 sm:p-8 flex-1">
                      <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                        <span>{post.author}</span>
                        <span>&bull;</span>
                        <time dateTime={post.published_at}>
                          {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-3 text-slate-400 line-clamp-2">{post.excerpt}</p>
                      )}
                      <span className="inline-block mt-4 text-blue-400 text-sm font-medium">
                        Read more &rarr;
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
