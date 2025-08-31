"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
  role: string
  role_id: number
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (user: User, token: string, role: string) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isLoggedIn = !!user

  const login = (userData: User, token: string, role: string) => {
    setUser(userData)
    localStorage.setItem('authToken', token)
    localStorage.setItem('userRole', role)
    localStorage.setItem('userData', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userData')
    
    // Clear cookies by calling logout endpoint
    fetch('http://localhost:8080/auth/logout', {
      method: 'POST',
      credentials: 'include'
    }).catch(console.error)
  }

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const userData = localStorage.getItem('userData')
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        // Clear invalid data
        localStorage.removeItem('authToken')
        localStorage.removeItem('userRole')
        localStorage.removeItem('userData')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
