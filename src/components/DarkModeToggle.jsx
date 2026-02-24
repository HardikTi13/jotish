import React, { useEffect, useState } from 'react'

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('jotish_theme') !== 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('jotish_theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <button
      className="btn btn-secondary btn-sm"
      onClick={() => setIsDark(d => !d)}
      title="Toggle theme"
      aria-label="Toggle dark mode"
      style={{ fontSize: '18px', padding: '6px 10px' }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

export default DarkModeToggle
