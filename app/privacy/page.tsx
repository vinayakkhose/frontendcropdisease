'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Server, Key, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

const sections = [
  {
    icon: Eye,
    title: 'Data We Collect',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    points: [
      'Account information (name, email address)',
      'Prediction history and uploaded leaf images',
      'Usage analytics to improve our service',
      'Location data for weather-based disease risk',
    ],
  },
  {
    icon: Server,
    title: 'How We Use It',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-800',
    points: [
      'Deliver accurate disease predictions and recommendations',
      'Generate personalized analytics and reports',
      'Improve AI model accuracy over time',
      'We never sell your personal data to third parties',
    ],
  },
  {
    icon: Lock,
    title: 'Security',
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-800',
    points: [
      'Secure authentication with JWT tokens',
      'All connections use HTTPS encryption',
      'Passwords are hashed and never plain text',
      'Regular security audits and updates',
    ],
  },
  {
    icon: Key,
    title: 'Your Rights',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    points: [
      'Access your personal data at any time',
      'Request deletion of your account and data',
      'Export your prediction history as PDF or CSV',
      'Contact us for any privacy-related concerns',
    ],
  },
]

export default function PrivacyPage() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-700 via-gray-800 to-zinc-800">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(45deg,white 25%,transparent 25%),linear-gradient(-45deg,white 25%,transparent 25%)', backgroundSize: '20px 20px' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-white/90 text-sm font-medium border border-white/20">
              <Shield className="w-4 h-4" />
              Last updated: 2024
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 drop-shadow">{t('privacy_policy')}</h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              {t('privacy_desc')}
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50 dark:from-gray-950 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* Trust banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-10 flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Your data is secure with us</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">CropGuard uses industry-standard security practices to protect your information.</p>
          </div>
        </motion.div>

        {/* Policy cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {sections.map((sec, i) => (
            <motion.div key={sec.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * (i + 2) }}
              className={`${sec.bg} border ${sec.border} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${sec.color} shadow mb-4`}>
                <sec.icon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{sec.title}</h2>
              <ul className="space-y-2">
                {sec.points.map((pt, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-slate-700 to-gray-800 rounded-2xl p-8 text-center text-white shadow-xl mb-8">
          <Shield className="w-10 h-10 mx-auto mb-3 opacity-80" />
          <h3 className="text-xl font-bold mb-2">Questions about your privacy?</h3>
          <p className="text-gray-300 text-sm mb-5">Our team is happy to answer any privacy-related questions.</p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 bg-white text-slate-800 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition shadow-md">
            Get in Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="text-center">
          <Link href="/" className="text-slate-500 dark:text-gray-400 hover:underline text-sm">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
