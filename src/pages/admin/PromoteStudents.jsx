import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import { DashboardLayout } from '../../components/common/Layout'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { TrendingUp, Search, CheckCircle2, Circle } from 'lucide-react'

export default function PromoteStudents() {
  const [selectedStudents, setSelectedStudents] = useState([])
  const [newClassId, setNewClassId] = useState('')
  const [search, setSearch] = useState('')
  const [gradeFilter, setGradeFilter] = useState('')
  const [sessionId, setSessionId] = useState('')

  // Fetch grades
  const { data: gradesData = [] } = useQuery('grades', () => 
    api.get('/academic/grades').then(r => r.data))

  // Fetch sessions
  const { data: sessionsData = [] } = useQuery('sessions', () => 
    api.get('/academic/sessions').then(r => r.data))

  // Fetch target classes (for promotion)
  const { data: targetClasses = [] } = useQuery(['targetClasses', gradeFilter, sessionId], 
    () => api.get(`/academic/classes?session_id=${sessionId}&grade_id=${gradeFilter}`).then(r => r.data), 
    { enabled: !!gradeFilter && !!sessionId })

  // Fetch students
  const { data: studentsData, isLoading } = useQuery('all-students', () => 
    api.get('/admin/users?role=student&per_page=50').then(r => r.data))

  const students = (studentsData?.users || []).filter(s => 
    !search || (s.full_name || s.email || '').toLowerCase().includes(search.toLowerCase()))

  const promoteMutation = useMutation(d => api.post('/admin/promote-students', d), {
    onSuccess: () => {
      toast.success('Students promoted successfully!')
      setSelectedStudents([])
      setNewClassId('')
    },
    onError: e => toast.error(e?.response?.data?.error || 'Failed to promote students')
  })

  const handleToggleStudent = (id) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handlePromote = () => {
    if (selectedStudents.length === 0) return toast.error('Select students first')
    if (!newClassId) return toast.error('Select a target class')
    
    promoteMutation.mutate({
      user_ids: selectedStudents,
      class_id: parseInt(newClassId)
    })
  }

  return (
    <DashboardLayout title="Super Admin" subtitle="Assign New Session to Students Panel">
      <div className="space-y-6">
        {/* Header/Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-xl font-extrabold flex items-center gap-2" style={{ color: 'var(--brand-navy)' }}>
            
            Assign Students to New Session
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {selectedStudents.length} Students Selected
            </span>
            <button 
              onClick={handlePromote}
              disabled={promoteMutation.isLoading}
              className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl shadow-lg transition transform active:scale-95 disabled:opacity-50">
              {promoteMutation.isLoading ? 'Adding...' : 'Add to New Session'}
            </button>
          </div>
        </div>

        {/* Class Configuration Card */}
        <div className="card p-6">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
               Class Configuration
            </h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--brand-navy)' }}>Session</label>
                <select 
                  value={sessionId} 
                  onChange={e => { setSessionId(e.target.value); setNewClassId(''); }}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-orange-300 outline-none"
                  style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }}>
                  <option value="">Select Session</option>
                  {sessionsData.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--brand-navy)' }}>Grade</label>
                <select 
                  value={gradeFilter} 
                  onChange={e => { setGradeFilter(e.target.value); setNewClassId(''); }}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-orange-300 outline-none"
                  style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }}>
                  <option value="">Select Grade</option>
                  {gradesData.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--brand-navy)' }}>Class Section</label>
                <select 
                  value={newClassId} 
                  disabled={!gradeFilter || !sessionId}
                  onChange={e => setNewClassId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-orange-300 outline-none disabled:opacity-50"
                  style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }}>
                  <option value="">Select Section</option>
                  {targetClasses.map(c => <option key={c.id} value={c.id}>Section {c.section}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Students Table Section */}
        <div className="card overflow-hidden">
          <div className="px-6 py-5 border-b flex items-center justify-between flex-wrap gap-4" style={{ borderColor: 'var(--brand-border)' }}>
            <div className="flex items-center gap-6 flex-1 min-w-[300px]">
              <h3 className="font-bold text-sm whitespace-nowrap" style={{ color: 'var(--brand-navy)' }}>Student List</h3>
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search students by email or ID..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm focus:ring-2 focus:ring-orange-300 outline-none"
                  style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }} />
              </div>
            </div>
            <button 
              onClick={() => setSelectedStudents(selectedStudents.length === students.length ? [] : students.map(s => s.id))}
              className="text-xs font-bold text-orange-600 hover:underline">
              {selectedStudents.length === students.length ? 'Deselect All' : 'Select All Students'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-lg">
              <thead style={{ background: 'var(--brand-bg)' }}>
                <tr>
                  <th className="w-12 py-3 px-4"></th>
                  {['ID', 'Email', 'Status'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider"
                      style={{ color: 'var(--text-primary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="py-20 text-center text-gray-400">Loading students...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={5} className="py-20 text-center text-gray-400">No students found</td></tr>
                ) : students.map(s => (
                  <tr key={s.id} 
                    onClick={() => handleToggleStudent(s.id)}
                    className="border-b last:border-0 hover:bg-gray-50/50 cursor-pointer transition"
                    style={{ borderColor: 'var(--brand-border)' }}>
                    <td className="py-3 px-4">
                      {selectedStudents.includes(s.id) ? (
                        <CheckCircle2 size={18} className="text-orange-500" />
                      ) : (
                        <Circle size={18} className="text-gray-300" />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-xs" style={{ color: 'var(--text-secondary)' }}>{s.id}</span>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{s.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
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
