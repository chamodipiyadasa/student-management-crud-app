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

  // form state used for both create and edit
  const [idEditing, setIdEditing] = useState<number | null>(null)
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
      setError(err?.message || 'Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function startEdit(s: Student) {
    setIdEditing(s.id)
    setFirstName(s.firstName)
    setLastName(s.lastName)
    setEmail(s.email)
    // normalize date input to yyyy-mm-dd
    setDateOfBirth(s.dateOfBirth?.split('T')[0] || s.dateOfBirth)
  }

  function resetForm() {
    setIdEditing(null)
    setFirstName('')
    setLastName('')
    setEmail('')
    setDateOfBirth('')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName || !lastName || !email || !dateOfBirth) {
      setError('Please fill all fields')
      return
    }
    try {
      if (idEditing) {
        await api.put(`/api/students/${idEditing}`, { firstName, lastName, email, dateOfBirth })
      } else {
        await api.post('/api/students', { firstName, lastName, email, dateOfBirth })
      }
      await load()
      resetForm()
    } catch (err: any) {
      setError(err?.message || 'Save failed')
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this student?')) return
    try {
      await api.del(`/api/students/${id}`)
      await load()
    } catch (err: any) {
      setError(err?.message || 'Delete failed')
    }
  }

  return (
    <div className="students-page" style={{ padding: 24 }}>
      <div className="students-header">
        <h2>Students</h2>
      </div>

  <section className="form-section" style={{ marginBottom: 18 }}>
        <h3>{idEditing ? 'Edit student' : 'Add new student'}</h3>
        <form onSubmit={handleSubmit} className="student-form" aria-label="Add or edit student">
          <div className="form-grid">
            <input className="input" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <input className="input" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} />
            <input className="input" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="input" placeholder="Date of birth" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
          </div>
          <div className="form-actions">
            <button className="btn primary" type="submit">{idEditing ? 'Save' : 'Add'}</button>
            <button className="btn ghost" type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
        {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
      </section>

      <section className="table-section">
        <h3 className="visually-hidden">Student list</h3>
        {loading ? (
          <div className="loading">Loading…</div>
        ) : (
          <div className="table-card">
            <table className="students-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Email</th>
                  <th>Birthday</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  /* show a sample row when there is no data */
                  <tr className="sample-row">
                    <td>Alice Johnson</td>
                    <td>alice.j@example.com</td>
                    <td>1998-05-15</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="icon" title="Edit">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span className="icon delete" title="Delete">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6h18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </td>
                  </tr>
                ) : (
                  students.map(s => (
                    <tr key={s.id}>
                      <td>{s.firstName} {s.lastName}</td>
                      <td>{s.email}</td>
                      <td>{new Date(s.dateOfBirth).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="icon-btn" onClick={() => startEdit(s)} aria-label="Edit">
                          {/* neo‑brutalist edit icon (thinner strokes) */}
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button className="icon-btn" onClick={() => handleDelete(s.id)} aria-label="Delete">
                          {/* neo‑brutalist delete icon (thinner strokes) */}
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
