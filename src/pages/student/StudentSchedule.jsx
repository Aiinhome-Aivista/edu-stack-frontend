import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/common/Layout'
import { useQuery } from 'react-query'
import api from '../../utils/api'
import { Calendar, Clock, BookOpen, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat']
const PERIODS = [
  {time:'08:00–09:30', subjects:['Mathematics','—','Mathematics','—','Science','Revision']},
  {time:'09:45–11:15', subjects:['Science','Mathematics','—','Mathematics','Mathematics','—']},
  {time:'11:30–01:00', subjects:['English','Science','History','Science','—','Mathematics']},
  {time:'02:00–03:30', subjects:['—','English','Geography','English','English','—']},
]
const PERIOD_COLORS = {'Mathematics':'#F05A28','Science':'#6B5ECD','English':'#22C55E','History':'#F59E0B','Geography':'#3B82F6','Revision':'#EC4899','—':null}

const EVENTS = [
  {date:'Nov 24',title:'Vedic Maths Quiz',type:'assessment',time:'10:00 AM',urgent:true},
  {date:'Nov 25',title:'Doubt Clearance: Physics',type:'session',time:'02:00 PM',urgent:false},
  {date:'Nov 26',title:'Geography Achievement',type:'achievement',time:'',urgent:false},
  {date:'Nov 28',title:'Unit Test: Linear Algebra',type:'assessment',time:'09:00 AM',urgent:true},
  {date:'Dec 02',title:'Science Project Submission',type:'deadline',time:'11:59 PM',urgent:false},
]

export default function StudentSchedule() {
  const navigate = useNavigate()
  const [weekOffset, setWeekOffset] = useState(0)
  const today = new Date()

  const { data: schedule } = useQuery('student-schedule', ()=>api.get('/students/schedule').then(r=>r.data))
  const upcomingAssessments = schedule?.upcoming_assessments || []

  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + 1 + weekOffset*7)
  const dateLabels = DAYS.map((d,i)=>{
    const dt = new Date(weekStart); dt.setDate(weekStart.getDate()+i)
    return {day:d, date:dt.getDate(), isToday: dt.toDateString()===today.toDateString()}
  })

  const typeIcon = t => t==='assessment'?'📝':t==='session'?'💬':t==='achievement'?'🏆':'⏰'
  const typeColor = t => t==='assessment'?'var(--brand-orange)':t==='session'?'var(--brand-purple)':t==='achievement'?'#16A34A':'#D97706'

  return (
    <DashboardLayout title="Student" subtitle="Your class timetable and upcoming events">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Weekly timetable */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base" style={{color:'var(--brand-navy)'}}>Class Timetable</h2>
              <div className="flex items-center gap-2">
                <button onClick={()=>setWeekOffset(p=>p-1)} className="p-1.5 rounded-lg border hover:bg-gray-50" style={{borderColor:'var(--brand-border)'}}>
                  <ChevronLeft size={15}/>
                </button>
                <button onClick={()=>setWeekOffset(0)} className="px-3 py-1 rounded-lg text-xs font-semibold"
                  style={{background:'var(--brand-orange-pale)',color:'var(--brand-orange)'}}>This Week</button>
                <button onClick={()=>setWeekOffset(p=>p+1)} className="p-1.5 rounded-lg border hover:bg-gray-50" style={{borderColor:'var(--brand-border)'}}>
                  <ChevronRight size={15}/>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  <div className="text-xs text-center py-1" style={{color:'var(--text-muted)'}}>Period</div>
                  {dateLabels.map(d=>(
                    <div key={d.day} className="text-center">
                      <p className="text-xs" style={{color:'var(--text-muted)'}}>{d.day}</p>
                      <div className={`mx-auto mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                        ${d.isToday?'bg-orange-500 text-white':''}`}
                        style={{color:d.isToday?'white':'var(--brand-navy)'}}>
                        {d.date}
                      </div>
                    </div>
                  ))}
                </div>
                {PERIODS.map((period,pi)=>(
                  <div key={pi} className="grid grid-cols-7 border-t" style={{borderColor:'var(--brand-border)',minHeight:52}}>
                    <div className="flex items-center justify-center text-xs px-1" style={{color:'var(--text-muted)'}}>{period.time}</div>
                    {period.subjects.map((subj,si)=>{
                      const color = PERIOD_COLORS[subj]
                      return (
                        <div key={si} className="border-l px-1 py-1 flex items-center justify-center" style={{borderColor:'var(--brand-border)'}}>
                          {color ? (
                            <div className="rounded-lg px-2 py-1.5 text-white text-center w-full" style={{background:color+'CC'}}>
                              <p className="text-xs font-semibold leading-tight">{subj}</p>
                            </div>
                          ) : <span className="text-gray-300 text-xs">—</span>}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Assessments from API */}
          {upcomingAssessments.length > 0 && (
            <div className="card p-5">
              <h2 className="font-bold text-base mb-3" style={{color:'var(--brand-navy)'}}>Upcoming Assessments</h2>
              <div className="space-y-2">
                {upcomingAssessments.map((a,i)=>(
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                    style={{background:'var(--brand-bg)'}}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📝</span>
                      <div>
                        <p className="font-semibold text-sm" style={{color:'var(--brand-navy)'}}>{a.title}</p>
                        <p className="text-xs" style={{color:'var(--text-muted)'}}>{new Date(a.scheduled_at).toLocaleString('en-IN')} · {a.duration_minutes} min</p>
                      </div>
                    </div>
                    <button onClick={()=>navigate(`/student/assessment/${a.id}`)}
                      className="btn-primary text-xs px-3 py-1.5 rounded-lg">Start</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Events */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-sm mb-4" style={{color:'var(--brand-navy)'}}>Upcoming Events</h3>
            <div className="space-y-3">
              {EVENTS.map((e,i)=>(
                <div key={i} className={`rounded-xl p-3 border ${e.urgent?'border-orange-200':'border-transparent'}`}
                  style={{background:e.urgent?'#FFF5F0':'var(--brand-bg)'}}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">{typeIcon(e.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs leading-tight" style={{color:'var(--brand-navy)'}}>{e.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs" style={{color:'var(--text-muted)'}}>{e.date}{e.time&&` · ${e.time}`}</span>
                        {e.urgent && <span className="badge-orange text-xs">Soon</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="card p-4">
            <h4 className="text-xs font-semibold mb-3" style={{color:'var(--text-muted)'}}>SUBJECT LEGEND</h4>
            <div className="space-y-1.5">
              {Object.entries(PERIOD_COLORS).filter(([k])=>k!=='—').map(([subj,color])=>(
                <div key={subj} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded flex-shrink-0" style={{background:color}}/>
                  <span className="text-xs" style={{color:'var(--text-secondary)'}}>{subj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
