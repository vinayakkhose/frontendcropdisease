'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'
import { Leaf, Droplet, Sun, Shield, Calendar, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'



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

export default function FarmersGuidePage() {
  const { t } = useLanguage()

  const cropCareTips = [
    {
      crop: t('tomato'), emoji: '🍅',
      color: 'from-red-500 to-orange-500', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-100 dark:border-red-800/40',
      tips: [t('tomato_tip_1'), t('tomato_tip_2'), t('tomato_tip_3'), t('tomato_tip_4'), t('tomato_tip_5')],
    },
    {
      crop: t('potato'), emoji: '🥔',
      color: 'from-amber-500 to-yellow-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800/40',
      tips: [t('potato_tip_1'), t('potato_tip_2'), t('potato_tip_3'), t('potato_tip_4'), t('potato_tip_5')],
    },
    {
      crop: t('corn'), emoji: '🌽',
      color: 'from-green-500 to-emerald-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-100 dark:border-green-800/40',
      tips: [t('corn_tip_1'), t('corn_tip_2'), t('corn_tip_3'), t('corn_tip_4'), t('corn_tip_5')],
    },
  ]

  const seasonalTips = [
    {
      season: t('spring'), icon: '🌱', color: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-100 dark:border-green-800/40',
      tasks: [t('spring_task_1'), t('spring_task_2'), t('spring_task_3'), t('spring_task_4')],
    },
    {
      season: t('summer'), icon: '☀️', color: 'from-yellow-500 to-amber-500',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-100 dark:border-yellow-800/40',
      tasks: [t('summer_task_1'), t('summer_task_2'), t('summer_task_3'), t('summer_task_4')],
    },
    {
      season: t('fall'), icon: '🍂', color: 'from-orange-500 to-red-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-100 dark:border-orange-800/40',
      tasks: [t('fall_task_1'), t('fall_task_2'), t('fall_task_3'), t('fall_task_4')],
    },
    {
      season: t('winter'), icon: '❄️', color: 'from-blue-500 to-indigo-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800/40',
      tasks: [t('winter_task_1'), t('winter_task_2'), t('winter_task_3'), t('winter_task_4')],
    },
  ]

  const quickCards = [
    {
      icon: Droplet, title: t('watering_guide'), bg: 'bg-sky-50 dark:bg-sky-900/20', border: 'border-sky-100 dark:border-sky-800/40',
      iconColor: 'from-sky-500 to-blue-500',
      desc: t('watering_desc'),
    },
    {
      icon: Sun, title: t('sunlight_req'), bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800/40',
      iconColor: 'from-amber-400 to-orange-500',
      desc: t('sunlight_desc'),
    },
    {
      icon: Shield, title: t('disease_prev'), bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-100 dark:border-green-800/40',
      iconColor: 'from-green-500 to-emerald-500',
      desc: t('disease_desc'),
    },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />

        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-5 text-white text-sm font-semibold">
                <BookOpen className="w-4 h-4" />
                {t('knowledge_hub')}
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 drop-shadow">{t('farmers_guide_title')}</h1>
              <p className="text-green-100 text-lg max-w-xl mx-auto">{t('farmers_guide_subtitle')}</p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
        </div>

        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

          {/* Crop Care Tips */}
          <motion.section variants={slideUp} className="mb-14">
            <div className="flex items-center gap-3 mb-7">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('crop_care_tips')}</h2>
            </div>
            <motion.div variants={stagger} initial="hidden" animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cropCareTips.map((crop) => (
                <motion.div key={crop.crop} variants={scaleIn}
                  whileHover={{ y: -6, boxShadow: '0 12px 32px -8px rgba(0,0,0,0.12)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`${crop.bg} border ${crop.border} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${crop.color} flex items-center justify-center shadow-md text-lg`}>
                      {crop.emoji}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{crop.crop}</h3>
                  </div>
                  <ul className="space-y-2">
                    {crop.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Seasonal Guide */}
          <motion.section variants={slideUp} className="mb-14">
            <div className="flex items-center gap-3 mb-7">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('seasonal_tasks')}</h2>
            </div>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {seasonalTips.map((s) => (
                <motion.div key={s.season} variants={scaleIn}
                  whileHover={{ y: -6, boxShadow: '0 12px 32px -8px rgba(0,0,0,0.12)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`${s.bg} border ${s.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md text-lg`}>
                      {s.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{s.season}</h3>
                  </div>
                  <ul className="space-y-2">
                    {s.tasks.map((task, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <ChevronRight className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Quick Reference */}
          <motion.section variants={slideUp}>
            <div className="flex items-center gap-3 mb-7">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('quick_reference')}</h2>
            </div>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
              className="grid md:grid-cols-3 gap-5">
              {quickCards.map((card) => (
                <motion.div key={card.title} variants={scaleIn}
                  whileHover={{ y: -6, boxShadow: '0 12px 32px -8px rgba(0,0,0,0.12)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`${card.bg} border ${card.border} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.iconColor} shadow-md mb-4`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
