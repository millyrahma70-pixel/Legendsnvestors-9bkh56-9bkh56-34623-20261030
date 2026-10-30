import { useState, useEffect } from 'react'

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = () => {
      const adminSession = localStorage.getItem('admin_session')
      const userRole = localStorage.getItem('user_role')
      setIsAdmin(adminSession === 'true' || userRole === 'admin')
      setIsLoading(false)
    }
    checkAdmin()
  }, [])

  return { isAdmin, isLoading }
}
