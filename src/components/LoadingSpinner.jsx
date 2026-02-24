import React from 'react'

const LoadingSpinner = ({ text = 'Loading data...' }) => (
  <div className="spinner-overlay">
    <div className="spinner" />
    <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{text}</p>
  </div>
)

export default LoadingSpinner
