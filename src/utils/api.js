import axios from 'axios'

const api = axios.create({
  baseURL: 'http://122.163.121.176:3004/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor - attach JWT
api.interceptors.request.use((config) => {
  try {
    const stored = JSON.parse(localStorage.getItem('edustack-auth') || '{}')
    const token = stored?.state?.accessToken
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch (_) {}
  return config
})

// Response interceptor - handle 401, refresh token
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const stored = JSON.parse(localStorage.getItem('edustack-auth') || '{}')
        const refreshToken = stored?.state?.refreshToken
        if (!refreshToken) throw new Error('No refresh token')
        const res = await axios.post('/api/auth/refresh', {},
          { headers: { Authorization: `Bearer ${refreshToken}` } })
        const newToken = res.data.access_token
        // Update stored token
        stored.state.accessToken = newToken
        localStorage.setItem('edustack-auth', JSON.stringify(stored))
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (_) {
        localStorage.removeItem('edustack-auth')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const getNotifications = (page = 1) => api.get(`/notifications/?page=${page}`)
export const markAllNotificationsRead = () => api.post('/notifications/mark-all-read')
export const markNotificationRead = (id) => api.post(`/notifications/${id}/read`)

export default api
