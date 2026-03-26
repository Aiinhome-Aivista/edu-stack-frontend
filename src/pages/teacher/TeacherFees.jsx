import React from 'react'
import { DashboardLayout } from '../../components/common/Layout'
import { IndianRupee, AlertCircle, CheckCircle, Clock } from 'lucide-react'

const FEE_RECORDS = [
  {name:'Ravi Sankar',  adm:'ADM-001', amount:35000, paid:12000, due:'2024-07-01', status:'partial'},
  {name:'Sarah Jenkins',adm:'ADM-002', amount:35000, paid:35000, due:'2024-07-01', status:'paid'},
  {name:'Ananya Rao',   adm:'ADM-003', amount:35000, paid:0,     due:'2024-07-01', status:'unpaid'},
  {name:'Dev Kumar',    adm:'ADM-004', amount:35000, paid:35000, due:'2024-07-01', status:'paid'},
  {name:'Priya Singh',  adm:'ADM-005', amount:35000, paid:20000, due:'2024-07-01', status:'partial'},
]

export default function TeacherFees() {
  const paid    = FEE_RECORDS.filter(f=>f.status==='paid').length
  const partial = FEE_RECORDS.filter(f=>f.status==='partial').length
  const unpaid  = FEE_RECORDS.filter(f=>f.status==='unpaid').length

  return (
    <DashboardLayout title="Teacher" subtitle="Student fee status overview">
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {[
            {label:'Fully Paid',    value:paid,    icon:CheckCircle, color:'green'},
            {label:'Partial',       value:partial,  icon:Clock,       color:'yellow'},
            {label:'Unpaid / Due',  value:unpaid,   icon:AlertCircle, color:'orange'},
          ].map(s=>(
            <div key={s.label} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{background:s.color==='green'?'#F0FDF4':s.color==='yellow'?'#FEF9C3':'#FFF0EB'}}>
                <s.icon size={20} style={{color:s.color==='green'?'#16A34A':s.color==='yellow'?'#D97706':'var(--brand-orange)'}}/>
              </div>
              <div>
                <p className="text-3xl font-extrabold" style={{color:'var(--brand-navy)'}}>{s.value}</p>
                <p className="text-xs" style={{color:'var(--text-muted)'}}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b" style={{borderColor:'var(--brand-border)'}}>
            <h2 className="font-bold text-sm" style={{color:'var(--brand-navy)'}}>Class Fee Status — Grade 10-A</h2>
          </div>
          <table className="w-full text-sm">
            <thead style={{background:'var(--brand-bg)'}}>
              <tr>
                {['Student','Admission No','Fee Due','Paid','Balance','Status'].map(h=>(
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold" style={{color:'var(--text-muted)'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEE_RECORDS.map((f,i)=>(
                <tr key={i} className="border-b" style={{borderColor:'var(--brand-border)'}}>
                  <td className="py-3 px-4 font-medium" style={{color:'var(--brand-navy)'}}>{f.name}</td>
                  <td className="py-3 px-4" style={{color:'var(--text-secondary)'}}>{f.adm}</td>
                  <td className="py-3 px-4 font-semibold" style={{color:'var(--brand-navy)'}}>₹{f.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">₹{f.paid.toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold" style={{color:f.amount-f.paid>0?'var(--brand-orange)':'#16A34A'}}>
                    ₹{(f.amount-f.paid).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={f.status==='paid'?'badge-green':f.status==='partial'?'badge-yellow':'badge-red'}>
                      {f.status.charAt(0).toUpperCase()+f.status.slice(1)}
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
