// AssessmentResult.jsx
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import api from '../../utils/api'
import { CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react'

export default function AssessmentResult() {
  const { attemptId } = useParams()
  const navigate = useNavigate()
  const { data: result, isLoading } = useQuery(['result', attemptId],
    () => api.get(`/assessments/attempt/${attemptId}/result`).then(r => r.data))

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const passed = result?.passed
  const pct = result?.percentage || 0

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--brand-bg)' }}>
      <div className="max-w-2xl w-full">
        <div className="card p-8 text-center mb-5">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center
            ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
            {passed
              ? <CheckCircle size={40} className="text-green-500" />
              : <XCircle size={40} className="text-red-500" />}
          </div>
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--brand-navy)' }}>
            {passed ? 'Congratulations!' : 'Better luck next time!'}
          </h1>
          <p className="mb-5" style={{ color: 'var(--text-secondary)' }}>
            {passed ? 'You passed the assessment.' : 'You did not meet the passing criteria.'}
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl p-4" style={{ background: 'var(--brand-bg)' }}>
              <p className="text-2xl font-extrabold" style={{ color: 'var(--brand-orange)' }}>
                {pct.toFixed(1)}%
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Score</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'var(--brand-bg)' }}>
              <p className="text-2xl font-extrabold" style={{ color: 'var(--brand-navy)' }}>
                {result?.score}/{result?.total_marks}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Marks</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'var(--brand-bg)' }}>
              <p className={`text-2xl font-extrabold ${passed ? 'text-green-600' : 'text-red-500'}`}>
                {passed ? 'PASS' : 'FAIL'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Result</p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/student/dashboard')}
              className="btn-secondary flex items-center gap-2">
              <Home size={16} /> Dashboard
            </button>
            <button onClick={() => navigate(-1)}
              className="btn-primary flex items-center gap-2">
              <RotateCcw size={16} /> Retry Practice
            </button>
          </div>
        </div>

        {/* Answer Review */}
        {result?.answers && (
          <div className="card p-6">
            <h2 className="font-bold text-base mb-4" style={{ color: 'var(--brand-navy)' }}>
              Answer Review
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {result.answers.map((a, i) => (
                <div key={i} className={`rounded-xl p-4 ${a.is_correct ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-start gap-2">
                    {a.is_correct
                      ? <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      : <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />}
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--brand-navy)' }}>
                        {i + 1}. {a.question_text}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Your answer: <strong>{a.selected}</strong> · Correct: <strong>{a.correct}</strong>
                      </p>
                      {a.explanation && (
                        <p className="text-xs mt-1 italic" style={{ color: 'var(--text-muted)' }}>
                          {a.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
