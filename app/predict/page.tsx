'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, X, AlertTriangle, Loader2, Camera,
  Pill, Sprout, Shield, Leaf, ChevronDown, ChevronUp,
  CheckCircle2, BarChart3, Microscope, FlaskConical
} from 'lucide-react'
import { predictionAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import { useLanguage } from '@/lib/language-context'

/* ── types ───────────────────────────────────────────────── */
interface PredictionResult {
  disease_name: string
  confidence_percent: number
  top_3_predictions: Array<{ disease: string; confidence: number }>
  treatment: string
  prevention: string[]
  crop_health_score: number
  fertilizer_suggestion?: string
  risk_level: string
  severity?: { severity: string; confidence: number }
  pathogen?: string
  symptoms?: string
  symptoms_list?: string[]
  soil_recommendations?: string[]
  demo?: boolean
  message?: string
  not_plant?: boolean
}

function normalise(data: any): PredictionResult {
  const p = data || {}
  return {
    disease_name: p.disease_name != null ? String(p.disease_name) : 'Unknown',
    confidence_percent: Number(p.confidence_percent) || 0,
    top_3_predictions: (Array.isArray(p.top_3_predictions) ? p.top_3_predictions : [])
      .map((x: any) => ({ disease: String(x?.disease ?? ''), confidence: Number(x?.confidence) || 0 })),
    treatment: String(p.treatment ?? ''),
    prevention: Array.isArray(p.prevention) ? p.prevention : [],
    crop_health_score: Number(p.crop_health_score) || 0,
    fertilizer_suggestion: p.fertilizer_suggestion ? String(p.fertilizer_suggestion) : undefined,
    risk_level: String(p.risk_level ?? 'low'),
    severity: p.severity,
    pathogen: p.pathogen,
    symptoms: p.symptoms,
    symptoms_list: p.symptoms_list,
    soil_recommendations: Array.isArray(p.soil_recommendations) ? p.soil_recommendations : undefined,
    demo: p.demo,
    message: p.message,
    not_plant: p.not_plant,
  }
}

const CROP_OPTIONS = ['Tomato', 'Potato', 'Corn', 'Apple', 'Grape', 'Rice', 'Wheat', 'Cotton', 'Sugarcane']
const SOIL_OPTIONS = ['Sandy', 'Clay', 'Loamy', 'Silty']

const riskStyle: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  high: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300', badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
  moderate: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  low: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-300', badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
}

/* ── Steps (module-level — never recreated) ─────────────────── */
const STEPS = ['Uploading image…', 'Enhancing image quality…', 'Analysing with AI…', 'Building report…'] as const

const ProgressBar = React.memo(function ProgressBar({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value))
  const color = clamped >= 80 ? 'from-green-500 to-emerald-400' : clamped >= 60 ? 'from-amber-500 to-yellow-400' : 'from-red-500 to-orange-400'
  return (
    <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
      />
    </div>
  )
})

