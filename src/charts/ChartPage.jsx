import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { fetchEmployees } from '../services/api'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'

const COLORS = [
  '#4285f4', '#1a73e8', '#1967d2', '#185abc',
  '#34a853', '#1e8e3e', '#188038', '#137333',
  '#fbbc04', '#f9ab00'
]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: 8, padding: '10px 14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <p style={{ fontWeight: 600, marginBottom: 4, fontSize: 13 }}>{d.payload.fullName}</p>
      <p style={{ color: 'var(--success)', fontSize: 15, fontWeight: 700 }}>
        ₹{Number(d.value).toLocaleString('en-IN')}
      </p>
    </div>
  )
}

const ChartPage = () => {
  const { employees, setEmployees } = useAuth()
  const [loading, setLoading] = useState(employees.length === 0)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (employees.length > 0) return
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchEmployees()
        setEmployees(data)
      } catch (err) {
        console.error('Failed to fetch employees', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [employees.length, setEmployees])

  const chartData = useMemo(() => {
    if (!employees.length) return []
    
    const nameKey = Object.keys(employees[0] || {}).find(k =>
      k.toLowerCase() === 'name' || k.toLowerCase() === 'employee_name'
    ) || 'name'
    const salaryKey = Object.keys(employees[0] || {}).find(k =>
      k.toLowerCase() === 'salary' || k.toLowerCase() === 'ctc'
    ) || 'salary'

    const filtered = search.trim() 
      ? employees.filter(emp => String(emp[nameKey]).toLowerCase().includes(search.toLowerCase()))
      : employees.slice(0, 10)

    return filtered.slice(0, 10).map(emp => ({
      name: (emp[nameKey] || 'Unknown').split(' ')[0],
      salary: parseFloat(emp[salaryKey]) || 0,
      fullName: emp[nameKey] || 'Unknown',
    }))
  }, [employees, search])

  if (loading) return (
    <>
      <Navbar />
      <div className="page"><LoadingSpinner text="Loading chart data…" /></div>
    </>
  )

  if (!employees.length) {
    return (
      <>
        <Navbar />
        <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
          <h2>No employee data available</h2>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/list')}>
            Back to List
          </button>
        </div>
      </>
    )
  }

  const maxSalary = Math.max(...chartData.map(d => d.salary))
  const avgSalary = chartData.reduce((s, d) => s + d.salary, 0) / chartData.length

  return (
    <>
      <Navbar />
      <div className="page">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 28 }}
        >
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
            ← Back
          </button>
          <h1 className="page-title">Salary Chart</h1>
          <p className="page-subtitle">Visualizing employee compensation</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          style={{ marginBottom: 24 }}
        >
          <div className="card" style={{ padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Find Employee</span>
            <input
              type="text"
              className="input"
              placeholder="Type name to filter chart…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ maxWidth: 300, padding: '8px 12px', fontSize: 14 }}
            />
            {search && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setSearch('')}
              >
                Reset
              </button>
            )}
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
              Showing {chartData.length} records
            </span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}
        >
          {[
            { label: 'Highest Salary', value: `₹${maxSalary.toLocaleString('en-IN')}`, color: '#fbbc04' },
            { label: 'Average Salary', value: `₹${Math.round(avgSalary).toLocaleString('en-IN')}`, color: 'var(--success)' },
            { label: 'Employees Shown', value: `${chartData.length} of ${employees.length}`, color: 'var(--accent)' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '16px 24px', flex: '1 1 180px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          className="card"
          style={{ padding: '24px 16px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 style={{ marginBottom: 24, paddingLeft: 8, fontSize: 16, fontWeight: 600 }}>Employee Salaries (INR)</h3>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="name"
                tick={{ fill: 'var(--text-secondary)', fontSize: 13 }}
                axisLine={{ stroke: 'var(--border-color)' }}
              />
              <YAxis
                tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border-color)' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(66,133,244,0.08)' }} />
              <Legend wrapperStyle={{ paddingTop: 16, color: 'var(--text-secondary)' }} />
              <Bar dataKey="salary" name="Salary (₹)" radius={[4, 4, 0, 0]} maxBarSize={56}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </>
  )
}

export default ChartPage
