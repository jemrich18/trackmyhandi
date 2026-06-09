import { useState } from 'react'
import type { RoundFormData } from '../types'
import { createRound } from '../api/rounds'

const today = () => new Date().toISOString().split('T')[0]

const EMPTY_FORM: RoundFormData = {
  score: '' as unknown as number,
  course_name: '',
  course_rating: '' as unknown as number,
  slope_rating: '' as unknown as number,
  date_played: today(),
  weather: null,
  wind_strength: null,
  green_speed: null,
  green_firmness: null,
  fairway_conditions: null,
  miss_category: null,
  notes: '',
}

interface Props {
  onSaved: () => void
  onCancel: () => void
}

export default function RoundForm({ onSaved, onCancel }: Props) {
  const [form, setForm] = useState<RoundFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)

  function set<K extends keyof RoundFormData>(key: K, value: RoundFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: [] }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})
    try {
      await createRound(form)
      onSaved()
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, string[]> } })?.response?.data
      if (data && typeof data === 'object') {
        setErrors(data)
      } else {
        setErrors({ non_field_errors: ['Something went wrong. Please try again.'] })
      }
    } finally {
      setSubmitting(false)
    }
  }

  function fieldError(key: string) {
    return errors[key]?.[0]
  }

  return (
    <form className="round-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Log a Round</h3>

      {errors.non_field_errors && (
        <p className="form-error-banner">{errors.non_field_errors[0]}</p>
      )}

      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Course Name *</label>
            <input
              className={`form-input ${fieldError('course_name') ? 'is-error' : ''}`}
              type="text"
              value={form.course_name}
              onChange={e => set('course_name', e.target.value)}
              placeholder="e.g. Pebble Beach"
              required
            />
            {fieldError('course_name') && <span className="field-error">{fieldError('course_name')}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Date Played *</label>
            <input
              className="form-input"
              type="date"
              value={form.date_played}
              onChange={e => set('date_played', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row form-row-3">
          <div className="form-group">
            <label className="form-label">Score *</label>
            <input
              className={`form-input ${fieldError('score') ? 'is-error' : ''}`}
              type="number"
              value={form.score === ('' as unknown as number) ? '' : form.score}
              onChange={e => set('score', Number(e.target.value))}
              min={40}
              max={200}
              required
            />
            {fieldError('score') && <span className="field-error">{fieldError('score')}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Course Rating *</label>
            <input
              className={`form-input ${fieldError('course_rating') ? 'is-error' : ''}`}
              type="number"
              step="0.1"
              value={form.course_rating === ('' as unknown as number) ? '' : form.course_rating}
              onChange={e => set('course_rating', Number(e.target.value))}
              min={55}
              max={85}
              required
            />
            {fieldError('course_rating') && <span className="field-error">{fieldError('course_rating')}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Slope Rating *</label>
            <input
              className={`form-input ${fieldError('slope_rating') ? 'is-error' : ''}`}
              type="number"
              value={form.slope_rating === ('' as unknown as number) ? '' : form.slope_rating}
              onChange={e => set('slope_rating', Number(e.target.value))}
              min={55}
              max={155}
              required
            />
            {fieldError('slope_rating') && <span className="field-error">{fieldError('slope_rating')}</span>}
          </div>
        </div>
      </div>

      <details className="form-section form-optional">
        <summary className="form-optional-toggle">Conditions (optional)</summary>
        <div className="form-row form-row-3">
          <div className="form-group">
            <label className="form-label">Weather</label>
            <select className="form-select" value={form.weather ?? ''} onChange={e => set('weather', (e.target.value || null) as RoundFormData['weather'])}>
              <option value="">—</option>
              <option value="sunny">Sunny</option>
              <option value="cloudy">Cloudy</option>
              <option value="windy">Windy</option>
              <option value="rainy">Rainy</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Wind</label>
            <select className="form-select" value={form.wind_strength ?? ''} onChange={e => set('wind_strength', (e.target.value || null) as RoundFormData['wind_strength'])}>
              <option value="">—</option>
              <option value="none">None</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="strong">Strong</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Green Speed</label>
            <select className="form-select" value={form.green_speed ?? ''} onChange={e => set('green_speed', (e.target.value || null) as RoundFormData['green_speed'])}>
              <option value="">—</option>
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Green Firmness</label>
            <select className="form-select" value={form.green_firmness ?? ''} onChange={e => set('green_firmness', (e.target.value || null) as RoundFormData['green_firmness'])}>
              <option value="">—</option>
              <option value="soft">Soft</option>
              <option value="normal">Normal</option>
              <option value="firm">Firm</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Fairway</label>
            <select className="form-select" value={form.fairway_conditions ?? ''} onChange={e => set('fairway_conditions', (e.target.value || null) as RoundFormData['fairway_conditions'])}>
              <option value="">—</option>
              <option value="wet">Wet</option>
              <option value="normal">Normal</option>
              <option value="dry">Dry</option>
              <option value="firm">Firm</option>
            </select>
          </div>
        </div>
      </details>

      <details className="form-section form-optional">
        <summary className="form-optional-toggle">Reflection (optional)</summary>
        <div className="form-group">
          <label className="form-label">Biggest Miss</label>
          <select className="form-select" value={form.miss_category ?? ''} onChange={e => set('miss_category', (e.target.value || null) as RoundFormData['miss_category'])}>
            <option value="">—</option>
            <option value="driving">Driving</option>
            <option value="iron_play">Iron Play</option>
            <option value="chipping">Chipping</option>
            <option value="putting">Putting</option>
            <option value="bunker">Bunker</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-textarea"
            value={form.notes ?? ''}
            onChange={e => set('notes', e.target.value)}
            rows={3}
            placeholder="Anything worth remembering about this round..."
          />
        </div>
      </details>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Round'}
        </button>
      </div>
    </form>
  )
}
