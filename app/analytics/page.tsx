'use client'

import { useEffect, useState } from 'react'
import { analyticsAPI } from '@/lib/api'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Download, Filter } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#8b5cf6']

type DiseaseFreqItem = { disease?: string; count?: number }
type CropHealthItem = { crop?: string; avg_health_score?: number; total_predictions?: number }
type MonthlyTrendItem = { month_label?: string; total_predictions?: number; unique_diseases?: number }
type RegionWiseItem = { region?: string; total_predictions?: number; unique_diseases?: number }

export default function AnalyticsPage() {
  const { t } = useLanguage()
  const [diseaseFrequency, setDiseaseFrequency] = useState<DiseaseFreqItem[]>([])
  const [cropHealth, setCropHealth] = useState<CropHealthItem[]>([])
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrendItem[]>([])
  const [regionWise, setRegionWise] = useState<RegionWiseItem[]>([])
  const [selectedCrop, setSelectedCrop] = useState('')
  const [loading, setLoading] = useState(true)
  const [availableCrops, setAvailableCrops] = useState<string[]>([])

  useEffect(() => {
    loadAvailableCrops()
  }, [])

  const loadAvailableCrops = async () => {
    try {
      const crops = await analyticsAPI.getAvailableCrops()
      setAvailableCrops(Array.isArray(crops) ? crops : [])
    } catch (error) {
      console.error('Failed to load available crops:', error)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [selectedCrop])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const [freq, health, trends, regions] = await Promise.all([
        analyticsAPI.getDiseaseFrequency(selectedCrop || undefined),
        analyticsAPI.getCropHealth(selectedCrop || undefined),
        analyticsAPI.getMonthlyTrends(selectedCrop || undefined),
        analyticsAPI.getRegionWise(selectedCrop || undefined),
      ])
      setDiseaseFrequency(Array.isArray(freq) ? (freq as DiseaseFreqItem[]) : [])
      setCropHealth(Array.isArray(health) ? (health as CropHealthItem[]) : [])
      setMonthlyTrends(Array.isArray(trends) ? (trends as MonthlyTrendItem[]) : [])
      setRegionWise(Array.isArray(regions) ? (regions as RegionWiseItem[]) : [])
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setDiseaseFrequency([])
      setCropHealth([])
      setMonthlyTrends([])
      setRegionWise([])
    } finally {
      setLoading(false)
    }
  }

  const exportPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')

      const doc = new jsPDF()

      // Title
      doc.setFontSize(18)
      doc.text('Crop Disease Analytics Report', 14, 22)
      doc.setFontSize(12)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)
      if (selectedCrop) {
        doc.text(`Crop Filter: ${selectedCrop}`, 14, 36)
      }

      let yPos = 45

      // Disease Frequency Table
      if (diseaseFrequency.length > 0) {
        doc.setFontSize(14)
        doc.text('Disease Frequency', 14, yPos)
        yPos += 5

        const freqData = diseaseFrequency.slice(0, 10).map((item: { disease?: string; count?: number }) => [
          item.disease || 'Unknown',
          item.count?.toString() || '0'
        ])

        autoTable(doc, {
          head: [['Disease', 'Count']],
          body: freqData,
          startY: yPos,
          theme: 'striped',
        })
        yPos = (doc as any).lastAutoTable.finalY + 10
      }

      // Crop Health Table
      if (cropHealth.length > 0) {
        doc.setFontSize(14)
        doc.text('Crop Health Statistics', 14, yPos)
        yPos += 5

        const healthData = cropHealth.map((item: { crop?: string; avg_health_score?: number; total_predictions?: number }) => [
          item.crop || 'Unknown',
          item.avg_health_score?.toFixed(2) || '0',
          item.total_predictions?.toString() || '0'
        ])

        autoTable(doc, {
          head: [['Crop', 'Avg Health Score', 'Total Predictions']],
          body: healthData,
          startY: yPos,
          theme: 'striped',
        })
        yPos = (doc as any).lastAutoTable.finalY + 10
      }

      // Region-wise Table
      if (regionWise.length > 0) {
        doc.setFontSize(14)
        doc.text('Region-wise Disease Spread', 14, yPos)
        yPos += 5

        const regionData = regionWise.slice(0, 10).map((item: { region?: string; total_predictions?: number; unique_diseases?: number }) => [
          item.region || 'Unknown',
          item.total_predictions?.toString() || '0',
          item.unique_diseases?.toString() || '0'
        ])

        autoTable(doc, {
          head: [['Region', 'Total Predictions', 'Unique Diseases']],
          body: regionData,
          startY: yPos,
          theme: 'striped',
        })
      }

      doc.save(`crop-disease-analytics-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('PDF export failed:', error)
      alert('Failed to export PDF. Please try again.')
    }
  }

  const exportCSV = () => {
    try {
      // Combine all data
      const csvRows: string[] = []

      // Disease Frequency
      csvRows.push('Disease Frequency')
      csvRows.push('Disease,Count')
      diseaseFrequency.forEach((item: { disease?: string; count?: number }) => {
        csvRows.push(`${item.disease || 'Unknown'},${item.count || 0}`)
      })
      csvRows.push('')

      // Crop Health
      csvRows.push('Crop Health Statistics')
      csvRows.push('Crop,Avg Health Score,Total Predictions')
      cropHealth.forEach((item: { crop?: string; avg_health_score?: number; total_predictions?: number }) => {
        csvRows.push(`${item.crop || 'Unknown'},${item.avg_health_score?.toFixed(2) || 0},${item.total_predictions || 0}`)
      })
      csvRows.push('')

      // Monthly Trends
      csvRows.push('Monthly Trends')
      csvRows.push('Month,Total Predictions,Unique Diseases')
      monthlyTrends.forEach((item: { month_label?: string; total_predictions?: number; unique_diseases?: number }) => {
        csvRows.push(`${item.month_label || 'Unknown'},${item.total_predictions || 0},${item.unique_diseases || 0}`)
      })
      csvRows.push('')

      // Region-wise
      csvRows.push('Region-wise Disease Spread')
      csvRows.push('Region,Total Predictions,Unique Diseases')
      regionWise.forEach((item: { region?: string; total_predictions?: number; unique_diseases?: number }) => {
        csvRows.push(`${item.region || 'Unknown'},${item.total_predictions || 0},${item.unique_diseases || 0}`)
      })

      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `crop-disease-analytics-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('CSV export failed:', error)
      alert('Failed to export CSV. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-400"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{t('analytics')}</h1>
            <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value="">{t('all_crops')}</option>
                {availableCrops.map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
              <button
                onClick={exportPDF}
                className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 text-sm sm:text-base"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t('export_pdf')}</span>
                <span className="sm:hidden">PDF</span>
              </button>
              <button
                onClick={exportCSV}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 text-sm sm:text-base"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t('export_csv')}</span>
                <span className="sm:hidden">CSV</span>
              </button>
            </div>
          </div>

          {/* Disease Frequency Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{t('disease_frequency')}</h2>
            <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
              <BarChart data={diseaseFrequency.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="disease" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Crop Health Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{t('crop_health')}</h2>
            {cropHealth.length > 0 ? (
              <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
                <BarChart data={cropHealth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="crop" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avg_health_score" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                <p>{t('no_crop_health_data')}</p>
              </div>
            )}
          </motion.div>

          {/* Monthly Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 dark:text-white">{t('monthly_trends')}</h2>
            {monthlyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month_label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total_predictions"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name={t('total_predictions')}
                  />
                  <Line
                    type="monotone"
                    dataKey="unique_diseases"
                    stroke="#eab308"
                    strokeWidth={2}
                    name={t('unique_diseases')}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                <p>{t('no_monthly_trend_data')}</p>
              </div>
            )}
          </motion.div>

          {/* Region-wise Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{t('region_wise')}</h2>
            {regionWise.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={regionWise.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ region, percent }: { region?: string; percent?: number }) =>
                      `${region ?? 'Unknown'}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="total_predictions"
                  >
                    {regionWise.slice(0, 5).map((entry: { region?: string }, index: number) => (
                      <Cell key={`cell-${entry.region ?? index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                <p>{t('no_region_data')}</p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </ProtectedRoute>
  )
}
