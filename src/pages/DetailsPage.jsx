import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import CameraCapture from '../components/CameraCapture'

const DetailsPage = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [showCamera, setShowCamera] = useState(false)
  const employee = state?.employee

  if (!employee) {
    return (
      <>
        <Navbar />
        <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
          <h2>No employee selected</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Please choose an employee from the list.</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/list')}>
            Back to List
          </button>
        </div>
      </>
    )
  }

  const handleCapture = (imageData) => {
    setShowCamera(false)
    navigate('/photo-result', { state: { image: imageData, employee } })
  }

  const formatKey = (key) =>
    key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, c => c.toUpperCase())

  const formatValue = (key, value) => {
    const k = key.toLowerCase()
    if (!value || value === '' || value === 'null') return '—'
    if (k === 'salary') return `₹${Number(value).toLocaleString('en-IN')}`
    return String(value)
  }

  const entries = Object.entries(employee).filter(([k]) => k && k !== '__typename')

  return (
    <>
      <Navbar />
      {showCamera && (
        <CameraCapture
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
      <div className="page">
        {/* Back + Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(-1)}
            style={{ marginBottom: 20 }}
          >
            ← Back
          </button>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Avatar */}
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0
              }}>
                {String(employee.name || employee.Name || 'E')[0].toUpperCase()}
              </div>
              <div>
                <h1 className="page-title" style={{ fontSize: 22 }}>
                  {employee.name || employee.Name || 'Employee Details'}
                </h1>
                <p className="page-subtitle">
                  {employee.designation || employee.department || ''}
                  {employee.city ? ` · ${employee.city}` : ''}
                </p>
              </div>
            </div>

            <button
              id="capture-photo-btn"
              className="btn btn-primary"
              onClick={() => setShowCamera(true)}
            >
              Capture Photo
            </button>
          </div>
        </motion.div>

        {/* Detail Grid */}
        <motion.div
          className="detail-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {entries.map(([key, value], i) => (
            <motion.div
              key={key}
              className="detail-field"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <div className="detail-label">{formatKey(key)}</div>
              <div
                className="detail-value"
                style={key.toLowerCase() === 'salary' ? { color: 'var(--success)' } : {}}
              >
                {formatValue(key, value)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  )
}

export default DetailsPage
