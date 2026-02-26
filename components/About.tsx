'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Mail, Linkedin, ExternalLink, X, Briefcase, Calendar, Cpu, Leaf, BarChart3, CloudSun } from 'lucide-react'
import { useState } from 'react'

const contributors = [
  {
    name: 'Vinayak Khose',
    role: 'Fullstack Developer',
    department: 'MCA',
    batchYear: '2026',
    description:
      'Designed and implemented the backend architecture using Python FastAPI, including authentication. Focused on secure system design, database integration, and scalable business logic. Built and integrated full-stack system features including UI dashboards, REST APIs for crop disease analysis.',
    email: 'vinayakkhose2020@gmail.com',
    linkedin: 'https://www.linkedin.com/in/vinayak-khose-146100231/',
    image: '/contributors/vinayak-khose.jpg',
    initials: 'VK',
    color: 'from-green-500 to-emerald-600',
  },
  {
    name: 'Dhananjay Bhavar',
    role: 'Frontend Developer & QA Engineer',
    department: 'MCA',
    batchYear: '2026',
    description:
      'Built scalable frontend architectures and implemented CI/CD pipelines with containerization. Managed production backend servers and automated deployment workflows for reliable and efficient releases. QA contributor with hands-on experience using GitHub, Docker to build CI/CD pipelines for scalable containerized applications.',
    email: 'dhananjaybhavar2002@gmail.com',
    linkedin: 'https://www.linkedin.com/in/dhananjay-bhavar-908494244',
    image: '/contributors/dhananjay-bhavar.jpeg',
    initials: 'DB',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Sumit Ugale',
    role: 'Frontend Developer & Database Administrator',
    department: 'MCA',
    batchYear: '2026',
    description:
      'Ensures high quality and performance through rigorous testing and optimization. Designed user-friendly dashboards. Built scalable frontend architectures and implemented CI/CD pipelines with containerization.',
    email: 'sumitugale2003@gmail.com',
    linkedin: 'https://www.linkedin.com/in/sumit-ugale-169201294',
    image: '/contributors/sumit-ugale.jpeg',
    initials: 'SU',
    color: 'from-purple-500 to-fuchsia-600',
  },
]

const features = [
  { icon: Cpu, label: 'AI-Powered Detection', desc: 'MobileNetV2 deep learning for instant, accurate disease diagnosis', color: 'from-green-500 to-emerald-500' },
  { icon: BarChart3, label: 'Analytics Dashboard', desc: 'Track prediction history and disease trends over time', color: 'from-blue-500 to-indigo-500' },
  { icon: CloudSun, label: 'Weather Integration', desc: 'Real-time weather data with location-specific disease risk assessment', color: 'from-amber-500 to-orange-500' },
  { icon: Leaf, label: "Farmer's Guide", desc: 'Comprehensive crop care tips and seasonal task guides', color: 'from-purple-500 to-fuchsia-500' },
]

/* ── animation variants ── */
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

