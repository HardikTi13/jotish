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
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/list" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: '#fff'
        }}>J</span>
        <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px' }}>
          Jotish
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {user && (
          <span style={{
            fontSize: 13, color: 'var(--text-secondary)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 6, padding: '4px 10px'
          }}>
            {user.username}
          </span>
        )}
        <DarkModeToggle />
        {user && (
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
