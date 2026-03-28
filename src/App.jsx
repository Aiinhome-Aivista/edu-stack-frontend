import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import useAuthStore from './context/authStore'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Public
import LoginPage      from './pages/LoginPage'
import PublicHomePage from './pages/PublicHomePage'

// Director / Principal
import DirectorDashboard    from './pages/director/DirectorDashboard'
import PrincipalDashboard   from './pages/principal/PrincipalDashboard'

// Teacher pages
import TeacherDashboard  from './pages/teacher/TeacherDashboard'
import CreateAssessment  from './pages/teacher/CreateAssessment'
import TeacherSchedule   from './pages/teacher/TeacherSchedule'
import TeacherStudents   from './pages/teacher/TeacherStudents'
import TeacherAnalytics  from './pages/teacher/TeacherAnalytics'
import TeacherFees       from './pages/teacher/TeacherFees'

// Student pages
import StudentDashboard   from './pages/student/StudentDashboard'
import AssessmentRoom     from './pages/student/AssessmentRoom'
import AssessmentResult   from './pages/student/AssessmentResult'
import StudentFees        from './pages/student/StudentFees'
import StudentSchedule    from './pages/student/StudentSchedule'
import StudentPerformance from './pages/student/StudentPerformance'
import StudentTests       from './pages/student/StudentTests'

// Admin
import UserManagement      from './pages/admin/UserManagement'
import TeacherAssignments  from './pages/admin/TeacherAssignments'
import PromoteStudents     from './pages/admin/PromoteStudents'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user?.role))
    return <Navigate to="/unauthorized" replace />
  return children
}

const RoleDashboard = () => {
  const { user } = useAuthStore()
  const map = {
    director:  '/director/dashboard',
    principal: '/principal/dashboard',
    teacher:   '/teacher/dashboard',
    student:   '/student/dashboard',
    superadmin:'/admin/users',
    parent:    '/student/fees',
  }
  return <Navigate to={map[user?.role] || '/login'} replace />
}

import NotificationHandler from './components/common/NotificationHandler'

import BlogPage from './pages/common/BlogPage'
import CareersPage from './pages/common/CareersPage'
import CaseStudiesPage from './pages/common/CaseStudiesPage'
import ContactPage from './pages/common/ContactPage'
import HelpCenter from './pages/common/HelpCenter'
import PricingPage from './pages/common/PricingPage'
import PrivacyPage from './pages/common/PrivacyPage'
import SecurityPage from './pages/common/SecurityPage'
import SolutionsPage from './pages/common/SolutionsPage'
import TutorialsPage from './pages/common/TutorialsPage'
import VisionPage from './pages/common/VisionPage'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <NotificationHandler />
      <Routes>
      {/* Public */}
      <Route path="/"          element={<PublicHomePage />} />
      <Route path="/login"     element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />

      {/* Common Pages */}
      <Route path="/solutions" element={<SolutionsPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/case-studies" element={<CaseStudiesPage />} />
      <Route path="/security" element={<SecurityPage />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/tutorials" element={<TutorialsPage />} />
      <Route path="/vision" element={<VisionPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* Director */}
      <Route path="/director/dashboard"
        element={<ProtectedRoute allowedRoles={['director','superadmin']}><DirectorDashboard /></ProtectedRoute>} />

      {/* Principal */}
      <Route path="/principal/dashboard"
        element={<ProtectedRoute allowedRoles={['principal','superadmin']}><PrincipalDashboard /></ProtectedRoute>} />

      {/* Teacher — all sidebar routes */}
      <Route path="/teacher/dashboard"
        element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/schedule"
        element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSchedule /></ProtectedRoute>} />
      <Route path="/teacher/assessment/create"
        element={<ProtectedRoute allowedRoles={['teacher','superadmin']}><CreateAssessment /></ProtectedRoute>} />
      <Route path="/teacher/students"
        element={<ProtectedRoute allowedRoles={['teacher']}><TeacherStudents /></ProtectedRoute>} />
      <Route path="/teacher/analytics"
        element={<ProtectedRoute allowedRoles={['teacher']}><TeacherAnalytics /></ProtectedRoute>} />
      <Route path="/teacher/fees"
        element={<ProtectedRoute allowedRoles={['teacher']}><TeacherFees /></ProtectedRoute>} />

      {/* Student — all sidebar routes */}
      <Route path="/student/dashboard"
        element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/schedule"
        element={<ProtectedRoute allowedRoles={['student']}><StudentSchedule /></ProtectedRoute>} />
      <Route path="/student/performance"
        element={<ProtectedRoute allowedRoles={['student']}><StudentPerformance /></ProtectedRoute>} />
      <Route path="/student/assessments"
        element={<ProtectedRoute allowedRoles={['student']}><StudentTests /></ProtectedRoute>} />
      <Route path="/student/assessment/:id"
        element={<ProtectedRoute allowedRoles={['student']}><AssessmentRoom /></ProtectedRoute>} />
      <Route path="/student/result/:attemptId"
        element={<ProtectedRoute allowedRoles={['student']}><AssessmentResult /></ProtectedRoute>} />
      <Route path="/student/fees"
        element={<ProtectedRoute allowedRoles={['student','parent']}><StudentFees /></ProtectedRoute>} />

      {/* Admin / Principal — user management + assignments */}
      <Route path="/admin/users"
        element={<ProtectedRoute allowedRoles={['superadmin','director','principal']}><UserManagement /></ProtectedRoute>} />
      <Route path="/admin/teacher-assignments"
        element={<ProtectedRoute allowedRoles={['superadmin','director','principal']}><TeacherAssignments /></ProtectedRoute>} />
      <Route path="/admin/promote-students"
        element={<ProtectedRoute allowedRoles={['superadmin']}><PromoteStudents /></ProtectedRoute>} />

      {/* Unauthorized */}
      <Route path="/unauthorized" element={
        <div className="flex items-center justify-center h-screen" style={{background:'var(--brand-bg)'}}>
          <div className="card p-10 text-center">
            <p className="text-5xl mb-4">🚫</p>
            <h1 className="text-xl font-bold" style={{color:'var(--brand-navy)'}}>Access Denied</h1>
            <p className="text-sm mt-2 mb-5" style={{color:'var(--text-muted)'}}>You don't have permission to view this page.</p>
            <button onClick={()=>window.history.back()} className="btn-primary px-6 py-2.5 rounded-xl text-sm">
              Go Back
            </button>
          </div>
        </div>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}
