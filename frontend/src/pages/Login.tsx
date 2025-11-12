import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // simple login handler demo
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setError('Enter email and password')
      return
    }
    // mark as logged in -demo 
    localStorage.setItem('student_app_logged_in', '1')
    // navigate to students list
    navigate('/students')
  }

  return (
    <div className="retro-bg">
      <div className="retro-window">

        <div className="window-body">
          <div className="left-panel">
            <div className="chat-box">
              <div className="chat-line">Welcome to Student Management App :)</div>
              <div className="chat-line muted">Please sign in to continue</div>
            </div>
            <div className="decor small-stars">
              <span className="star">✦</span>
              <span className="plus">＋</span>
            </div>
          </div>

          <div className="form-panel">
            <h2 className="retro-title">Sign in</h2>
            <form onSubmit={handleSubmit} className="retro-form">
              {/* email will use as a username */}
              <label className="field">
                <div className="label-text">Email</div>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>

              <label className="field">
                <div className="label-text">Password</div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </label>

              {error && <div className="error">{error}</div>}

              <div className="actions">
                <button className="btn primary" type="submit">
                  Sign in
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => {
                    setEmail('')
                    setPassword('')
                    setError(null)
                  }}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
