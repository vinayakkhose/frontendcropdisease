'use client'

import Navbar from '@/components/Navbar'
import About from '@/components/About'
import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

export default function AboutPage() {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />

            {/* Hero */}
            <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-white text-sm font-semibold">
                            <Leaf className="w-4 h-4" />
                            {t('our_story')}
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 drop-shadow">{t('about_cropguard')}</h1>
                        <p className="text-green-100 text-lg max-w-2xl mx-auto">
                            {t('about_cropguard_desc')}
                        </p>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
            </div>

            <About />
        </div>
    )
}
