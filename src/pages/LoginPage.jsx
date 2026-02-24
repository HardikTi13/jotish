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
    await new Promise(r => setTimeout(r, 500))

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: '#fff',
            margin: '0 auto 16px',
          }}>J</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: 14 }}>
            Sign in to the Employee Portal
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
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

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
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
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', color: 'var(--text-muted)',
                    fontSize: 13, lineHeight: 1
                  }}
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                className="alert alert-error"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ marginBottom: 18 }}
              >
                {error}
              </motion.div>
            )}

            <button
              id="login-btn"
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              style={{ padding: '12px 20px', fontSize: 15 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div style={{
            marginTop: 20, padding: '12px 14px',
            background: 'var(--accent-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)'
          }}>
            <strong style={{ color: 'var(--accent)' }}>Demo credentials:</strong>{' '}
            <code style={{ color: 'var(--text-primary)' }}>testuser</code>{' / '}
            <code style={{ color: 'var(--text-primary)' }}>Test123</code>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
