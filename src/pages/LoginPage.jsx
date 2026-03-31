import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../context/authStore'
import toast from 'react-hot-toast'
import { Eye, EyeOff, BookOpen } from 'lucide-react'
import logo from '../assets/Edustack_logo.svg'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Please fill all fields')
    setLoading(true)
    try {
      const user = await login(email.trim(), password)
      toast.success(`Welcome back!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Login failed. Check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--brand-bg)' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12"
           style={{ background: 'linear-gradient(145deg, #1E2B6F 0%, #2E3E8F 60%, #6B5ECD 100%)' }}>
        <div className="text-center text-white max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-sm shadow-white/20 flex-shrink-0">
              <img src={logo} alt="EduStack Logo" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-4xl font-bold tracking-tight">
              <span className="text-white">Edu</span>
              <span style={{ color: '#F05A28' }}>Stack</span>
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Next-gen Education Ecosystem
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            AI-powered learning management for institutes, teachers, and students — all in one platform.
          </p>

          {/* Feature pills */}
          <div className="mt-10 grid grid-cols-2 gap-3 text-sm">
            {['AI Question Generation', 'Smart Learning Paths', 'Fee Management', 'Real-time Analytics',
              'Behavioral Proctoring', '5 Role Dashboards'].map(f => (
              <div key={f} className="bg-white/10 rounded-xl px-4 py-3 text-white/90 font-medium">
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <img src={logo} alt="EduStack Logo" className="h-10 w-auto" />
            <span className="text-2xl font-bold" style={{ color: 'var(--brand-navy)' }}>
              Edu<span style={{ color: '#F05A28' }}>Stack</span>
            </span>
          </div>

          <div className="card p-8">
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-navy)' }}>
              Sign in to your account
            </h1>
            <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
              Enter your credentials to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-orange-500" />
                  <span style={{ color: 'var(--text-secondary)' }}>Remember me</span>
                </label>
                <button type="button" className="font-medium hover:underline"
                  style={{ color: 'var(--brand-orange)' }}>
                  Forgot password?
                </button>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 rounded-xl text-base"
                style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              Powered by EduStack LMS &copy; 2026. For access, contact your institution admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
