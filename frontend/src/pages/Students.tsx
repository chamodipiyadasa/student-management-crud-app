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
    <div style={{ padding: 16 }}>
      <h2>Students</h2>

      <section style={{ marginBottom: 18 }}>
        <h3>{idEditing ? 'Edit student' : 'Add new student'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
          <input placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} />
          <input placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} />
          <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Date of birth" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
            <button type="submit">{idEditing ? 'Save' : 'Add'}</button>
            <button type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
        {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
      </section>

      <section>
        <h3>Student list</h3>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
                <th style={{ textAlign: 'left', padding: 8 }}>DOB</th>
                <th style={{ textAlign: 'right', padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: 12 }}>No students yet</td>
                </tr>
              )}
              {students.map(s => (
                <tr key={s.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>{s.firstName} {s.lastName}</td>
                  <td style={{ padding: 8 }}>{s.email}</td>
                  <td style={{ padding: 8 }}>{new Date(s.dateOfBirth).toLocaleDateString()}</td>
                  <td style={{ padding: 8, textAlign: 'right' }}>
                    <button onClick={() => startEdit(s)} style={{ marginRight: 8 }}>Edit</button>
                    <button onClick={() => handleDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
