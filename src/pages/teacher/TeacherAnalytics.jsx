import React, { useState } from 'react'
import { DashboardLayout } from '../../components/common/Layout'
import { useQuery } from 'react-query'
import api from '../../utils/api'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'

const MOCK_WEEKLY = [{w:'W 01',avg:45},{w:'W 02',avg:52},{w:'W 03',avg:60},{w:'W 04',avg:67},{w:'W 05',avg:74}]
const MOCK_SUBJECT = [{s:'Calculus I',avg:82},{s:'Linear Algebra',avg:67},{s:'Trigonometry',avg:71},{s:'Statistics',avg:88}]
const MOCK_RADAR = [{topic:'Calculus',A:82},{topic:'Algebra',A:67},{topic:'Trig',A:71},{topic:'Stats',A:88},{topic:'Geometry',A:75}]
const MOCK_DIST = [{range:'0-40',count:4},{range:'41-60',count:8},{range:'61-75',count:18},{range:'76-90',count:22},{range:'91-100',count:7}]

export default function TeacherAnalytics() {
  const [period, setPeriod] = useState('month')
  const { data: kpi } = useQuery('teacher-dashboard', ()=>api.get('/teachers/dashboard').then(r=>r.data))

  return (
    <DashboardLayout title="Teacher" subtitle="Class performance analytics">
      <div className="space-y-5">
        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {label:'Avg Class Score',value:`${kpi?.avg_class_score||72}%`,trend:'+4.2%',good:true},
            {label:'Pass Rate',value:'84%',trend:'+2%',good:true},
            {label:'Assessments Given',value:kpi?.total_assessments||12,trend:''},
            {label:'Engagement Rate',value:'82%',trend:'-1%',good:false},
          ].map(k=>(
            <div key={k.label} className="card p-4">
              <p className="text-xs font-semibold mb-1" style={{color:'var(--text-muted)'}}>{k.label}</p>
              <p className="text-3xl font-extrabold" style={{color:'var(--brand-navy)'}}>{k.value}</p>
              {k.trend&&<p className={`text-xs font-semibold mt-1 ${k.good?'text-green-600':'text-red-500'}`}>{k.trend}</p>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Performance trend */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm" style={{color:'var(--brand-navy)'}}>Performance Trend</h3>
              <div className="flex gap-1">
                {['week','month','year'].map(p=>(
                  <button key={p} onClick={()=>setPeriod(p)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium capitalize transition
                      ${period===p?'bg-orange-500 text-white':'hover:bg-gray-100'}`}
                    style={{color:period===p?'white':'var(--text-secondary)'}}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={MOCK_WEEKLY}>
                <XAxis dataKey="w" tick={{fontSize:11}}/>
                <YAxis domain={[0,100]} tick={{fontSize:11}}/>
                <Tooltip formatter={v=>`${v}%`}/>
                <Line type="monotone" dataKey="avg" stroke="var(--brand-orange)" strokeWidth={2.5} dot={{fill:'var(--brand-purple)',r:4}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Score distribution */}
          <div className="card p-5">
            <h3 className="font-bold text-sm mb-4" style={{color:'var(--brand-navy)'}}>Score Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={MOCK_DIST} barCategoryGap="30%">
                <XAxis dataKey="range" tick={{fontSize:11}}/>
                <YAxis tick={{fontSize:11}}/>
                <Tooltip/>
                <Bar dataKey="count" radius={[6,6,0,0]}>
                  {MOCK_DIST.map((_,i)=><Cell key={i} fill={i<1?'#EF4444':i<2?'#F59E0B':i<3?'#F05A28':'#22C55E'}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Subject-wise */}
          <div className="card p-5">
            <h3 className="font-bold text-sm mb-4" style={{color:'var(--brand-navy)'}}>Subject-wise Avg Score</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={MOCK_SUBJECT} layout="vertical" barCategoryGap="25%">
                <XAxis type="number" domain={[0,100]} tick={{fontSize:11}}/>
                <YAxis type="category" dataKey="s" tick={{fontSize:11}} width={90}/>
                <Tooltip formatter={v=>`${v}%`}/>
                <Bar dataKey="avg" fill="var(--brand-purple)" radius={[0,6,6,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar */}
          <div className="card p-5">
            <h3 className="font-bold text-sm mb-4" style={{color:'var(--brand-navy)'}}>Topic Mastery Radar</h3>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={MOCK_RADAR}>
                <PolarGrid/>
                <PolarAngleAxis dataKey="topic" tick={{fontSize:11}}/>
                <Radar name="Avg" dataKey="A" stroke="var(--brand-orange)" fill="var(--brand-orange)" fillOpacity={0.3}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top / bottom students */}
        <div className="grid grid-cols-2 gap-5">
          {[
            {title:'🏆 Top Performers',students:[{name:'Sarah Jenkins',score:96},{name:'Ravi Sankar',score:92},{name:'Ananya Rao',score:89}],color:'text-green-600'},
            {title:'⚠ Needs Attention',students:[{name:'Kiran Patel',score:34},{name:'Dev Kumar',score:41},{name:'Priya Singh',score:48}],color:'text-red-500'},
          ].map(section=>(
            <div key={section.title} className="card p-5">
              <h3 className="font-bold text-sm mb-3" style={{color:'var(--brand-navy)'}}>{section.title}</h3>
              <div className="space-y-2">
                {section.students.map((s,i)=>(
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{background:'var(--brand-bg)',color:'var(--brand-navy)'}}>
                      {s.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{color:'var(--brand-navy)'}}>{s.name}</p>
                      <div className="progress-bar mt-1">
                        <div className="progress-fill" style={{width:`${s.score}%`,background:section.color.includes('green')?'#22C55E':'#EF4444'}}/>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${section.color}`}>{s.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
