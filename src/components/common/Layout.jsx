import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../context/authStore'
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../../utils/api'
import { formatRelativeTime } from '../../utils/dateUtils'
import {
  LayoutDashboard, Calendar, BarChart2, Users, FileText,
  IndianRupee, Bell, Settings, HelpCircle, LogOut, BookOpen, UserCheck, ClipboardList,
  CreditCard, AlertCircle, CheckCircle2,
} from 'lucide-react'

const NAV_ITEMS = {
  director: [
    { icon: LayoutDashboard, to: '/director/dashboard', label: 'Dashboard' },
    { icon: IndianRupee, to: '/director/finance', label: 'Finance' },
    { icon: BarChart2, to: '/director/analytics', label: 'Analytics' },
    { icon: Users, to: '/admin/users', label: 'Users' },
    { icon: UserCheck, to: '/admin/teacher-assignments', label: 'Assignments' },
  ],
  principal: [
    { icon: LayoutDashboard, to: '/principal/dashboard', label: 'Dashboard' },
    { icon: BarChart2, to: '/principal/analytics', label: 'Analytics' },
    { icon: Users, to: '/admin/users', label: 'Users' },
    { icon: UserCheck, to: '/admin/teacher-assignments', label: 'Assignments' },
    { icon: FileText, to: '/principal/reports', label: 'Reports' },
  ],
  teacher: [
    { icon: LayoutDashboard, to: '/teacher/dashboard', label: 'Dashboard' },
    { icon: Calendar, to: '/teacher/schedule', label: 'Schedule' },
    { icon: FileText, to: '/teacher/assessment/create', label: 'New Test' },
    { icon: Users, to: '/teacher/students', label: 'Students' },
    { icon: BarChart2, to: '/teacher/analytics', label: 'Analytics' },
    { icon: IndianRupee, to: '/teacher/fees', label: 'Fees' },
  ],
  student: [
    { icon: LayoutDashboard, to: '/student/dashboard', label: 'Dashboard' },
    { icon: Calendar, to: '/student/schedule', label: 'Schedule' },
    { icon: BarChart2, to: '/student/performance', label: 'Performance' },
    { icon: FileText, to: '/student/assessments', label: 'Tests' },
    { icon: IndianRupee, to: '/student/fees', label: 'Fees' },
  ],
  superadmin: [
    { icon: LayoutDashboard, to: '/admin/users', label: 'Users' },
    { icon: UserCheck, to: '/admin/teacher-assignments', label: 'Assignments' },
    { icon: Users, to: '/admin/promote-students', label: 'Promote Students' },
    { icon: BarChart2, to: '/director/dashboard', label: 'Analytics' },
  ]
}

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const role = user?.role || 'student'
  const navItems = NAV_ITEMS[role] || NAV_ITEMS.student

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav className="sidebar">
      {/* Logo */}
      <div className="mb-4 flex items-center justify-center w-10 h-10 rounded-xl"
        style={{ background: 'var(--brand-orange)' }}>
        <BookOpen size={20} color="white" />
      </div>

      {navItems.map(({ icon: Icon, to, label }) => (
        <NavLink key={to} to={to}
          className={({ isActive }) =>
            `sidebar-icon ${isActive ? 'active' : ''}`}
          title={label}>
          <Icon size={20} />
        </NavLink>
      ))}

      <div className="mt-auto flex flex-col gap-1">
        <button className="sidebar-icon" title="Help"><HelpCircle size={20} /></button>
        <button className="sidebar-icon" title="Settings"><Settings size={20} /></button>
        <button className="sidebar-icon" title="Logout" onClick={handleLogout}>
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  )
}