const InfoSection = React.memo(function InfoSection({ icon: Icon, title, color, children }: {
  icon: React.ElementType; title: string; color: string; children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  const toggle = useCallback(() => setOpen(v => !v), [])
  return (
    <div className={`rounded-2xl border ${color} overflow-hidden`}>
      <button onClick={toggle}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/60 transition-colors">
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4" />
          <span className="font-semibold text-gray-900 dark:text-white text-sm">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

/* ── main component ──────────────────────────────────────── */
export default function PredictPage() {
  const { t } = useLanguage()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cropType, setCropType] = useState('')
  const [customCrop, setCustomCrop] = useState('')
  const [region, setRegion] = useState('')
  const [soilType, setSoilType] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const onDrop = useCallback((files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
      setPreview(URL.createObjectURL(files[0]))
      setResult(null)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxFiles: 1,
    onDrop,
  })

  const handlePredict = useCallback(async (fileOverride?: File | null) => {
    const targetFile = fileOverride !== undefined ? fileOverride : file;
    if (!targetFile) { toast.error(t('please_select_image')); return }
    setLoading(true)
    setError(null)
    setAnalysisStep(0)

    const stepTimer = setInterval(() => {
      setAnalysisStep(s => (s < STEPS.length - 1 ? s + 1 : s))
    }, 800)

    try {
      const effectiveCrop = cropType === '_custom_' ? customCrop.trim() : cropType
      const res = await predictionAPI.predict(targetFile, effectiveCrop || undefined, region || undefined, soilType || undefined)
      const norm = normalise(res != null && typeof res === 'object' ? res : {})
      setResult(norm)
      if (!norm.not_plant) {
        toast.success(t('prediction_completed'))
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try {
            const { voiceGuide } = await import('@/lib/voice')
            voiceGuide.speak(`Disease detected: ${norm.disease_name}. Confidence: ${norm.confidence_percent} percent. Risk level: ${norm.risk_level}.`)
          } catch { /* noop */ }
        }
      }
    } catch (e: any) {
      const msg = e.response?.data?.detail ?? e.message ?? t('prediction_failed')
      const str = Array.isArray(msg) ? msg.join(' ') : String(msg)
      setError(str)
      toast.error(str)
    } finally {
      clearInterval(stepTimer)
      setLoading(false)
      setAnalysisStep(0)
    }
  }, [file, cropType, customCrop, region, soilType, t])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setShowCamera(false)
  }, [])

  const handleReset = useCallback(() => {
    setFile(null); setPreview(null); setResult(null); setError(null)
    setCropType(''); setCustomCrop(''); setRegion(''); setSoilType('')
    stopCamera()
  }, [stopCamera])

  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Camera access requires a secure HTTPS connection or localhost.')
        return
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; setShowCamera(true) }
    } catch (err: any) { 
        console.error('Camera error:', err)
        if (err.name === 'NotAllowedError') {
           toast.error('Camera permission was denied. Enable it in your browser settings.')
        } else {
           toast.error(t('camera_denied') + ' (Ensure HTTPS)') 
        }
    }
  }, [t])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
    canvas.toBlob(blob => {
      if (blob) {
        const f = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
        setFile(f); setPreview(URL.createObjectURL(blob)); setResult(null); stopCamera();
        handlePredict(f)
      }
    }, 'image/jpeg', 0.95)
  }, [stopCamera, handlePredict])

  const risk = result ? (riskStyle[result.risk_level] ?? riskStyle.low) : null

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />

        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-5 text-white text-sm font-semibold">
                <Microscope className="w-4 h-4" />
                {t('ai_disease_analysis')}
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 drop-shadow">{t('crop_disease_detection')}</h1>
              <p className="text-green-100 text-lg max-w-xl mx-auto">{t('upload_subtitle')}</p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* ── LEFT: Upload panel ──────────────────────── */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 shadow">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                  {t('upload_image_title')}
                </h2>

                {/* Drop zone */}
                {!showCamera && (
                  <div {...getRootProps()}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
                      ${isDragActive
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 scale-[1.01]'
                        : preview
                          ? 'border-green-300 dark:border-green-700 bg-white dark:bg-gray-800'
                          : 'border-gray-200 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50/50 dark:hover:bg-green-900/10'}`}
                  >
                    <input {...getInputProps()} />
                    {preview ? (
                      <div className="relative">
                        <img src={preview} alt="Preview" className="max-w-full max-h-64 mx-auto rounded-xl object-contain" />
                        <button onClick={(e) => { e.stopPropagation(); handleReset() }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow transition">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="mt-3 text-sm text-green-600 dark:text-green-400 font-semibold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> {t('image_ready')}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                          <Upload className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-gray-900 dark:text-white font-semibold mb-1">
                          {isDragActive ? t('drop_here') : t('drag_drop_or_click')}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('image_format_hint')}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Context fields */}
                <div className="mt-5 space-y-4">
                  {/* Crop type */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('crop_type_label')}</label>
                    <select
                      value={CROP_OPTIONS.includes(cropType) ? cropType : cropType ? '_custom_' : ''}
                      onChange={(e) => { const v = e.target.value; if (v === '_custom_') { setCropType('_custom_'); setCustomCrop('') } else { setCropType(v) } }}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:border-green-500 focus:outline-none transition-colors text-sm"
                    >
                      <option value="">{t('select_crop_type')}</option>
                      {CROP_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      <option value="_custom_">{t('other_custom')}</option>
                    </select>
                    {(cropType === '_custom_' || (cropType && !CROP_OPTIONS.includes(cropType))) && (
                      <input
                        type="text"
                        value={cropType === '_custom_' ? customCrop : cropType}
                        onChange={(e) => { setCustomCrop(e.target.value); setCropType('_custom_') }}
                        placeholder={t('crop_placeholder')}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-colors text-sm"
                      />
                    )}
                  </div>

                  {/* Region */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('region_label')}</label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder={t('enter_region_placeholder')}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-colors text-sm"
                    />
                  </div>

                  {/* Soil */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('soil_type_label')}</label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:border-green-500 focus:outline-none transition-colors text-sm"
                    >
                      <option value="">{t('select_soil_type')}</option>
                      {SOIL_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Camera button (mobile only) */}
                {!showCamera && !preview && typeof window !== 'undefined' && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={startCamera}
                      className="w-full mt-4 md:hidden flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-semibold shadow transition">
                      <Camera className="w-5 h-5" />{t('take_photo')}
                    </motion.button>
                  )}

                {/* Analyse button */}
                <motion.button
                  whileHover={!file || loading ? {} : { scale: 1.02 }}
                  whileTap={!file || loading ? {} : { scale: 0.97 }}
                  onClick={() => handlePredict()}
                  disabled={!file || loading}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{STEPS[analysisStep]}</span>
                    </>
                  ) : (
                    <>
                      <Microscope className="w-5 h-5" />
                      <span>{t('predict')}</span>
                    </>
                  )}
                </motion.button>

                {/* Loading progress steps */}
                {loading && (
                  <div className="mt-4 space-y-1">
                    {STEPS.map((step, i) => (
                      <div key={step} className={`flex items-center gap-2 text-xs transition-colors ${i <= analysisStep ? 'text-green-600 dark:text-green-400' : 'text-gray-300 dark:text-gray-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${i < analysisStep ? 'bg-green-500' : i === analysisStep ? 'bg-green-400 animate-pulse' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        {step}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* ── RIGHT: Results panel ───────────────────── */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <div ref={resultsRef}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 min-h-[400px]">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 shadow">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  {t('analysis_results')}
                </h2>

                <AnimatePresence mode="wait">
                  {/* Error state */}
                  {error && !result && (
                    <motion.div key="error" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <h3 className="font-bold text-amber-700 dark:text-amber-300">{t('analysis_failed')}</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                      <button onClick={() => { setError(null); handlePredict() }}
                        className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition">
                        {t('try_again')}
                      </button>
                    </motion.div>
                  )}

                  {/* Not-plant dialog */}
                  {result?.not_plant && (
                    <motion.div key="not-plant" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('invalid_image_title')}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                        {result.message || 'Please upload a clear photo of a plant leaf for disease detection.'}
                      </p>
                      <button onClick={() => setResult(null)}
                        className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition">
                        {t('ok_upload_again')}
                      </button>
                    </motion.div>
                  )}

                  {/* Full result */}
                  {result && !result.not_plant && (
                    <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="space-y-4">

                      {/* Main card */}
                      <div className={`${risk?.bg} border-2 ${risk?.border} rounded-2xl p-5`}>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">{t('suggested_diagnosis')}</p>
                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">{result.disease_name}</h3>
                          </div>
                          <span className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full ${risk?.badge}`}>
                            {(result.risk_level || 'low').toUpperCase()} {t('risk').toUpperCase()}
                          </span>
                        </div>

                        {/* Confidence bar with verbal label */}
                        <div className="mb-4">
                          <div className="flex justify-between mb-1.5">
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                              {t('ai_confidence')} — {result.confidence_percent >= 80 ? 'High' : result.confidence_percent >= 55 ? 'Moderate' : 'Low'}
                            </span>
                            <span className="text-sm font-extrabold text-gray-900 dark:text-white">{result.confidence_percent}%</span>
                          </div>
                          <ProgressBar value={result.confidence_percent} />
                          {result.confidence_percent < 60 && (
                            <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {t('low_confidence_warning')}
                            </p>
                          )}
                        </div>

                        {/* Health score + Severity */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3 text-center">
                            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{result.crop_health_score}<span className="text-sm">/100</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('est_crop_health')}</p>
                          </div>
                          {result.severity && (
                            <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3 text-center">
                              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{result.severity.severity}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('est_severity')}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expert disclaimer */}
                      <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3">
                        <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{t('expert_review_recommended')}</span>{' '}
                          {t('expert_review_details')}
                        </p>
                      </div>

                      {/* Top 3 possible diseases */}
                      {result.top_3_predictions.length > 0 && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">{t('top_3_diseases')}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{t('top_3_desc')}</p>
                          <div className="space-y-2">
                            {result.top_3_predictions.map((pred, i) => (
                              <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${i === 0 ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200'}`}>{i + 1}</span>
                                <span className="flex-1 text-sm text-gray-900 dark:text-white">{pred.disease}</span>
                                <span className={`text-xs font-semibold ${i === 0 ? 'text-green-700 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>{pred.confidence}% {t('likely')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Disease analysis (pathogen/symptoms) */}
                      {(result.pathogen || result.symptoms) && (
                        <InfoSection icon={Microscope} title={t('disease_analysis')} color="border-violet-200 dark:border-violet-800/40 bg-violet-50/50 dark:bg-violet-900/10">
                          {result.pathogen && <p className="text-sm text-gray-700 dark:text-gray-300 mb-1"><span className="font-semibold">{t('pathogen')}:</span> {result.pathogen}</p>}
                          {result.symptoms && <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">{t('symptoms')}:</span> {result.symptoms}</p>}
                        </InfoSection>
                      )}

                      {/* Treatment */}
                      <InfoSection icon={Pill} title={t('suggested_treatment')} color="border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-900/10">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{result.treatment || '—'}</p>
                        <p className="mt-2 text-xs text-blue-500 dark:text-blue-400">⚠️ {t('treatment_warning')}</p>
                      </InfoSection>

                      {/* Prevention */}
                      <InfoSection icon={Shield} title={t('prevention_tips')} color="border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-900/10">
                        <ul className="space-y-1.5">
                          {result.prevention.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />{tip}
                            </li>
                          ))}
                        </ul>
                      </InfoSection>

                      {/* Fertilizer */}
                      {result.fertilizer_suggestion && (
                        <InfoSection icon={FlaskConical} title={t('fertilizer_suggestion')} color="border-green-200 dark:border-green-800/40 bg-green-50/50 dark:bg-green-900/10">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{result.fertilizer_suggestion}</p>
                        </InfoSection>
                      )}

                      {/* Soil advice */}
                      {result.soil_recommendations && result.soil_recommendations.length > 0 && (
                        <InfoSection icon={Leaf} title={t('soil_advice')} color="border-teal-200 dark:border-teal-800/40 bg-teal-50/50 dark:bg-teal-900/10">
                          <ul className="space-y-1.5">
                            {result.soil_recommendations.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <Sprout className="w-4 h-4 mt-0.5 text-teal-500 flex-shrink-0" />{tip}
                              </li>
                            ))}
                          </ul>
                        </InfoSection>
                      )}

                      {/* New analysis button */}
                      <button onClick={handleReset}
                        className="w-full py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-green-400 dark:hover:border-green-600 hover:text-green-700 dark:hover:text-green-400 font-semibold text-sm transition-colors">
                        {t('analyze_another')}
                      </button>
                    </motion.div>
                  )}

                  {/* Empty state */}
                  {!result && !error && !loading && (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-20 h-20 mb-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                        <Leaf className="w-10 h-10 text-green-400 dark:text-green-500" />
                      </div>
                      <p className="font-semibold text-gray-600 dark:text-gray-400 mb-1">{t('no_results_yet')}</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">{t('upload_instruction')}</p>
                    </motion.div>
                  )}

                  {/* Loading state */}
                  {loading && !result && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-20 h-20 mb-5 rounded-full border-4 border-green-200 dark:border-green-800 border-t-green-500 animate-spin" />
                      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{STEPS[analysisStep]}</p>
                      <p className="text-sm text-gray-400">Enhanced AI processing with CLAHE preprocessing…</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Full-screen mobile camera overlay */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overscroll-none"
          >
            {/* Safe area top padding for notches */}
            <div className="w-full flex-1 relative flex items-center justify-center pb-24">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full max-h-[85vh] object-cover rounded-b-3xl" 
              />
              <div className="absolute top-4 right-4 z-10">
                <button onClick={stopCamera} className="bg-black/50 text-white p-3 rounded-full backdrop-blur-md">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-black bg-opacity-80 backdrop-blur-lg flex items-center justify-center gap-8 px-6 pb-6 pt-4 rounded-t-[40px]">
              <button 
                onClick={stopCamera}
                className="text-white/80 hover:text-white font-medium text-lg px-4"
              >
                {t('cancel')}
              </button>
              
              {/* Big capture button */}
              <button 
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent active:scale-95 transition-transform"
              >
                <div className="w-[66px] h-[66px] bg-white rounded-full"></div>
              </button>
              
              <div className="w-16"></div> {/* Spacer to center the capture button */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  )
}
