import React from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Students from './pages/Students'

function RequireAuth({ children }: { children: JSX.Element }) {
  const isLoggedIn = !!localStorage.getItem('student_app_logged_in')
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function LayoutNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const hideNav = location.pathname === '/login'
  const isLoggedIn = !!localStorage.getItem('student_app_logged_in')

  function handleLogout() {
    localStorage.removeItem('student_app_logged_in')
    navigate('/login')
  }

  return (
    <>
      {!hideNav && (
        <nav style={{ padding: 12 }}>
          {isLoggedIn ? (
            <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login" style={{ marginRight: 8 }}>Login</Link>
          )}
        </nav>
      )}
      <Outlet />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutNav />}> 
          <Route path="/login" element={<Login />} />
          <Route
            path="/students"
            element={
              <RequireAuth>
                <Students />
              </RequireAuth>
            }
          />
          <Route path="/" element={<Navigate to="/students" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
