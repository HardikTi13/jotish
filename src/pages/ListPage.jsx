import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchEmployees } from '../services/api'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import Pagination from '../components/Pagination'
import Navbar from '../components/Navbar'

const PAGE_SIZE = 10
const SORT_OPTIONS = ['name', 'salary', 'department', 'city']

const ListPage = () => {
  const { employees, setEmployees } = useAuth()
  const [loading, setLoading] = useState(employees.length === 0)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    if (employees.length > 0) return
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchEmployees()
        setEmployees(data)
      } catch (err) {
        setError('Failed to load employee data. Please check your connection.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, []) // eslint-disable-line

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    let rows = employees.filter(emp =>
      Object.values(emp).some(v => String(v).toLowerCase().includes(q))
    )
    rows = [...rows].sort((a, b) => {
      const av = String(a[sortKey] ?? a.name ?? '').toLowerCase()
      const bv = String(b[sortKey] ?? b.name ?? '').toLowerCase()
      const numA = parseFloat(av)
      const numB = parseFloat(bv)
      if (!isNaN(numA) && !isNaN(numB)) {
        return sortDir === 'asc' ? numA - numB : numB - numA
      }
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
    return rows
  }, [employees, search, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  // Derive visible columns from first employee object
  const columns = useMemo(() => {
    if (!employees.length) return []
    const keys = Object.keys(employees[0])
    // Show most relevant columns in table (limit to ~7)
    const priority = ['name','salary','department','city','email','phone','designation']
    const sorted = priority.filter(k => keys.includes(k))
    const rest = keys.filter(k => !priority.includes(k)).slice(0, Math.max(0, 7 - sorted.length))
    return [...sorted, ...rest]
  }, [employees])

  const sortIcon = (key) => {
    if (sortKey !== key) return ' ↕'
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  if (loading) return (
    <>
      <Navbar />
      <div className="page"><LoadingSpinner text="Fetching employee data…" /></div>
    </>
  )

  return (
    <>
      <Navbar />
      <div className="page">


        {/* Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div>
              <h1 className="page-title">Employee Directory</h1>
              <p className="page-subtitle">{employees.length} total employees</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => navigate('/chart')}>
                Salary Chart
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/map')}>
                View Map
              </button>
            </div>
          </div>
        </motion.div>

        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

        {/* Search + Sort Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}
        >
          <input
            id="search-emp"
            type="text"
            className="input"
            placeholder="Search employees…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            style={{ maxWidth: 340 }}
          />
          <select
            className="input"
            value={sortKey}
            onChange={e => { setSortKey(e.target.value); setPage(1) }}
            style={{ maxWidth: 180 }}
            id="sort-select"
          >
            {columns.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
          >
            {sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </motion.div>

        {/* Table */}
        <motion.div
          className="card table-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ marginBottom: 20 }}
        >
          <table>
            <thead>
              <tr>
                <th style={{ width: 48 }}>#</th>
                {columns.map(col => (
                  <th key={col} onClick={() => toggleSort(col)}>
                    {col.charAt(0).toUpperCase() + col.slice(1)}{sortIcon(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    No employees found matching "{search}"
                  </td>
                </tr>
              ) : (
                pageData.map((emp, idx) => (
                  <motion.tr
                    key={idx}
                    onClick={() => navigate('/details', { state: { employee: emp } })}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    title="Click to view details"
                  >
                    <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    {columns.map(col => (
                      <td key={col}>
                        {col === 'salary' ? (
                          <span className="badge badge-green">
                            ₹{Number(emp[col]).toLocaleString('en-IN')}
                          </span>
                        ) : col === 'department' ? (
                          <span className="badge badge-purple">{emp[col] || '—'}</span>
                        ) : (
                          String(emp[col] ?? '—')
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </>
  )
}

export default ListPage
