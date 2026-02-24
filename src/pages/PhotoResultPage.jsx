import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

const PhotoResultPage = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const image = state?.image
  const employee = state?.employee

  if (!image) {
    return (
      <>
        <Navbar />
        <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
          <h2>No photo found</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Capture a photo from the details page.</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/list')}>
            Back to List
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="page">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 28 }}
        >
          <h1 className="page-title">Captured Photo</h1>
          {employee?.name && (
            <p className="page-subtitle">Photo of {employee.name}</p>
          )}
        </motion.div>

        <motion.div
          style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', damping: 18 }}
        >
          <div className="card" style={{ padding: 20, marginBottom: 24 }}>
            <img
              src={image}
              alt="Captured"
              className="photo-result-img"
            />
          </div>

          <motion.div
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              id="retake-btn"
              className="btn btn-secondary"
              onClick={() => navigate('/details', { state: { employee }, replace: true })}
            >
              Retake Photo
            </button>
            <button
              id="back-to-list-btn"
              className="btn btn-primary"
              onClick={() => navigate('/list')}
            >
              Back to List
            </button>
          </motion.div>

          <div style={{ marginTop: 16 }}>
            <a
              href={image}
              download={`photo_${employee?.name?.replace(/\s+/g, '_') || 'capture'}.png`}
              className="btn btn-secondary btn-sm"
            >
              Download Photo
            </a>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default PhotoResultPage
