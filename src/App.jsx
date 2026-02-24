import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import LoginPage from './pages/LoginPage'
import ListPage from './pages/ListPage'
import DetailsPage from './pages/DetailsPage'
import PhotoResultPage from './pages/PhotoResultPage'
import ChartPage from './charts/ChartPage'
import MapPage from './map/MapPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected */}
          <Route path="/list" element={
            <ProtectedRoute><ListPage /></ProtectedRoute>
          } />
          <Route path="/details" element={
            <ProtectedRoute><DetailsPage /></ProtectedRoute>
          } />
          <Route path="/photo-result" element={
            <ProtectedRoute><PhotoResultPage /></ProtectedRoute>
          } />
          <Route path="/chart" element={
            <ProtectedRoute><ChartPage /></ProtectedRoute>
          } />
          <Route path="/map" element={
            <ProtectedRoute><MapPage /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
