/**
 * Zustand Store for Global State
 */

import { create } from 'zustand'

interface User {
  id: string
  email: string
  full_name: string
  role: string
  region?: string
}

interface AuthState {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  /** Atomically set token + user in one update – prevents ProtectedRoute race condition */
  setAuth: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  // Rehydrate user and token from localStorage on first load
  user:
    typeof window !== 'undefined'
      ? (() => {
        try {
          const raw = localStorage.getItem('user')
          return raw ? (JSON.parse(raw) as User) : null
        } catch {
          return null
        }
      })()
      : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,

  setUser: (user) => {
    set({ user })
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    }
  },

  setToken: (token) => {
    set({ token })
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    }
  },

  setAuth: (token, user) => {
    set({ token, user })
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    }
  },

  logout: () => {
    set({ user: null, token: null })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
}))
