'use client'

import { useEffect, useState, memo, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { predictionAPI } from '@/lib/api'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Calendar, TrendingUp, AlertTriangle, Upload, Leaf,
  Droplet, Sun, Shield, Search, ArrowUpRight, Activity,
  ChevronRight, CloudSun, Sprout, Zap
} from 'lucide-react'
import { format } from 'date-fns'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import { useAuthStore } from '@/lib/store'
import { useLanguage } from '@/lib/language-context'

/* ── Open-Meteo (browser-direct) ─────────────────────────────── */
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const METEO_URL = 'https://api.open-meteo.com/v1/forecast'

interface PredictionHistory {
  id: string; disease_name: string; confidence: number; crop_type?: string; created_at: string
}

/* ── animation variants ─────────────────────────────────────── */
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 } },
}
const slideUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}
const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}
const rowVariant = (i: number) => ({
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, delay: i * 0.05, ease: 'easeOut' } },
})

const riskColor = (r: string) =>
  r === 'high' ? 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    : r === 'moderate' ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
      : 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'

const confColor = (c: number) =>
  c >= 80 ? 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400'
    : c >= 60 ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400'
      : 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400'

/* ── animated counter ───────────────────────────────────────── */
const AnimCounter = memo(function AnimCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(value / 30)
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(start)
    }, 30)
    return () => clearInterval(timer)
  }, [value])
  return <>{display}{suffix}</>
})

