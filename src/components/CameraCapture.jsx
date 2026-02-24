import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState('')
  const [captured, setCaptured] = useState(false)
  const [preview, setPreview] = useState(null)

  const startCamera = useCallback(async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => setIsReady(true)
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions and reload.')
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [startCamera])

  const capture = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    const imgData = canvas.toDataURL('image/png')
    setPreview(imgData)
    setCaptured(true)
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
    }
  }

  const retake = () => {
    setCaptured(false)
    setPreview(null)
    setIsReady(false)
    startCamera()
  }

  const confirm = () => {
    onCapture(preview)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="camera-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="camera-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700 }}>📸 Take a Photo</h3>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          {!captured ? (
            <>
              <div style={{ position: 'relative', background: '#000', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', display: 'block', borderRadius: 10 }}
                />
                {!isReady && !error && (
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.6)', color: '#fff'
                  }}>
                    <div className="spinner" />
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary w-full" onClick={capture} disabled={!isReady}>
                  📷 Capture
                </button>
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <img src={preview} alt="Captured" style={{ width: '100%', borderRadius: 10, marginBottom: 16 }} />
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary w-full" onClick={confirm}>
                  ✅ Use Photo
                </button>
                <button className="btn btn-secondary" onClick={retake}>🔄 Retake</button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CameraCapture
