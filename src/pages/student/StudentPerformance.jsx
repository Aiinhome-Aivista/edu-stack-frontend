import React, { useState } from 'react'
import { DashboardLayout } from '../../components/common/Layout'
import { useQuery } from 'react-query'
import api from '../../utils/api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell } from 'recharts'
import { TrendingUp, Target, Award, Clock } from 'lucide-react'

const MOCK_WEEKLY = [{w:'W 01',v:28},{w:'W 02',v:35},{w:'W 03',v:55},{w:'W 04',v:66},{w:'W 05',v:82}]
const MOCK_SUBJECTS = [{s:'Mathematics',v:88},{s:'Science',v:92},{s:'English',v:74},{s:'History',v:68},{s:'Geography',v:79}]
const MOCK_RADAR = [{topic:'Calculus',v:82},{topic:'Algebra',v:67},{topic:'Trig',v:88},{topic:'Statistics',v:71},{topic:'Geometry',v:79}]

export default function StudentPerformance() {
  const [tab, setTab] = useState('overview')

  const { data: profile } = useQuery('learning-profile',
    ()=>api.get('/students/learning-profile').then(r=>r.data))
  const { data: dashboard } = useQuery('student-dashboard',
    ()=>api.get('/students/dashboard').then(r=>r.data))

  const mastery = profile?.topic_masteries || []
  const strong  = mastery.filter(m=>m.mastery_level>=75)
  const weak    = mastery.filter(m=>m.mastery_level<50)
  const roadmap = profile?.ai_roadmap

  return (
    <DashboardLayout title="Student" subtitle="Detailed performance analysis and AI insights">
      <div className="space-y-5">
        {/* Tab nav */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{background:'var(--brand-border)'}}>
          {[['overview','Overview'],['subjects','Subjects'],['ai-roadmap','AI Roadmap']].map(([key,label])=>(
            <button key={key} onClick={()=>setTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${tab===key?'bg-white shadow':''}`}
              style={{color:'var(--brand-navy)'}}>
              {label}
            </button>
          ))}
        </div>

        {tab==='overview' && (
          <div className="space-y-5">
            {/* KPI cards */}
            <div className="grid grid-cols-4 gap-4">
              {[
                {icon:Award,   label:'Overall Score',   value:`${dashboard?.avg_score||0}%`,   color:'orange'},
                {icon:Target,  label:'Accuracy Rate',   value:`${profile?.accuracy_rate||88}%`, color:'green'},
                {icon:TrendingUp,label:'Strong Topics', value:dashboard?.strong_topics||12,     color:'purple'},
                {icon:Clock,   label:'Avg Time/Q',      value:'42s',                           color:'yellow'},
              ].map(s=>(
                <div key={s.label} className="card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{background:s.color==='orange'?'#FFF0EB':s.color==='green'?'#F0FDF4':s.color==='purple'?'#EEF0FF':'#FEF9C3'}}>
                      <s.icon size={16} style={{color:s.color==='orange'?'var(--brand-orange)':s.color==='green'?'#16A34A':s.color==='purple'?'var(--brand-purple)':'#D97706'}}/>
                    </div>
                    <p className="text-xs" style={{color:'var(--text-muted)'}}>{s.label}</p>
                  </div>
                  <p className="text-2xl font-extrabold" style={{color:'var(--brand-navy)'}}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Line chart + Radar */}
            <div className="grid grid-cols-2 gap-5">
              <div className="card p-5">
                <h3 className="font-bold text-sm mb-3" style={{color:'var(--brand-navy)'}}>Weekly Performance</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={dashboard?.weekly_performance?.length?dashboard.weekly_performance:MOCK_WEEKLY}>
                    <XAxis dataKey="week" tick={{fontSize:11}}/>
                    <YAxis domain={[0,100]} tick={{fontSize:11}}/>
                    <Tooltip formatter={v=>`${v}%`}/>
                    <Line type="monotone" dataKey={dashboard?.weekly_performance?.[0]?.avg!==undefined?'avg':'v'}
                      stroke="var(--brand-navy)" strokeWidth={2.5} dot={{fill:'var(--brand-purple)',r:4}}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="card p-5">
                <h3 className="font-bold text-sm mb-3" style={{color:'var(--brand-navy)'}}>Topic Mastery Radar</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={MOCK_RADAR}>
                    <PolarGrid/>
                    <PolarAngleAxis dataKey="topic" tick={{fontSize:10}}/>
                    <Radar dataKey="v" stroke="var(--brand-orange)" fill="var(--brand-orange)" fillOpacity={0.3}/>
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strong / weak */}
            <div className="grid grid-cols-2 gap-5">
              {[
                {title:'💪 Strong Areas',items:['Calculus I — 92%','Statistics — 88%','Algebra II — 85%'],color:'green'},
                {title:'📌 Weak Areas',  items:['Trigonometry — 48%','Integration — 52%','Vectors — 55%'],  color:'red'},
              ].map(section=>(
                <div key={section.title} className="card p-5">
                  <h3 className="font-bold text-sm mb-3" style={{color:'var(--brand-navy)'}}>{section.title}</h3>
                  <div className="space-y-2">
                    {section.items.map((item,i)=>{
                      const [name,pct] = item.split(' — ')
                      const num = parseInt(pct)
                      return (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span style={{color:'var(--brand-navy)'}}>{name}</span>
                            <span className={`font-bold ${section.color==='green'?'text-green-600':'text-red-500'}`}>{pct}</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{width:pct,background:section.color==='green'?'#22C55E':'#EF4444'}}/>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='subjects' && (
          <div className="space-y-5">
            <div className="card p-5">
              <h3 className="font-bold text-sm mb-4" style={{color:'var(--brand-navy)'}}>Subject-wise Scores</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={MOCK_SUBJECTS} barCategoryGap="35%">
                  <XAxis dataKey="s" tick={{fontSize:11}}/>
                  <YAxis domain={[0,100]} tick={{fontSize:11}}/>
                  <Tooltip formatter={v=>`${v}%`}/>
                  <Bar dataKey="v" radius={[8,8,0,0]}>
                    {MOCK_SUBJECTS.map((_,i)=>(
                      <Cell key={i} fill={['#F05A28','#6B5ECD','#22C55E','#F59E0B','#3B82F6'][i]}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {MOCK_SUBJECTS.map(subj=>(
                <div key={subj.s} className="card p-4">
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold text-sm" style={{color:'var(--brand-navy)'}}>{subj.s}</p>
                    <p className="font-extrabold text-lg" style={{color:'var(--brand-orange)'}}>{subj.v}%</p>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width:`${subj.v}%`}}/>
                  </div>
                  <div className="flex justify-between mt-2 text-xs" style={{color:'var(--text-muted)'}}>
                    <span>Class avg: {subj.v-8}%</span>
                    <span>{subj.v>=80?'Above average':'Below average'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='ai-roadmap' && (
          <div className="space-y-4">
            <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#1E2B6F 0%,#6B5ECD 100%)'}}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🤖</span>
                <h2 className="text-xl font-extrabold">Your AI Learning Roadmap</h2>
              </div>
              <p className="text-white/70 text-sm">Personalized plan generated based on your performance data</p>
            </div>
            {roadmap ? (
              <div className="grid grid-cols-3 gap-4">
                {[
                  {title:'Short-term Goals',items:roadmap.short_term||[],icon:'🎯',color:'orange'},
                  {title:'Mid-term Goals',  items:Array.isArray(roadmap.mid_term)?roadmap.mid_term:[roadmap.mid_term].filter(Boolean), icon:'📅',color:'purple'},
                  {title:'Long-term Vision',items:[roadmap.long_term||''].filter(Boolean),icon:'🌟',color:'green'},
                ].map(section=>(
                  <div key={section.title} className="card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{section.icon}</span>
                      <h3 className="font-bold text-sm" style={{color:'var(--brand-navy)'}}>{section.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {(Array.isArray(section.items)?section.items:[section.items]).map((item,i)=>(
                        <li key={i} className="flex items-start gap-2 text-xs" style={{color:'var(--text-secondary)'}}>
                          <span className="mt-0.5 flex-shrink-0" style={{color:'var(--brand-orange)'}}>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-10 text-center">
                <p className="text-4xl mb-3">🤖</p>
                <p className="font-semibold" style={{color:'var(--brand-navy)'}}>No roadmap generated yet</p>
                <p className="text-sm mt-1" style={{color:'var(--text-muted)'}}>Complete at least 3 assessments to get your personalized AI roadmap</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
