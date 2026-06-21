'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Post {
  id: number
  title: string
  slug: string
  status: string
  author: string
  published_at: string | null
  scheduled_at: string | null
  created_at: string
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [filter])

  async function fetchPosts() {
    setLoading(true)
    const params = new URLSearchParams()
    if (filter) params.set('status', filter)
    const res = await fetch(`/api/admin/blog?${params}`)
    const data = await res.json()
    setPosts(data.posts || [])
    setLoading(false)
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"?`)) return
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    fetchPosts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your blog content for SEO</p>
        </div>
        <Link href="/admin/blog/new"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          + New Post
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        {['', 'published', 'draft', 'scheduled'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === s ? 'bg-blue-600 text-white' : 'bg-navy-800 text-slate-400 hover:text-white'
            }`}>
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No posts yet. Create your first blog post!</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-left">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b border-slate-800/50 hover:bg-navy-800/50">
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">{post.title}</div>
                    <div className="text-slate-500 text-xs mt-0.5">/{post.slug}</div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'published' ? 'bg-green-900/50 text-green-400' :
                      post.status === 'scheduled' ? 'bg-amber-900/50 text-amber-400' :
                      'bg-yellow-900/50 text-yellow-400'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {post.status === 'published' && post.published_at ? (
                      <span className="text-slate-400">{new Date(post.published_at).toLocaleDateString()}</span>
                    ) : post.status === 'scheduled' && post.scheduled_at ? (
                      <span className="text-amber-400 text-xs">Scheduled: {new Date(post.scheduled_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                    ) : (
                      <span className="text-slate-500 text-xs">Draft</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === 'published' && (
                        <a href={`/blog/${post.slug}`} target="_blank"
                          className="text-slate-500 hover:text-blue-400 transition-colors text-xs">
                          View
                        </a>
                      )}
                      <Link href={`/admin/blog/${post.id}`}
                        className="text-slate-500 hover:text-white transition-colors text-xs">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(post.id, post.title)}
                        className="text-slate-500 hover:text-red-400 transition-colors text-xs">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
