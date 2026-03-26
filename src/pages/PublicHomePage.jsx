import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, BarChart2, Users, GraduationCap, Wifi, Database, CheckCircle } from 'lucide-react'

const PILLARS = [
  { icon: '🏛', title: 'Institute', color: '#1E2B6F',
    desc: 'Unified administration, financial management, and resource planning for modern campuses.' },
  { icon: '👩‍🏫', title: 'Teachers', color: '#F05A28',
    desc: 'AI-powered grading, lesson planning, and real-time student performance analytics.' },
  { icon: '👨‍👩‍👧', title: 'Parents', color: '#F59E0B',
    desc: 'Complete transparency into child\'s progress, attendance, and holistic development.' },
  { icon: '🎓', title: 'Students', color: '#6B5ECD',
    desc: 'Personalized learning paths, interactive modules, and global skill benchmarking.' },
]

const ECOSYSTEM = [
  { icon: BarChart2, title: 'Real-time Analytics',
    desc: 'Live dashboards showing performance metrics across classes and individuals.' },
  { icon: Wifi, title: 'Connected Nodes',
    desc: 'Automatic updates and notifications keep parents and teachers perfectly synced.' },
  { icon: Database, title: 'Validated Insights',
    desc: 'Educational models verified by pedagogical experts and modern data science.' },
]

