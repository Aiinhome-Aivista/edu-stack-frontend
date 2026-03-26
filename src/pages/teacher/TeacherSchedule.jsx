import React, { useState } from 'react'
import { DashboardLayout } from '../../components/common/Layout'
import { useQuery } from 'react-query'
import api from '../../utils/api'
import { Calendar, Clock, Users, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat']
const HOURS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00']

const COLORS = ['#F05A28','#6B5ECD','#22C55E','#F59E0B','#3B82F6','#EC4899']

// Static demo timetable entries
const TIMETABLE = [
  { day:0, hour:0, subject:'Calculus I',      class:'10-A', duration:2, color:COLORS[0] },
  { day:0, hour:3, subject:'Linear Algebra',  class:'11-B', duration:1, color:COLORS[1] },
  { day:1, hour:0, subject:'Calculus I',      class:'10-B', duration:2, color:COLORS[0] },
  { day:1, hour:4, subject:'Faculty Meeting', class:'Staff', duration:1, color:COLORS[2] },
  { day:2, hour:0, subject:'Trigonometry',    class:'10-A', duration:1, color:COLORS[3] },
  { day:2, hour:2, subject:'Linear Algebra',  class:'10-C', duration:2, color:COLORS[1] },
  { day:3, hour:1, subject:'Calculus II',     class:'10-A', duration:2, color:COLORS[4] },
  { day:3, hour:5, subject:'Office Hours',    class:'Room 12', duration:1, color:COLORS[2] },
  { day:4, hour:0, subject:'Trigonometry',    class:'10-B', duration:2, color:COLORS[3] },
  { day:4, hour:3, subject:'Calculus II',     class:'11-A', duration:2, color:COLORS[4] },
  { day:5, hour:1, subject:'Revision Class',  class:'10-A', duration:2, color:COLORS[5] },
]

const UPCOMING_ASSESSMENTS = [
  { title:'Mid-Term: Calculus I',   class:'Grade 10-A', date:'Nov 24, 10:00 AM', status:'scheduled' },
  { title:'Quiz: Trigonometry',     class:'Grade 10-B', date:'Nov 26, 02:00 PM', status:'draft' },
  { title:'Unit Test: Algebra',     class:'Grade 11-B', date:'Nov 28, 09:00 AM', status:'scheduled' },
]

export default function TeacherSchedule() {
  const [weekOffset, setWeekOffset] = useState(0)
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7)

  const dateLabels = DAYS.map((d, i) => {
    const dt = new Date(weekStart)
    dt.setDate(weekStart.getDate() + i)
    return { day: d, date: dt.getDate(), isToday: dt.toDateString() === today.toDateString() }
  })

  return (
    <DashboardLayout title="Teacher" subtitle="Your schedule and timetable">
      <div className="space-y-5">
        {/* Top stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: BookOpen,  label: 'Classes Today',    value: '3', color: 'orange' },
            { icon: Users,     label: 'Total Students',   value: '124', color: 'purple' },
            { icon: Calendar,  label: 'Upcoming Tests',   value: '3', color: 'green' },
            { icon: Clock,     label: 'Teaching Hours/Wk',value: '18h', color: 'yellow' },
          ].map(s => (
            <div key={s.label} className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: s.color==='orange'?'#FFF0EB':s.color==='purple'?'#EEF0FF':s.color==='green'?'#F0FDF4':'#FEF9C3' }}>
                  <s.icon size={18} style={{ color: s.color==='orange'?'var(--brand-orange)':s.color==='purple'?'var(--brand-purple)':s.color==='green'?'#16A34A':'#D97706' }}/>
                </div>
                <div>
                  <p className="text-2xl font-extrabold" style={{color:'var(--brand-navy)'}}>{s.value}</p>
                  <p className="text-xs" style={{color:'var(--text-muted)'}}>{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timetable */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base" style={{color:'var(--brand-navy)'}}>Weekly Timetable</h2>
            <div className="flex items-center gap-2">
              <button onClick={()=>setWeekOffset(p=>p-1)} className="p-1.5 rounded-lg border hover:bg-gray-50" style={{borderColor:'var(--brand-border)'}}>
                <ChevronLeft size={16}/>
              </button>
              <span className="text-sm font-medium px-3" style={{color:'var(--brand-navy)'}}>
                {weekStart.toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                {' – '}
                {new Date(weekStart.getTime()+5*86400000).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
              </span>
              <button onClick={()=>setWeekOffset(p=>p+1)} className="p-1.5 rounded-lg border hover:bg-gray-50" style={{borderColor:'var(--brand-border)'}}>
                <ChevronRight size={16}/>
              </button>
              <button onClick={()=>setWeekOffset(0)} className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{background:'var(--brand-orange-pale)',color:'var(--brand-orange)'}}>Today</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                <div className="text-xs font-medium text-center py-2" style={{color:'var(--text-muted)'}}>Time</div>
                {dateLabels.map(d=>(
                  <div key={d.day} className="text-center py-2">
                    <p className="text-xs font-medium" style={{color:'var(--text-muted)'}}>{d.day}</p>
                    <div className={`mx-auto mt-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${d.isToday?'bg-orange-500 text-white':''}`}
                      style={{color:d.isToday?'white':'var(--brand-navy)'}}>
                      {d.date}
                    </div>
                  </div>
                ))}
              </div>
              {/* Grid */}
              {HOURS.map((hour, hi) => (
                <div key={hour} className="grid grid-cols-7 border-t" style={{borderColor:'var(--brand-border)',minHeight:56}}>
                  <div className="flex items-start pt-2 px-2 text-xs" style={{color:'var(--text-muted)'}}>{hour}</div>
                  {DAYS.map((_, di) => {
                    const entry = TIMETABLE.find(e => e.day === di && e.hour === hi)
                    if (!entry) return <div key={di} className="border-l" style={{borderColor:'var(--brand-border)'}} />
                    return (
                      <div key={di} className="border-l px-1 py-1 relative" style={{borderColor:'var(--brand-border)'}}>
                        <div className="rounded-lg p-1.5 text-white text-xs cursor-pointer hover:opacity-90 transition"
                          style={{background: entry.color, minHeight: entry.duration * 48}}>
                          <p className="font-semibold leading-tight">{entry.subject}</p>
                          <p className="opacity-80 mt-0.5">{entry.class}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming assessments */}
        <div className="card p-5">
          <h2 className="font-bold text-base mb-4" style={{color:'var(--brand-navy)'}}>Upcoming Assessments</h2>
          <div className="space-y-3">
            {UPCOMING_ASSESSMENTS.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border"
                style={{borderColor:'var(--brand-border)',background:'var(--brand-bg)'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{background:'var(--brand-orange-pale)'}}>
                    <BookOpen size={18} style={{color:'var(--brand-orange)'}}/>
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{color:'var(--brand-navy)'}}>{a.title}</p>
                    <p className="text-xs" style={{color:'var(--text-muted)'}}>{a.class} · {a.date}</p>
                  </div>
                </div>
                <span className={a.status==='scheduled'?'badge-green':'badge-yellow'}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
