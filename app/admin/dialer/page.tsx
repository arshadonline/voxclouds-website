'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Campaign {
  id: number
  name: string
  description: string
  caller_id: string
  agent_extension: string
  mode: string
  script: string
  voice: string
  status: string
  total_numbers: number
  dialed: number
  answered: number
  failed: number
  interested: number
  created_at: string
}

interface SipAccount {
  id: number
  username: string
  accountid: number
  first_name: string
  last_name: string
  number: string
}

export default function DialerPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [sipAccounts, setSipAccounts] = useState<SipAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', caller_id: '', agent_extension: '', ring_timeout: '30', mode: 'robocall', script: 'english', voice: 'female' })
  const [expandedScript, setExpandedScript] = useState<number | null>(null)

  const scriptInfo: Record<string, { label: string; voiceName: string; pitch: string; keys: string }> = {
    english_female: {
      label: 'English',
      voiceName: 'Sonia (Female, British)',
      pitch: 'Hello! This is a call from VoxClouds, your international VoIP platform. With VoxClouds, you can make affordable calls to over 50 countries, and run your own automated marketing campaigns without hiring call center operators. Press 1 if interested, press 9 if not, press 3 to call later, press 0 to talk to an agent.',
      keys: '1 = Interested, 9 = Not Interested, 3 = Call Later, 0 = Talk to Agent',
    },
    english_male: {
      label: 'English',
      voiceName: 'Ryan (Male, British)',
      pitch: 'Hello! This is a call from VoxClouds, your international VoIP platform. With VoxClouds, you can make affordable calls to over 50 countries, and run your own automated marketing campaigns without hiring call center operators. If you are interested, press 1. If not interested, press 9. To receive a call back later, press 3. To speak with an agent, press 0.',
      keys: '1 = Interested, 9 = Not Interested, 3 = Call Later, 0 = Talk to Agent',
    },
    urdu_male: {
      label: 'Urdu (اردو)',
      voiceName: 'Asad (Male, Pakistan)',
      pitch: 'السلام علیکم! VoxClouds سے آپ دنیا بھر میں سستی کالز کرنے کے ساتھ ساتھ اپنی مارکیٹنگ کالز بھی خود کر سکتے ہیں۔ کال سینٹرز کو آپریٹرز ہائر کرنے کی ضرورت نہیں۔ اگر آپ کی دلچسپی ہے تو 1 دبائیں۔ اگر نہیں تو 2 دبائیں۔',
      keys: '1 = دلچسپی, 2 = نہیں, 3 = بعد میں کال, 0 = ایجنٹ سے بات',
    },
    urdu_female: {
      label: 'Urdu (اردو)',
      voiceName: 'Uzma (Female, Pakistan)',
      pitch: 'السلام علیکم! VoxClouds سے آپ دنیا بھر میں سستی کالز کرنے کے ساتھ ساتھ اپنی مارکیٹنگ کالز بھی خود کر سکتے ہیں۔ کال سینٹرز کو آپریٹرز ہائر کرنے کی ضرورت نہیں۔ اگر آپ کی دلچسپی ہے تو 1 دبائیں۔ اگر نہیں تو 2 دبائیں۔',
      keys: '1 = دلچسپی, 2 = نہیں, 3 = بعد میں کال, 0 = ایجنٹ سے بات',
    },
  }
  const [creating, setCreating] = useState(false)

  useEffect(() => { loadCampaigns() }, [])

  async function loadCampaigns() {
    const res = await fetch('/api/admin/dialer')
    const data = await res.json()
    setCampaigns(data.campaigns || [])
    setSipAccounts(data.sipAccounts || [])
    setLoading(false)
  }

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    await fetch('/api/admin/dialer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        ring_timeout: parseInt(form.ring_timeout),
      }),
    })
    setForm({ name: '', description: '', caller_id: '', agent_extension: '', ring_timeout: '30', mode: 'robocall', script: 'english', voice: 'female' })
    setShowCreate(false)
    setCreating(false)
    loadCampaigns()
  }

  function handleSipSelect(field: 'caller_id' | 'agent_extension', username: string) {
    setForm({ ...form, [field]: username })
  }

  const statusColor: Record<string, string> = {
    draft: 'bg-slate-600',
    running: 'bg-green-600',
    paused: 'bg-yellow-600',
    completed: 'bg-blue-600',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Auto Dialer</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          {showCreate ? 'Cancel' : '+ New Campaign'}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={createCampaign} className="bg-navy-800 rounded-xl p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Campaign Name *</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm"
                placeholder="e.g. Pakistan Expats UK"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Description</label>
              <input
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm"
                placeholder="Optional description"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Caller ID *</label>
              <select
                value={form.caller_id}
                onChange={e => handleSipSelect('caller_id', e.target.value)}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm"
                required
              >
                <option value="">Select caller ID</option>
                {sipAccounts.map(s => (
                  <option key={`cid-${s.id}`} value={s.username}>
                    {s.username} — {s.first_name} {s.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Agent Extension *</label>
              <select
                value={form.agent_extension}
                onChange={e => handleSipSelect('agent_extension', e.target.value)}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm"
                required
              >
                <option value="">Select agent extension</option>
                {sipAccounts.map(s => (
                  <option key={`ext-${s.id}`} value={s.username}>
                    {s.username} — {s.first_name} {s.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Mode *</label>
              <select
                value={form.mode}
                onChange={e => setForm({ ...form, mode: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm"
              >
                <option value="robocall">Robo-Call (Automated Message + DTMF)</option>
                <option value="agent">Live Agent (Bridge to Agent)</option>
              </select>
            </div>
            {form.mode === 'robocall' && (
              <div>
                <label className="block text-sm text-slate-400 mb-1">IVR Script Language</label>
                <select
                  value={form.script}
                  onChange={e => setForm({ ...form, script: e.target.value })}
                  className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm"
                >
                  <option value="english">English</option>
                  <option value="urdu">Urdu (اردو)</option>
                </select>
              </div>
            )}
            {form.mode === 'robocall' && (
              <div>
                <label className="block text-sm text-slate-400 mb-1">Voice</label>
                <select
                  value={form.voice}
                  onChange={e => setForm({ ...form, voice: e.target.value })}
                  className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm"
                >
                  <option value="female">👩 Female</option>
                  <option value="male">👨 Male</option>
                </select>
              </div>
            )}
          </div>
          {form.mode === 'robocall' && scriptInfo[`${form.script}_${form.voice}`] && (
            <div className="bg-navy-900 border border-slate-700 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">IVR Preview</span>
                <span className="text-xs text-slate-500">— {scriptInfo[`${form.script}_${form.voice}`].voiceName}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{scriptInfo[`${form.script}_${form.voice}`].pitch}</p>
              <p className="text-xs text-slate-500">Keys: {scriptInfo[`${form.script}_${form.voice}`].keys}</p>
            </div>
          )}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Ring Timeout (seconds)</label>
            <input
              type="number"
              value={form.ring_timeout}
              onChange={e => setForm({ ...form, ring_timeout: e.target.value })}
              className="w-32 px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-white text-sm"
              min="10" max="120"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create Campaign'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-slate-400 text-center py-12">Loading...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">📞</div>
          <p className="text-slate-400">No campaigns yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => {
            const info = scriptInfo[`${c.script}_${c.voice}`] || scriptInfo['english_female']
            return (
              <div key={c.id} className="bg-navy-800 rounded-xl overflow-hidden">
                <Link
                  href={`/admin/dialer/${c.id}`}
                  className="block p-5 hover:bg-navy-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-semibold">{c.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full text-white ${statusColor[c.status] || 'bg-slate-600'}`}>
                          {c.status}
                        </span>
                        {c.mode === 'robocall' && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-300">
                            {info.label}
                          </span>
                        )}
                      </div>
                      {c.description && <p className="text-sm text-slate-400">{c.description}</p>}
                      <p className="text-xs text-slate-500 mt-1">
                        {c.mode === 'robocall' ? '🤖 Robo-Call' : '👤 Live Agent'} &bull; {info.voiceName} &bull; Caller: {c.caller_id} &bull; {new Date(c.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-white font-mono">{c.dialed}/{c.total_numbers}</div>
                      <div className="text-xs text-slate-400">
                        <span className="text-green-400">{c.answered} answered</span>
                        {c.interested > 0 && <span className="text-cyan-400 ml-2">{c.interested} interested</span>}
                        {c.failed > 0 && <span className="text-red-400 ml-2">{c.failed} failed</span>}
                      </div>
                    </div>
                  </div>

                  {c.total_numbers > 0 && (
                    <div className="mt-3 h-1.5 bg-navy-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all"
                        style={{ width: `${Math.round((c.dialed / c.total_numbers) * 100)}%` }}
                      />
                    </div>
                  )}
                </Link>

                {c.mode === 'robocall' && (
                  <div className="border-t border-slate-700/50">
                    <button
                      onClick={(e) => { e.preventDefault(); setExpandedScript(expandedScript === c.id ? null : c.id) }}
                      className="w-full px-5 py-2 flex items-center justify-between text-xs text-slate-500 hover:text-slate-300 hover:bg-navy-750 transition-colors"
                    >
                      <span>📜 View IVR Script</span>
                      <svg className={`w-3.5 h-3.5 transition-transform ${expandedScript === c.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedScript === c.id && (
                      <div className="px-5 pb-4 space-y-2">
                        <p className="text-sm text-slate-300 leading-relaxed">{info.pitch}</p>
                        <p className="text-xs text-slate-500">Keys: {info.keys}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
