/**
 * API Client for Crop Disease Detection Backend
 */

import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests (client-side only)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  // When sending FormData, let the browser set Content-Type (multipart/form-data with boundary)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

// Handle auth errors (don't redirect if already on login page so user sees error message)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: async (data: {
    email: string
    password: string
    full_name: string
    role?: string
    region?: string
  }) => {
    const response = await api.post('/api/auth/register', data)
    return response.data
  },

  login: async (email: string, password: string) => {
    const body = new URLSearchParams({
      email: email.trim().toLowerCase(),
      password,
    }).toString()
    const response = await api.post('/api/auth/login', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return response.data
  },

  getMe: async () => {
    const response = await api.get('/api/auth/me')
    return response.data
  },
}

export const predictionAPI = {
  predict: async (file: File, cropType?: string, region?: string, soilType?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (cropType) formData.append('crop_type', cropType)
    if (region) formData.append('region', region)
    if (soilType) formData.append('soil_type', soilType)

    const response = await api.post('/api/predictions/predict', formData)
    return response.data
  },

  getHistory: async (limit: number = 10) => {
    const response = await api.get('/api/predictions/history', {
      params: { limit },
    })
    return response.data
  },

  getById: async (predictionId: string) => {
    const response = await api.get(`/api/predictions/${predictionId}`)
    return response.data
  },

  getGradCAM: async (predictionId: string) => {
    const response = await api.get(`/api/predictions/gradcam/${predictionId}`)
    return response.data
  },

  delete: async (predictionId: string) => {
    const response = await api.delete(`/api/predictions/${predictionId}`)
    return response.data
  },
}

export const weatherAPI = {
  getWeather: async (region: string) => {
    const response = await api.get('/api/advanced/weather', {
      params: { region },
    })
    return response.data
  },
}

export const analyticsAPI = {
  getAvailableCrops: async () => {
    const response = await api.get('/api/analytics/available-crops')
    return response.data
  },

  getSummary: async (cropType?: string) => {
    const response = await api.get('/api/analytics/summary', {
      params: { crop_type: cropType },
    })
    return response.data
  },

  getDiseaseFrequency: async (cropType?: string, region?: string) => {
    const response = await api.get('/api/analytics/disease-frequency', {
      params: { crop_type: cropType, region },
    })
    return response.data
  },

  getCropHealth: async (cropType?: string) => {
    const response = await api.get('/api/analytics/crop-health', {
      params: { crop_type: cropType },
    })
    return response.data
  },

  getMonthlyTrends: async (cropType?: string) => {
    const response = await api.get('/api/analytics/monthly-trends', {
      params: { crop_type: cropType },
    })
    return response.data
  },

  getRegionWise: async (cropType?: string) => {
    const response = await api.get('/api/analytics/region-wise', {
      params: { crop_type: cropType },
    })
    return response.data
  },
}

export const chatbotAPI = {
  chat: async (message: string, context?: { crop_type?: string; language?: string }) => {
    const response = await api.post('/api/chatbot/chat', { message, context })
    return response.data
  },
  getSuggestions: async (cropType?: string) => {
    const response = await api.get('/api/chatbot/suggestions', {
      params: { crop_type: cropType },
    })
    return response.data
  },
}

export const contactAPI = {
  submit: async (data: { name: string; email: string; message: string }) => {
    const response = await api.post('/api/contact/', data)
    return response.data
  }
}

export default api
