import { Link } from 'react-router-dom'

const features = [
  {
    icon: '📊',
    title: 'WHS Handicap Index',
    body: 'Automatically calculated from your rounds using the official World Handicap System formula.',
  },
  {
    icon: '🏌️',
    title: 'Round Logging',
    body: 'Log score, course rating, and slope for every round. Track conditions and reflect on your game.',
  },
  {
    icon: '📈',
    title: 'Score Differentials',
    body: 'See your score differential for every round so you know exactly where your handicap is heading.',
  },
  {
    icon: '🌤️',
    title: 'Conditions & Reflection',
    body: 'Record weather, green speed, and your biggest miss to spot patterns in your game over time.',
  },
]

export default function Landing() {
  return (
    <div className="app-layout">
      <nav className="app-nav">
        <div className="nav-brand">
          <span className="brand-icon">⛳</span>
          <span className="brand-name">TrackMyHandi</span>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn btn-ghost">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      <main className="landing-main">
        <section className="hero">
          <h1 className="hero-title">
            Your Golf Handicap,<br />Tracked Properly
          </h1>
          <p className="hero-body">
            Log rounds, calculate your WHS Handicap Index, and understand your game.
            Free and straightforward.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Start Tracking Free</Link>
            <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
          </div>
        </section>

        <section className="features">
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-body">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <h2 className="cta-title">Ready to know your real handicap?</h2>
          <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
        </section>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} TrackMyHandi</p>
      </footer>
    </div>
  )
}
