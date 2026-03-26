import React, { useState } from 'react'
import { DashboardLayout } from '../../components/common/Layout'
import { Select } from '../../components/common/Select'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { UserPlus, Trash2, Users, BookOpen, ChevronDown, ChevronRight } from 'lucide-react'

export default function TeacherAssignments() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]   = useState({ teacher_id:'', grade_id:'', class_id:'', subject_id:'' })
  const [expanded, setExpanded] = useState({})
  const set = (k,v) => setForm(p=>({...p,[k]:v}))

  // Data fetches
  const { data: teachers=[] } = useQuery('all-teachers',
    () => api.get('/teachers/all').then(r=>r.data))
  const { data: grades=[] }   = useQuery('grades',
    () => api.get('/academic/grades').then(r=>r.data))
  const { data: classes=[] }  = useQuery(['classes',form.grade_id],
    () => api.get(`/academic/classes?grade_id=${form.grade_id}`).then(r=>r.data),
    { enabled:!!form.grade_id })
  const { data: subjects=[] } = useQuery(['subjects',form.grade_id],
    () => api.get(`/academic/subjects?grade_id=${form.grade_id}`).then(r=>r.data),
    { enabled:!!form.grade_id })

  const assignMut = useMutation(
    d => api.post('/teachers/assign-class', d),
    { onSuccess:() => { toast.success('Teacher assigned!'); qc.invalidateQueries('all-teachers'); setShowForm(false); setForm({teacher_id:'',grade_id:'',class_id:'',subject_id:''}) },
      onError: e => toast.error(e?.response?.data?.error || 'Assignment failed') }
  )
  const removeMut = useMutation(
    id => api.delete(`/teachers/assign-class/${id}`),
    { onSuccess:() => { toast.success('Assignment removed'); qc.invalidateQueries('all-teachers') },
      onError: () => toast.error('Failed to remove') }
  )

  const handleAssign = () => {
    if (!form.teacher_id || !form.class_id || !form.subject_id)
      return toast.error('Please fill all fields')
    assignMut.mutate({
      teacher_id: parseInt(form.teacher_id),
      class_id:   parseInt(form.class_id),
      subject_id: parseInt(form.subject_id),
    })
  }

  const gradeOpts   = grades.map(g=>({value:String(g.id),label:g.name}))
  const classOpts   = classes.map(c=>({value:String(c.id),label:`Section ${c.section}`}))
  const subjectOpts = subjects.map(s=>({value:String(s.id),label:s.name}))
  const teacherOpts = teachers.map(t=>({value:String(t.id),label:`${t.full_name} (${t.employee_id||'—'})`}))

  const totalAssignments = teachers.reduce((s,t)=>s+(t.assignments?.length||0),0)

  return (
    <DashboardLayout title="Admin" subtitle="Manage teacher–class–subject assignments">
      <div className="space-y-5">

        {/* Header stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:'Total Teachers',    value: teachers.length,        icon:'👨‍🏫' },
            { label:'Total Assignments', value: totalAssignments,       icon:'📋' },
            { label:'Unassigned',        value: teachers.filter(t=>!t.assignments?.length).length, icon:'⚠️' },
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

        {/* Assign form */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base" style={{color:'var(--brand-navy)'}}>
              Assign Teacher to Class
            </h2>
            <button onClick={()=>setShowForm(p=>!p)}
              className="btn-primary flex items-center gap-2 text-sm px-4 py-2 rounded-xl">
              <UserPlus size={15}/> New Assignment
            </button>
          </div>

          {showForm && (
            <div className="p-4 rounded-xl border space-y-4 mt-2"
              style={{borderColor:'var(--brand-border)',background:'var(--brand-bg)'}}>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Teacher *" placeholder="Select teacher…"
                  options={teacherOpts} value={form.teacher_id} onChange={v=>set('teacher_id',v)}/>
                <Select label="Grade *" placeholder="Select grade…"
                  options={gradeOpts} value={form.grade_id} onChange={v=>{set('grade_id',v);set('class_id','');set('subject_id','')}}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Class Section *" placeholder="Select section…"
                  options={classOpts} value={form.class_id} onChange={v=>set('class_id',v)} disabled={!form.grade_id}/>
                <Select label="Subject *" placeholder="Select subject…"
                  options={subjectOpts} value={form.subject_id} onChange={v=>set('subject_id',v)} disabled={!form.grade_id}/>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={()=>setShowForm(false)} className="btn-secondary px-5 py-2.5 rounded-xl text-sm">
                  Cancel
                </button>
                <button onClick={handleAssign} disabled={assignMut.isLoading}
                  className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
                  {assignMut.isLoading
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Assigning…</>
                    : <><UserPlus size={15}/> Assign Teacher</>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Teachers list with assignments */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b" style={{borderColor:'var(--brand-border)'}}>
            <h2 className="font-bold text-sm" style={{color:'var(--brand-navy)'}}>
              Teacher Assignments ({teachers.length})
            </h2>
          </div>

          {teachers.length===0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl mb-3">👨‍🏫</p>
              <p className="font-semibold" style={{color:'var(--brand-navy)'}}>No teachers found</p>
              <p className="text-sm mt-1" style={{color:'var(--text-muted)'}}>Create teacher accounts in User Management first</p>
            </div>
          ) : teachers.map(teacher => {
            const isOpen = expanded[teacher.id]
            return (
              <div key={teacher.id} className="border-b" style={{borderColor:'var(--brand-border)'}}>
                {/* Teacher row */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={()=>setExpanded(p=>({...p,[teacher.id]:!p[teacher.id]}))}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                      style={{background:'var(--brand-orange-pale)',color:'var(--brand-orange)'}}>
                      {teacher.full_name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{color:'var(--brand-navy)'}}>{teacher.full_name}</p>
                      <p className="text-xs" style={{color:'var(--text-muted)'}}>
                        {teacher.employee_id||'—'} · {teacher.assignments?.length||0} class assignment{teacher.assignments?.length!==1?'s':''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {teacher.assignments?.length===0 && (
                      <span className="badge-yellow text-xs">Unassigned</span>
                    )}
                    {isOpen ? <ChevronDown size={16} style={{color:'var(--text-muted)'}}/> 
                            : <ChevronRight size={16} style={{color:'var(--text-muted)'}}/>}
                  </div>
                </div>

                {/* Assignments table */}
                {isOpen && (
                  <div className="px-5 pb-4">
                    {teacher.assignments?.length===0 ? (
                      <div className="rounded-xl p-4 text-center text-sm"
                        style={{background:'var(--brand-bg)',color:'var(--text-muted)'}}>
                        No classes assigned yet. Use the form above to assign.
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{borderBottom:'1px solid var(--brand-border)'}}>
                            {['Class','Subject','Students','Actions'].map(h=>(
                              <th key={h} className="text-left py-2 px-3 text-xs font-semibold"
                                style={{color:'var(--text-muted)'}}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {teacher.assignments.map((a,i)=>(
                            <tr key={i} style={{borderBottom:'1px solid var(--brand-border)'}}>
                              <td className="py-2.5 px-3 font-medium" style={{color:'var(--brand-navy)'}}>
                                <div className="flex items-center gap-2">
                                  <BookOpen size={13} style={{color:'var(--brand-orange)'}}/>
                                  {a.class_name}
                                </div>
                              </td>
                              <td className="py-2.5 px-3" style={{color:'var(--text-secondary)'}}>{a.subject_name}</td>
                              <td className="py-2.5 px-3">
                                <StudentCount classId={a.class_id}/>
                              </td>
                              <td className="py-2.5 px-3">
                                <button
                                  onClick={()=>{
                                    if(window.confirm('Remove this assignment?')) removeMut.mutate(a.ts_id)
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                                  <Trash2 size={14}/>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}

// Small component to show student count per class
function StudentCount({ classId }) {
  const { data } = useQuery(['class-students',classId],
    () => api.get(`/academic/classes?grade_id=0`).then(()=>null).catch(()=>null),
    { enabled: false }) // placeholder — count shown from seed
  return <span className="flex items-center gap-1 text-xs" style={{color:'var(--text-secondary)'}}><Users size={11}/> —</span>
}
