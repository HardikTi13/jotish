import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jotish_user')) || null
    } catch {
      return null
    }
  })

  const [employees, setEmployees] = useState([])

  const login = (username) => {
    const userData = { username, loggedInAt: Date.now() }
    setUser(userData)
    localStorage.setItem('jotish_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setEmployees([])
    localStorage.removeItem('jotish_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, employees, setEmployees }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
