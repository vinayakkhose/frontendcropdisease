'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown, Upload, Leaf, Cloud, Settings, MessageCircle, ArrowRight, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'

const faqs = [
  {
    icon: Upload,
    category: 'Getting Started',
    q: 'How do I detect a crop disease?',
    a: 'Go to Predict Disease, upload a clear photo of an affected leaf, select your crop type if known, and click Analyze. The AI will identify the disease and suggest detailed treatment options within seconds.',
    accent: 'from-emerald-400 to-teal-500',
    iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
    borderOpen: 'border-emerald-200 dark:border-emerald-800',
  },
  {
    icon: Leaf,
    category: 'Image Upload',
    q: 'What image format is supported?',
    a: 'We support JPG, JPEG, and PNG images up to 10MB. For best results, use a clear, well-lit photo of the affected leaf against a neutral background. Avoid blurry or dark images.',
    accent: 'from-green-400 to-lime-500',
    iconBg: 'bg-gradient-to-br from-green-400 to-lime-500',
    badgeColor: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
    borderOpen: 'border-green-200 dark:border-green-800',
  },
  {
    icon: Cloud,
    category: 'Weather',
    q: 'How does weather affect disease risk?',
    a: 'Check the Weather page — high humidity and moderate temperatures increase disease spread. Enter your region to get location-specific risk recommendations and preventive actions.',
    accent: 'from-sky-400 to-blue-500',
    iconBg: 'bg-gradient-to-br from-sky-400 to-blue-500',
    badgeColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400',
    borderOpen: 'border-sky-200 dark:border-sky-800',
  },
  {
    icon: Settings,
    category: 'Customization',
    q: 'Can I add my own crop type?',
    a: 'Yes. In Predict Disease, select "Other (Custom)" from the crop dropdown and type your crop name (e.g., Mango, Banana). The AI will adapt its analysis accordingly.',
    accent: 'from-orange-400 to-amber-500',
    iconBg: 'bg-gradient-to-br from-orange-400 to-amber-500',
    badgeColor: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400',
    borderOpen: 'border-orange-200 dark:border-orange-800',
  },
  {
    icon: MessageCircle,
    category: 'Reports',
    q: 'How do I export my reports?',
    a: 'Go to the Reports page where you can export your prediction history in PDF or CSV format. The PDF report includes disease frequency tables and summaries for easy sharing.',
    accent: 'from-pink-400 to-rose-500',
    iconBg: 'bg-gradient-to-br from-pink-400 to-rose-500',
    badgeColor: 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-400',
    borderOpen: 'border-pink-200 dark:border-pink-800',
  },
]

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

export default function HelpPage() {
  const { t } = useLanguage()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero — consistent with Privacy / About pages */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-800 dark:via-teal-800 dark:to-cyan-800">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-white text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              {t('support_center')}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 drop-shadow">{t('help_faq')}</h1>
            <p className="text-emerald-100 text-lg max-w-xl mx-auto">
              {t('help_desc')}
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-emerald-50 dark:from-gray-950 to-transparent" />
      </div>

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* FAQ Accordion */}
        <motion.div variants={stagger} className="space-y-3 mb-12">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={i}
                variants={slideUp}
                className={`bg-white dark:bg-gray-800 rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm
                  ${isOpen
                    ? `${faq.borderOpen} shadow-md`
                    : 'border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600'}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <motion.div
                    animate={{ rotate: isOpen ? 360 : 0 }}
                    transition={{ duration: 0.35 }}
                    className={`flex-shrink-0 w-11 h-11 rounded-xl ${faq.iconBg} flex items-center justify-center shadow-md`}
                  >
                    <faq.icon className="w-5 h-5 text-white" />
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <span className={`inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1.5 ${faq.badgeColor}`}>
                      {faq.category}
                    </span>
                    <p className="font-semibold text-gray-900 dark:text-white leading-snug">{faq.q}</p>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors
                      ${isOpen ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}
                  >
                    <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 ml-[60px]">
                        <div className={`h-px w-full bg-gradient-to-r ${faq.accent} opacity-40 mb-3`} />
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={slideUp}
          className="bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 rounded-2xl p-8 text-center shadow-xl text-white"
        >
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-emerald-100 text-sm mb-6">Reach out through the Contact page — we&apos;d love to help!</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-7 py-3 rounded-xl hover:bg-emerald-50 transition shadow-md"
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div variants={slideUp} className="mt-8 text-center">
          <Link href="/" className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm">← Back to Home</Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
