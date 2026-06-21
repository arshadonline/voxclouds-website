'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const COUNTRIES = [
  { code: 146, name: 'Pakistan', dial: '+92' },
  { code: 88, name: 'India', dial: '+91' },
  { code: 203, name: 'United States', dial: '+1' },
  { code: 200, name: 'United Kingdom', dial: '+44' },
  { code: 199, name: 'United Arab Emirates', dial: '+971' },
  { code: 162, name: 'Saudi Arabia', dial: '+966' },
  { code: 156, name: 'Qatar', dial: '+974' },
  { code: 102, name: 'Kuwait', dial: '+965' },
  { code: 16, name: 'Bahrain', dial: '+973' },
  { code: 145, name: 'Oman', dial: '+968' },
  { code: 36, name: 'Canada', dial: '+1' },
  { code: 72, name: 'Germany', dial: '+49' },
  { code: 66, name: 'France', dial: '+33' },
  { code: 12, name: 'Australia', dial: '+61' },
  { code: 117, name: 'Malaysia', dial: '+60' },
  { code: 152, name: 'Philippines', dial: '+63' },
  { code: 17, name: 'Bangladesh', dial: '+880' },
  { code: 135, name: 'Nepal', dial: '+977' },
  { code: 175, name: 'Sri Lanka', dial: '+94' },
  { code: 57, name: 'Egypt', dial: '+20' },
  { code: 141, name: 'Nigeria', dial: '+234' },
  { code: 171, name: 'South Africa', dial: '+27' },
  { code: 100, name: 'Kenya', dial: '+254' },
  { code: 194, name: 'Turkey', dial: '+90' },
]

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    company: '', password: '', confirmPassword: '', countryCode: 146,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState<{ accountNumber: string } | null>(null)

  function updateField(field: string, value: string | number) {
    setForm(f => ({ ...f, [field]: value }))
    if (error) setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.firstName.trim()) { setError('First name is required'); return }
    if (!form.email.trim() || !form.email.includes('@')) { setError('Valid email address is required'); return }
    if (!form.phone.trim()) { setError('Phone number is required'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          company: form.company,
          password: form.password,
          countryCode: form.countryCode,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSuccess({ accountNumber: data.accountNumber })
      } else {
        setError(data.error || 'Signup failed. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    }
    setLoading(false)
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 bg-navy-950">
        <div className="w-full max-w-md">
          <div className="bg-navy-800 rounded-2xl border border-slate-700/50 p-8 text-center">
            {/* Checkmark */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600/20 mb-5">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Account Created!</h2>
            <p className="text-slate-400 text-sm mb-6">
              Your VoxClouds account is ready. We&apos;ve sent your login details to <span className="text-white">{form.email}</span>.
            </p>

            <div className="bg-navy-900 rounded-xl p-4 mb-6 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400">Account Number</span>
                <span className="text-sm font-mono text-white font-semibold">{success.accountNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Password</span>
                <span className="text-sm text-slate-300">The one you just set</span>
              </div>
            </div>

            <button onClick={() => router.push('/login')}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors">
              Sign In Now
            </button>

            <p className="text-xs text-slate-500 mt-4">
              Check your inbox for a welcome email with all the details.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 sm:px-6 bg-navy-950 py-8 sm:py-12 sm:justify-center">
      <div className="w-full max-w-md">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Power Up Your Business Communications</h1>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed">
            Make international calls, get virtual numbers for USA, UK &amp; 180+ countries,
            and deploy AI-powered voice agents — all from your browser.
          </p>
        </div>

        {/* Trust banner */}
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="text-xs text-blue-300">
            Trusted by businesses worldwide. Set up in under 2 minutes — no hardware required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">First Name *</label>
              <input type="text" required value={form.firstName}
                onChange={e => updateField('firstName', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base sm:text-sm"
                placeholder="John" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Last Name</label>
              <input type="text" value={form.lastName}
                onChange={e => updateField('lastName', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base sm:text-sm"
                placeholder="Doe" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address *</label>
            <input type="email" required value={form.email}
              onChange={e => updateField('email', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              placeholder="john@example.com" />
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Country</label>
            <select value={form.countryCode}
              onChange={e => updateField('countryCode', parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-navy-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base sm:text-sm appearance-none">
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name} ({c.dial})</option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone Number *</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-xl bg-navy-900 border border-r-0 border-slate-700 text-slate-300 text-sm font-mono">
                {COUNTRIES.find(c => c.code === form.countryCode)?.dial || '+92'}
              </span>
              <input type="tel" required value={form.phone}
                onChange={e => updateField('phone', e.target.value.replace(/[^0-9]/g, ''))}
                className="flex-1 px-4 py-3 rounded-r-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="3001234567" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Enter number without country code</p>
          </div>

          {/* Company (optional) */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Company <span className="text-slate-600">(optional)</span></label>
            <input type="text" value={form.company}
              onChange={e => updateField('company', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              placeholder="Your company name" />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Password *</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required value={form.password}
                onChange={e => updateField('password', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base sm:text-sm pr-12"
                placeholder="Min 6 characters" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm Password *</label>
            <input type={showPassword ? 'text' : 'password'} required value={form.confirmPassword}
              onChange={e => updateField('confirmPassword', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-navy-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              placeholder="Repeat your password" />
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-900/30 border border-red-700/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm transition-colors mt-2">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Features grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'International Calling', desc: 'Crystal-clear calls to 180+ countries at wholesale rates' },
            { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', title: 'Virtual Numbers', desc: 'Get USA, UK & international DIDs for your business' },
            { icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', title: 'AI Voice Agents', desc: 'Deploy intelligent voice bots to handle calls 24/7' },
            { icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', title: 'Browser-Based', desc: 'No downloads or hardware — call directly from your browser' },
          ].map((f, i) => (
            <div key={i} className="bg-navy-800/50 rounded-xl p-3.5 border border-slate-700/30">
              <svg className="w-5 h-5 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
              </svg>
              <p className="text-xs font-semibold text-white mb-0.5">{f.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <div className="flex -space-x-2">
            {['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500'].map((c, i) => (
              <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-navy-950 flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">{['M', 'A', 'S', 'K'][i]}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            Join businesses already using VoxClouds
          </p>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign In</Link>
        </p>

        <p className="text-center text-xs text-slate-600 mt-4">
          &copy; 2026 VoxClouds &middot; AI-Powered Telecom Solutions by{' '}
          <a href="https://watnidigital.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-400">Watni Digital</a>
        </p>
      </div>
    </div>
  )
}
