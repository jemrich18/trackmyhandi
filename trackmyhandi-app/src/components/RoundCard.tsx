import type { Round } from '../types'

const CONDITION_LABELS: Record<string, string> = {
  sunny: 'Sunny', cloudy: 'Cloudy', windy: 'Windy', rainy: 'Rainy',
  none: 'No wind', light: 'Light wind', moderate: 'Moderate wind', strong: 'Strong wind',
  slow: 'Slow greens', normal: 'Normal greens', fast: 'Fast greens',
  soft: 'Soft greens', firm: 'Firm greens',
  wet: 'Wet fairways', dry: 'Dry fairways',
  driving: 'Driving', iron_play: 'Iron Play', chipping: 'Chipping',
  putting: 'Putting', bunker: 'Bunker',
}

function label(v: string | null) {
  return v ? CONDITION_LABELS[v] ?? v : null
}

function diffClass(diff: number) {
  if (diff <= 10) return 'diff-excellent'
  if (diff <= 18) return 'diff-good'
  if (diff <= 25) return 'diff-average'
  return 'diff-high'
}

interface Props {
  round: Round
  onDelete: (id: number) => void
}

export default function RoundCard({ round, onDelete }: Props) {
  const diff = round.score_differential
  const conditions = [
    label(round.weather),
    label(round.wind_strength),
    label(round.green_speed),
    label(round.green_firmness),
    label(round.fairway_conditions),
  ].filter(Boolean)

  const dateFmt = new Date(round.date_played + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  function handleDelete() {
    if (confirm(`Delete round at ${round.course_name}?`)) {
      onDelete(round.id)
    }
  }

  return (
    <div className="round-card">
      <div className="round-card-header">
        <div>
          <p className="round-course">{round.course_name}</p>
          <p className="round-date">{dateFmt}</p>
        </div>
        <div className="round-scores">
          <span className="round-score">{round.score}</span>
          <span className={`round-diff ${diffClass(diff)}`}>
            {diff >= 0 ? '+' : ''}{diff.toFixed(1)}
          </span>
        </div>
      </div>

      {conditions.length > 0 && (
        <div className="round-conditions">
          {conditions.map(c => (
            <span key={c} className="condition-tag">{c}</span>
          ))}
        </div>
      )}

      {round.miss_category && (
        <p className="round-miss">
          <span className="round-miss-label">Biggest miss:</span> {label(round.miss_category)}
        </p>
      )}

      {round.notes && (
        <p className="round-notes">{round.notes}</p>
      )}

      <div className="round-card-footer">
        <span className="round-course-info">
          Rating {Number(round.course_rating).toFixed(1)} / Slope {round.slope_rating}
        </span>
        <button className="btn-delete" onClick={handleDelete} aria-label="Delete round">
          Delete
        </button>
      </div>
    </div>
  )
}
