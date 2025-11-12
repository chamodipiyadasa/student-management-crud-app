import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setError('Enter email and password')
      return
    }
    localStorage.setItem('student_app_logged_in', '1')
    navigate('/students')
  }

  return (
    <div style={{ maxWidth: 420, margin: '24px auto' }}>
      <h2>Login (demo)</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>
            Email
            <br />
            <input value={email} onChange={e => setEmail(e.target.value)} />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            Password
            <br />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </label>
        </div>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <div style={{ marginTop: 12 }}>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  )
}
