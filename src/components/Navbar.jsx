import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DarkModeToggle from './DarkModeToggle'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)',
    }}>
      <Link to="/list" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--accent-grad)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 800, color: '#fff'
        }}>J</span>
        <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>
          Jotish<span style={{ color: 'var(--accent)' }}>.</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {user && (
          <span style={{
            fontSize: 13, color: 'var(--text-secondary)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 8, padding: '5px 12px'
          }}>
            👤 {user.username}
          </span>
        )}
        <DarkModeToggle />
        {user && (
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
