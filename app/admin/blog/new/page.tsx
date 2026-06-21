'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AiModel {
  id: string
  label: string
  provider: string
  available: boolean
}

export default function NewBlogPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    cover_image: '',
    author: 'VoxClouds Editorial Team',
    status: 'draft' as 'draft' | 'published',
  })

  // AI Generation state
  const [aiTopic, setAiTopic] = useState('')
  const [generating, setGenerating] = useState(false)
  const [aiStep, setAiStep] = useState('')
  const [models, setModels] = useState<AiModel[]>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [modelUsed, setModelUsed] = useState('')
  const [imagePrompt, setImagePrompt] = useState('')
  const [regeneratingImage, setRegeneratingImage] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('09:00')
  const [showSchedule, setShowSchedule] = useState(false)

  useEffect(() => {
    fetch('/api/admin/blog/generate')
      .then(r => r.json())
      .then(data => {
        if (data.models) {
          setModels(data.models)
          setSelectedModel(data.default || data.models[0]?.id || '')
        }
      })
      .catch(() => {})
  }, [])

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function set(key: string, value: string) {
    setForm(f => {
      const updated = { ...f, [key]: value }
      if (key === 'title' && !f.slug) {
        updated.slug = generateSlug(value)
      }
      return updated
    })
  }

  async function handleAiGenerate() {
    if (!aiTopic.trim()) return
    setGenerating(true)
    setError('')
    setModelUsed('')
    const modelLabel = models.find(m => m.id === selectedModel)?.label || selectedModel
    setAiStep(`Generating with ${modelLabel}...`)

    try {
      const res = await fetch('/api/admin/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic, model: selectedModel }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'AI generation failed')
        if (data.raw) setError(prev => prev + '\n\nRaw response: ' + data.raw)
        setGenerating(false)
        setAiStep('')
        return
      }

      setModelUsed(data.model_used || '')
      setImagePrompt(data.image_prompt || '')
      setAiStep('Done! Review the generated content below.')

      setForm({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        meta_keywords: data.meta_keywords || '',
        cover_image: data.cover_image || '',
        author: 'VoxClouds Editorial Team',
        status: 'draft',
      })
    } catch {
      setError('Network error — please try again')
    }

    setGenerating(false)
    setTimeout(() => setAiStep(''), 8000)
  }

  async function handleRegenerateImage() {
    if (!imagePrompt) return
    setRegeneratingImage(true)
    setError('')
    try {
      const res = await fetch('/api/admin/blog/generate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_prompt: imagePrompt }),
      })
      const data = await res.json()
      if (res.ok && data.cover_image) {
        set('cover_image', data.cover_image)
      } else {
        setError(data.error || 'Failed to regenerate image')
      }
    } catch {
      setError('Network error — please try again')
    }
    setRegeneratingImage(false)
  }

  async function handleSchedule() {
    if (!scheduledDate) { setError('Please select a date'); return }
    const scheduledAt = `${scheduledDate}T${scheduledTime || '09:00'}`
    setSaving(true); setError('')
    const res = await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, status: 'scheduled', scheduled_at: scheduledAt }),
    })
    const data = await res.json()
    if (res.ok) {
      router.push('/admin/blog')
    } else {
      setError(data.error || 'Failed to schedule')
      setSaving(false)
    }
  }

  async function handleSave(status: 'draft' | 'published') {
    setSaving(true); setError('')
    const res = await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, status }),
    })
    const data = await res.json()
    if (res.ok) {
      router.push('/admin/blog')
    } else {
      setError(data.error || 'Failed to save')
      setSaving(false)
    }
  }

  const providerIcon: Record<string, string> = {
    anthropic: 'Claude',
    openai: 'OpenAI',
    gemini: 'Gemini',
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">New Blog Post</h1>
        <div className="flex gap-2 items-center">
          <button onClick={() => handleSave('draft')} disabled={saving}
            className="bg-navy-800 hover:bg-navy-700 border border-slate-700 text-slate-200 font-medium px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50">
            Save Draft
          </button>
          <button onClick={() => setShowSchedule(!showSchedule)} disabled={saving}
            className="bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 font-medium px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50">
            Schedule
          </button>
          <button onClick={() => handleSave('published')} disabled={saving}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50">
            Publish Now
          </button>
        </div>
      </div>

      {/* Schedule Panel */}
      {showSchedule && (
        <div className="mb-6 bg-amber-900/10 border border-amber-500/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-semibold text-amber-300">Schedule Publication</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">Pick a date and time. The post will be automatically published at the scheduled moment.</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-amber-300/80 mb-1">Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-medium text-amber-300/80 mb-1">Time</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              onClick={handleSchedule}
              disabled={saving || !scheduledDate}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {saving ? 'Scheduling...' : 'Confirm Schedule'}
            </button>
          </div>
          {scheduledDate && (
            <p className="mt-3 text-xs text-amber-300/70">
              Post will be automatically published on {new Date(`${scheduledDate}T${scheduledTime || '09:00'}`).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
            </p>
          )}
        </div>
      )}

      {/* AI Generation Section */}
      <div className="mb-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-sm font-semibold text-purple-300">AI Post Generator</span>
          {modelUsed && (
            <span className="text-xs text-slate-500 ml-auto">Generated with {modelUsed}</span>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Enter a topic and AI will generate a complete SEO-optimized blog post with cover image. Review and edit before publishing.
        </p>

        {/* Model selector */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-400 mb-1">AI Model</label>
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            disabled={generating}
            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-navy-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
          >
            {models.map(m => (
              <option key={m.id} value={m.id} disabled={!m.available}>
                {providerIcon[m.provider]} — {m.label}{!m.available ? ' (no key)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Topic input + generate button */}
        <div className="flex gap-2">
          <input
            value={aiTopic}
            onChange={e => setAiTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !generating && handleAiGenerate()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-navy-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
            placeholder="e.g. How to set up a cloud PBX for a small business in 2026"
            disabled={generating}
          />
          <button
            onClick={handleAiGenerate}
            disabled={generating || !aiTopic.trim()}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {generating ? 'Generating...' : 'Generate Post'}
          </button>
        </div>
        {aiStep && (
          <p className="mt-2 text-xs text-purple-300 animate-pulse">{aiStep}</p>
        )}
      </div>

      {/* Cover Image Preview — prominent position */}
      {form.cover_image && (
        <div className="mb-6 bg-navy-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-300">Cover Image Preview</label>
            <div className="flex gap-2">
              {imagePrompt && (
                <button
                  onClick={handleRegenerateImage}
                  disabled={regeneratingImage}
                  className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {regeneratingImage ? 'Generating...' : 'Regenerate Image'}
                </button>
              )}
              <button
                onClick={() => set('cover_image', '')}
                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 text-xs font-medium rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
          <img src={form.cover_image} alt="Cover preview" className="w-full max-h-72 object-cover rounded-xl border border-slate-700" />
          {imagePrompt && (
            <p className="mt-2 text-xs text-slate-500">Prompt: {imagePrompt}</p>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-900/30 border border-red-700/50 text-red-400 text-sm whitespace-pre-wrap">{error}</div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
            placeholder="How to Set Up a Cloud PBX for Your Business" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Slug</label>
          <div className="flex items-center">
            <span className="text-slate-500 text-sm mr-1">/blog/</span>
            <input value={form.slug} onChange={e => set('slug', e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              placeholder="how-to-set-up-cloud-pbx" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Excerpt (shown in blog list)</label>
          <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2}
            className="w-full px-4 py-3 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm resize-none"
            placeholder="A short summary of the post..." />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Content (HTML)</label>
          <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={20}
            className="w-full px-4 py-3 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-mono resize-y"
            placeholder="<h2>Introduction</h2><p>Your content here...</p>" />
          <p className="text-xs text-slate-500 mt-1">
            Use HTML tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a href&gt;, &lt;strong&gt;, &lt;blockquote&gt;, &lt;code&gt;
          </p>
        </div>

        <div className="border-t border-slate-800 pt-4">
          <p className="text-sm font-medium text-slate-300 mb-3">SEO Settings</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Meta Title (defaults to title)</label>
              <input value={form.meta_title} onChange={e => set('meta_title', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                placeholder="SEO title..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Meta Description</label>
              <textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)} rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm resize-none"
                placeholder="SEO description (150-160 chars)..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Meta Keywords</label>
              <input value={form.meta_keywords} onChange={e => set('meta_keywords', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                placeholder="cloud pbx, voip, business phone..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Cover Image URL</label>
              <input value={form.cover_image} onChange={e => set('cover_image', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Author</label>
              <input value={form.author} onChange={e => set('author', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
