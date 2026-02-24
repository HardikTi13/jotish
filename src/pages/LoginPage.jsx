import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const VALID_USER = 'testuser'
const VALID_PASS = 'Test123'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) return setError('Username is required.')
    if (!password.trim()) return setError('Password is required.')

    setLoading(true)
    await new Promise(r => setTimeout(r, 600)) // subtle UX delay

    if (username === VALID_USER && password === VALID_PASS) {
      login(username)
      navigate('/list', { replace: true })
    } else {
      setError('Invalid credentials. Try testuser / Test123')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'var(--bg-primary)',
    }}>
      <div className="gradient-bg" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', damping: 20 }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 900, color: '#fff',
            margin: '0 auto 16px',
            boxShadow: '0 12px 40px rgba(124,58,237,0.4)'
          }}>J</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-1px' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>
            Sign in to the Employee Portal
          </p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
                Username
              </label>
              <input
                id="username"
                type="text"
                className="input"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', color: 'var(--text-muted)',
                    fontSize: 18, lineHeight: 1
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                className="alert alert-error"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ marginBottom: 20 }}
              >
                ⚠️ {error}
              </motion.div>
            )}

            <button
              id="login-btn"
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              style={{ padding: '13px 20px', fontSize: 16 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Signing in…
                </span>
              ) : '🚀 Sign In'}
            </button>
          </form>

          <div style={{
            marginTop: 24, padding: '14px 16px',
            background: 'rgba(6,182,212,0.07)',
            border: '1px solid rgba(6,182,212,0.2)',
            borderRadius: 10, fontSize: 13, color: 'var(--text-secondary)'
          }}>
            <strong style={{ color: 'var(--accent-2)' }}>Demo:</strong>{' '}
            Username: <code style={{ color: 'var(--text-primary)' }}>testuser</code>{' '}|{' '}
            Password: <code style={{ color: 'var(--text-primary)' }}>Test123</code>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
