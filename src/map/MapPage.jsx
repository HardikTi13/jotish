import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons (Vite/Webpack asset issue)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Indian city coordinates lookup
const CITY_COORDS = {
  mumbai: [19.076, 72.877],
  delhi: [28.704, 77.102],
  'new delhi': [28.613, 77.209],
  bangalore: [12.972, 77.594],
  bengaluru: [12.972, 77.594],
  hyderabad: [17.385, 78.487],
  ahmedabad: [23.023, 72.572],
  chennai: [13.083, 80.270],
  kolkata: [22.572, 88.364],
  pune: [18.520, 73.856],
  jaipur: [26.912, 75.787],
  lucknow: [26.847, 80.947],
  surat: [21.170, 72.831],
  kanpur: [26.449, 80.331],
  nagpur: [21.146, 79.088],
  patna: [25.594, 85.137],
  indore: [22.719, 75.857],
  bhopal: [23.259, 77.413],
  visakhapatnam: [17.686, 83.218],
  vadodara: [22.307, 73.181],
  coimbatore: [11.017, 76.955],
  agra: [27.178, 78.006],
  nashik: [19.998, 73.791],
  ranchi: [23.344, 85.310],
  faridabad: [28.408, 77.317],
  meerut: [28.984, 77.706],
  rajkot: [22.303, 70.801],
  jabalpur: [23.181, 79.987],
  guwahati: [26.144, 91.736],
  chandigarh: [30.733, 76.779],
  noida: [28.535, 77.391],
  gurgaon: [28.459, 77.027],
  gurugram: [28.459, 77.027],
  kochi: [9.931, 76.267],
  thiruvananthapuram: [8.524, 76.936],
  goa: [15.491, 73.832],
  mysore: [12.305, 76.655],
  mangalore: [12.914, 74.856],
  hubli: [15.362, 75.124],
  tirupati: [13.628, 79.418],
  jodhpur: [26.286, 73.014],
  udaipur: [24.571, 73.691],
  amritsar: [31.634, 74.872],
  ludhiana: [30.900, 75.847],
  varanasi: [25.316, 82.973],
  ghaziabad: [28.670, 77.412],
  allahabad: [25.435, 81.846],
  prayagraj: [25.435, 81.846],
}

const getCoords = (city) => {
  if (!city) return null
  const lower = String(city).toLowerCase().trim()
  if (CITY_COORDS[lower]) return CITY_COORDS[lower]
  // Partial match
  const match = Object.keys(CITY_COORDS).find(k => lower.includes(k) || k.includes(lower))
  return match ? CITY_COORDS[match] : null
}

const MapPage = () => {
  const { employees } = useAuth()
  const navigate = useNavigate()

  const cityKey = useMemo(() => {
    if (!employees.length) return 'city'
    const keys = Object.keys(employees[0])
    return keys.find(k => k.toLowerCase() === 'city' || k.toLowerCase() === 'location') || 'city'
  }, [employees])

  const nameKey = useMemo(() => {
    if (!employees.length) return 'name'
    const keys = Object.keys(employees[0])
    return keys.find(k => k.toLowerCase() === 'name') || 'name'
  }, [employees])

  const markers = useMemo(() => {
    const seen = {}
    return employees.reduce((acc, emp) => {
      const city = emp[cityKey]
      const coords = getCoords(city)
      if (!coords) return acc
      const key = coords.join(',')
      if (!seen[key]) {
        seen[key] = { coords, city, employees: [] }
        acc.push(seen[key])
      }
      seen[key].employees.push(emp[nameKey] || 'Unknown')
      return acc
    }, [])
  }, [employees, cityKey, nameKey])

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="gradient-bg" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 24 }}
        >
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
            ← Back
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="page-title">🗺️ Employee Map</h1>
              <p className="page-subtitle">{markers.length} cities with employees</p>
            </div>
            <div className="card" style={{ padding: '10px 16px', display: 'flex', gap: 16 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                📍 {employees.length} employees mapped across {markers.length} locations
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="map-container"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((m, i) => (
              <Marker key={i} position={m.coords}>
                <Popup>
                  <div style={{ minWidth: 150 }}>
                    <strong style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>
                      📍 {m.city}
                    </strong>
                    <div style={{ fontSize: 13, color: '#555' }}>
                      {m.employees.slice(0, 5).map((name, j) => (
                        <div key={j}>👤 {name}</div>
                      ))}
                      {m.employees.length > 5 && (
                        <div style={{ color: '#888', marginTop: 4 }}>
                          +{m.employees.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        {markers.length === 0 && (
          <div className="alert alert-error" style={{ marginTop: 16 }}>
            ⚠️ No geocodeable cities found in employee data. Cities must match known Indian cities.
          </div>
        )}
      </div>
    </>
  )
}

export default MapPage
