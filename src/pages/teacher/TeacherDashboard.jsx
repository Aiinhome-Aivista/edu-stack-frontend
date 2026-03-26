import React from 'react'
import { useQuery } from 'react-query'
import { DashboardLayout, StatCard } from '../../components/common/Layout'
import { BookOpen, FileText, TrendingUp, Users2, ChevronRight } from 'lucide-react'
import api from '../../utils/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'

const HEATMAP_DATA = [
  { chapter: 'Calculus I', scores: [92, 98, 73, 90] },
  { chapter: 'Linear Algebra', scores: [93, 61, 89, 75] },
  { chapter: 'Trigonometry', scores: [91, 72, 70, 85] }
]

function HeatCell({ v }) {
  const cls = v >= 80 ? 'heatmap-expert' : v >= 65 ? 'heatmap-average' : 'heatmap-critical'
  return <div className={`heatmap-cell ${cls}`}>{v}%</div>
}

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const { data } = useQuery('teacher-dashboard', () =>
    api.get('/teachers/dashboard').then(r => r.data))

  const perfData = [
    { w: 'W 01', v: 30 }, { w: 'W 02', v: 35 }, { w: 'W 03', v: 55 },
    { w: 'W 04', v: 67 }, { w: 'W 05', v: 82 }
  ]

  const students = [
    { name: 'Sarah Jenkins', attendance: '90%', grade: 'A+', weak: 'None', status: 'Excellent', sc: 'text-green-600' },
    { name: 'Jaya Gonjalvis', attendance: '82%', grade: 'B', weak: 'Trigonometry', status: 'Stable', sc: 'text-yellow-600' },
    { name: 'Ravi Sankar', attendance: '85%', grade: 'A', weak: 'None', status: 'Excellent', sc: 'text-green-600' },
    { name: 'Renuka Salk', attendance: '87%', grade: 'A', weak: 'None', status: 'Excellent', sc: 'text-green-600' },
  ]

  return (
    <DashboardLayout title="Teacher" subtitle="Personalized insight and routine | Mathematics">
      <div className="space-y-5">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Classes" icon={BookOpen} value={data?.total_assessments ? '452' : '452'}
            subtext="02/04" trend="+4%" color="orange" />
          <StatCard label="Assessments" icon={FileText} value={data?.total_assessments}
            subtext={`${data?.pending_drafts} Pending`} color="purple" />
          <StatCard label="Overall Performance" icon={TrendingUp} value="B+ Average"
            subtext="70/100" trend="-4%" color="yellow" />
          <StatCard label="Attendance" icon={Users2} value="85%"
            subtext="75/95" trend="+4%" color="green" />
        </div>

        {/* Heatmap + Performance Trend + Today's Routine */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Topic Mastery Heatmap */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--brand-navy)' }}>
                  Topic Mastery Heatmap
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Class-wise proficiency</p>
              </div>
              <select className="text-xs border rounded-lg px-2 py-1"
                style={{ borderColor: 'var(--brand-border)' }}>
                <option>Class-10</option>
              </select>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left py-1 pr-2" style={{ color: 'var(--text-muted)' }}>Chapter</th>
                  {['10-A', '10-B', '10-C', '10-D'].map(s => (
                    <th key={s} className="text-center py-1 px-1" style={{ color: 'var(--brand-purple)' }}>{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HEATMAP_DATA.map(row => (
                  <tr key={row.chapter}>
                    <td className="py-1.5 pr-2 font-medium" style={{ color: 'var(--brand-navy)' }}>
                      {row.chapter}
                    </td>
                    {row.scores.map((v, i) => (
                      <td key={i} className="py-1.5 px-1 text-center"><HeatCell v={v} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-3 mt-3 text-xs">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-200" /><span style={{ color: 'var(--text-muted)' }}>&gt;80% Expert</span></div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-yellow-200" /><span style={{ color: 'var(--text-muted)' }}>&gt;80% Avg</span></div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-200" /><span style={{ color: 'var(--text-muted)' }}>&lt;65% Critical</span></div>
            </div>
          </div>

          {/* Performance Trend */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm" style={{ color: 'var(--brand-navy)' }}>
                Performance Trends
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

          {/* Today's Routine */}
          <div className="card p-5" style={{ background: 'var(--brand-orange)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white">Today's Routine</h3>
              <ChevronRight size={18} color="white" />
            </div>
            <div className="space-y-3">
              {[
                { time: '08:00–09:30 AM', title: 'Grade 10-A Calculus', done: true },
                { time: '10:00–12:30 PM', title: 'Grade 11-B Algebra II', done: false },
                { time: '02:00–03:30 PM', title: 'Faculty Meeting', done: false },
              ].map((item, i) => (
                <div key={i} className={`rounded-xl p-3 flex items-start gap-3 ${item.done ? 'bg-white/20' : 'bg-white/10'}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
                    ${item.done ? 'border-white bg-white' : 'border-white/50'}`}>
                    {item.done && <span className="text-orange-500 text-xs font-bold">✓</span>}
                  </div>
                  <div>
                    <p className="text-xs text-white/70">{item.time}</p>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engagement Metrics + Student Performance Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card p-5">
            <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--brand-navy)' }}>
              Engagement Metrics
            </h3>
            {[
              { label: 'Live Participation', value: 82, color: 'green' },
              { label: 'Homework Turnaround', value: 94, color: 'orange', note: 'Submission within 24h' },
              { label: 'Doubt Resolution', value: 60, color: 'purple' }
            ].map(m => (
              <div key={m.label} className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--brand-navy)' }}>{m.label}</span>
                  <span className="font-bold" style={{ color: m.color === 'orange' ? 'var(--brand-orange)' : m.color === 'green' ? '#16A34A' : 'var(--brand-purple)' }}>
                    {m.value}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${m.color}`}
                    style={{ width: `${m.value}%`, background: m.color === 'orange' ? 'var(--brand-orange)' : m.color === 'green' ? '#22C55E' : 'var(--brand-purple)' }} />
                </div>
                {m.note && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{m.note}</p>}
              </div>
            ))}
          </div>

          <div className="card p-5 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base font-bold" style={{ color: 'var(--brand-navy)' }}>
                Student Performances
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--brand-border)' }}>
                    {['Student Name', 'Attendance', 'Mid-term Grade', 'Weak Areas', 'Status'].map(h => (
                      <th key={h} className="text-left py-2 px-2 text-xs font-semibold"
                        style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-700">
                            {s.name[0]}
                          </div>
                          <span style={{ color: 'var(--brand-navy)' }}>{s.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2" style={{ color: 'var(--text-secondary)' }}>{s.attendance}</td>
                      <td className="py-3 px-2 font-bold" style={{ color: 'var(--brand-orange)' }}>{s.grade}</td>
                      <td className="py-3 px-2">
                        {s.weak !== 'None'
                          ? <span className="badge-yellow">{s.weak}</span>
                          : <span style={{ color: 'var(--text-muted)' }}>None</span>}
                      </td>
                      <td className={`py-3 px-2 font-semibold ${s.sc}`}>{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button onClick={() => navigate('/teacher/assessment/create')}
          className="btn-primary px-8 py-3 text-base rounded-xl">
          + Create New Assessment
        </button>
      </div>
    </DashboardLayout>
  )
}