export default function About() {
  const [showContributors, setShowContributors] = useState(false)
  const [selectedContributor, setSelectedContributor] = useState<typeof contributors[0] | null>(null)

  return (
    <section id="about" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto w-full">

        {/* Site Details */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full px-4 py-2 text-sm font-semibold mb-5">
            <Leaf className="w-4 h-4" />
            About CropGuard
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-5">
            AI-Powered Crop Disease Detection
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto mb-3">
            CropGuard is an AI-powered crop disease detection system designed to help farmers
            identify plant diseases quickly and accurately. Using advanced deep learning technology
            (MobileNetV2), our platform analyzes leaf images and provides instant diagnosis with
            treatment recommendations. The system includes analytics dashboards, weather integration,
            and a comprehensive farmer&apos;s guide to support sustainable agriculture.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Icon by juicy_fish on{' '}
            <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-300">
              Freepik
            </a>
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              variants={scaleIn}
              whileHover={{ y: -6, boxShadow: '0 12px 32px -8px rgba(0,0,0,0.12)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 p-5 text-center group"
            >
              <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${f.color} shadow-md mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">{f.label}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Our Contributors Button */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="flex justify-center"
        >
          <button
            onClick={() => setShowContributors(true)}
            className="group w-full max-w-2xl flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-fuchsia-600 hover:from-red-600 hover:to-fuchsia-700 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="font-bold text-lg md:text-xl">Our Contributors</div>
              <div className="text-sm text-white/90">Meet the creators behind Crop Disease Analysis</div>
            </div>
            <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-semibold flex-shrink-0">
              {contributors.length} members
            </div>
          </button>
        </motion.div>
      </div>

      {/* Contributors Modal */}
      <AnimatePresence>
        {showContributors && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContributors(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto my-4 mx-2 sm:mx-4"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-500 to-fuchsia-600 px-6 py-5 flex items-center justify-between gap-2 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Our Contributors</h3>
                    <p className="text-xs text-white/80">Meet the creators behind Crop Disease Analysis</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowContributors(false)}
                  className="p-2 rounded-full hover:bg-white/20 text-white transition"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Profile Cards */}
              <div className="p-6 sm:p-8">
                <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {contributors.map((contributor) => (
                    <motion.div
                      key={contributor.name}
                      variants={scaleIn}
                      whileHover={{ y: -6, boxShadow: '0 12px 32px -8px rgba(0,0,0,0.12)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      <div className={`h-1.5 bg-gradient-to-r ${contributor.color}`} />
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex justify-center mb-4">
                          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 flex items-center justify-center shadow-md">
                            <img
                              src={contributor.image}
                              alt={contributor.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                const fallback = e.currentTarget.nextElementSibling
                                if (fallback) (fallback as HTMLElement).classList.remove('hidden')
                              }}
                            />
                            <span className={`hidden absolute text-2xl font-extrabold bg-gradient-to-br ${contributor.color} bg-clip-text text-transparent`}>
                              {contributor.initials}
                            </span>
                          </div>
                        </div>
                        <h4 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-1">{contributor.name}</h4>
                        <p className={`text-xs uppercase tracking-wider text-center font-semibold mb-3 bg-gradient-to-r ${contributor.color} bg-clip-text text-transparent`}>
                          {contributor.role}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex-1 line-clamp-4 mb-4 leading-relaxed">
                          {contributor.description}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <a
                            href={`mailto:${contributor.email}`}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 transition"
                            aria-label={`Email ${contributor.name}`}
                            title={`Email: ${contributor.email}`}
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          <a
                            href={contributor.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0A66C2] text-white hover:bg-[#004182] transition text-xs font-semibold"
                          >
                            <Linkedin className="w-3.5 h-3.5" />
                            LinkedIn
                          </a>
                          <button
                            onClick={() => setSelectedContributor(contributor)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 hover:underline"
                          >
                            View Detail <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Full Profile Detail Modal */}
            <AnimatePresence>
              {selectedContributor && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedContributor(null)}
                  className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    <div className={`h-2 bg-gradient-to-r ${selectedContributor.color}`} />
                    <div className="p-6">
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => setSelectedContributor(null)}
                          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition"
                          aria-label="Close"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-5">
                        <div className="flex-shrink-0 flex justify-center sm:justify-start">
                          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 flex items-center justify-center shadow-lg">
                            <img
                              src={selectedContributor.image}
                              alt={selectedContributor.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                const fallback = e.currentTarget.nextElementSibling
                                if (fallback) (fallback as HTMLElement).classList.remove('hidden')
                              }}
                            />
                            <span className={`hidden absolute text-4xl font-extrabold bg-gradient-to-br ${selectedContributor.color} bg-clip-text text-transparent`}>
                              {selectedContributor.initials}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">{selectedContributor.name}</h4>
                          <p className={`text-sm uppercase tracking-wider font-semibold mb-4 bg-gradient-to-r ${selectedContributor.color} bg-clip-text text-transparent`}>
                            {selectedContributor.role}
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                              <Briefcase className="w-4 h-4 flex-shrink-0 text-gray-400" />
                              <span>Department: <strong className="text-gray-700 dark:text-gray-200">{selectedContributor.department}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                              <Calendar className="w-4 h-4 flex-shrink-0 text-gray-400" />
                              <span>Batch Year: <strong className="text-gray-700 dark:text-gray-200">{selectedContributor.batchYear}</strong></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">About Contributor</h5>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{selectedContributor.description}</p>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <a
                          href={`mailto:${selectedContributor.email}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm"
                        >
                          <Mail className="w-4 h-4" /> Email
                        </a>
                        <a
                          href={selectedContributor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A66C2] text-white hover:bg-[#004182] transition text-sm"
                        >
                          <Linkedin className="w-4 h-4" /> LinkedIn
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
