'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'

export default function RegisterPage() {
  const router = useRouter()
  const setAuth = useAuthStore(s => s.setAuth)
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    region: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await authAPI.register({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        full_name: formData.full_name.trim(),
        region: formData.region.trim() || undefined,
      })
      const response = await authAPI.login(formData.email, formData.password)
      const token = response?.access_token
      if (!token) {
        toast.error('Registration succeeded but login failed. Please log in.')
        setLoading(false)
        return
      }
      const u = response?.user
      const userObj = u
        ? {
          id: String(u.id ?? ''),
          email: u.email ?? '',
          full_name: u.full_name ?? '',
          role: typeof u.role === 'string' ? u.role : (u.role ?? 'farmer'),
          region: u.region ?? undefined,
        }
        : null

      if (!userObj) {
        try {
          const userData = await authAPI.getMe()
          setAuth(token, {
            id: String(userData?.id ?? ''),
            email: userData?.email ?? '',
            full_name: userData?.full_name ?? '',
            role: typeof userData?.role === 'string' ? userData.role : (userData?.role ?? 'farmer'),
            region: userData?.region ?? undefined,
          })
        } catch {
          toast.error('Registered but could not load profile. Please log in.')
          setLoading(false)
          return
        }
      } else {
        setAuth(token, userObj)
      }
      toast.success(t('register_success'))
      router.push('/dashboard')
    } catch (error: any) {
      const detail = error.response?.data?.detail
      const message = Array.isArray(detail) ? detail.map((x: any) => x?.msg ?? x).join(', ') : (detail || 'Registration failed')
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-md border border-gray-200 dark:border-gray-700"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-900 dark:text-white">{t('register')}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">{t('full_name')}</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">{t('email')}</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">{t('password')}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">{t('region_optional')}</label>
            <input
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 dark:bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? t('registering') : t('register')}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
          {t('have_account_login')}{' '}
          <Link href="/login" className="text-green-600 dark:text-green-400 hover:underline">
            {t('login')}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
