'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, CloudSun, Search, MapPin,
  ThermometerSun, Wind, Eye, Cloud, Droplets,
  CheckCircle2, ChevronRight, Info
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

/* ── Open-Meteo URLs (free, no API key, CORS-enabled) ── */
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const METEO_URL = 'https://api.open-meteo.com/v1/forecast'

/* ── Risk config ── */
const riskConfig: Record<string, {
  label: string; bg: string; border: string; text: string
  badge: string; icon: string
}> = {
  high: {
    label: 'High Disease Risk',
    bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', icon: '🔴',
  },
  moderate: {
    label: 'Moderate Disease Risk',
    bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', icon: '🟡',
  },
  low: {
    label: 'Low Disease Risk',
    bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-300',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', icon: '🟢',
  },
}

const generalAdvice: Record<string, string> = {
  high: 'High disease risk. Avoid overhead irrigation, improve air circulation, and consider preventive fungicide application. Inspect crops daily for early symptoms.',
  moderate: 'Moderate disease risk. Monitor crops closely, ensure proper ventilation, and avoid excess moisture on leaves. Scout for disease signs every 2-3 days.',
  low: 'Low disease risk. Maintain good agronomic practices. Conditions are currently unfavourable for most crop pathogens.',
}

/* ── Risk scoring (runs in browser) ── */
function calcRisk(humidity: number, temperature: number, precipitation: number,
  cloudCover: number, dewPoint: number, windSpeed: number) {
  let score = 0
  const factors: string[] = []

  if (humidity > 90) { score += 3; factors.push('Very high humidity (>90%) — critical fungal/bacterial risk') }
  else if (humidity > 80) { score += 2; factors.push('High humidity (>80%) — favourable for fungal spread') }
  else if (humidity > 65) { score += 1; factors.push('Moderate humidity — some disease pressure possible') }

  if (temperature >= 20 && temperature <= 28) { score += 3; factors.push(`Temperature ${temperature}°C — optimal pathogen range`) }
  else if (temperature >= 15 && temperature <= 30) { score += 2; factors.push(`Temperature ${temperature}°C — within disease-conducive range`) }
  else if (temperature >= 10 && temperature < 15) { score += 1; factors.push(`Temperature ${temperature}°C — cool; downy mildew risk elevated`) }

  if (precipitation > 5) { score += 2; factors.push(`Heavy rainfall (${precipitation}mm) — splash dispersal likely`) }
  else if (precipitation > 0) { score += 1; factors.push(`Rainfall present (${precipitation}mm) — leaf wetness increased`) }

  if (cloudCover > 75) { score += 1; factors.push('Heavy cloud cover — leaves stay wet longer') }

  const spread = temperature - dewPoint
  if (spread < 3) { score += 1; factors.push('Dew point near air temp — overnight dew/condensation likely') }

  if (windSpeed < 3 && score >= 3) { score += 1; factors.push('Low wind — airborne spores stay localised') }

  if (!factors.length) factors.push('Conditions currently unfavourable for most crop diseases')

  return {
    risk_level: score >= 7 ? 'high' : score >= 4 ? 'moderate' : 'low',
    risk_factors: factors,
  }
}

/* ── animation variants ── */
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 } }
}
const slideUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
}

