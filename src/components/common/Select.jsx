import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'

/* ── Single Select ─────────────────────────────────────────── */
export function Select({ label, placeholder = 'Select…', options = [], value, onChange, disabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const selected = options.find(o => String(o.value) === String(value))

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-navy)' }}>{label}</label>}
      <button type="button" onClick={() => !disabled && setOpen(o => !o)} disabled={disabled}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition focus:outline-none"
        style={{
          borderColor: open ? 'var(--brand-orange)' : 'var(--brand-border)',
          background: disabled ? '#f9fafb' : 'var(--brand-bg)',
          color: selected ? 'var(--brand-navy)' : 'var(--text-muted)',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}>
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--text-muted)' }} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 rounded-xl shadow-lg border overflow-hidden"
          style={{ background: 'white', borderColor: 'var(--brand-border)', maxHeight: 220, overflowY: 'auto' }}>
          {options.length === 0
            ? <div className="px-4 py-2.5 text-sm" style={{ color: 'var(--text-muted)' }}>No options</div>
            : options.map(o => (
              <button key={o.value} type="button"
                onClick={() => { onChange(o.value); setOpen(false) }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-orange-50 transition text-left"
                style={{ color: String(o.value) === String(value) ? 'var(--brand-orange)' : 'var(--brand-navy)' }}>
                {o.label}
                {String(o.value) === String(value) && <Check size={14} style={{ color: 'var(--brand-orange)' }} />}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

/* ── Multi Select ──────────────────────────────────────────── */
export function MultiSelect({ label, placeholder = 'Select multiple…', options = [], value = [], onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const selected = options.filter(o => value.includes(String(o.value)))

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle = (val) => {
    const strVal = String(val)
    onChange(value.includes(strVal) ? value.filter(v => v !== strVal) : [...value, strVal])
  }

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--brand-navy)' }}>{label}</label>}
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition focus:outline-none min-h-[48px]"
        style={{ borderColor: open ? 'var(--brand-orange)' : 'var(--brand-border)', background: 'var(--brand-bg)' }}>
        <div className="flex flex-wrap gap-1.5 flex-1 text-left">
          {selected.length === 0
            ? <span style={{ color: 'var(--text-muted)' }}>{placeholder}</span>
            : selected.map(o => (
              <span key={o.value} className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-lg"
                style={{ background: 'var(--brand-orange-pale)', color: 'var(--brand-orange)' }}>
                {o.label}
                <X size={10} onClick={e => { e.stopPropagation(); toggle(o.value) }} className="cursor-pointer" />
              </span>
            ))}
        </div>
        <ChevronDown size={16} className={`flex-shrink-0 ml-2 transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--text-muted)' }} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 rounded-xl shadow-lg border overflow-hidden"
          style={{ background: 'white', borderColor: 'var(--brand-border)', maxHeight: 240, overflowY: 'auto' }}>
          {options.map(o => {
            const isSelected = value.includes(String(o.value))
            return (
              <button key={o.value} type="button" onClick={() => toggle(o.value)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-orange-50 transition text-left"
                style={{ color: isSelected ? 'var(--brand-orange)' : 'var(--brand-navy)' }}>
                <div className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                  {isSelected && <Check size={10} color="white" strokeWidth={3} />}
                </div>
                {o.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
