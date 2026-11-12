import { createContext, useState, useEffect, useCallback } from 'react'
import { getCurrentUserDummy, loginDummy, logoutDummy } from '../services/dummy/authDummy'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const currentUser = await getCurrentUserDummy()
        if (active) {
          setUser(currentUser)
        }
      } catch {
        if (active) {
          setUser(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const session = await loginDummy(email, password)
    setUser(session)
    return session
  }, [])

  const logout = useCallback(async () => {
    await logoutDummy()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}


