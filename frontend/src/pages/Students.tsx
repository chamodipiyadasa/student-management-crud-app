import React, { useEffect, useState } from 'react'
import api from '../utils/api'

type Student = {
  id: number
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // create form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get('/api/students')
      setStudents(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    // small validation
    if (!firstName || !lastName || !email || !dateOfBirth) {
      setError('Please fill all fields')
      return
    }
    try {
      await api.post('/api/students', {
        firstName,
        lastName,
        email,
        dateOfBirth
      })
      // clear and reload
      setFirstName('')
      setLastName('')
      setEmail('')
      setDateOfBirth('')
      await load()
    } catch (err: any) {
      setError(err.message || 'Create failed')
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this student?')) return
    try {
      await api.del(`/api/students/${id}`)
      await load()
    } catch (err: any) {
      setError(err.message || 'Delete failed')
    }
  }

  return (
    <div className="retro-bg">
      <div className="retro-window">
        <div className="window-body">
          <div className="left-panel">
            <div className="chat-box">
              <div className="chat-line">Students</div>
              <div className="chat-line muted">Manage students — create, view, delete</div>
            </div>
          </div>

          <div className="form-panel">
            <h2 className="retro-title">Students</h2>

            <form onSubmit={handleCreate} className="retro-form">
              {/* student: quick create form for adding a new student */}
              <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
                <label className="field">
                  <div className="label-text">First name</div>
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First" />
                </label>
                <label className="field">
                  <div className="label-text">Last name</div>
                  <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last" />
                </label>
              </div>

              <label className="field">
                <div className="label-text">Email</div>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </label>

              <label className="field">
                <div className="label-text">Date of birth</div>
                <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
              </label>

              {error && <div className="error">{error}</div>}

              <div className="actions" style={{ marginBottom: 18 }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <button className="btn primary" type="submit">Add student</button>
                  <div className="pixel-cursor" aria-hidden />
                </div>
                <button type="button" className="btn ghost" onClick={() => { setFirstName(''); setLastName(''); setEmail(''); setDateOfBirth('') }}>Clear</button>
              </div>
            </form>

            <div style={{ marginTop: 8 }}>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <table className="students-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>DOB</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id} style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                          <td className="cell name">{s.firstName} {s.lastName}</td>
                          <td className="cell">{s.email}</td>
                          <td className="cell">{new Date(s.dateOfBirth).toLocaleDateString()}</td>
                          <td className="cell actions-cell">
                            <button className="action-btn" title="Edit" onClick={() => alert('Edit not implemented')}>
                              <svg className="icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                            </button>
                            <button className="action-btn" title="Delete" onClick={() => handleDelete(s.id)}>
                              <svg className="icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                          </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ padding: 12 }}>No students yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