export function Topbar({ title, subtitle }) {
  const navigate = useNavigate()
  const { user, profile } = useAuthStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const fetchNotifications = async (p = 1, append = false) => {
    if (isFetchingMore) return
    if (p > 1) setIsFetchingMore(true)
    try {
      const res = await getNotifications(p)
      const newNotifs = res.data.notifications || []
      if (append) {
        setNotifications(prev => [...prev, ...newNotifs])
      } else {
        setNotifications(newNotifs)
      }
      setUnreadCount(res.data.unread_count || 0)
      setHasMore(newNotifs.length > 0)
      setPage(p)
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setIsFetchingMore(false)
    }
  }

  useEffect(() => {
    fetchNotifications(1)
    const interval = setInterval(() => fetchNotifications(1), 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 50 && hasMore && !isFetchingMore) {
      fetchNotifications(page + 1, true)
    }
  }

  const getIcon = (type) => {
    const maps = {
      assessment: { icon: <Calendar size={14} className="text-blue-600" />, bg: 'bg-blue-50' },
      fee: { icon: <CreditCard size={14} className="text-green-600" />, bg: 'bg-green-50' },
      system: { icon: <AlertCircle size={14} className="text-orange-600" />, bg: 'bg-orange-50' },
    }
    const match = maps[type] || { icon: <Bell size={14} className="text-gray-600" />, bg: 'bg-gray-50' }
    return match
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead()
      // Refresh notifications to update local state
      const res = await getNotifications(1)
      setNotifications(res.data.notifications || [])
      setUnreadCount(res.data.unread_count || 0)
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  const handleNotificationClick = async (n) => {
    try {
      if (!n.is_read) {
        await markNotificationRead(n.id)
        const res = await getNotifications(1)
        setNotifications(res.data.notifications || [])
        setUnreadCount(res.data.unread_count || 0)
      }

      // Navigate based on type
      if (n.type === 'assessment') {
        navigate('/student/assessments')
      } else if (n.type === 'fee') {
        navigate('/student/fees')
      }
      setShowNotifications(false)
    } catch (err) {
      console.error('Failed to handle notification click:', err)
    }
  }

  return (
    <header className="topbar">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold" style={{ color: 'var(--brand-navy)' }}>
            Welcome <span style={{ color: 'var(--brand-navy)' }}>{profile?.full_name?.split(' ')[0] || user?.email}!</span>
          </span>
        </div>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {title && <span className="text-xs font-semibold mt-0.5" style={{ color: 'var(--brand-purple)' }}>{title}</span>} | {subtitle}
          </p>
        )}
      </div>

      {/* Center logo */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1.5">
          <BookOpen size={22} className="text-orange-500" />
          <span className="font-bold text-lg" style={{ color: 'var(--brand-navy)' }}>
            Edu<span style={{ color: 'var(--brand-orange)' }}>Stack</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-xl hover:bg-gray-100 transition active:scale-95 group">
          <Bell size={20} className="transition-colors group-hover:text-orange-500" style={{ color: 'var(--text-secondary)' }} />
          {unreadCount > 0 && (
            <span className="absolute top-0 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-white animate-in zoom-in duration-300">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border z-50 overflow-hidden animate-in fade-in zoom-in duration-200"
            style={{ borderColor: 'var(--brand-border)' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--brand-border)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--brand-navy)' }}>Notifications</h3>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5 opacity-60">
                  <div className="w-2.5 h-2.5 rounded bg-gray-200 border border-gray-300 shadow-sm" />
                  <span className="text-[10px] font-bold text-gray-500">READ ({Math.max(0, notifications.length - unreadCount)})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded shadow-sm" style={{ background: 'var(--brand-orange-pale)', border: '1px solid var(--brand-orange)' }} />
                  <span className="text-[10px] font-extrabold" style={{ color: 'var(--brand-orange)' }}>UNREAD ({unreadCount})</span>
                </div>
              </div>
            </div>
            <div
              onScroll={handleScroll}
              className="max-h-[350px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => {
                  const { icon, bg } = getIcon(n.type)
                  return (
                    <div key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-4 hover:bg-gray-100 transition border-b last:border-0 cursor-pointer group ${!n.is_read ? 'bg-orange-50' : 'bg-gray-100/60'}`}
                      style={{ borderColor: 'var(--brand-border)' }}>
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${bg} group-hover:bg-white border transition`}
                          style={{ borderColor: 'var(--brand-border)' }}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <div className="flex items-center gap-1.5 truncate">
                              {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />}
                              <p className={`text-xs truncate ${!n.is_read ? 'font-extrabold' : 'font-medium opacity-60'}`} style={{ color: 'var(--brand-navy)' }}>{n.title}</p>
                            </div>
                            <span className="text-[10px] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                              {formatRelativeTime(n.created_at)}
                            </span>
                          </div>
                          <p className={`text-[11px] leading-relaxed line-clamp-2 ${!n.is_read ? 'font-semibold' : 'opacity-50'}`}
                            style={{ color: 'var(--brand-navy)' }}>
                            {n.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <p className="text-xs">No new notifications</p>
                </div>
              )}
              {isFetchingMore && (
                <div className="p-4 text-center">
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              )}
            </div>
            <div className="p-3 bg-gray-50/50 text-center border-t" style={{ borderColor: 'var(--brand-border)' }}>
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold hover:underline" style={{ color: 'var(--brand-navy)' }}>
                Mark all as read
              </button>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer"
          style={{ borderColor: 'var(--brand-border)' }}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-blue-500
                          flex items-center justify-center text-white text-xs font-bold">
            {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--brand-navy)' }}>
            {profile?.full_name?.split(' ')[0] || 'User'}
          </span>
        </div>
      </div>
    </header>
  )
}

export function StatCard({ label, value, subtext, trend, color = 'orange', icon: Icon }) {
  const colors = {
    orange: { bg: '#FFF0EB', text: 'var(--brand-orange)' },
    purple: { bg: '#EEF0FF', text: 'var(--brand-purple)' },
    green: { bg: '#F0FDF4', text: '#16A34A' },
    yellow: { bg: '#FEF9C3', text: '#D97706' }
  }
  const c = colors[color] || colors.orange
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="stat-label">{label}</p>
        </div>
        {Icon && (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: c.bg }}>
            <Icon size={18} style={{ color: c.text }} />
          </div>
        )}
      </div>
      <p className="text-3xl font-extrabold mt-1" style={{ color: 'var(--brand-navy)' }}>
        {value}
      </p>
      {(subtext || trend) && (
        <div className="flex items-center gap-2 mt-2">
          {trend && (
            <span className={`text-xs font-semibold ${trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
              {trend}
            </span>
          )}
          {subtext && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtext}</span>}
        </div>
      )}
    </div>
  )
}

export function DashboardLayout({ children, title, subtitle }) {
  return (
    <div className="main-layout wave-bg">
      <Sidebar />
      <Topbar title={title} subtitle={subtitle} />
      <main className="p-6">{children}</main>
    </div>
  )
}
