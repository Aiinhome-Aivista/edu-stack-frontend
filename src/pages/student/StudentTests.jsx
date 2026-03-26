import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/common/Layout'
import { useQuery } from 'react-query'
import api from '../../utils/api'
import { BookOpen, Clock, CheckCircle, XCircle, PlayCircle, Filter } from 'lucide-react'

const STATUS_CONFIG = {
  published: { label:'Available',   color:'badge-green',  canStart:true  },
  active:    { label:'Active',      color:'badge-orange', canStart:true  },
  closed:    { label:'Closed',      color:'badge-red',    canStart:false },
}
const ATTEMPT_CONFIG = {
  graded:      { label:'Completed', icon:CheckCircle, color:'text-green-600' },
  in_progress: { label:'In Progress',icon:PlayCircle, color:'text-orange-500' },
  abandoned:   { label:'Missed',    icon:XCircle,     color:'text-red-500'   },
}

export default function StudentTests() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')

  const { data: raw=[], isLoading } = useQuery('student-assessments',
    () => api.get('/students/assessments').then(r=>r.data),
    { staleTime: 0, cacheTime: 0 })

  // Sort by scheduled_at ascending (earliest first)
  const assessments = [...raw].sort((a, b) =>
    new Date(a.scheduled_at || 0) - new Date(b.scheduled_at || 0)
  )

  const filtered = assessments.filter(a => {
    if (filter==='available') return a.status==='published'&&!a.attempt_status
    if (filter==='completed') return a.attempt_status==='graded'
    if (filter==='practice')  return a.is_practice
    return true
  })

  const getDiffColor = d => d==='advanced'?'badge-red':d==='intermediate'?'badge-yellow':'badge-green'

  return (
    <DashboardLayout title="Student" subtitle="Assessments and practice tests">
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {label:'Available Tests', value: assessments.filter(a=>a.status==='published'&&!a.attempt_status).length, icon:'📋', color:'orange'},
            {label:'Completed',       value: assessments.filter(a=>a.attempt_status==='graded').length,              icon:'✅', color:'green'},
            {label:'Avg Score',       value: assessments.filter(a=>a.percentage!=null).length
              ? `${(assessments.filter(a=>a.percentage!=null).reduce((s,a)=>s+a.percentage,0)/assessments.filter(a=>a.percentage!=null).length).toFixed(0)}%`
              : '—',                                                                                                 icon:'📊', color:'purple'},
          ].map(s=>(
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-2xl font-extrabold" style={{color:'var(--brand-navy)'}}>{s.value}</p>
                <p className="text-xs" style={{color:'var(--text-muted)'}}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{background:'var(--brand-border)'}}>
          {[['all','All Tests'],['available','Available'],['completed','Completed']].map(([key,label])=>(
            <button key={key} onClick={()=>setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter===key?'bg-white shadow':''}`}
              style={{color:'var(--brand-navy)'}}>
              {label}
            </button>
          ))}
        </div>

        {/* Assessment cards */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : filtered.length===0 ? (
          <div className="card p-16 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-semibold" style={{color:'var(--brand-navy)'}}>No assessments found</p>
            <p className="text-sm mt-1" style={{color:'var(--text-muted)'}}>Your teacher hasn't published any assessments yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(a=>{
              const attemptInfo = a.attempt_status ? ATTEMPT_CONFIG[a.attempt_status] : null
              const statusConf  = STATUS_CONFIG[a.status] || {}
              const canStart    = statusConf.canStart && !a.attempt_status
              return (
                <div key={a.id} className="card p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{background:'var(--brand-orange-pale)'}}>
                    <BookOpen size={22} style={{color:'var(--brand-orange)'}}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-sm" style={{color:'var(--brand-navy)'}}>{a.title}</p>
                      <span className={getDiffColor(a.difficulty)}>{a.difficulty}</span>
                      {statusConf.label && <span className={statusConf.color}>{statusConf.label}</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{color:'var(--text-muted)'}}>
                      <span className="flex items-center gap-1"><Clock size={11}/> {a.duration_minutes} min</span>
                      <span>·</span>
                      <span>{a.total_marks} marks</span>
                      {a.scheduled_at && <><span>·</span><span>{new Date(a.scheduled_at).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true })}</span></>}
                    </div>
                    {/* Result bar if completed */}
                    {a.percentage!=null && (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex-1 progress-bar">
                          <div className="progress-fill" style={{width:`${a.percentage}%`,
                            background:a.percentage>=60?'#22C55E':'#EF4444'}}/>
                        </div>
                        <span className={`text-xs font-bold ${a.percentage>=60?'text-green-600':'text-red-500'}`}>
                          {a.percentage}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {attemptInfo && (
                      <div className={`flex items-center gap-1 text-xs font-medium ${attemptInfo.color}`}>
                        <attemptInfo.icon size={14}/> {attemptInfo.label}
                      </div>
                    )}
                    {canStart && (
                      <button onClick={()=>navigate(`/student/assessment/${a.id}`)}
                        className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-1.5">
                        <PlayCircle size={15}/> Start
                      </button>
                    )}
                    {a.attempt_status==='in_progress' && (
                      <button onClick={()=>navigate(`/student/assessment/${a.id}`)}
                        className="btn-primary text-sm px-4 py-2 rounded-xl"
                        style={{background:'var(--brand-purple)'}}>
                        Continue
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Practice CTA */}
        <div className="card p-5 flex items-center gap-4 border-2 border-dashed" style={{borderColor:'var(--brand-orange)'}}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{background:'var(--brand-orange-pale)'}}>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm" style={{color:'var(--brand-navy)'}}>Start a Practice Session</p>
            <p className="text-xs" style={{color:'var(--text-muted)'}}>Adaptive questions based on your weak areas</p>
          </div>
          <button onClick={()=>navigate('/student/dashboard')}
            className="btn-primary text-sm px-4 py-2 rounded-xl">
            Practice Now
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
