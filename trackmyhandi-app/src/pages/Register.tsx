import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, login, getMe } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  function fieldError(key: string) {
    return errors[key]?.[0]
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await register({ username, email, password })
      // auto-login after registration
      await login({ username, password })
      const user = await getMe()
      setUser(user)
      navigate('/dashboard')
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, string[]> } })?.response?.data
      if (data && typeof data === 'object') {
        setErrors(data)
      } else {
        setErrors({ non_field_errors: ['Registration failed. Please try again.'] })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-icon">⛳</span>
          <span className="brand-name">TrackMyHandi</span>
        </div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start tracking your handicap</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {fieldError('non_field_errors') && (
            <div className="alert alert-error">{fieldError('non_field_errors')}</div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              className={`form-input ${fieldError('username') ? 'is-error' : ''}`}
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
              disabled={loading}
            />
            {fieldError('username') && <span className="field-error">{fieldError('username')}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              className={`form-input ${fieldError('email') ? 'is-error' : ''}`}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
            {fieldError('email') && <span className="field-error">{fieldError('email')}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              className={`form-input ${fieldError('password') ? 'is-error' : ''}`}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              disabled={loading}
            />
            {fieldError('password') && <span className="field-error">{fieldError('password')}</span>}
            <span className="field-hint">Minimum 8 characters</span>
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