export default function WeatherPage() {
  const { t } = useLanguage()
  const [region, setRegion] = useState('')
  const [weatherData, setWeatherData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [error, setError] = useState('')

  const handleCheckWeather = async () => {
    const q = region.trim()
    if (!q) { setError(t('please_enter_region_or_city')); return }
    setError('')
    setWeatherData(null)
    setLoading(true)

    try {
      // Step 1 — geocode
      setLoadingStep(t('finding_location'))
      const geoRes = await fetch(`${GEO_URL}?name=${encodeURIComponent(q)}&count=1&language=en&format=json`)
      if (!geoRes.ok) throw new Error('Geocoding failed')
      const geoJson = await geoRes.json()
      const place = geoJson?.results?.[0]
      if (!place) throw new Error(`Location "${q}" not found. Try a different spelling or add the country (e.g. "Pune, India").`)

      const { latitude: lat, longitude: lon, name, country } = place

      // Step 2 — fetch weather (5 variables, fast single request)
      setLoadingStep(t('loading_live_weather'))
      const params = new URLSearchParams({
        latitude: String(lat),
        longitude: String(lon),
        current: 'temperature_2m,relative_humidity_2m,precipitation,cloud_cover,dew_point_2m,wind_speed_10m',
        timezone: 'auto',
        wind_speed_unit: 'kmh',
      })
      const wxRes = await fetch(`${METEO_URL}?${params}`)
      if (!wxRes.ok) throw new Error('Weather fetch failed')
      const wxJson = await wxRes.json()
      const cur = wxJson?.current || {}

      const temperature = Number(cur.temperature_2m ?? 22)
      const humidity = Number(cur.relative_humidity_2m ?? 50)
      const precipitation = Number(cur.precipitation ?? 0)
      const cloudCover = Number(cur.cloud_cover ?? 50)
      const dewPoint = Number(cur.dew_point_2m ?? 10)
      const windSpeed = Number(cur.wind_speed_10m ?? 5)

      const { risk_level, risk_factors } = calcRisk(humidity, temperature, precipitation, cloudCover, dewPoint, windSpeed)

      setWeatherData({
        location: `${name}${country ? `, ${country}` : ''}`,
        source: 'Open-Meteo · Live',
        humidity: humidity.toFixed(1),
        temperature: temperature.toFixed(1),
        precipitation: precipitation.toFixed(1),
        cloud_cover: cloudCover.toFixed(1),
        dew_point: dewPoint.toFixed(1),
        wind_speed: windSpeed.toFixed(1),
        risk_level,
        risk_factors,
      })
    } catch (e: any) {
      setError(e.message || 'Could not fetch weather data. Please check the region name.')
    } finally {
      setLoading(false)
      setLoadingStep('')
    }
  }

  const risk = weatherData ? (riskConfig[weatherData.risk_level] ?? riskConfig.moderate) : null

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />

        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-5 text-white text-sm font-semibold">
                <CloudSun className="w-4 h-4" />{t('live_weather_disease_risk')}
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 drop-shadow">
                {t('weather_disease_risk_title')}
              </h1>
              <p className="text-sky-100 text-lg max-w-xl mx-auto">
                {t('real_time_weather_info')}
              </p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
        </div>

        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          {/* Search card */}
          <motion.div variants={slideUp}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-sky-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">{t('enter_region_weather')}</h2>
              <span className="ml-auto text-xs text-gray-400">{t('works_for_any_city')}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && handleCheckWeather()}
                  placeholder={t('enter_region_placeholder_2')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-sky-400 focus:outline-none transition-colors text-sm"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleCheckWeather}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md shadow-sky-500/30 disabled:opacity-60 transition-all text-sm whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {loadingStep || t('loading')}
                  </span>
                ) : t('check_weather')}
              </motion.button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-start gap-1.5">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
              </p>
            )}
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {weatherData && risk && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                {/* Location + source */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-500" />
                    <span className="font-bold text-gray-900 dark:text-white text-lg">{weatherData.location}</span>
                  </div>
                  <span className="text-xs bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 rounded-full px-3 py-1 flex items-center gap-1">
                    <Info className="w-3 h-3" />{weatherData.source}
                  </span>
                </div>

                {/* Metric cards */}
                <motion.div variants={stagger} initial="hidden" animate="visible"
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { icon: Droplets, label: t('humidity'), value: `${weatherData.humidity}%`, color: 'from-sky-500 to-blue-500', bg: 'bg-sky-50 dark:bg-sky-900/20', border: 'border-sky-100 dark:border-sky-800/40' },
                    { icon: ThermometerSun, label: t('temperature'), value: `${weatherData.temperature}°C`, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800/40' },
                    { icon: Cloud, label: t('precipitation'), value: `${weatherData.precipitation}mm`, color: 'from-slate-400 to-gray-500', bg: 'bg-slate-50 dark:bg-slate-900/20', border: 'border-slate-100 dark:border-slate-800/40' },
                    { icon: Eye, label: t('cloud_cover'), value: `${weatherData.cloud_cover}%`, color: 'from-indigo-400 to-blue-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-800/40' },
                    { icon: ThermometerSun, label: t('dew_point'), value: `${weatherData.dew_point}°C`, color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-100 dark:border-teal-800/40' },
                    { icon: Wind, label: t('wind_speed'), value: `${weatherData.wind_speed} km/h`, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-100 dark:border-violet-800/40' },
                  ].map(({ icon: Icon, label, value, color, bg, border }) => (
                    <motion.div key={label}
                      variants={scaleIn}
                      whileHover={{ y: -6, boxShadow: '0 12px 32px -8px rgba(0,0,0,0.12)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`${bg} border ${border} rounded-2xl p-4 text-center shadow-sm`}
                    >
                      <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${color} shadow mb-2.5`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-xl font-extrabold text-gray-900 dark:text-white">{value}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{label}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Risk banner */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                  className={`${risk.bg} border-2 ${risk.border} rounded-2xl p-5`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{risk.icon}</span>
                    <div>
                      <h3 className={`font-bold text-lg ${risk.text}`}>{t(`${weatherData.risk_level}_disease_risk`)}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('based_on_current_conditions')}</p>
                    </div>
                    <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${risk.badge}`}>
                      {weatherData.risk_level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {t(`${weatherData.risk_level}_risk_advice`) || t('moderate_risk_advice')}
                  </p>

                  {weatherData.risk_factors?.length > 0 && (
                    <>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                        {t('risk_factors_detected')}
                      </p>
                      <ul className="space-y-1.5">
                        {weatherData.risk_factors.map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <ChevronRight className="w-4 h-4 mt-0.5 text-sky-500 flex-shrink-0" />{f}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </motion.div>

                {/* Disclaimer */}
                <div className="flex items-start gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {t('weather_disclaimer')}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
