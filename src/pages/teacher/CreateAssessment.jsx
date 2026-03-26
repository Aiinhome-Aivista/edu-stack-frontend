import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/common/Layout'
import { Select, MultiSelect } from '../../components/common/Select'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { Sparkles, RefreshCw, Save, ArrowRight, CheckCircle, Trash2, Eye, EyeOff, Send } from 'lucide-react'

const DIFFICULTY = [
  { value: 'beginner', label: '🟢 Easy', desc: 'Recall & basic understanding' },
  { value: 'intermediate', label: '🟡 Moderate', desc: 'Application & analysis' },
  { value: 'advanced', label: '🔴 Difficult', desc: 'Synthesis & evaluation' },
]
const Q_TYPES = [
  { id: 'mcq', label: 'MCQs', desc: 'Auto-graded single choice' },
  { id: 'true_false', label: 'True / False', desc: 'Quick logic verification' },
  { id: 'short_answer', label: 'Short Answer', desc: 'Manual review required' },
]

export default function CreateAssessment() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [form, setForm] = useState({
    title: '', instructions: '', grade_id: '', class_id: '',
    subject_ids: [], chapter_id: '', topic_ids: [],
    difficulty: 'intermediate', duration_minutes: 60,
    total_marks: 100, passing_marks: 35,
    proctoring_enabled: true, scheduled_at: '',
  })
  const [qTypes, setQTypes] = useState(['mcq'])
  const [qCount, setQCount] = useState(10)
  const [step, setStep] = useState('form')    // form | generating | publishing | published
  const [assessmentId, setAssessmentId] = useState(null)
  const [questionCount, setQuestionCount] = useState(0)  // just the count, not the questions themselves
  const [showAnswers, setShowAnswers] = useState(false)  // teacher can toggle to see answers

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  // ── Data fetches ─────────────────────────────────────────
  const { data: gradesData = [] } = useQuery('grades', () => api.get('/academic/grades').then(r => r.data))
  const { data: classesData = [] } = useQuery(['classes', form.grade_id],
    () => api.get(`/academic/classes?grade_id=${form.grade_id}`).then(r => r.data), { enabled: !!form.grade_id })
  const { data: subjectsData = [] } = useQuery(['subjects', form.grade_id],
    () => api.get(`/academic/subjects?grade_id=${form.grade_id}`).then(r => r.data), { enabled: !!form.grade_id })
  const { data: chaptersData = [] } = useQuery(['chapters', form.subject_ids[0]],
    () => api.get(`/academic/chapters?subject_id=${form.subject_ids[0]}`).then(r => r.data), { enabled: form.subject_ids.length > 0 })
  const { data: topicsData = [] } = useQuery(['topics', form.chapter_id],
    () => api.get(`/academic/topics?chapter_id=${form.chapter_id}`).then(r => r.data), { enabled: !!form.chapter_id })
  const { data: suggestionsData } = useQuery(['suggestions', form.subject_ids[0], form.class_id],
    () => api.get(`/ai/smart-suggestions/1?subject_id=${form.subject_ids[0]}&class_id=${form.class_id}`).then(r => r.data),
    { enabled: !!(form.subject_ids[0] && form.class_id) })

  // Teacher view of questions for a generated assessment (with optional answers)
  const { data: generatedQs = [], refetch: refetchQs } = useQuery(
    ['teacher-questions', assessmentId],
    () => api.get(`/assessments/${assessmentId}/questions`).then(r => r.data),
    { enabled: !!assessmentId && step === 'review' }
  )

  useEffect(() => { set('class_id', ''); set('subject_ids', []); set('chapter_id', ''); set('topic_ids', []) }, [form.grade_id])
  useEffect(() => { set('chapter_id', ''); set('topic_ids', []) }, [form.subject_ids.join(',')])

  const gradeOpts = gradesData.map(g => ({ value: String(g.id), label: g.name }))
  const sectionOpts = classesData.map(c => ({ value: String(c.id), label: `Section ${c.section}` }))
  const subjectOpts = subjectsData.map(s => ({ value: String(s.id), label: s.name }))
  const chapterOpts = chaptersData.map(c => ({ value: String(c.id), label: c.title }))
  const topicOpts = topicsData.map(t => ({ value: String(t.id), label: t.title }))
  const suggestions = suggestionsData?.suggestions || [
    { message: 'Include "Heisenberg Uncertainty Principle" questions', detail: 'Needs more reinforcement based on class data.' },
    { message: 'Reuse Top Performance MCQ from 2023 Finals', detail: 'Question had high discrimination power.' },
  ]

  // ── Mutations ─────────────────────────────────────────────
  const createMut = useMutation(d => api.post('/assessments/', d))
  const generateMut = useMutation(d => api.post('/ai/generate-questions', d, { timeout: 300000 }))
  const publishMut = useMutation(
    id => api.post(`/assessments/${id}/publish`),
    {
      onSuccess: () => {
        toast.success('Assessment published! Students can now see it.')
        qc.invalidateQueries('teacher-assessments')
        setStep('published')
      },
      onError: e => toast.error(e?.response?.data?.error || 'Publish failed')
    }
  )
  const deleteMut = useMutation(
    (qid) => api.delete(`/assessments/${assessmentId}/questions/${qid}`),
    { onSuccess: () => { toast.success('Question removed'); refetchQs() } }
  )

  // ── Generate handler ──────────────────────────────────────
  const handleGenerate = async () => {
    if (step === 'generating' || step === 'publishing') return // Prevent double-triggering
    if (!form.title) return toast.error('Assessment name is required')
    if (!form.class_id) return toast.error('Select a Grade and Section')
    if (!form.subject_ids.length) return toast.error('Select at least one Subject')

    setStep('generating')
    const tid = toast.loading('AI is crafting your questions…')
    try {
      // Step 1: Create assessment record
      const res = await createMut.mutateAsync({
        title: form.title, description: form.instructions,
        class_id: parseInt(form.class_id), subject_id: parseInt(form.subject_ids[0]),
        chapter_id: form.chapter_id ? parseInt(form.chapter_id) : null,
        topic_id: form.topic_ids[0] ? parseInt(form.topic_ids[0]) : null,
        difficulty: form.difficulty, duration_minutes: form.duration_minutes,
        total_marks: form.total_marks, passing_marks: form.passing_marks,
        proctoring_enabled: form.proctoring_enabled,
        scheduled_at: form.scheduled_at || null,
      })
      const aId = res.data.id
      setAssessmentId(aId)

      // Step 2: Generate questions — single API call with primary question type
      const qRes = await generateMut.mutateAsync({
        assessment_id: aId, subject_id: parseInt(form.subject_ids[0]),
        chapter_id: form.chapter_id ? parseInt(form.chapter_id) : null,
        topic_id: form.topic_ids[0] ? parseInt(form.topic_ids[0]) : null,
        grade_id: parseInt(form.grade_id) || 1,
        count: qCount,
        question_type: qTypes[0] || 'mcq',
        difficulty: form.difficulty,
      })
      const totalGenerated = qRes.data.questions?.length || 0
      setQuestionCount(totalGenerated)
      toast.dismiss(tid)

      // Step 3: Show publishing screen for at least for a mimnimum time
      setStep('publishing')
      const [publishRes] = await Promise.all([
        publishMut.mutateAsync(aId),
        new Promise(resolve => setTimeout(resolve, 6000))
      ])
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Generation failed')
      setStep('form')
    }
  }

  const handlePublish = () => {
    if (!assessmentId) return toast.error('No assessment to publish')
    publishMut.mutate(assessmentId)
  }

  // ── Render ─────────────────────────────────────────────────
  const stepLabels = ['Subject & Topic', 'Configuration', 'AI Suggestions']
  const activeStep = step === 'form' ? 0 : step === 'review' || step === 'generating' ? 2 : 2

  return (
    <DashboardLayout>
      <div className="mx-auto pb-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <button onClick={() => navigate('/teacher/dashboard')}
            className="w-9 h-9 rounded-xl border flex items-center justify-center hover:bg-gray-50"
            style={{ borderColor: 'var(--brand-border)' }}>←</button>
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: 'var(--brand-navy)' }}>Create New Assessment</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Make assessment sheets for your classes with AI assistance.</p>
          </div>
          <div className="ml-auto flex gap-1 p-1 rounded-xl" style={{ background: 'var(--brand-border)' }}>
            {stepLabels.map((t, i) => (
              <div key={t} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition
                ${i === activeStep ? 'bg-white shadow' : ''}`}
                style={{ color: 'var(--brand-navy)' }}>{t}</div>
            ))}
          </div>
        </div>

        {/* ── PUBLISHED SUCCESS ── */}
        {step === 'published' && (
          <div className="card p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--brand-navy)' }}>Assessment Published!</h2>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
              Your assessment is now visible to students in the assigned class.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate('/teacher/dashboard')}
                className="btn-secondary px-6 py-3 rounded-xl">← Dashboard</button>
              <button onClick={() => { setStep('form'); setAssessmentId(null); setQuestionCount(0); setForm({ title: '', instructions: '', grade_id: '', class_id: '', subject_ids: [], chapter_id: '', topic_ids: [], difficulty: 'intermediate', duration_minutes: 60, total_marks: 100, passing_marks: 35, proctoring_enabled: true, scheduled_at: '' }) }}
                className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2">
                <Sparkles size={15} /> Create Another
              </button>
            </div>
          </div>
        )}

        {/* ── GENERATING SCREEN ── */}
        {step === 'generating' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-orange-100" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={32} style={{ color: 'var(--brand-orange)' }} />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--brand-navy)' }}>Generating Questions…</h2>
            <p className="text-sm max-w-sm" style={{ color: 'var(--text-muted)' }}>
              AI is crafting your assessment questions. This may take a few minutes. Please wait.
            </p>
          </div>
        )}

        {/* ── PUBLISHING SCREEN ── */}
        {step === 'publishing' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-green-100" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Send size={32} style={{ color: '#16A34A' }} />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--brand-navy)' }}>Publishing Assessment…</h2>
            <p className="text-sm max-w-sm" style={{ color: 'var(--text-muted)' }}>
              Almost done! We're making your assessment available to students now.
            </p>
          </div>
        )}

        {step !== 'published' && step !== 'generating' && step !== 'publishing' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">

              {/* ── FORM ── */}
              {step === 'form' && (
                <>
                  {/* Subject & Topic */}
                  <div className="card p-6">
                    <h2 className="font-bold text-base mb-4" style={{ color: 'var(--brand-navy)' }}>Subject & Topic</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-navy)' }}>
                          Assessment Name <span className="text-red-500">*</span>
                        </label>
                        <input value={form.title} onChange={e => set('title', e.target.value)}
                          placeholder="e.g. Mid-term Quantum Mechanics"
                          className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                          style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Select label="Grade *" placeholder="Select grade…" options={gradeOpts}
                          value={form.grade_id} onChange={v => set('grade_id', v)} />
                        <Select label="Class Section *" placeholder="Select section…" options={sectionOpts}
                          value={form.class_id} onChange={v => set('class_id', v)} disabled={!form.grade_id} />
                      </div>
                      <MultiSelect label="Subject(s) *" placeholder="Select subjects…"
                        options={subjectOpts} value={form.subject_ids} onChange={v => set('subject_ids', v)} />
                      {!form.grade_id && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>↑ Select a grade first to load subjects</p>}
                      {form.subject_ids.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                          <Select label="Chapter" placeholder="Select chapter…" options={chapterOpts}
                            value={form.chapter_id} onChange={v => set('chapter_id', v)} />
                          <MultiSelect label="Topics" placeholder="Select topics…"
                            options={topicOpts} value={form.topic_ids} onChange={v => set('topic_ids', v)} />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-navy)' }}>Instructions for Students</label>
                        <textarea rows={3} value={form.instructions} onChange={e => set('instructions', e.target.value)}
                          placeholder="e.g. Calculators are not permitted. All the best!"
                          className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                          style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }} />
                      </div>
                    </div>
                  </div>

                  {/* Configuration */}
                  <div className="card p-6">
                    <h2 className="font-bold text-base mb-4" style={{ color: 'var(--brand-navy)' }}>Configuration</h2>
                    <div className="space-y-5">
                      {/* Difficulty */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--brand-navy)' }}>Difficulty Level</label>
                        <div className="grid grid-cols-3 gap-3">
                          {DIFFICULTY.map(d => (
                            <button key={d.value} type="button" onClick={() => set('difficulty', d.value)}
                              className="rounded-xl p-3 border text-left transition"
                              style={{
                                borderColor: form.difficulty === d.value ? 'var(--brand-orange)' : 'var(--brand-border)',
                                background: form.difficulty === d.value ? 'var(--brand-orange-pale)' : 'white',
                              }}>
                              <p className="font-semibold text-sm" style={{ color: 'var(--brand-navy)' }}>{d.label}</p>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{d.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Question Types */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--brand-navy)' }}>
                          Question Types <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>(select multiple)</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {Q_TYPES.map(qt => {
                            const sel = qTypes.includes(qt.id)
                            return (
                              <button key={qt.id} type="button"
                                onClick={() => setQTypes(p => sel ? p.filter(x => x !== qt.id) : [...p, qt.id])}
                                className="rounded-xl p-3 border text-left transition"
                                style={{
                                  borderColor: sel ? 'var(--brand-orange)' : 'var(--brand-border)',
                                  background: sel ? 'var(--brand-orange-pale)' : 'white',
                                }}>
                                <div className="flex items-center gap-2 mb-1">
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0
                                    ${sel ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                                    {sel && <CheckCircle size={10} color="white" strokeWidth={3} />}
                                  </div>
                                  <span className="font-semibold text-sm" style={{ color: 'var(--brand-navy)' }}>{qt.label}</span>
                                </div>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{qt.desc}</p>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      {/* Counts */}
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'No. of Questions', val: qCount, onChange: v => setQCount(Number(v)), min: 5, max: 50 },
                          { label: 'Total Marks', val: form.total_marks, onChange: v => set('total_marks', Number(v)), min: 10, max: 500 },
                          { label: 'Passing Marks', val: form.passing_marks, onChange: v => set('passing_marks', Number(v)), min: 1, max: form.total_marks },
                        ].map(f => (
                          <div key={f.label}>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-navy)' }}>{f.label}</label>
                            <input type="number" min={f.min} max={f.max} value={f.val} onChange={e => f.onChange(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                              style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-bg)' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── REVIEW: show question count, hide answers by default ── */}
              {step === 'review' && (
                <div className="card p-6">
                  {/* Summary banner */}
                  <div className="rounded-xl p-4 mb-5 flex items-center gap-4"
                    style={{ background: 'linear-gradient(135deg,#1E2B6F 0%,#6B5ECD 100%)' }}>
                    <div className="text-3xl">📋</div>
                    <div className="flex-1">
                      <p className="font-extrabold text-white text-lg">{questionCount} Questions Generated</p>
                      <p className="text-white/70 text-sm">"{form.title}" · {form.difficulty} · {form.duration_minutes} min</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white text-xl">{form.total_marks}</p>
                      <p className="text-white/70 text-xs">Total Marks</p>
                    </div>
                  </div>

                  {/* Teacher preview toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-base" style={{ color: 'var(--brand-navy)' }}>
                      Question Preview (Teacher View)
                    </h2>
                    <div className="flex items-center gap-2">
                      <button onClick={handleGenerate} disabled={step === 'generating'}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                        style={{ color: 'var(--brand-orange)', background: 'var(--brand-orange-pale)' }}>
                        <RefreshCw size={12} /> Regenerate
                      </button>
                      <button onClick={() => setShowAnswers(p => !p)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition"
                        style={{ borderColor: 'var(--brand-border)', color: 'var(--brand-navy)' }}>
                        {showAnswers ? <><EyeOff size={12} /> Hide Answers</> : <><Eye size={12} /> Show Answers</>}
                      </button>
                    </div>
                  </div>

                  {/* Question list — answers hidden by default */}
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {generatedQs.length === 0 ? (
                      <div className="py-10 text-center">
                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading questions…</p>
                      </div>
                    ) : generatedQs.map((q, i) => (
                      <div key={q.id} className="rounded-xl p-4 border" style={{ background: 'var(--brand-bg)', borderColor: 'var(--brand-border)' }}>
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: 'var(--brand-orange-pale)', color: 'var(--brand-orange)' }}>
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm mb-2" style={{ color: 'var(--brand-navy)' }}>{q.text}</p>

                            {/* Options */}
                            {q.option_a && ['A', 'B', 'C', 'D'].map(k => {
                              const optVal = q[`option_${k.toLowerCase()}`]
                              if (!optVal) return null
                              const isCorrect = q.correct_answer === k
                              return (
                                <div key={k} className={`flex items-center gap-2 text-xs py-1 px-2 rounded-lg mb-1 ${showAnswers && isCorrect ? 'bg-green-50' : ''}`}>
                                  <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold flex-shrink-0
                                    ${showAnswers && isCorrect ? 'bg-green-500 text-white' :
                                      showAnswers ? 'bg-gray-100 text-gray-500' : 'bg-gray-100 text-gray-500'}`}>
                                    {k}
                                  </span>
                                  <span style={{ color: showAnswers && isCorrect ? '#16A34A' : 'var(--text-secondary)' }}>
                                    {optVal}
                                  </span>
                                  {showAnswers && isCorrect && <span className="text-green-600 font-bold ml-auto">✓ Correct</span>}
                                </div>
                              )
                            })}

                            {/* Explanation — only when answers shown */}
                            {showAnswers && q.explanation && (
                              <div className="mt-2 px-3 py-2 rounded-lg text-xs italic"
                                style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                                💡 {q.explanation}
                              </div>
                            )}

                            {/* Type badge */}
                            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
                              style={{ background: 'var(--brand-border)', color: 'var(--text-muted)' }}>
                              {q.type} · {q.marks} marks · {q.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Privacy notice */}
                  <div className="mt-4 p-3 rounded-xl flex items-start gap-2 text-xs"
                    style={{ background: '#F0FDF4', color: '#166534' }}>
                    <span className="mt-0.5 flex-shrink-0">🔒</span>
                    <span>
                      <strong>Student Privacy:</strong> Correct answers are hidden from students during the assessment.
                      Only you (the teacher) can view answers using the "Show Answers" toggle above.
                    </span>
                  </div>

                  {/* Publish button */}
                  <button onClick={handlePublish} disabled={publishMut.isLoading || generatedQs.length === 0}
                    className="btn-primary w-full mt-5 py-3.5 rounded-xl flex items-center justify-center gap-2 text-base"
                    style={{ opacity: (publishMut.isLoading || generatedQs.length === 0) ? 0.7 : 1 }}>
                    {publishMut.isLoading
                      ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Publishing…</>
                      : <><Send size={17} /> Publish Assessment to Students</>}
                  </button>
                </div>
              )}

              {/* Generating spinner */}
              {step === 'generating' && (
                <div className="card p-16 text-center">
                  <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="font-bold text-lg" style={{ color: 'var(--brand-navy)' }}>Generating Questions…</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>AI is crafting {qCount} {form.difficulty} questions</p>
                </div>
              )}
            </div>

            {/* RIGHT PANEL */}
            <div className="space-y-4">
              {/* Settings */}
              <div className="card p-5">
                <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--brand-navy)' }}>Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 py-2 border-b" style={{ borderColor: 'var(--brand-border)' }}>
                    <span className="text-xl">⏱</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>TIME LIMIT</p>
                      <input type="number" min={10} max={180} value={form.duration_minutes}
                        onChange={e => set('duration_minutes', Number(e.target.value))}
                        className="w-full px-2 py-1 rounded-lg border text-sm mt-0.5 focus:outline-none"
                        style={{ borderColor: 'var(--brand-border)' }} disabled={step === 'review'} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-2 border-b" style={{ borderColor: 'var(--brand-border)' }}>
                    <span className="text-xl">🏆</span>
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>TOTAL POINTS</p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--brand-navy)' }}>{form.total_marks} Points</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-2 border-b" style={{ borderColor: 'var(--brand-border)' }}>
                    <span className="text-xl">📅</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>SCHEDULE</p>
                      <input type="datetime-local" value={form.scheduled_at}
                        onChange={e => set('scheduled_at', e.target.value)}
                        className="w-full px-2 py-1 rounded-lg border text-xs mt-0.5 focus:outline-none"
                        style={{ borderColor: 'var(--brand-border)' }} disabled={step === 'review'} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🛡</span>
                      <div>
                        <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>PROCTORING</p>
                        <p className="text-sm font-semibold" style={{ color: 'var(--brand-navy)' }}>AI Enabled</p>
                      </div>
                    </div>
                    <button onClick={() => step !== 'review' && set('proctoring_enabled', !form.proctoring_enabled)}
                      className={`w-11 h-6 rounded-full relative transition-colors ${form.proctoring_enabled ? 'bg-orange-500' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form.proctoring_enabled ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg,#F05A28 0%,#FF8C5A 100%)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={17} color="white" />
                    <span className="font-bold text-white text-sm">AI Smart Suggestions</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {suggestions.map((s, i) => (
                    <div key={i} className="bg-white/20 rounded-xl p-3 hover:bg-white/30 transition cursor-pointer">
                      <p className="text-sm font-semibold text-white leading-tight">{s.message || s.topic_name}</p>
                      <p className="text-xs text-white/75 mt-0.5">{s.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              {step === 'form' && (
                <>
                  <button className="btn-secondary w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                    <Save size={14} /> Save Draft
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={step === 'generating'}
                    className={`btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm ${(step === 'generating' || step === 'review') ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    {step === 'generating' ? (
                      <><RefreshCw size={14} className="animate-spin" /> Generating...</>
                    ) : (
                      <><Sparkles size={14} /> Generate with AI <ArrowRight size={14} /></>
                    )}
                  </button>
                </>
              )}
              {step === 'review' && (
                <button onClick={() => navigate('/teacher/analytics')}
                  className="btn-secondary w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                  View Analytics
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
