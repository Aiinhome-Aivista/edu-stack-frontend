import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BookOpen, ArrowLeft } from 'lucide-react'

export default function CommonPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  // Map slug to readable title
  const titles = {
    'solutions': 'Our Solutions',
    'pricing': 'Pricing Plans',
    'case-studies': 'Case Studies',
    'security': 'Security & Compliance',
    'help': 'Help Center',
    'blog': 'Educational Blog',
    'tutorials': 'Video Tutorials',
    'vision': 'Our Vision',
    'careers': 'Join Our Team',
    'contact': 'Contact Us',
    'privacy': 'Privacy Policy'
  }

  const title = titles[slug] || slug?.charAt(0).toUpperCase() + slug?.slice(1)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="px-8 py-5 bg-white border-b flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <BookOpen size={22} className="text-orange-500" />
          <span className="text-xl font-extrabold">
            <span style={{ color: '#1E2B6F' }}>Edu</span>
            <span style={{ color: '#F05A28' }}>Stack</span>
          </span>
        </div>
        <button onClick={() => navigate('/')}
          className="text-sm font-semibold flex items-center gap-1.5 hover:text-orange-500 transition">
          <ArrowLeft size={16} /> Back to Home
        </button>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full py-16 px-8">
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen size={40} />
          </div>
          <h1 className="text-4xl font-extrabold mb-4" style={{ color: '#1E2B6F' }}>
            {title}
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            This page is currently under development as part of our core ecosystem expansion. 
            Stay tuned for the full {title} experience coming soon!
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate('/')} className="btn-primary px-8 py-3 rounded-xl">
              Return Home
            </button>
            <button onClick={() => navigate('/login')} className="bg-white border text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">
              Get Started
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border">
            <h3 className="font-bold text-lg mb-2" style={{ color: '#1E2B6F' }}>Need immediate help?</h3>
            <p className="text-sm text-gray-500 mb-4">Our support team is available 24/7 to assist you with any questions.</p>
            <button className="text-orange-500 font-bold text-sm hover:underline">Contact Support →</button>
          </div>
          <div className="bg-white p-6 rounded-2xl border">
            <h3 className="font-bold text-lg mb-2" style={{ color: '#1E2B6F' }}>New to EduStack?</h3>
            <p className="text-sm text-gray-500 mb-4">Learn how our platform can transform your educational institution.</p>
            <button className="text-orange-500 font-bold text-sm hover:underline">View Demo →</button>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-gray-400 border-t bg-white">
        ©2026 VedaYukti. All rights reserved.
      </footer>
    </div>
  )
}
