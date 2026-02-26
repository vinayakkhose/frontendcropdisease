'use client'

import { useEffect, useRef, useState, memo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { authAPI } from '@/lib/api'

export default memo(function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useAuthStore(s => s.user)
  const token = useAuthStore(s => s.token)
  const setUser = useAuthStore(s => s.setUser)
  const logout = useAuthStore(s => s.logout)
  const [checking, setChecking] = useState(true)
  // Track whether we already ran the auth check so we don't repeat on user-state changes
  const checkedRef = useRef(false)

  useEffect(() => {
    // Only re-run when the token itself changes (not on every user update)
    checkedRef.current = false
  }, [token])

  useEffect(() => {
    if (checkedRef.current) return
    checkedRef.current = true

    const initAuth = async () => {
      try {
        // No token → go to login
        if (!token) {
          logout()
          router.push('/login')
          return
        }

        // Token present and we already have user data (e.g. set atomically by setAuth) – done
        if (user) {
          setChecking(false)
          return
        }

        // Token present but user missing (e.g. hard refresh) – fetch from backend
        const me = await authAPI.getMe()
        setUser({
          id: String(me?.id ?? ''),
          email: me?.email ?? '',
          full_name: me?.full_name ?? '',
          role: typeof me?.role === 'string' ? me.role : (me?.role ?? 'farmer'),
          region: me?.region ?? undefined,
        })
      } catch {
        // Token invalid or /me failed – force logout
        logout()
        router.push('/login')
      } finally {
        setChecking(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Show spinner while checking
  if (checking || !token || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return <>{children}</>
})
