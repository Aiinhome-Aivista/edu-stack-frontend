import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout, StatCard } from '../../components/common/Layout'
import { Users2, AlertTriangle, CheckCircle, Award, BookOpen } from 'lucide-react'
import api from '../../utils/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const subjectData = {
  math: { name: 'Mathematics', topic: 'Advance Algebra', score: 88, bars: [40, 55, 45, 60, 70, 65, 75, 80, 72, 82] },
  sci: { name: 'Science', topic: 'Quantum Physics', score: 92, bars: [50, 60, 58, 72, 68, 80, 85, 78, 90, 88] }
}

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { data } = useQuery('student-dashboard', () =>
    api.get('/students/dashboard').then(r => r.data))

  const { data: assessments = [] } = useQuery('student-assessments',
    () => api.get('/students/assessments').then(r => r.data))

  const [activeTab, setActiveTab] = useState('schedule')

  const pendingAssessments = assessments.filter(a => a.status === 'published' && !a.attempt_status)

  const perfData = data?.weekly_performance?.map(p => ({
    w: p.week,
    v: p.avg
  })) || [
    { w: 'W 01', v: 0 }, { w: 'W 02', v: 0 }, { w: 'W 03', v: 0 },
    { w: 'W 04', v: 0 }, { w: 'W 05', v: 0 }
  ]

  const schedule = [
    { type: 'assessment', title: 'Vedic Maths Quiz', sub: 'Assessment Schedule | 10:00 AM' },
    { type: 'session', title: 'Doubt Clearance: Physi…', sub: 'Live Session | 02:00 PM' },
    { type: 'achievement', title: 'Geography…', sub: 'Achievement' },
  ]

  const attendance = data?.attendance_percentage ?? 0
  const weakTopics = data?.weak_topics ?? 0
  const strongTopics = data?.strong_topics ?? 0
  const rank = data?.class_rank ?? 0
  const avgScore = data?.avg_score ?? 0

  return (
    <DashboardLayout title="Student" subtitle="Track your school journey and academic excellence">
      <div className="space-y-5">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Attendance" icon={Users2} value={`${attendance}%`}
            trend="-2%" color="orange" />
          <StatCard label="Weak Areas" icon={AlertTriangle} value={`${weakTopics} Topics`}
            trend="+2" color="yellow" />
          <StatCard label="Strong Areas" icon={CheckCircle} value={`${strongTopics} Topics`}
            trend="+3" color="green" />
          <StatCard label="Assessment Rank" icon={Award} value={`#${rank}`}
            trend="-2" color="purple" />
        </div>

        {/* Overall Performance + Rank Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card p-5 lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm" style={{ color: 'var(--brand-navy)' }}>
                Overall Performance
              </h3>
              <select className="text-xs border rounded-lg px-2 py-1"
                style={{ borderColor: 'var(--brand-border)' }}>
                <option>This Month</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={perfData}>
                <XAxis dataKey="w" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke="#1E2B6F" strokeWidth={2.5}
                  dot={{ fill: '#6B5ECD', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Rank Analysis */}
          <div className="card p-5">
            <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--brand-navy)' }}>
              Rank Analysis
            </h3>
            <div className="flex items-center gap-6 mb-4">
              {/* Circular rank */}
              <div className="relative flex items-center justify-center">
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="38" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                  <circle cx="45" cy="45" r="38" fill="none" stroke="var(--brand-orange)"
                    strokeWidth="8" strokeDasharray={`${(8 / 18) * 238.8} 238.8`}
                    strokeLinecap="round" transform="rotate(-90 45 45)" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-extrabold" style={{ color: 'var(--brand-navy)' }}>
                    {rank}<sup className="text-sm">th</sup>
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Yearly Best</p>
                  <p className="text-lg font-extrabold" style={{ color: 'var(--brand-navy)' }}>
                    8<sup className="text-sm">th</sup>
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Previous Year</p>
                  <p className="text-lg font-extrabold" style={{ color: 'var(--brand-navy)' }}>
                    18<sup className="text-sm">th</sup>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              {[{ label: 'My', color: 'var(--brand-orange)' }, { label: 'Class', color: '#E5E7EB' }].map(l => (
                <div key={l.label} className="flex items-center gap-1 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{l.label}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-3 text-sm font-medium"
              style={{ background: 'var(--brand-bg)', color: 'var(--brand-navy)' }}>
              🏆 You are in the top <strong style={{ color: 'var(--brand-orange)' }}>5%</strong> of your batch! →
            </div>
          </div>

          {/* Overview Calendar + Schedule */}
          <div className="card p-5" style={{ background: 'var(--brand-navy)', minHeight: 280 }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-white">Overview</h3>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-white/70 font-semibold">Learning Activity</p>
                <select className="text-xs bg-white/10 text-white border-0 rounded px-2 py-1">
                  <option>This Month</option>
                </select>
              </div>
              {/* Mini calendar */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-white/50 mb-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                  const isActive = [5, 10, 11, 12, 13, 14, 19, 25, 26].includes(d)
                  const isToday = d === 19
                  return (
                    <div key={d} className={`rounded-md py-0.5 text-xs font-medium
                      ${isToday ? 'bg-orange-500 text-white' :
                        isActive ? 'bg-white/20 text-white' : 'text-white/40'}`}>
                      {d}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`text-xs font-semibold transition-colors ${activeTab === 'schedule' ? 'text-white' : 'text-white/50'}`}
              >
                Schedule
              </button>
              <button
                onClick={() => setActiveTab('assessments')}
                className={`text-xs font-semibold transition-colors ${activeTab === 'assessments' ? 'text-white' : 'text-white/50'}`}
              >
                Pending Assessments
              </button>
            </div>
            <div className="space-y-2">
              {activeTab === 'schedule' ? (
                schedule.map((s, i) => (
                  <div key={i} className="bg-white/10 rounded-xl px-3 py-2">
                    <p className="text-xs font-semibold text-white">{s.title}</p>
                    <p className="text-xs text-white/60">{s.sub}</p>
                  </div>
                ))
              ) : (
                pendingAssessments.length === 0 ? (
                  <p className="text-xs text-white/50 py-4 text-center">No pending assessments</p>
                ) : (
                  pendingAssessments.map((a, i) => (
                    <div
                      key={i}
                      className="bg-white/10 rounded-xl px-3 py-2 cursor-pointer hover:bg-white/20 transition-colors"
                      onClick={() => navigate(`/student/assessment/${a.id}`)}
                    >
                      <p className="text-xs font-semibold text-white">{a.title}</p>
                      <p className="text-xs text-white/60">{a.total_marks} Marks | {a.duration_minutes} Min</p>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>

        {/* Subject Insight + Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Subject Insight */}
          <div className="card p-5 lg:col-span-2">
            <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--brand-navy)' }}>
              Subject Insight
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.values(subjectData).map(subj => (
                <div key={subj.name} className="rounded-xl p-4"
                  style={{ background: 'var(--brand-bg)' }}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="font-extrabold text-sm" style={{ color: 'var(--brand-navy)' }}>
                        {subj.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subj.topic}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-lg" style={{ color: 'var(--brand-orange)' }}>
                        {subj.score}%
                      </span>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Overall Score</p>
                    </div>
                  </div>
                  <p className="text-xs mt-3 mb-2" style={{ color: 'var(--text-muted)' }}>Last 10 Practice</p>
                  <ResponsiveContainer width="100%" height={60}>
                    <BarChart data={subj.bars.map((v, i) => ({ i: `T${String(i + 1).padStart(2, '0')}`, v }))}>
                      <Bar dataKey="v" fill="var(--brand-orange)" radius={[3, 3, 0, 0]} opacity={0.7} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    <span>T 01</span><span>T 05</span><span>T 10</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1 font-semibold">
                    <div><span style={{ color: 'var(--text-muted)' }}>Last Term</span><br />
                      <span style={{ color: 'var(--brand-navy)' }}>{subj.bars[0]}%</span></div>
                    <div className="text-center"><span style={{ color: 'var(--text-muted)' }}>Best Score</span><br />
                      <span style={{ color: 'var(--brand-navy)' }}>{Math.max(...subj.bars)}%</span></div>
                    <div className="text-right"><span style={{ color: 'var(--text-muted)' }}>Practice</span><br />
                      <span style={{ color: 'var(--brand-navy)' }}>{subj.bars[subj.bars.length - 1]}%</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="card p-5">
            <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--brand-navy)' }}>
              Status
            </h3>
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Accuracy rate
                </p>
                <p className="text-2xl font-extrabold" style={{ color: 'var(--brand-navy)' }}>
                  88% <span className="text-sm text-green-600 font-semibold">↑ 4.5%</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Time/Questions
                </p>
                <p className="text-2xl font-extrabold" style={{ color: 'var(--brand-navy)' }}>
                  42<span className="text-base font-medium">sc</span>
                  <span className="text-sm text-red-500 font-semibold ml-2">↓ 5.5sc</span>
                </p>
              </div>
              <button className="w-full btn-primary py-3 rounded-xl mt-4 flex items-center justify-center gap-2">
                <BookOpen size={16} /> Start Practice Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
