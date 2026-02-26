'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { Leaf, LogOut, User, LayoutDashboard, Upload, BarChart3, BookOpen, Sun, FileText, Menu, X, Info, Mail, HelpCircle, Shield, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import { useLanguage } from '@/lib/language-context'
import { useState, useEffect, useMemo, memo, useCallback } from 'react'

const navLinkBase =
  'flex items-center gap-1 whitespace-nowrap text-sm rounded-lg px-2 py-1.5 transition-colors duration-200 ' +
  'text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'

function getActiveClass(active: boolean) {
  return active
    ? ' text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/30 ring-1 ring-green-200 dark:ring-green-800'
    : ''
}

const NavLink = memo(function NavLink({
  href,
  exact,
  icon: Icon,
  label,
  pathname,
}: {
  href: string
  exact?: boolean
  icon: React.ElementType
  label: string
  pathname: string
}) {
  const isActive = exact ? pathname === href : pathname === href || (href !== '/' && pathname.startsWith(href))
  return (
    <Link
      href={href}
      className={navLinkBase + getActiveClass(isActive)}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{label}</span>
    </Link>
  )
})

function getInitials(name: string) {
  if (!name) return ''
  const words = name.trim().split(/\s+/)
  if (words.length === 0) return ''
  if (words.length === 1) return words[0][0].toUpperCase()
  if (words.length === 2) return `${words[0][0]}${words[1][0]}`.toUpperCase()
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}

