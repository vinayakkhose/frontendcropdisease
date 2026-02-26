import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider } from '@/lib/language-context'
import { OfflineIndicator } from '@/components/OfflineIndicator'
import FarmerChatbot from '@/components/FarmerChatbot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CropGuard - Crop Disease Detection',
  description: 'AI-powered crop disease detection and management',
  icons: {
    icon: [{ url: '/logo.png', type: 'image/png' }],
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            {children}
            <FarmerChatbot />
            <Toaster position="top-right" />
            <OfflineIndicator />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
