import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getRounds, deleteRound } from '../api/rounds'
import { computeHandicapIndex, formatHandicap } from '../utils/handicap'
import RoundCard from '../components/RoundCard'
import RoundForm from '../components/RoundForm'
import type { Round } from '../types'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [rounds, setRounds] = useState<Round[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  async function loadRounds() {
    try {
      const data = await getRounds()
      setRounds(data)
    } catch {
      setError('Failed to load rounds.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRounds()
  }, [])

  async function handleDelete(id: number) {
    try {
      await deleteRound(id)
      setRounds(prev => prev.filter(r => r.id !== id))
    } catch {
      setError('Failed to delete round.')
    }
  }

  function handleSaved() {
    setShowForm(false)
    loadRounds()
  }

  const handicap = computeHandicapIndex(rounds)
  const roundsNeeded = Math.max(0, 3 - rounds.length)

  return (
    <div className="app-layout">
      <nav className="app-nav">
        <div className="nav-brand">
          <span className="brand-icon">⛳</span>
          <span className="brand-name">TrackMyHandi</span>
        </div>
        <div className="nav-user">
          <span className="nav-username">{user?.username}</span>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Sign Out</button>
        </div>
      </nav>

      <main className="app-main">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="dashboard-top">
          <div className="handicap-display">
            {loading ? (
              <div className="handicap-loading">Loading...</div>
            ) : handicap !== null ? (
              <>
                <div className="handicap-value">{formatHandicap(handicap)}</div>
                <div className="handicap-label">Handicap Index</div>
                <div className="handicap-meta">Based on {Math.min(rounds.length, 20)} rounds</div>
              </>
            ) : (
              <>
                <div className="handicap-value handicap-pending">—</div>
                <div className="handicap-label">Handicap Index</div>
                <div className="handicap-meta">
                  {roundsNeeded > 0
                    ? `Log ${roundsNeeded} more round${roundsNeeded !== 1 ? 's' : ''} to get your index`
                    : 'Calculating...'}
                </div>
              </>
            )}
          </div>

          {!showForm && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Log a Round
            </button>
          )}
        </div>

        {showForm && (
          <div className="form-container">
            <RoundForm onSaved={handleSaved} onCancel={() => setShowForm(false)} />
          </div>
        )}

        <section className="rounds-section">
          <h2 className="section-title">Round History</h2>

          {loading ? (
            <p className="empty-state">Loading rounds...</p>
          ) : rounds.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-title">No rounds yet</p>
              <p className="empty-state-body">Log your first round to start tracking your handicap.</p>
            </div>
          ) : (
            <div className="rounds-list">
              {rounds.map(round => (
                <RoundCard key={round.id} round={round} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
