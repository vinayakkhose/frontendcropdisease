'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/lib/language-context'

// Using Leaflet for maps (lightweight alternative to Mapbox)
interface DiseaseMapProps {
  reports: Array<{
    latitude: number
    longitude: number
    disease_name: string
    severity: string
    count: number
  }>
}

export default function DiseaseMap({ reports }: DiseaseMapProps) {
  const { t } = useLanguage()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<{ remove: () => void } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return

    const container = mapRef.current

    type LeafletLib = typeof import('leaflet')['default']
    const init = (L: LeafletLib) => {
      // Remove existing map before re-initializing (fixes "Map container is already initialized")
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      const map = L.map(container).setView([20, 0], 2)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      reports.forEach((report) => {
        const color = report.severity === 'Severe' ? 'red' :
                      report.severity === 'Moderate' ? 'orange' : 'yellow'
        const marker = L.marker([report.latitude, report.longitude], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [20, 20]
          })
        })
        marker.bindPopup(`
          <b>${report.disease_name}</b><br>
          Severity: ${report.severity}<br>
          Reports: ${report.count}
        `).addTo(map)
      })
    }

    import('leaflet').then((L) => init(L.default))

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [reports])

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">{t('disease_map')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="w-full h-[500px] rounded-lg" />
      </CardContent>
    </Card>
  )
}