export default function PublicHomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Nav */}
      <header className="px-8 py-5 flex items-center justify-between"
        style={{ background: 'rgba(255,255,255,0.95)' }}>
        <div className="flex items-center gap-2">
          <BookOpen size={22} className="text-orange-500" />
          <span className="text-xl font-extrabold">
            <span style={{ color: '#1E2B6F' }}>Edu</span>
            <span style={{ color: '#F05A28' }}>Stack</span>
          </span>
        </div>
        <button onClick={() => navigate('/login')}
          className="bg-yellow-400 text-yellow-900 font-semibold px-5 py-2 rounded-xl text-sm hover:bg-yellow-300 transition flex items-center gap-2">
          Get Started →
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-8 py-20 max-w-6xl mx-auto">
        {/* Decorative tree SVG (orange branches) */}
        <div className="absolute right-0 top-0 w-1/2 h-80 pointer-events-none select-none"
          style={{ opacity: 0.9 }}>
          <svg viewBox="0 0 600 350" className="w-full h-full">
            <path d="M500 0 Q420 80 480 160 Q420 140 350 200 Q400 100 300 80 Q420 60 500 0"
              fill="none" stroke="#F05A28" strokeWidth="14" strokeLinecap="round" />
            <path d="M480 160 Q380 200 320 280" fill="none" stroke="#F05A28" strokeWidth="10" strokeLinecap="round" />
            <ellipse cx="310" cy="78" rx="18" ry="28" fill="#1E2B6F" transform="rotate(-30 310 78)" />
            <ellipse cx="340" cy="60" rx="15" ry="24" fill="#1E2B6F" transform="rotate(15 340 60)" />
            <ellipse cx="290" cy="110" rx="14" ry="22" fill="#1E2B6F" transform="rotate(-10 290 110)" />
            <ellipse cx="370" cy="195" rx="15" ry="23" fill="#1E2B6F" transform="rotate(20 370 195)" />
            <ellipse cx="340" cy="220" rx="13" ry="20" fill="#1E2B6F" transform="rotate(-15 340 220)" />
            <ellipse cx="430" cy="150" rx="16" ry="25" fill="#1E2B6F" transform="rotate(5 430 150)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen size={36} className="text-orange-500" />
            <span className="text-4xl font-extrabold">
              <span style={{ color: '#1E2B6F' }}>Edu</span>
              <span style={{ color: '#F05A28' }}>Stack</span>
            </span>
          </div>
          <h1 className="text-4xl font-extrabold mb-4 leading-tight" style={{ color: '#1E2B6F' }}>
            Next-gen Education Ecosystem
          </h1>
          <p className="text-base mb-8 leading-relaxed" style={{ color: '#6B7280' }}>
            A comprehensive smart education platform designed to empower institutes, teachers, parents,
            and students through a data-driven collaborative ecosystem.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => navigate('/login')}
              className="btn-primary flex items-center gap-2 text-base px-7 py-3.5 rounded-xl">
              Start Personalized Learning →
            </button>
          </div>
          <div className="flex gap-4 mt-8">
            <div className="bg-purple-600 text-white rounded-full px-5 py-2 text-sm font-semibold">
              +84 Growth Rate
            </div>
            <div className="bg-yellow-400 text-yellow-900 rounded-full px-5 py-2 text-sm font-semibold">
              Elite Class Performance
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="py-20 px-8" style={{ background: '#F9FAFB' }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-3" style={{ color: '#1E2B6F' }}>
            The Four Pillars of Our Ecosystem
          </h2>
          <p className="mb-12 text-base" style={{ color: '#6B7280' }}>
            Bridging the gap between everyone involved in the educational journey with a unified,
            data-driven approach.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map(p => (
              <div key={p.title} className="bg-white rounded-2xl p-6 text-left shadow-sm border"
                style={{ borderColor: '#E8EAF6' }}>
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#1E2B6F' }}>{p.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B7280' }}>{p.desc}</p>
                <button className="text-sm font-semibold hover:underline" style={{ color: p.color }}>
                  Explore →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data-Driven Ecosystem */}
      <section className="py-20 px-8" style={{ background: '#1E2B6F' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Data-Driven Collaborative Ecosystem
            </h2>
            <p className="text-white/70 mb-8 leading-relaxed">
              We believe that education is most effective when information flows seamlessly between
              all stakeholders. Our platform ensures that every insight is actionable.
            </p>
            <div className="space-y-5">
              {ECOSYSTEM.map(e => (
                <div key={e.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(240,90,40,0.2)' }}>
                    <e.icon size={18} style={{ color: '#F05A28' }} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{e.title}</p>
                    <p className="text-sm text-white/60 mt-0.5">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Nodes visual */}
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(107,94,205,0.3)' }} />
              <div className="absolute inset-8 rounded-full" style={{ background: 'rgba(107,94,205,0.4)' }} />
              <div className="absolute inset-16 rounded-full" style={{ background: 'rgba(107,94,205,0.6)' }} />
              {[
                { top: '15%', right: '5%', icon: '🎓' },
                { top: '50%', right: '-5%', icon: '📊' },
                { bottom: '20%', left: '10%', icon: '✉️' },
              ].map((n, i) => (
                <div key={i} className="absolute w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-lg"
                  style={{ top: n.top, right: n.right, bottom: n.bottom, left: n.left }}>
                  <span className="text-lg">{n.icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Learning Journey */}
      <section className="py-20 px-8" style={{ background: '#F9FAFB' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-3" style={{ color: '#1E2B6F' }}>
            Personalized Learning Journey
          </h2>
          <p className="mb-14" style={{ color: '#6B7280' }}>
            A guided path from foundation to mastery, tracked with meaningful milestones
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { icon: '🎯', title: 'Short-term Goals',
                desc: 'Weekly conceptual targets and skill-building exercises to boost immediate confidence.' },
              { icon: '📅', title: 'Mid-term Goals',
                desc: 'Monthly achievement milestones and holistic development tracking for consistent progress.' },
              { icon: '🌟', title: 'Long-term Vision',
                desc: 'Career alignment and global benchmarking to ensure future-ready educational outcomes.' },
            ].map((step, i) => (
              <div key={step.title} className="relative">
                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-5
                                shadow-md border-4 border-white text-4xl">
                  {step.icon}
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: '#1E2B6F' }}>{step.title}</h3>
                <p className="text-sm" style={{ color: '#6B7280' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t" style={{ borderColor: '#E8EAF6' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={20} className="text-orange-500" />
              <span className="font-extrabold text-lg">
                <span style={{ color: '#1E2B6F' }}>Edu</span>
                <span style={{ color: '#F05A28' }}>Stack</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
              Empowering the next generation of global citizens through a blend of traditional wisdom and modern innovation.
            </p>
          </div>
          {[
            { 
              title: 'Platform', 
              links: [
                { label: 'Solutions', to: '/solutions' },
                { label: 'Pricing', to: '/pricing' },
                { label: 'Case Studies', to: '/case-studies' },
                { label: 'Security', to: '/security' }
              ] 
            },
            { 
              title: 'Resources', 
              links: [
                { label: 'Help Center', to: '/help' },
                { label: 'Blog', to: '/blog' },
                { label: 'Tutorials', to: '/tutorials' }
              ] 
            },
            { 
              title: 'Company', 
              links: [
                { label: 'Our Vision', to: '/vision' },
                { label: 'Careers', to: '/careers' },
                { label: 'Contact', to: '/contact' },
                { label: 'Privacy', to: '/privacy' }
              ] 
            },
          ].map(col => (
            <div key={col.title}>
              <p className="font-semibold text-sm mb-3" style={{ color: '#1E2B6F' }}>{col.title}</p>
              {col.links.map(l => (
                <p 
                  key={l.label} 
                  className="text-xs mb-2 cursor-pointer hover:underline" 
                  style={{ color: '#9CA3AF' }}
                  onClick={() => navigate(l.to)}
                >
                  {l.label}
                </p>
              ))}
            </div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-5 text-center text-xs border-t"
          style={{ borderColor: '#E8EAF6', color: '#9CA3AF' }}>
          ©2026 VedaYukti. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
