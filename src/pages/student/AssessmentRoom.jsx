import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { Flag, ChevronLeft, ChevronRight, Cloud, Settings, HelpCircle,Clock } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function AssessmentRoom() {
  const { id: assessmentId } = useParams()
  const navigate = useNavigate()
  const [attemptId, setAttemptId] = useState(null)
  const [isStarting, setIsStarting] = useState(false)
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})        // { questionId: selectedOption }
  const [flagged, setFlagged] = useState(new Set())
  const [timeLeft, setTimeLeft] = useState(null)
  const [lastSaved, setLastSaved] = useState(null)
  const [questionStart, setQuestionStart] = useState(Date.now())
  const tabSwitches = useRef(0)
  const submitted = useRef(false)
  const answerMutation = useMutation(({ qId, ans }) =>
    api.post(`/assessments/attempt/${attemptId}/answer`, {
      question_id: qId, selected_answer: ans,
      time_spent_seconds: Math.floor((Date.now() - questionStart) / 1000)
    }))
  const submitMutation = useMutation(() =>
    api.post(`/assessments/attempt/${attemptId}/submit`, {
      proctoring_flags: { tab_switches: tabSwitches.current }
    }))

  const { data: assessment } = useQuery(['assessment', assessmentId], () =>
    api.get(`/assessments/${assessmentId}`).then(r => r.data),
    { enabled: !!assessmentId }
  )

  const handleStart = async () => {
    if (!assessmentId) return
    setIsStarting(true)
    try {
      const r = await api.post(`/assessments/${assessmentId}/start`, { is_practice: false })
      setAttemptId(r.data.attempt_id)
      if (r.data.questions) setQuestions(r.data.questions)
      setQuestionStart(Date.now())
    } catch (err) {
      toast.error('Could not start assessment')
    } finally {
      setIsStarting(false)
    }
  }

  // Timer
  useEffect(() => {
    if (!assessment?.duration_minutes || !attemptId) return
    setTimeLeft(assessment.duration_minutes * 60)
  }, [assessment, attemptId])

  useEffect(() => {
    if (timeLeft === null) return
    if (submitted.current) return          // Stop ticking after submission
    if (timeLeft <= 0) { handleSubmit(); return }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft])

  // Proctoring: tab switch detection
  useEffect(() => {
    const handler = () => { if (document.hidden) tabSwitches.current++ }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [])

  const selectAnswer = useCallback((questionId, option) => {
    setAnswers(p => ({ ...p, [questionId]: option }))
    if (attemptId) {
      answerMutation.mutate({ qId: questionId, ans: option }, {
        onSuccess: () => setLastSaved(new Date().toLocaleTimeString())
      })
    }
  }, [attemptId, answerMutation])

  const toggleFlag = (qId) => {
    setFlagged(p => { const s = new Set(p); s.has(qId) ? s.delete(qId) : s.add(qId); return s })
  }

  const handleSubmit = async () => {
    if (!attemptId) return
    if (submitted.current) return         // Prevent double-submit
    submitted.current = true
    setTimeLeft(null)                     // Clear timer immediately
    try {
      await submitMutation.mutateAsync()
      navigate(`/student/result/${attemptId}`)
    } catch {
      submitted.current = false           // Allow retry on failure
      toast.error('Submission failed. Please retry.')
    }
  }

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  if (!assessment) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p style={{ color: 'var(--text-secondary)' }}>Loading assessment…</p>
      </div>
    </div>
  )

  if (!attemptId) return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--brand-bg)' }}>
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--brand-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <p className="font-bold" style={{ color: 'var(--brand-navy)' }}>Assessment Instructions</p>
        </div>
        <button onClick={() => navigate(-1)} className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
          <ChevronLeft size={16} /> Back to Dashboard
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border" style={{ borderColor: 'var(--brand-border)' }}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-navy)' }}>{assessment.title}</h1>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{assessment.subject || 'General Assessment'}</p>
              </div>
              <div className="text-right">
                <span className="badge-orange">{assessment.difficulty || 'Intermediate'}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-center">
                <Clock className="mx-auto mb-1 text-orange-500" size={20} />
                <p className="text-xs font-bold text-orange-700 uppercase">Duration</p>
                <p className="text-lg font-bold text-orange-600">{assessment.duration_minutes} Min</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                <HelpCircle className="mx-auto mb-1 text-blue-500" size={20} />
                <p className="text-xs font-bold text-blue-700 uppercase">Questions</p>
                <p className="text-lg font-bold text-blue-600">{assessment.questions?.length || 0}</p>
              </div>
              <div className="p-4 rounded-2xl bg-green-50 border border-green-100 text-center">
                <Settings className="mx-auto mb-1 text-green-500" size={20} />
                <p className="text-xs font-bold text-green-700 uppercase">Total Marks</p>
                <p className="text-lg font-bold text-green-600">{assessment.total_marks || 0}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--brand-navy)' }}>Exam Instructions</h3>
              <ul className="space-y-3">
                {[
                  'Ensure you have a stable internet connection.',
                  'Once started, the timer cannot be paused.',
                  'Do not switch tabs or minimize the browser window.',
                  'The assessment will automatically submit when time expires.',
                  'Make sure your camera is positioned correctly for proctoring.'
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                      {i + 1}
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleStart}
              disabled={isStarting}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg transition shadow-lg hover:shadow-orange-200/50 flex items-center justify-center gap-3"
              style={{ background: 'var(--brand-orange)' }}
            >
              {isStarting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Starting Assessment...
                </>
              ) : (
                <>Start Assessment <ChevronRight size={20} /></>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )

  const allQuestions = questions.length > 0 ? questions : (assessment.questions || [])
  const q = allQuestions[currentQ]
  const timeWarning = timeLeft !== null && timeLeft < 300

  return (
    <div className="min-h-screen" style={{ background: 'var(--brand-bg)' }}>
      {/* Topbar */}
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between"
        style={{ borderColor: 'var(--brand-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--brand-navy)' }}>Assessment</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{assessment.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Settings size={20} style={{ color: 'var(--text-secondary)' }} className="cursor-pointer" />
          <HelpCircle size={20} style={{ color: 'var(--text-secondary)' }} className="cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-gray-300" />
        </div>
      </header>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Left Panel */}
        <aside className="w-72 bg-white border-r flex flex-col p-4 overflow-y-auto"
          style={{ borderColor: 'var(--brand-border)' }}>
          {/* Timer */}
          <div className={`rounded-2xl p-4 text-center mb-4 ${timeWarning ? 'bg-orange-50' : 'bg-orange-50'}`}>
            <p className="text-xs font-semibold mb-1 text-orange-700">TIME REMAINING</p>
            <p className={`text-4xl font-extrabold ${timeWarning ? 'timer-warning' : 'text-orange-500'}`}>
              {timeLeft !== null ? fmtTime(timeLeft) : '--:--'}
            </p>
          </div>

          {/* Student Info */}
          <div className="rounded-xl p-3 mb-4" style={{ background: 'var(--brand-bg)' }}>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Student Information
            </p>
          </div>

          {/* Question Grid */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-2">
              <span className="font-semibold" style={{ color: 'var(--brand-navy)' }}>QUESTION GRID</span>
              <span style={{ color: 'var(--brand-orange)' }}>
                {Object.keys(answers).length} / {allQuestions.length} Completed
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {allQuestions.map((_, i) => {
                const qId = allQuestions[i]?.id
                const answered = answers[qId]
                const isFlagged = flagged.has(qId)
                const isCurrent = i === currentQ
                return (
                  <button key={i} onClick={() => { setCurrentQ(i); setQuestionStart(Date.now()) }}
                    className="w-10 h-10 rounded-lg text-sm font-semibold transition"
                    style={{
                      background: isCurrent ? 'var(--brand-orange)' :
                                  isFlagged ? '#FEF3C7' :
                                  answered ? '#DCFCE7' : 'var(--brand-bg)',
                      color: isCurrent ? 'white' : isFlagged ? '#92400E' :
                             answered ? '#166534' : 'var(--brand-navy)',
                      border: `1.5px solid ${isCurrent ? 'var(--brand-orange)' : 'var(--brand-border)'}`,
                      position: 'relative'
                    }}>
                    {i + 1}
                    {isFlagged && <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Rules */}
          <div className="mt-auto rounded-xl p-3" style={{ background: '#F0EEFF' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--brand-purple)' }}>
              ASSESSMENT RULES
            </p>
            {['Do not refresh the page.', 'External calculators are prohibited.',
              'Camera must remain ON at all times.'].map(r => (
              <p key={r} className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>• {r}</p>
            ))}
          </div>
        </aside>

        {/* Main Question Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {q ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="badge-orange">Question {currentQ + 1} of {allQuestions.length}</span>
                  <button onClick={() => toggleFlag(q.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border font-medium text-sm transition"
                    style={{
                      borderColor: flagged.has(q.id) ? 'var(--brand-orange)' : 'var(--brand-border)',
                      color: flagged.has(q.id) ? 'var(--brand-orange)' : 'var(--text-secondary)',
                      background: flagged.has(q.id) ? 'var(--brand-orange-pale)' : 'white'
                    }}>
                    <Flag size={15} /> Flag for Review
                  </button>
                </div>

                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--brand-navy)' }}>
                  {assessment.title}
                </h2>

                {/* Question */}
                <div className="card p-6 mb-5">
                  <p className="text-base mb-4 font-semibold" style={{ color: 'var(--brand-navy)' }}>
                    {q.question || q.question_text}
                  </p>

                  {/* MCQ & True/False Options */}
                  {(q.type === 'mcq' || q.type === 'true_false' || q.type === 'mcq_multiple') && (
                    <div className="space-y-3 mt-4">
                      {['A', 'B', 'C', 'D'].map(opt => {
                        const text = q[`option_${opt.toLowerCase()}`]
                        if (!text) return null
                        const isSelected = answers[q.id] === opt
                        return (
                          <button key={opt} onClick={() => selectAnswer(q.id, opt)}
                            className={`question-option w-full text-left ${isSelected ? 'selected' : ''}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className="font-medium mr-2" style={{ color: 'var(--brand-navy)' }}>
                              {opt})
                            </span>
                            <span style={{ color: 'var(--text-primary)' }}>{text}</span>
                            {isSelected && (
                              <span className="ml-auto" style={{ color: 'var(--brand-orange)' }}>✓</span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {q.type === 'short_answer' && (
                    <textarea
                      className="w-full mt-4 p-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }}
                      rows={4} placeholder="Type your answer here…"
                      value={answers[q.id] || ''}
                      onChange={e => selectAnswer(q.id, e.target.value)}
                    />
                  )}
                </div>

                {/* Autosave indicator */}
                {lastSaved && (
                  <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                    <Cloud size={12} className="inline mr-1" />
                    Response autosaved at {lastSaved}
                  </p>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p style={{ color: 'var(--text-muted)' }}>No questions available</p>
              </div>
            )}
          </div>

          {/* Bottom Nav */}
          <div className="bg-white border-t px-6 py-4 flex items-center justify-between"
            style={{ borderColor: 'var(--brand-border)' }}>
            <button onClick={() => { setCurrentQ(p => Math.max(0, p - 1)); setQuestionStart(Date.now()) }}
              disabled={currentQ === 0}
              className="btn-secondary flex items-center gap-2 disabled:opacity-40">
              <ChevronLeft size={16} /> Previous
            </button>

            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <Cloud size={16} className="text-purple-400" />
              All progress synced
            </div>

            {currentQ < questions.length - 1 ? (
              <button onClick={() => { setCurrentQ(p => p + 1); setQuestionStart(Date.now()) }}
                className="btn-primary flex items-center gap-2">
                Next Question <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit}
                disabled={submitMutation.isLoading}
                className="btn-primary bg-gray-900 hover:bg-gray-800 flex items-center gap-2"
                style={{ background: 'var(--brand-navy)' }}>
                {submitMutation.isLoading ? 'Submitting…' : 'Submit Assessment'}
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