export default function DashboardPage() {
  const { t } = useLanguage()
  const prefersReduced = useReducedMotion()
  const [history, setHistory] = useState<PredictionHistory[]>([])
  const [loading, setLoading] = useState(true)
  const user = useAuthStore(s => s.user)

  /* weather */
  const [weatherRegion, setWeatherRegion] = useState('')
  const [weatherData, setWeatherData] = useState<{
    location: string; temperature: number; humidity: number; risk_level: string
  } | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherErr, setWeatherErr] = useState('')

  const loadHistory = useCallback(async () => {
    try { setHistory(await predictionAPI.getHistory(10)) }
    catch { /* noop */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { loadHistory() }, [loadHistory])

  const fetchWeather = useCallback(async () => {
    const q = weatherRegion.trim(); if (!q) return
    setWeatherLoading(true); setWeatherErr(''); setWeatherData(null)
    try {
      const geo = await (await fetch(`${GEO_URL}?name=${encodeURIComponent(q)}&count=1&format=json`)).json()
      const place = geo?.results?.[0]; if (!place) throw new Error('Location not found')
      const params = new URLSearchParams({ latitude: String(place.latitude), longitude: String(place.longitude), current: 'temperature_2m,relative_humidity_2m', timezone: 'auto' })
      const wx = (await (await fetch(`${METEO_URL}?${params}`)).json())?.current || {}
      const temp = Number(wx.temperature_2m ?? 22); const hum = Number(wx.relative_humidity_2m ?? 50)
      const risk = hum > 80 && temp >= 15 && temp <= 30 ? 'high' : hum > 65 ? 'moderate' : 'low'
      setWeatherData({ location: `${place.name}, ${place.country}`, temperature: temp, humidity: hum, risk_level: risk })
    } catch (e: any) { setWeatherErr(e.message || 'Could not fetch weather') }
    finally { setWeatherLoading(false) }
  }, [weatherRegion])

  const totalPred = useMemo(() => history.length, [history])
  const avgConf = useMemo(() => totalPred > 0 ? Math.round(history.reduce((s, h) => s + h.confidence, 0) / totalPred) : 0, [history, totalPred])
  const uniqDis = useMemo(() => new Set(history.map(h => h.disease_name)).size, [history])

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full"
      />
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="text-sm text-gray-400">Loading your dashboard…</motion.p>
    </div>
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8"
          variants={prefersReduced ? {} : pageVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ── Top bar ── */}
          <motion.div variants={slideUp}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {t('welcome_back')}{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {format(new Date(), 'EEEE, MMM d yyyy')} · {t('farm_overview')}
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link href="/predict"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-green-500/20 transition-colors text-sm">
                <Upload className="w-4 h-4" />{t('new_prediction')}
              </Link>
            </motion.div>
          </motion.div>

          {/* ── Stats ── */}
          <motion.div variants={slideUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Calendar, label: t('total_predictions'), value: totalPred, suffix: '', color: 'bg-green-500', ring: 'ring-green-100 dark:ring-green-900/30' },
              { icon: TrendingUp, label: t('avg_confidence'), value: avgConf, suffix: '%', color: 'bg-blue-500', ring: 'ring-blue-100 dark:ring-blue-900/30' },
              { icon: AlertTriangle, label: t('unique_diseases'), value: uniqDis, suffix: '', color: 'bg-rose-500', ring: 'ring-rose-100 dark:ring-rose-900/30' },
            ].map(({ icon: Icon, label, value, suffix, color, ring }, i) => (
              <motion.div key={label}
                variants={scaleIn}
                custom={i}
                whileHover={{ y: -4, boxShadow: '0 12px 32px -8px rgba(0,0,0,0.12)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex items-center gap-4 cursor-default">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.2 + i * 0.1 }}
                  className={`${color} ${ring} ring-4 p-3 rounded-xl shadow`}>
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    <AnimCounter value={value} suffix={suffix} />
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Quick Actions ── */}
          <motion.div variants={slideUp}>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { href: '/predict', icon: Upload, label: t('predict_disease'), sub: t('upload_crop_image'), gradient: 'from-green-500 to-emerald-500', shadow: 'shadow-green-200 dark:shadow-green-900/30' },
                { href: '/analytics', icon: Activity, label: t('view_analytics'), sub: t('track_trends'), gradient: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-200 dark:shadow-blue-900/30' },
                { href: '/weather', icon: CloudSun, label: t('weather_alert'), sub: t('check_conditions'), gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-200 dark:shadow-amber-900/30' },
                { href: '/farmers-guide', icon: Shield, label: t('prevention_tips'), sub: t('stay_protected'), gradient: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-200 dark:shadow-violet-900/30' },
              ].map(({ href, icon: Icon, label, sub, gradient, shadow }, i) => (
                <motion.div key={label}
                  variants={scaleIn}
                  custom={i}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
                  <Link href={href}
                    className={`group block bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg ${shadow} transition-shadow`}>
                    <motion.div
                      className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow mb-3`}
                      whileHover={{ rotate: [0, -8, 8, 0] }}
                      transition={{ duration: 0.4 }}>
                      <Icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{label}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Weather widget ── */}
          <motion.div variants={slideUp}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 shadow">
                <Sun className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-bold text-gray-900 dark:text-white">{t('weather_disease_risk')}</h2>
              <motion.div whileHover={{ x: 3 }} className="ml-auto">
                <Link href="/weather" className="text-xs font-semibold text-sky-500 hover:underline flex items-center gap-0.5">
                  Full page <ArrowUpRight className="w-3 h-3" />
                </Link>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={weatherRegion}
                  onChange={e => setWeatherRegion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !weatherLoading && fetchWeather()}
                  placeholder={t('enter_region')}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-sky-400 focus:outline-none text-sm transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                />
              </div>
              <motion.button onClick={fetchWeather} disabled={weatherLoading}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md shadow-sky-400/20 disabled:opacity-50 text-sm transition-colors">
                {weatherLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full" />
                    Checking…
                  </span>
                ) : t('get_weather')}
              </motion.button>
            </div>

            {weatherErr && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-red-500">{weatherErr}</motion.p>
            )}

            <AnimatePresence>
              {weatherData && (
                <motion.div
                  key="weather-result"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-xs text-gray-400 mb-0.5">Location</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{weatherData.location}</p>
                    </div>
                    {[
                      { icon: Sun, label: 'Temperature', val: `${weatherData.temperature}°C` },
                      { icon: Droplet, label: 'Humidity', val: `${weatherData.humidity}%` },
                    ].map(({ icon: Icon, label, val }, i) => (
                      <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                          <Icon className="w-3.5 h-3.5 text-sky-500" />{val}
                        </p>
                      </motion.div>
                    ))}
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                      <p className="text-xs text-gray-400 mb-1">Disease Risk</p>
                      <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${riskColor(weatherData.risk_level)}`}>
                        {weatherData.risk_level.toUpperCase()}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Recent Detections ── */}
          <motion.div variants={slideUp}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-500" />{t('prediction_history')}
              </h2>
              <motion.div whileHover={{ x: 3 }}>
                <Link href="/reports" className="text-xs font-semibold text-green-600 dark:text-green-400 hover:underline flex items-center gap-0.5">
                  All reports <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {history.length === 0 ? (
                <motion.div key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="py-14 text-center text-gray-400 dark:text-gray-500">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                    <Leaf className="w-10 h-10 opacity-20 mx-auto mb-2" />
                  </motion.div>
                  <p className="text-sm">{t('no_predictions_yet')}</p>
                </motion.div>
              ) : (
                <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/40">
                          <th className="px-5 py-3 text-left">{t('date')}</th>
                          <th className="px-5 py-3 text-left">{t('disease')}</th>
                          <th className="px-5 py-3 text-left hidden sm:table-cell">{t('crop_type')}</th>
                          <th className="px-5 py-3 text-left">{t('confidence')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {history.map((item, i) => (
                          <motion.tr key={item.id}
                            variants={rowVariant(i)}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ backgroundColor: 'rgba(16,185,129,0.04)' }}
                            className="transition-colors">
                            <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {format(new Date(item.created_at), 'MMM d, HH:mm')}
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white">
                              {item.disease_name}
                            </td>
                            <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                              {item.crop_type || '—'}
                            </td>
                            <td className="px-5 py-3.5">
                              <motion.span
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 260, damping: 18 }}
                                className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${confColor(item.confidence)}`}>
                                {item.confidence}%
                              </motion.span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
