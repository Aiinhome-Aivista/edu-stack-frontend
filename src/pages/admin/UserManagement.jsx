// UserManagement.jsx
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { DashboardLayout } from '../../components/common/Layout'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { Plus, Search, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react'
import useAuthStore from '../../context/authStore'

const ROLES = ['student', 'teacher', 'parent', 'principal', 'director']
const ROLE_COLORS = {
  student: 'badge-orange', teacher: 'badge-green', parent: 'badge-yellow',
  principal: 'text-purple-700 bg-purple-100 text-xs font-semibold px-2 py-1 rounded-full',
  director: 'text-blue-700 bg-blue-100 text-xs font-semibold px-2 py-1 rounded-full',
  superadmin: 'text-gray-700 bg-gray-100 text-xs font-semibold px-2 py-1 rounded-full'
}



export default function UserManagement() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [roleFilter, setRoleFilter] = useState('')
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [showSession, setShowSession] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 10
  const [newUser, setNewUser] = useState({ email: '', role: 'student', full_name: '', institution_id: 1, session_id: '' })
  // const [newSession, setNewSession] = useState({
  //   institution_id: "",
  //   name: "",
  //   start_date: "",
  //   end_date: "",
  //   is_active: true
  // })

  const { data, isLoading } = useQuery(['users', roleFilter, page], () =>
    api.get(`/admin/users?role=${roleFilter}&per_page=${perPage}&page=${page}`).then(r => r.data))

  const { data: sessionsData = [] } = useQuery('sessions', () => api.get('/academic/sessions').then(r => r.data))
  const { data: gradesData = [] } = useQuery('grades', () => api.get('/academic/grades').then(r => r.data))
  const { data: classesData = [] } = useQuery(['classes', newUser.grade_id, newUser.session_id],
    () => api.get(`/academic/classes?session_id=${newUser.session_id}&grade_id=${newUser.grade_id}`).then(r => r.data),
    { enabled: !!newUser.grade_id && !!newUser.session_id }
  )



  const createMutation = useMutation(d => api.post('/admin/add-user', d), {
    onSuccess: (res) => {
      toast.success(`User created! Temp password: ${res.data.temp_password}`)
      setShowCreate(false)
      queryClient.invalidateQueries('users')
    },
    onError: e => toast.error(e?.response?.data?.error || 'Failed')
  })

  const deleteMutation = useMutation(id => api.delete(`/admin/users/${id}`), {
    onSuccess: () => { toast.success('User deactivated'); queryClient.invalidateQueries('users') }
  })



  const users = (data?.users || []).filter(u =>
    !search || (u.email || '').toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout title={user?.role === 'superadmin' ? 'Super Admin' : 'Admin'} subtitle="User Management Panel">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-extrabold" style={{ color: 'var(--brand-navy)' }}>
            User Management
          </h1>
          <div className="flex items-center gap-3">
            {/* <button onClick={() => setShowSession(true)} className="flex items-center gap-2 px-[22px] py-[10px] rounded-[10px] text-white text-sm font-semibold transition hover:opacity-90 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)' }}>
              <Plus size={16} /> Create Academic Session
            </button> */}
            <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Create User
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-48 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by email…"
              className="w-full pl-9 pr-4 py-2.5 rounded-[10px] border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setRoleFilter(''); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${!roleFilter ? 'bg-orange-500 text-white' : 'bg-white border'}`}
              style={{ borderColor: 'var(--brand-border)' }}>All</button>
            {ROLES.map(r => (
              <button key={r} onClick={() => { setRoleFilter(r === roleFilter ? '' : r); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition ${roleFilter === r ? 'bg-orange-500 text-white' : 'bg-white border'}`}
                style={{ borderColor: 'var(--brand-border)' }}>{r}</button>
            ))}
          </div>
        </div>

        {/* User Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 uppercase" style={{ background: 'var(--brand-bg)' }}>
                <tr>
                  {['User', 'Role', 'Status', 'Last Login', 'Actions'].map(h => (
                    <th key={h} className="text-left py-2 px-4 text-xs font-semibold"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="py-10 text-center">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={5} className="py-10 text-center" style={{ color: 'var(--text-muted)' }}>
                    No users found
                  </td></tr>
                ) : users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-700">
                          {(u.email || u.full_name || '?')[0].toUpperCase()}
                        </div>
                        <span style={{ color: 'var(--brand-navy)' }}>{u.email || u.full_name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 capitalize">
                      <span className={ROLE_COLORS[u.role] || 'badge-orange'}>{u.role}</span>
                    </td>
                    <td className="py-2 px-4">
                      <span className={u.is_active ? 'badge-green' : 'badge-red'}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-blue-600">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteMutation.mutate(u.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition text-gray-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-4 py-3 flex items-center justify-between bg-white border-t" style={{ borderColor: 'var(--brand-border)' }}>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Showing {users.length} of {data?.total || 0} users
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 transition"
                style={{ borderColor: 'var(--brand-border)' }}>
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold" style={{ color: 'var(--brand-navy)' }}>
                Page {page} of {Math.ceil((data?.total || 1) / perPage)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil((data?.total || 0) / perPage) || isLoading}
                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 transition"
                style={{ borderColor: 'var(--brand-border)' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Create User Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="card p-6 w-full max-w-md">
              <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--brand-navy)' }}>
                Create New User
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Full Name', key: 'full_name', placeholder: 'John Doe' },
                  { label: 'Email', key: 'email', placeholder: 'user@school.edu' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--brand-navy)' }}>
                      {f.label}
                    </label>
                    <input value={newUser[f.key]}
                      onChange={e => setNewUser(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                      style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--brand-navy)' }}>Role</label>
                  <select value={newUser.role}
                    onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }}>
                    {ROLES.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
                  </select>
                </div>
                {newUser.role === 'student' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--brand-navy)' }}>Session</label>
                      <select value={newUser.session_id}
                        onChange={e => setNewUser(p => ({ ...p, session_id: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }}>
                        <option value="">Select Session</option>
                        {sessionsData.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--brand-navy)' }}>Grade</label>
                        <select value={newUser.grade_id || ''}
                          onChange={e => setNewUser(p => ({ ...p, grade_id: e.target.value, class_id: '' }))}
                          className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                          style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }}>
                          <option value="">Select Grade</option>
                          {gradesData.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--brand-navy)' }}>Class Section</label>
                        <select value={newUser.class_id || ''}
                          onChange={e => setNewUser(p => ({ ...p, class_id: e.target.value }))}
                          disabled={!newUser.grade_id}
                          className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
                          style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }}>
                          <option value="">Select Section</option>
                          {classesData.map(c => (
                            <option key={c.id} value={c.id}>Section {c.section}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1 py-2.5 rounded-xl">
                  Cancel
                </button>
                <button onClick={() => {
                  const { grade_id, grade, section, session_id, ...payload } = newUser;
                  createMutation.mutate(payload);
                }}
                  disabled={createMutation.isLoading}
                  className="btn-primary flex-1 py-2.5 rounded-xl">
                  {createMutation.isLoading ? 'Creating…' : 'Create User'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Session Modal */}
        {/* {showSession && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="card p-6 w-full max-w-sm">
              <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--brand-navy)' }}>
                Create Academic Session
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--brand-navy)' }}>Institution Name</label>
                  <select value={newSession.institution_id}
                    onChange={e => setNewSession(p => ({ ...p, institution_id: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }}>
                    <option value="">Select Institution</option>
                    {(instData?.institutions || []).map(i => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--brand-navy)' }}>Academic Session</label>
                  <input type="text" value={newSession.name}
                    onChange={e => setNewSession(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. 2025-2026"
                    className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }} />
                </div>
                {[
                  { label: 'Start Date', key: 'start_date', type: 'date' },
                  { label: 'End Date', key: 'end_date', type: 'date' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--brand-navy)' }}>
                      {f.label}
                    </label>
                    <input type={f.type} value={newSession[f.key]}
                      onChange={e => setNewSession(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                      style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }} />
                  </div>
                ))}
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input type="checkbox" checked={newSession.is_active}
                    onChange={e => setNewSession(p => ({ ...p, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded text-orange-500 focus:ring-orange-300" />
                  <span className="text-sm font-medium" style={{ color: 'var(--brand-navy)' }}>Active Session</span>
                </label>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowSession(false)} className="btn-secondary flex-1 py-2 rounded-xl text-sm">
                  Cancel
                </button>
                <button onClick={() => sessionMutation.mutate(newSession)}
                  disabled={sessionMutation.isLoading}
                  className="btn-primary flex-1 py-2 rounded-xl text-sm">
                  {sessionMutation.isLoading ? 'Creating…' : 'Create Session'}
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </DashboardLayout>
  )
}
