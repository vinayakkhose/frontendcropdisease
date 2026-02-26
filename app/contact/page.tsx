'use client'

import Navbar from '@/components/Navbar'
import { Mail, MessageCircle, MapPin, Send, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { contactAPI } from '@/lib/api'
import { useLanguage } from '@/lib/language-context'

const contactDetails = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'cropguard40@gmail.com',
    href: 'mailto:cropguard40@gmail.com',
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-100 dark:border-green-800/40',
  },
  {
    icon: MessageCircle,
    label: 'Community',
    value: 'Meet our Team',
    href: '/about',
    color: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-100 dark:border-blue-800/40',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Global (Remote)',
    href: null,
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    border: 'border-violet-100 dark:border-violet-800/40',
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

export default function ContactPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await contactAPI.submit(formData)
      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      toast.success('Message sent! We\'ll get back to you soon.')
    } catch {
      toast.error('Failed to send. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
              <MessageCircle className="w-4 h-4" />
              {t('we_respond_24_hours')}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 drop-shadow">{t('get_in_touch')}</h1>
            <p className="text-green-100 text-lg max-w-xl mx-auto">
              {t('contact_desc')}
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
      </div>

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          className="grid md:grid-cols-5 gap-8 lg:gap-12"
          variants={stagger}
        >
          {/* Left: contact info cards */}
          <motion.div className="md:col-span-2 flex flex-col gap-4" variants={slideUp}>
            <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Contact Details</p>

            {contactDetails.map((item) => (
              <motion.div
                key={item.label}
                variants={scaleIn}
                whileHover={{ y: -6, boxShadow: '0 12px 32px -8px rgba(0,0,0,0.12)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`flex items-center gap-4 p-5 rounded-2xl border ${item.bg} ${item.border} shadow-sm transition-shadow`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">{item.label}</p>
                  {item.href ? (
                    <Link href={item.href} className="text-gray-900 dark:text-white font-semibold hover:text-green-600 dark:hover:text-green-400 transition-colors truncate block">
                      {item.value}
                    </Link>
                  ) : (
                    <p className="text-gray-900 dark:text-white font-semibold">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Trust note */}
            <motion.div
              variants={slideUp}
              className="mt-2 p-5 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg"
            >
              <CheckCircle2 className="w-8 h-8 mb-3 opacity-90" />
              <h3 className="font-bold text-lg mb-1">We&apos;re here to help</h3>
              <p className="text-green-100 text-sm leading-relaxed">
                Our team is committed to helping farmers get the most out of CropGuard&apos;s AI-powered features.
              </p>
            </motion.div>
          </motion.div>

          {/* Right: form */}
          <motion.div className="md:col-span-3" variants={slideUp}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold hover:underline"
                  >
                    Send another message <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Send us a Message</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-7">Fill in the form and we&apos;ll be in touch shortly.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 focus:border-green-500 dark:focus:border-green-400 transition-colors outline-none text-sm"
                        />
                      </div>
                      {/* Email */}
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 focus:border-green-500 dark:focus:border-green-400 transition-colors outline-none text-sm"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Message</label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can we help you today?"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 focus:border-green-500 dark:focus:border-green-400 transition-colors outline-none resize-none text-sm"
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          variants={slideUp}
        >
          <Link href="/" className="text-green-600 dark:text-green-400 hover:underline text-sm font-medium">
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