export default memo(function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const showUser = mounted ? user : null
  const initials = showUser?.full_name ? getInitials(showUser.full_name) : ''

  const handleLogout = useCallback(() => {
    logout()
    router.push('/login')
    setMobileMenuOpen(false)
  }, [logout, router])

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])

  const mobileLinkBase =
    'text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200 rounded-lg px-2 py-2'

  const getMobileLinkClass = useMemo(() => {
    return (href: string, exact?: boolean) => {
      const isActive = exact
        ? pathname === href
        : pathname === href || (href !== '/' && pathname.startsWith(href))
      const base =
        'flex items-center space-x-2 py-2 rounded-lg px-2 transition-colors duration-200 ' +
        'text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
      return isActive ? base + ' text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/30' : base
    }
  }, [pathname])

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 w-full">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-14 sm:h-16 gap-2">
          {/* Logo - always visible */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
              <img
                src="/logo.png"
                alt="CropGuard"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const fb = e.currentTarget.nextElementSibling as HTMLElement | null
                  if (fb) fb.style.display = 'block'
                }}
              />
              <Leaf className="w-8 h-8 text-green-600 dark:text-green-400 hidden" />
            </span>
            <span className="font-bold text-gray-800 dark:text-white text-xl sm:text-2xl whitespace-nowrap">CropGuard</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-end gap-1 lg:gap-2 flex-grow min-w-0">
            {showUser ? (
              <>
                <NavLink href="/dashboard" exact icon={LayoutDashboard} label={t('dashboard')} pathname={pathname} />
                <NavLink href="/predict" icon={Upload} label={t('predict')} pathname={pathname} />
                <NavLink href="/analytics" icon={BarChart3} label={t('analytics')} pathname={pathname} />
                <NavLink href="/farmers-guide" icon={BookOpen} label={t('farmers_guide')} pathname={pathname} />
                <NavLink href="/weather" icon={Sun} label={t('weather')} pathname={pathname} />
                <NavLink href="/reports" icon={FileText} label={t('reports')} pathname={pathname} />
                <div className="relative group">
                  <button className={`${navLinkBase} flex items-center gap-1`}>
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>{t('more')}</span>
                    <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 py-2">
                    <Link href="/about" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-green-600 dark:hover:text-green-400">
                      <Info className="w-4 h-4" /> {t('about')}
                    </Link>
                    <Link href="/contact" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-green-600 dark:hover:text-green-400">
                      <Mail className="w-4 h-4" /> {t('contact')}
                    </Link>
                    <Link href="/help" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-green-600 dark:hover:text-green-400">
                      <HelpCircle className="w-4 h-4" /> {t('help')}
                    </Link>
                    <Link href="/privacy" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-green-600 dark:hover:text-green-400">
                      <Shield className="w-4 h-4" /> {t('privacy')}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-2 lg:gap-4 pl-4 border-l border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <ThemeToggle />
                  <LanguageToggle />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink href="/farmers-guide" icon={BookOpen} label={t('farmers_guide')} pathname={pathname} />
                <NavLink href="/weather" icon={Sun} label={t('weather')} pathname={pathname} />
                <div className="relative group z-50">
                  <button className={`${navLinkBase} flex items-center gap-1`}>
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>{t('more')}</span>
                    <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 py-2">
                    <Link href="/about" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-green-600 dark:hover:text-green-400">
                      <Info className="w-4 h-4" /> {t('about')}
                    </Link>
                    <Link href="/contact" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-green-600 dark:hover:text-green-400">
                      <Mail className="w-4 h-4" /> {t('contact')}
                    </Link>
                    <Link href="/help" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-green-600 dark:hover:text-green-400">
                      <HelpCircle className="w-4 h-4" /> {t('help')}
                    </Link>
                    <Link href="/privacy" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-green-600 dark:hover:text-green-400">
                      <Shield className="w-4 h-4" /> {t('privacy')}
                    </Link>
                  </div>
                </div>
                <NavLink href="/login" exact icon={User} label={t('login')} pathname={pathname} />
                <Link href="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition whitespace-nowrap text-sm flex-shrink-0 font-medium">
                  {t('register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <LanguageToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="px-4 py-4 space-y-3">
                {showUser ? (
                  <>
                    <Link href="/dashboard" onClick={closeMobileMenu} className={getMobileLinkClass('/dashboard', true)}>
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{t('dashboard')}</span>
                    </Link>
                    <Link href="/predict" onClick={closeMobileMenu} className={getMobileLinkClass('/predict')}>
                      <Upload className="w-4 h-4" />
                      <span>{t('predict')}</span>
                    </Link>
                    <Link href="/analytics" onClick={closeMobileMenu} className={getMobileLinkClass('/analytics')}>
                      <BarChart3 className="w-4 h-4" />
                      <span>{t('analytics')}</span>
                    </Link>
                    <Link href="/farmers-guide" onClick={closeMobileMenu} className={getMobileLinkClass('/farmers-guide')}>
                      <BookOpen className="w-4 h-4" />
                      <span>{t('farmers_guide')}</span>
                    </Link>
                    <Link href="/weather" onClick={closeMobileMenu} className={getMobileLinkClass('/weather')}>
                      <Sun className="w-4 h-4" />
                      <span>{t('weather')}</span>
                    </Link>
                    <Link href="/reports" onClick={closeMobileMenu} className={getMobileLinkClass('/reports')}>
                      <FileText className="w-4 h-4" />
                      <span>{t('reports')}</span>
                    </Link>
                    <Link href="/about" onClick={closeMobileMenu} className={getMobileLinkClass('/about', true)}>
                      <Info className="w-4 h-4" />
                      <span>{t('about')}</span>
                    </Link>
                    <Link href="/contact" onClick={closeMobileMenu} className={getMobileLinkClass('/contact', true)}>
                      <Mail className="w-4 h-4" />
                      <span>{t('contact')}</span>
                    </Link>
                    <Link href="/help" onClick={closeMobileMenu} className={getMobileLinkClass('/help', true)}>
                      <HelpCircle className="w-4 h-4" />
                      <span>{t('help')}</span>
                    </Link>
                    <Link href="/privacy" onClick={closeMobileMenu} className={getMobileLinkClass('/privacy', true)}>
                      <Shield className="w-4 h-4" />
                      <span>{t('privacy')}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition w-full py-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/farmers-guide" onClick={closeMobileMenu} className={getMobileLinkClass('/farmers-guide')}>
                      <BookOpen className="w-4 h-4" />
                      <span>{t('farmers_guide')}</span>
                    </Link>
                    <Link href="/weather" onClick={closeMobileMenu} className={getMobileLinkClass('/weather')}>
                      <Sun className="w-4 h-4" />
                      <span>{t('weather')}</span>
                    </Link>
                    <Link href="/about" onClick={closeMobileMenu} className={getMobileLinkClass('/about', true)}>
                      <Info className="w-4 h-4" />
                      <span>{t('about')}</span>
                    </Link>
                    <Link href="/contact" onClick={closeMobileMenu} className={getMobileLinkClass('/contact', true)}>
                      <Mail className="w-4 h-4" />
                      <span>{t('contact')}</span>
                    </Link>
                    <Link href="/help" onClick={closeMobileMenu} className={getMobileLinkClass('/help', true)}>
                      <HelpCircle className="w-4 h-4" />
                      <span>{t('help')}</span>
                    </Link>
                    <Link href="/privacy" onClick={closeMobileMenu} className={getMobileLinkClass('/privacy', true)}>
                      <Shield className="w-4 h-4" />
                      <span>{t('privacy')}</span>
                    </Link>
                    <Link href="/login" onClick={closeMobileMenu} className={getMobileLinkClass('/login', true)}>
                      <User className="w-4 h-4" />
                      <span>{t('login')}</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMobileMenu}
                      className="block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition text-center font-medium"
                    >
                      {t('register')}
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
})
