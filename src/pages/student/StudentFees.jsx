// StudentFees.jsx
import React from 'react'
import { useQuery, useMutation } from 'react-query'
import { DashboardLayout } from '../../components/common/Layout'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { Download, CreditCard } from 'lucide-react'
import useAuthStore from '../../context/authStore'

export default function StudentFees() {
  const { profile } = useAuthStore()
  const studentId = profile?.id

  const { data } = useQuery(['student-fees', studentId],
    () => api.get(`/fees/student/${studentId}`).then(r => r.data),
    { enabled: !!studentId })

  const { data: txns } = useQuery(['fee-txns', studentId],
    () => api.get(`/fees/transactions/${studentId}`).then(r => r.data),
    { enabled: !!studentId })

  const payMutation = useMutation((payload) => api.post('/fees/pay', payload), {
    onSuccess: (res) => toast.success(`Payment successful! Ref: ${res.data.transaction_id}`)
  })

  const fees = data?.fees || []
  const totalPending = data?.total_pending || 2485

  // Current semester breakdown (from first unpaid fee + mock)
  const breakdown = [
    { desc: 'Tuition Fees - Computer Science', amount: 3500 },
    { desc: 'Library & Resource Access', amount: 200 },
    { desc: 'Laboratory Materials (Physics/CS)', amount: 150 },
    { desc: 'Sports & Recreational Fees', amount: 100 },
    { desc: 'Merit Scholarship (15% Waiver)', amount: -1500, discount: true },
  ]
  const netPayable = breakdown.reduce((s, r) => s + r.amount, 0)

  const transactions = txns || [
    { transaction_id: 'TXN-8823102', paid_at: 'Sept 12, 2024', payment_method: 'Credit Card (•••• 4242)', amount: '1,200.00', status: 'success' },
    { transaction_id: 'TXN-8711094', paid_at: 'Aug 05, 2024', payment_method: 'Net Banking', amount: '1,200.00', status: 'success' },
    { transaction_id: 'TXN-8692201', paid_at: 'July 28, 2024', payment_method: 'UPI (rajesh@hdfc)', amount: '500.00', status: 'pending' },
  ]

  return (
    <DashboardLayout>
      <div className="mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <button className="w-8 h-8 rounded-xl border flex items-center justify-center"
            style={{ borderColor: 'var(--brand-border)' }} onClick={() => window.history.back()}>←</button>
          <div>
            <h1 className="text-xl font-extrabold" style={{ color: 'var(--brand-navy)' }}>
              Student Fees Portal
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Manage your academic finances and scholarships.
            </p>
          </div>
        </div>

        {/* Top: Pending Card + Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Pending */}
          <div className="rounded-2xl p-6 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #2E3EBF 0%, #6B5ECD 100%)' }}>
            <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              Due data in 12 days
            </div>
            <p className="text-sm text-white/80 mb-2">Total pending fees</p>
            <p className="text-4xl font-extrabold mb-6">₹{totalPending.toLocaleString()}.00</p>
            <div className="flex gap-3">
              <button onClick={() => payMutation.mutate({ student_fee_id: fees[0]?.id, amount: netPayable, payment_method: 'upi' })}
                className="flex items-center gap-2 bg-yellow-400 text-yellow-900 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-yellow-300 transition">
                <CreditCard size={16} /> Pay Now
              </button>
              <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition">
                <Download size={16} /> Download Statement
              </button>
            </div>
          </div>

          {/* Breakdown */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm" style={{ color: 'var(--brand-navy)' }}>
                Current Semester Breakdown
              </h3>
              <span className="badge-orange">TERM: FALL 2024</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="rounded-xl overflow-hidden">
                  <th className="text-left py-2 px-3 bg-purple-900 text-white rounded-l-lg text-xs">Description</th>
                  <th className="text-right py-2 px-3 bg-purple-900 text-white rounded-r-lg text-xs">Amount</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((b, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                    <td className={`py-2.5 px-3 text-xs font-medium ${b.discount ? 'text-green-600' : ''}`}
                      style={{ color: b.discount ? '#16A34A' : 'var(--brand-navy)' }}>
                      {b.desc} {b.discount && 'ⓘ'}
                    </td>
                    <td className={`py-2.5 px-3 text-xs text-right font-semibold ${b.discount ? 'text-green-600' : ''}`}
                      style={{ color: b.discount ? '#16A34A' : 'var(--brand-navy)' }}>
                      {b.discount ? `-₹${Math.abs(b.amount).toFixed(2)}` : `₹${b.amount.toFixed(2)}`}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-3 px-3 font-bold text-sm" style={{ color: 'var(--brand-navy)' }}>
                    Net Payable Amount
                  </td>
                  <td className="py-3 px-3 font-extrabold text-sm text-right" style={{ color: 'var(--brand-navy)' }}>
                    ₹{netPayable.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Transactions */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base" style={{ color: 'var(--brand-navy)' }}>
                Recent Transactions
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>History of your last 12 months</p>
            </div>
            <button className="btn-secondary text-sm px-4 py-2 rounded-xl flex items-center gap-1.5">
              ⚙ Filter
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '2px solid var(--brand-border)' }}>
                  {['TRANSACTION DATE', 'TRANSACTION ID', 'PAYMENT METHOD', 'AMOUNT', 'STATUS', 'RECEIPT'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                    <td className="py-3 px-3" style={{ color: 'var(--text-secondary)' }}>
                      {t.paid_at ? new Date(t.paid_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : t.paid_at}
                    </td>
                    <td className="py-3 px-3 font-medium" style={{ color: 'var(--brand-orange)' }}>
                      {t.transaction_id}
                    </td>
                    <td className="py-3 px-3" style={{ color: 'var(--text-secondary)' }}>
                      {t.payment_method}
                    </td>
                    <td className="py-3 px-3 font-bold" style={{ color: 'var(--brand-navy)' }}>
                      ${typeof t.amount === 'string' ? t.amount : parseFloat(t.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={t.status === 'success' ? 'badge-green' : 'badge-yellow'}>
                        {t.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button className="text-gray-400 hover:text-gray-600">🧾</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
