import React from 'react'
import { useQuery } from 'react-query'
import { DashboardLayout, StatCard } from '../../components/common/Layout'
import { IndianRupee, Users, TrendingUp, AlertCircle, Clock } from 'lucide-react'
import api from '../../utils/api'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts'

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const PIE_COLORS = ['#F05A28', '#F59E0B', '#E5E7EB']
const EXPENSE_COLORS = { salary: '#6B5ECD', infrastructure: '#F05A28', operations: '#22C55E', maintenance: '#F59E0B', others: '#9CA3AF' }

export default function DirectorDashboard() {
  const { data, isLoading } = useQuery('director-overview', () =>
    api.get('/director/overview').then(r => r.data))

  const monthlyData = (data?.monthly_collections || []).map(r => ({
    name: MONTH_NAMES[r.month - 1],
    collected: r.total
  }))

  const expenseData = (data?.expenses_by_category || []).map(e => ({
    name: e.category.charAt(0).toUpperCase() + e.category.slice(1),
    value: e.total,
    fill: EXPENSE_COLORS[e.category] || '#9CA3AF'
  }))

  const feeStatus = [
    { name: 'Fully Paid', value: 1529, color: '#F05A28' },
    { name: 'Partial', value: 450, color: '#F59E0B' },
    { name: 'Unpaid', value: 124, color: '#E5E7EB' }
  ]

  const recentTxns = [
    { name: 'Sarah Jerkins', desc: 'Term 2 Tuition Fee', amount: '+₹25K', time: 'Today, 10:45 AM' },
    { name: 'Ravi Sankar', desc: 'Library Annual Fee', amount: '+₹2K', time: 'Today, 10:55 AM' },
    { name: 'Jaya Gonjalvis', desc: 'Scholarship Disbursement', amount: '-₹5K', time: 'Today, 11:45 AM', negative: true },
    { name: 'Ranuka Salki', desc: 'Sports Fee', amount: '+₹7K', time: 'Today, 12:10 PM' },
  ]

  const totalRevenue = data?.total_revenue || 45200000
  const enrollment = data?.enrollment || { students: 1850, teachers: 120 }

  return (
    <DashboardLayout title="Admin" subtitle="Personalized insight and routine | Admin">
      <div className="space-y-6">

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Revenue" icon={IndianRupee}
            value={`₹${(totalRevenue / 100000).toFixed(0)}L`}
            trend="+12% vs last term" color="purple" />
          <StatCard label="Fees Collected" icon={IndianRupee}
            value="₹38,00,000" subtext="86% collection rate" color="orange" />
          <StatCard label="Outstanding" icon={AlertCircle}
            value="₹63,00,000" subtext="124 pending payments" color="yellow" />
          <div className="card p-5 bg-gradient-to-br"
               style={{ background: 'linear-gradient(135deg, #F05A28 0%, #FF8C5A 100%)' }}>
            <div className="flex items-start justify-between mb-2">
              <p className="stat-label text-white/80">Late Fee Alerts</p>
              <Clock size={18} color="white" />
            </div>
            <p className="text-4xl font-extrabold text-white">18</p>
            <p className="text-sm text-white/80 mt-1">Due for over 30 days →</p>
          </div>
        </div>

        {/* Revenue Chart + Fee Collection Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base" style={{ color: 'var(--brand-navy)' }}>
                  Revenue & Performance Trends
                </h3>
              </div>
              <select className="text-xs border rounded-lg px-3 py-1.5"
                style={{ borderColor: 'var(--brand-border)', color: 'var(--text-secondary)' }}>
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData.length ? monthlyData : MONTH_NAMES.map((m, i) => ({
                name: m,
                collected: [30,28,45,42,55,66,72,68,78,85,90,95][i] * 10000
              }))}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
                <Tooltip formatter={v => `₹${(v/100000).toFixed(2)}L`} />
                <Line type="monotone" dataKey="collected" stroke="#6B5ECD" strokeWidth={2.5}
                  dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-base mb-4" style={{ color: 'var(--brand-navy)' }}>
              Fee Collection Status
            </h3>
            <div className="flex flex-col items-center">
              <PieChart width={160} height={160}>
                <Pie data={feeStatus} cx={80} cy={80} innerRadius={50} outerRadius={75}
                  dataKey="value" startAngle={90} endAngle={-270}>
                  {feeStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <p className="font-extrabold text-2xl -mt-20 mb-16"
                style={{ color: 'var(--brand-navy)' }}>86%</p>
              <div className="space-y-1.5 w-full mt-2">
                {feeStatus.map(s => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{s.name}</span>
                    </div>
                    <span className="font-semibold" style={{ color: 'var(--brand-navy)' }}>
                      {s.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row: Recent Transactions + Enrollment + Academic Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Transactions */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base" style={{ color: 'var(--brand-navy)' }}>
                Recent Transactions
              </h3>
              <button className="text-xs font-semibold" style={{ color: 'var(--brand-orange)' }}>
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentTxns.map((t, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--brand-bg)' }}>
                      <IndianRupee size={14} style={{ color: 'var(--brand-orange)' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--brand-navy)' }}>
                        {t.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${t.negative ? 'text-red-500' : 'text-green-600'}`}>
                      {t.amount}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enrollment */}
          <div className="card p-5"
            style={{ background: 'linear-gradient(145deg, #1E2B6F 0%, #2E3E8F 100%)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Users size={18} color="white" />
              <span className="text-sm font-semibold text-white/80">Total Enrollment</span>
            </div>
            <p className="text-3xl font-extrabold text-white mb-4">
              {(enrollment.students + enrollment.teachers + 10).toLocaleString()}
            </p>
            {[
              { label: 'Students', value: enrollment.students, max: 2000 },
              { label: 'Teachers', value: enrollment.teachers, max: 150 },
              { label: 'Staff', value: 10, max: 20 }
            ].map(item => (
              <div key={item.label} className="mb-3">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="progress-bar" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <div className="progress-fill"
                    style={{ width: `${item.value / item.max * 100}%`, background: '#F05A28' }} />
                </div>
              </div>
            ))}
            <button className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold text-white border border-white/20
                               hover:bg-white/10 transition flex items-center justify-center gap-2">
              Download Enrollment →
            </button>
          </div>

          {/* Academic Performance Bar */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-base" style={{ color: 'var(--brand-navy)' }}>
                Academic Performance
              </h3>
              <select className="text-xs border rounded-lg px-2 py-1"
                style={{ borderColor: 'var(--brand-border)' }}>
                <option>Annual 2023-24</option>
              </select>
            </div>
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              Overall student status for the academic year
            </p>
            <p className="text-2xl font-extrabold mb-0.5" style={{ color: 'var(--brand-orange)' }}>
              {data?.avg_academic_performance ? `${data.avg_academic_performance}%` : '88.4%'}
            </p>
            <p className="text-xs text-green-600 font-semibold mb-4">↑ +4.2% from last year</p>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={[
                { s: 'MATH', v: 88 }, { s: 'SCI', v: 82 }, { s: 'HIST', v: 75 },
                { s: 'GEO', v: 79 }, { s: 'CIVIC', v: 92 }, { s: 'LANG', v: 85 }, { s: 'OTH', v: 77 }
              ]} barCategoryGap="30%">
                <XAxis dataKey="s" tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="v" fill="var(--brand-orange)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
