/**
 * Offline Support Utilities
 */

export class OfflineManager {
  private dbName = 'CropDiseaseDB'
  private dbVersion = 1
  private db: IDBDatabase | null = null

  async init() {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return false
    }

    return new Promise<boolean>((resolve) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => resolve(false)
      request.onsuccess = () => {
        this.db = request.result
        resolve(true)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        if (!db.objectStoreNames.contains('predictions')) {
          db.createObjectStore('predictions', { keyPath: 'id', autoIncrement: true })
        }
        
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'id', autoIncrement: true })
        }
      }
    })
  }

  async savePrediction(prediction: any) {
    if (!this.db) return false

    return new Promise<boolean>((resolve) => {
      const transaction = this.db!.transaction(['predictions'], 'readwrite')
      const store = transaction.objectStore('predictions')
      const request = store.add({
        ...prediction,
        timestamp: Date.now(),
        synced: false
      })

      request.onsuccess = () => resolve(true)
      request.onerror = () => resolve(false)
    })
  }

  async getPendingPredictions() {
    if (!this.db) return []

    return new Promise<any[]>((resolve) => {
      const transaction = this.db!.transaction(['predictions'], 'readonly')
      const store = transaction.objectStore('predictions')
      const request = store.getAll()

      request.onsuccess = () => {
        const predictions = request.result.filter((p: any) => !p.synced)
        resolve(predictions)
      }
      request.onerror = () => resolve([])
    })
  }

  async syncPredictions(apiCall: (prediction: any) => Promise<any>) {
    const pending = await this.getPendingPredictions()
    
    for (const prediction of pending) {
      try {
        await apiCall(prediction)
        // Mark as synced
        if (this.db) {
          const transaction = this.db.transaction(['predictions'], 'readwrite')
          const store = transaction.objectStore('predictions')
          store.put({ ...prediction, synced: true })
        }
      } catch (error) {
        console.error('Sync failed:', error)
      }
    }
  }

  isOnline(): boolean {
    return typeof navigator !== 'undefined' && navigator.onLine
  }

  onOnline(callback: () => void) {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', callback)
    }
  }

  onOffline(callback: () => void) {
    if (typeof window !== 'undefined') {
      window.addEventListener('offline', callback)
    }
  }
}

export const offlineManager = new OfflineManager()
