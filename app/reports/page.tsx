'use client'

import { useState, useEffect, useCallback } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileText, Calendar, X, Trash2, BarChart3, Activity, ChevronRight } from 'lucide-react'
import { predictionAPI, analyticsAPI } from '@/lib/api'
import { format } from 'date-fns'
// jsPDF is lazy-imported on demand to avoid bloating the initial JS bundle
import { useLanguage } from '@/lib/language-context'

export interface PredictionResult {
  id?: string
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
  not_plant?: boolean
  message?: string
}

interface DiseaseFreqItem { disease?: string; count?: number }
interface ReportData {
  predictions: any[]
  analytics: { diseaseFrequency?: DiseaseFreqItem[]; cropHealth?: unknown[]; trends?: unknown[] }
  dateRange: { start: Date; end: Date }
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

export default function ReportsPage() {
  const { t } = useLanguage()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPrediction, setSelectedPrediction] = useState<any | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [dateRange] = useState({ start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() })

  const loadReportData = useCallback(async () => {
    setLoading(true)
    try {
      // 2 parallel calls instead of 4 — /summary runs 3 aggregations concurrently on the server
      const [predictions, summary] = await Promise.all([
        predictionAPI.getHistory(20),          // reduced from 100 for fast initial load
        analyticsAPI.getSummary(),             // replaces 3 separate analytics calls
      ])
      setReportData({
        predictions,
        analytics: {
          diseaseFrequency: summary?.diseaseFrequency ?? [],
          cropHealth: summary?.cropHealth ?? [],
          trends: summary?.trends ?? [],
        },
        dateRange,
      })
    } catch (error) {
      console.error('Failed to load report data:', error)
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => { loadReportData() }, [])

  const loadPredictionDetails = async (id: string) => {
    setDetailsLoading(true)
    try { const full = await predictionAPI.getById(id); setSelectedPrediction(full) }
    catch { /* noop */ } finally { setDetailsLoading(false) }
  }

  const handleDeletePrediction = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this report?')) return
    try {
      await predictionAPI.delete(id)
      setReportData(prev => prev ? { ...prev, predictions: prev.predictions.filter(p => p.id !== id) } : null)
      if (selectedPrediction?.id === id) setSelectedPrediction(null)
    } catch { /* noop */ }
  }

  const exportPDF = async () => {
    if (!reportData) return
    // Lazy-import jsPDF only when the user clicks Export — keeps initial bundle small
    const { default: jsPDF } = await import('jspdf')
    await import('jspdf-autotable')
    const doc = new jsPDF()
    doc.setFontSize(20); doc.text('Crop Disease Detection Report', 14, 22)
    doc.setFontSize(12); doc.text(`Period: ${format(dateRange.start, 'MMM dd, yyyy')} - ${format(dateRange.end, 'MMM dd, yyyy')}`, 14, 30)
    doc.setFontSize(16); doc.text('Summary', 14, 45)
    doc.setFontSize(12); doc.text(`Total Predictions: ${reportData.predictions.length}`, 14, 55)
    const uniqueDiseases = new Set(reportData.predictions.map((p: any) => p.disease_name)).size
    doc.text(`Unique Diseases: ${uniqueDiseases}`, 14, 62)
    doc.setFontSize(16); doc.text('Disease Frequency', 14, 80)
    const tableData = (reportData.analytics.diseaseFrequency ?? []).slice(0, 10).map((item: DiseaseFreqItem) => [item.disease ?? '', (item.count ?? 0).toString()])
      ; (doc as any).autoTable({ startY: 85, head: [['Disease', 'Count']], body: tableData })
    doc.save(`crop-disease-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
  }

  const exportCSV = () => {
    if (!reportData) return
    const headers = ['Date', 'Disease', 'Crop Type', 'Confidence']
    const rows = reportData.predictions.map(p => [format(new Date(p.created_at), 'yyyy-MM-dd HH:mm'), p.disease_name, p.crop_type || 'N/A', `${p.confidence}%`])
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `crop-disease-report-${format(new Date(), 'yyyy-MM-dd')}.csv`; a.click()
  }

  const uniqueDiseases = new Set(reportData?.predictions.map(p => p.disease_name) ?? []).size

  if (loading) return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('loading_reports')}</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />

        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-5 text-white text-sm font-semibold">
                <BarChart3 className="w-4 h-4" />
                {t('analytics_history')}
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 drop-shadow">{t('reports')}</h1>
              <p className="text-violet-100 text-lg max-w-xl mx-auto">{t('generate_report')}</p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
        </div>

        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          {/* Top bar: export buttons */}
          <div className="flex flex-wrap justify-end gap-3 mb-8">
            {[
              { label: t('export_pdf'), icon: FileText, action: exportPDF },
              { label: t('export_csv'), icon: Download, action: exportCSV },
            ].map(({ label, icon: Icon, action }) => (
              <motion.button key={label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={action}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:border-violet-400 dark:hover:border-violet-600 hover:text-violet-700 dark:hover:text-violet-400 transition-all shadow-sm">
                <Icon className="w-4 h-4" />{label}
              </motion.button>
            ))}
          </div>

          {/* Stats cards */}
          <motion.div variants={stagger} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {[
              { label: t('total_predictions_report'), value: reportData?.predictions.length ?? 0, icon: Activity, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-100 dark:border-violet-800/40' },
              { label: t('unique_diseases'), value: uniqueDiseases, icon: BarChart3, color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800/40' },
              { label: t('period'), value: reportData ? `${format(dateRange.start, 'MMM dd')} – ${format(dateRange.end, 'MMM dd, yyyy')}` : '—', icon: Calendar, color: 'from-teal-500 to-green-500', bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-100 dark:border-teal-800/40', isText: true },
            ].map(({ label, value, icon: Icon, color, bg, border, isText }, i) => (
              <motion.div key={label} variants={scaleIn}
                whileHover={{ y: -6, boxShadow: '0 12px 32px -8px rgba(0,0,0,0.12)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`${bg} border ${border} rounded-2xl p-6 shadow-sm flex items-center gap-4`}>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-md flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                  <p className={`font-extrabold text-gray-900 dark:text-white ${isText ? 'text-sm' : 'text-3xl'}`}>{value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Prediction History Table */}
          <motion.div variants={slideUp}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-sm">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">{t('prediction_history')}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('recent_predictions')}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('date')}</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('disease')}</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('crop_type')}</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('confidence')}</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('actions')}</th>
                  </tr>
                </thead>
                <motion.tbody variants={stagger} initial="hidden" animate="visible"
                  className="divide-y divide-gray-100 dark:divide-gray-700">
                  {reportData?.predictions.slice(0, 20).map((pred) => (
                    <motion.tr key={pred.id} variants={slideUp}
                      onClick={() => loadPredictionDetails(pred.id)}
                      className="hover:bg-violet-50/50 dark:hover:bg-violet-900/10 cursor-pointer transition-colors group">
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {format(new Date(pred.created_at), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                          {pred.disease_name}
                          <ChevronRight className="w-3.5 h-3.5 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{pred.crop_type || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold
                          ${pred.confidence >= 80 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                            : pred.confidence >= 60 ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                              : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'}`}>
                          {pred.confidence}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => handleDeletePrediction(e, pred.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                  {!reportData?.predictions.length && (
                    <motion.tr variants={slideUp}>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 text-sm">{t('no_predictions_yet')}</td>
                    </motion.tr>
                  )}
                </motion.tbody>
              </table>
            </div>
          </motion.div>

          {/* Detail panel */}
          <AnimatePresence>
            {selectedPrediction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-violet-200 dark:border-violet-800/40 shadow-lg overflow-hidden"
              >
                <div className="px-6 py-4 bg-violet-50 dark:bg-violet-900/20 border-b border-violet-100 dark:border-violet-800/40 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{t('prediction_details')}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedPrediction.disease_name} – {selectedPrediction.crop_type || 'N/A'} ({format(new Date(selectedPrediction.created_at), 'MMM dd, yyyy HH:mm')})
                    </p>
                  </div>
                  <button onClick={() => setSelectedPrediction(null)}
                    className="p-2 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-800/40 text-gray-500 dark:text-gray-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  {detailsLoading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500"><div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />{t('loading_details')}</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                          { label: t('disease'), value: selectedPrediction.disease_name },
                          { label: t('crop_type'), value: selectedPrediction.crop_type || 'N/A' },
                          { label: t('confidence'), value: `${selectedPrediction.confidence_percent ?? selectedPrediction.confidence ?? 0}%` },
                          ...(selectedPrediction.pathogen ? [{ label: t('pathogen'), value: selectedPrediction.pathogen }] : []),
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
                          </div>
                        ))}
                      </div>

                      {selectedPrediction.treatment && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/40 rounded-xl p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-green-700 dark:text-green-400 mb-1.5">{t('recommended_medicine')}</p>
                          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{selectedPrediction.treatment}</p>
                        </div>
                      )}

                      {selectedPrediction.fertilizer_suggestion && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 rounded-xl p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400 mb-1.5">{t('fertilizer_suggestion')}</p>
                          <p className="text-sm text-gray-800 dark:text-gray-200">{selectedPrediction.fertilizer_suggestion}</p>
                        </div>
                      )}

                      {selectedPrediction.soil_recommendations?.length > 0 && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">{t('soil_advice')}</p>
                          <ul className="space-y-1">
                            {selectedPrediction.soil_recommendations.map((tip: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <ChevronRight className="w-4 h-4 mt-0.5 text-violet-500 flex-shrink-0" />{tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
