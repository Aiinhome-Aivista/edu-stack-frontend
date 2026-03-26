// PrincipalDashboard.jsx
import React from 'react'
import { useQuery } from 'react-query'
import { DashboardLayout, StatCard } from '../../components/common/Layout'
import { TrendingUp, Users2, BookOpen, AlertTriangle } from 'lucide-react'
import api from '../../utils/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function PrincipalDashboard() {
  const { data } = useQuery('principal-kpi', () =>
    api.get('/principal/kpi').then(r => r.data))

  const classPerf = data?.class_performance || [
    { section: '10-A', avg_score: 88 }, { section: '10-B', avg_score: 74 },
    { section: '10-C', avg_score: 82 }, { section: '11-A', avg_score: 91 },
    { section: '11-B', avg_score: 68 }, { section: '12-A', avg_score: 85 }
  ]

  const teacherPerf = data?.teacher_performance || [
    { name: 'Dr. Murthi', avg_class_score: 88.4, assessments_created: 12 },
    { name: 'Mrs. Priya', avg_class_score: 82.1, assessments_created: 9 },
    { name: 'Mr. Suresh', avg_class_score: 75.3, assessments_created: 7 },
    { name: 'Ms. Divya', avg_class_score: 91.2, assessments_created: 14 },
  ]

  return (
    <DashboardLayout title="Principal" subtitle="Academic KPIs and institutional performance">
      <div className="space-y-5">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Overall Performance" icon={TrendingUp} value="88.4%" trend="+4.2%" color="orange" />
          <StatCard label="Active Teachers" icon={Users2} value="120" subtext="12 subjects" color="purple" />
          <StatCard label="Total Students" icon={BookOpen} value="1,850" trend="+5%" color="green" />
          <StatCard label="At-Risk Students" icon={AlertTriangle} value="24" trend="+3" color="yellow" />
        </div>

        {/* Class Performance Bar Chart */}
        <div className="card p-6">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--brand-navy)' }}>
            Class-wise Performance Overview
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={classPerf} barCategoryGap="35%">
              <XAxis dataKey="section" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip formatter={v => `${v}%`} />
              <Bar dataKey="avg_score" radius={[8, 8, 0, 0]}>
                {classPerf.map((c, i) => (
                  <Cell key={i} fill={c.avg_score >= 85 ? '#22C55E' : c.avg_score >= 75 ? '#F05A28' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-5 mt-3 text-xs justify-center">
            {[['≥85% Excellent', '#22C55E'], ['75–84% Good', '#F05A28'], ['<75% Needs Attention', '#EF4444']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ background: c }} />
                <span style={{ color: 'var(--text-secondary)' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Performance Table */}
        <div className="card p-6">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--brand-navy)' }}>
            Teacher Performance
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid var(--brand-border)' }}>
                {['Teacher', 'Avg Class Score', 'Assessments Created', 'Status'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teacherPerf.map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                  <td className="py-3 px-3 font-medium" style={{ color: 'var(--brand-navy)' }}>
                    {t.name}
                  </td>
                  <td className="py-3 px-3 font-bold" style={{ color: 'var(--brand-orange)' }}>
                    {t.avg_class_score}%
                  </td>
                  <td className="py-3 px-3" style={{ color: 'var(--text-secondary)' }}>
                    {t.assessments_created}
                  </td>
                  <td className="py-3 px-3">
                    <span className={t.avg_class_score >= 85 ? 'badge-green' : t.avg_class_score >= 75 ? 'badge-orange' : 'badge-red'}>
                      {t.avg_class_score >= 85 ? 'Excellent' : t.avg_class_score >= 75 ? 'Good' : 'Review'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
