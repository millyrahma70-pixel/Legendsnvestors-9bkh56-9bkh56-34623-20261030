import { useState } from 'react'

export function useSharedLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // Mock login - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`Login attempt: ${email}`)
      // Store mock token
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', 'mock_token')
      }
      return true
    } catch (err) {
      setError('Login failed')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  return { login, logout, isLoading, error }
}

export default useSharedLogin
