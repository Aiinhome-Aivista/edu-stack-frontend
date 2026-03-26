import React, { useState } from 'react'
import { DashboardLayout } from '../../components/common/Layout'
import { Select } from '../../components/common/Select'
import { useQuery } from 'react-query'
import api from '../../utils/api'
import useAuthStore from '../../context/authStore'
import { Search, TrendingUp, AlertTriangle, Users, BookOpen } from 'lucide-react'

export default function TeacherStudents() {
  const { profile } = useAuthStore()
  const teacherId   = profile?.id
  const [search, setSearch]       = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [selected, setSelected]   = useState(null)

  // Fetch students under this teacher using the correct endpoint
  const { data: students=[], isLoading } = useQuery(
    ['teacher-students', teacherId],
    () => api.get(`/teachers/${teacherId}/students`).then(r => r.data),
    { enabled: !!teacherId }
  )

  // Fetch classes this teacher is assigned to
  const { data: classes=[] } = useQuery(
    ['my-classes', teacherId],
    () => api.get('/teachers/classes').then(r => r.data),
    { enabled: !!teacherId }
  )

  // Detailed performance for selected student
  const { data: perf } = useQuery(
    ['student-perf', selected],
    () => api.get(`/teachers/student/${selected}/performance`).then(r => r.data),
    { enabled: !!selected }
  )

  const normalize = str => (str || '').replace(/\s*-\s*/g, '-').trim().toLowerCase()
  const classOpts = classes.map(c => ({ value: normalize(c.class_name), label: c.class_name }))
  const filtered  = students.filter(s =>
    (!search || s.full_name.toLowerCase().includes(search.toLowerCase()) || s.roll_number?.includes(search)) &&
    (!classFilter || normalize(s.class_name) === classFilter)
  )

  const getGrade = pct => pct>=90?'A+':pct>=80?'A':pct>=70?'B+':pct>=60?'B':pct>=50?'C':'F'
  const getStatusLabel = pct => pct>=75?'Excellent':pct>=50?'Stable':'Needs Help'
  const getStatusColor = pct => pct>=75?'text-green-600':pct>=50?'text-yellow-600':'text-red-500'

  return (
    <DashboardLayout title="Teacher" subtitle="Your assigned students">
      <div className="flex gap-5">

        {/* ── Student list ─────────────────────────────── */}
        <div className="flex-1 space-y-4 min-w-0">

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label:'Total Students',  value: students.length,                                                  color:'orange', icon:Users },
              { label:'Above 75%',       value: students.filter(s=>s.last_score>=75).length,                     color:'green',  icon:TrendingUp },
              { label:'Needs Attention', value: students.filter(s=>s.last_score!=null&&s.last_score<50).length,  color:'yellow', icon:AlertTriangle },
            ].map(s=>(
              <div key={s.label} className="card p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{background:s.color==='orange'?'#FFF0EB':s.color==='green'?'#F0FDF4':'#FEF9C3'}}>
                  <s.icon size={18} style={{color:s.color==='orange'?'var(--brand-orange)':s.color==='green'?'#16A34A':'#D97706'}}/>
                </div>
                <div>
                  <p className="text-2xl font-extrabold" style={{color:'var(--brand-navy)'}}>{s.value}</p>
                  <p className="text-xs" style={{color:'var(--text-muted)'}}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="card p-4 flex gap-3 flex-wrap">
            <div className="flex-1 min-w-40 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search by name or roll no…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                style={{borderColor:'var(--brand-border)',background:'var(--brand-bg)'}}/>
            </div>
            {classOpts.length>0&&(
              <div className="w-48">
                <Select placeholder="All classes" options={classOpts}
                  value={classFilter} onChange={v=>setClassFilter(v===classFilter?'':v)}/>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b flex items-center justify-between"
              style={{borderColor:'var(--brand-border)'}}>
              <h2 className="font-bold text-sm" style={{color:'var(--brand-navy)'}}>
                Students ({filtered.length})
              </h2>
              {filtered.length>0&&<span className="text-xs" style={{color:'var(--text-muted)'}}>
                Click a row for details
              </span>}
            </div>

            {isLoading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"/>
              </div>
            ) : filtered.length===0 ? (
              <div className="py-16 text-center">
                <p className="text-4xl mb-3">👥</p>
                <p className="font-semibold" style={{color:'var(--brand-navy)'}}>
                  {students.length===0 ? 'No students assigned to your classes yet' : 'No results match your search'}
                </p>
                {students.length===0&&(
                  <p className="text-sm mt-2" style={{color:'var(--text-muted)'}}>
                    Ask your principal to assign you to a class in Teacher Assignments.
                  </p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{background:'var(--brand-bg)'}}>
                    <tr>
                      {['Student','Roll No','Class','Attendance','Last Score','Grade','Status'].map(h=>(
                        <th key={h} className="text-left py-3 px-4 text-xs font-semibold"
                          style={{color:'var(--text-muted)'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(s=>(
                      <tr key={s.id}
                        onClick={()=>setSelected(s.id===selected?null:s.id)}
                        className="cursor-pointer hover:bg-orange-50 transition border-b"
                        style={{
                          borderColor:'var(--brand-border)',
                          background:s.id===selected?'#FFF5F0':''
                        }}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                              style={{background:'var(--brand-orange-pale)',color:'var(--brand-orange)'}}>
                              {s.full_name[0]}
                            </div>
                            <span className="font-medium" style={{color:'var(--brand-navy)'}}>{s.full_name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4" style={{color:'var(--text-secondary)'}}>{s.roll_number||'—'}</td>
                        <td className="py-3 px-4 text-xs" style={{color:'var(--text-secondary)'}}>{s.class_name||'—'}</td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${(s.attendance_pct||0)>=75?'text-green-600':(s.attendance_pct||0)>=60?'text-yellow-600':'text-red-500'}`}>
                            {s.attendance_pct||0}%
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold" style={{color:'var(--brand-orange)'}}>
                          {s.last_score!=null?`${s.last_score}%`:'—'}
                        </td>
                        <td className="py-3 px-4 font-bold" style={{color:'var(--brand-navy)'}}>
                          {s.last_score!=null?getGrade(s.last_score):'—'}
                        </td>
                        <td className="py-3 px-4">
                          {s.last_score!=null
                            ?<span className={`font-semibold text-xs ${getStatusColor(s.last_score)}`}>
                              {getStatusLabel(s.last_score)}
                            </span>
                            :<span className="text-xs" style={{color:'var(--text-muted)'}}>No data</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── Detail panel ─────────────────────────────── */}
        {selected && (
          <div className="w-72 flex-shrink-0 space-y-4">
            <div className="card p-5">
              {!perf ? (
                <div className="py-8 flex justify-center">
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"/>
                </div>
              ) : (
                <>
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{background:'var(--brand-orange-pale)',color:'var(--brand-orange)'}}>
                      {perf.student?.full_name?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{color:'var(--brand-navy)'}}>{perf.student?.full_name}</p>
                      <p className="text-xs" style={{color:'var(--text-muted)'}}>
                        Roll: {perf.student?.roll_number||'—'} · {perf.total_attempts||0} attempts
                      </p>
                    </div>
                  </div>

                  {/* Score card */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="rounded-xl p-3 text-center" style={{background:'var(--brand-orange-pale)'}}>
                      <p className="text-2xl font-extrabold" style={{color:'var(--brand-orange)'}}>
                        {perf.avg_score||0}%
                      </p>
                      <p className="text-xs" style={{color:'var(--text-muted)'}}>Avg Score</p>
                    </div>
                    <div className="rounded-xl p-3 text-center" style={{background:'#EEF0FF'}}>
                      <p className="text-2xl font-extrabold" style={{color:'var(--brand-purple)'}}>
                        {perf.total_attempts||0}
                      </p>
                      <p className="text-xs" style={{color:'var(--text-muted)'}}>Tests Done</p>
                    </div>
                  </div>

                  {/* Recent attempts */}
                  <h4 className="text-xs font-semibold mb-2" style={{color:'var(--text-muted)'}}>RECENT TESTS</h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {(perf.attempts||[]).slice(0,6).map((a,i)=>(
                      <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b"
                        style={{borderColor:'var(--brand-border)'}}>
                        <span style={{color:'var(--text-secondary)'}}>
                          {a.submitted_at?new Date(a.submitted_at).toLocaleDateString('en-IN'):a.is_practice?'Practice':'—'}
                        </span>
                        <span className={`font-bold ${(a.percentage||0)>=60?'text-green-600':'text-red-500'}`}>
                          {a.percentage!=null?`${a.percentage}%`:'—'}
                        </span>
                      </div>
                    ))}
                    {(perf.attempts||[]).length===0&&(
                      <p className="text-xs text-center py-2" style={{color:'var(--text-muted)'}}>No attempts yet</p>
                    )}
                  </div>

                  {/* Weak topics */}
                  {(perf.topic_masteries||[]).some(t=>t.mastery_level<50)&&(
                    <div className="mt-4">
                      <h4 className="text-xs font-semibold mb-2 flex items-center gap-1" style={{color:'var(--text-muted)'}}>
                        <AlertTriangle size={11} className="text-yellow-500"/> WEAK AREAS
                      </h4>
                      {perf.topic_masteries.filter(t=>t.mastery_level<50).slice(0,4).map((t,i)=>(
                        <div key={i} className="mb-2">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span style={{color:'var(--brand-navy)'}}>Topic {t.topic_id}</span>
                            <span className="text-red-500 font-semibold">{Math.round(t.mastery_level)}%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{width:`${t.mastery_level}%`,background:'#EF4444'}}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button onClick={()=>setSelected(null)}
                    className="w-full mt-4 py-2 rounded-xl border text-xs font-medium hover:bg-gray-50 transition"
                    style={{borderColor:'var(--brand-border)',color:'var(--text-secondary)'}}>
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
