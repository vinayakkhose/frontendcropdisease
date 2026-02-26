'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Leaf, Shield, BarChart3, Upload, CloudSun, BookOpen, Sparkles, Star } from 'lucide-react'
import Navbar from '@/components/Navbar'
import About from '@/components/About'
import { useLanguage } from '@/lib/language-context'
import { useAuthStore } from '@/lib/store'

/* ── translations (unchanged from original) ─────────────── */
const translations: Record<string, Record<string, string>> = {
  en: {
    title: 'Detect Crop Diseases with', titleHighlight: 'AI Precision',
    subtitle: 'Protect your crops with advanced deep learning technology. Upload an image and get instant disease diagnosis with treatment recommendations.',
    tryNow: 'Try Now', viewDashboard: 'View Dashboard', featuresTitle: 'Powerful Features',
    feature1Title: 'AI-Powered Detection', feature1Desc: 'Advanced MobileNetV2 model with 90%+ accuracy for reliable disease identification.',
    feature2Title: 'Analytics Dashboard', feature2Desc: 'Track disease trends, crop health, and regional patterns with interactive charts.',
    feature3Title: 'Treatment Guidance', feature3Desc: 'Get personalized treatment suggestions and prevention tips for each disease.',
    ctaTitle: 'Ready to Protect Your Crops?', ctaSubtitle: 'Join thousands of farmers using AI to safeguard their harvests', getStarted: 'Get Started Free',
  },
  hi: {
    title: 'AI सटीकता के साथ', titleHighlight: 'फसल रोगों का पता लगाएं',
    subtitle: 'उन्नत गहन शिक्षण तकनीक के साथ अपनी फसलों की सुरक्षा करें।', tryNow: 'अभी आज़माएं', viewDashboard: 'डैशबोर्ड देखें',
    featuresTitle: 'शक्तिशाली सुविधाएं', feature1Title: 'AI-संचालित पहचान', feature1Desc: '90%+ सटीकता के साथ उन्नत MobileNetV2 मॉडल।',
    feature2Title: 'विश्लेषण डैशबोर्ड', feature2Desc: 'रोग रुझान और फसल स्वास्थ्य ट्रैक करें।', feature3Title: 'उपचार मार्गदर्शन',
    feature3Desc: 'प्रत्येक रोग के लिए उपचार सुझाव प्राप्त करें।', ctaTitle: 'आपकी फसलों की सुरक्षा के लिए तैयार हैं?',
    ctaSubtitle: 'AI का उपयोग करने वाले हजारों किसानों में शामिल हों', getStarted: 'मुफ्त शुरू करें',
  },
  mr: {
    title: 'AI अचूकतेसह', titleHighlight: 'पिक रोग शोधा',
    subtitle: 'प्रगत डीप लर्निंग तंत्रज्ञानाने आपल्या पिकांचे रक्षण करा.', tryNow: 'आता वापरा', viewDashboard: 'डॅशबोर्ड पहा',
    featuresTitle: 'शक्तिशाली वैशिष्ट्ये', feature1Title: 'AI-चालित शोध', feature1Desc: '90%+ अचूकतेसह प्रगत मॉडेल.',
    feature2Title: 'विश्लेषण डॅशबोर्ड', feature2Desc: 'रोग ट्रेंड ट्रॅक करा.', feature3Title: 'उपचार मार्गदर्शन',
    feature3Desc: 'प्रत्येक रोगासाठी उपचार सूचना मिळवा.', ctaTitle: 'आपल्या पिकांचे रक्षण करण्यास तयार आहात?',
    ctaSubtitle: 'AI वापरणाऱ्या हजारो शेतकऱ्यांमध्ये सामील व्हा', getStarted: 'विनामूल्य सुरू करा',
  },
}

const features = [
  { icon: Shield, key: 'feature1', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-100 dark:border-green-800/40' },
  { icon: BarChart3, key: 'feature2', color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800/40' },
  { icon: Leaf, key: 'feature3', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800/40' },
]

const stats = [
  { value: '90%+', label: 'Detection Accuracy' },
  { value: '38+', label: 'Disease Classes' },
  { value: '5s', label: 'Avg. Analysis Time' },
  { value: '8', label: 'Languages Supported' },
]

export default function LandingPage() {
  const { language } = useLanguage()
  const L = translations[language] || translations.en
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
    </div>
  )

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 w-full max-w-[100vw] overflow-x-hidden">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pt-20 pb-24">
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-green-200/40 to-emerald-300/30 dark:from-green-900/20 dark:to-emerald-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-teal-200/30 to-cyan-300/20 dark:from-teal-900/10 dark:to-cyan-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 shadow-sm rounded-full px-4 py-2 mb-8 text-green-700 dark:text-green-400 text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Crop Disease Detection
              <Sparkles className="w-4 h-4" />
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              {L.title}{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">{L.titleHighlight}</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              {L.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/predict"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all w-full sm:w-auto">
                  <Upload className="w-5 h-5" />
                  {L.tryNow}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-2xl text-lg font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-gray-700 transition-all w-full sm:w-auto shadow-sm">
                  {L.viewDashboard}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────────── */}
      <section className="border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full px-4 py-2 text-sm font-semibold mb-4">
            <Star className="w-4 h-4" />
            {L.featuresTitle}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Everything a farmer needs</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, key, color, bg, border }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              whileHover={{ y: -4 }}
              className={`${bg} border ${border} rounded-2xl p-7 shadow-sm hover:shadow-md transition-all duration-300`}
            >
              <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${color} shadow-md mb-5`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{(L as any)[`${key}Title`]}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{(L as any)[`${key}Desc`]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Quick links ────────────────────────────────────── */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-10 border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Farmer's Guide", href: '/farmers-guide', icon: BookOpen, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
              { label: 'Weather', href: '/weather', icon: CloudSun, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/30' },
              { label: 'Reports', href: '/reports', icon: BarChart3, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30' },
              { label: 'Predict Disease', href: '/predict', icon: Upload, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
            ].map(({ label, href, icon: Icon, color, bg }) => (
              <motion.div key={href} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link href={href} className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800 shadow-sm hover:shadow-md transition-all text-center group">
                  <div className={`p-3 rounded-xl ${bg}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-green-500 transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────── */}
      <About />

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 py-16 sm:py-20">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">{L.ctaTitle}</h2>
            <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">{L.ctaSubtitle}</p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/register"
                className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-4 rounded-2xl hover:bg-green-50 transition shadow-xl text-base">
                {L.getStarted} <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">CropGuard</span>
          </div>
          <Link href="/about" className="text-green-400 hover:text-green-300 transition underline text-sm">
            About &amp; Contributors
          </Link>
          <p className="mt-2 text-gray-500 text-sm">&copy; 2024 CropGuard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
