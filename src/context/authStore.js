import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const res = await api.post('/auth/login', { email, password })
        const { access_token, refresh_token, user, profile } = res.data
        set({
          user,
          profile,
          accessToken: access_token,
          refreshToken: refresh_token,
          isAuthenticated: true
        })
        return user
      },

      logout: () => {
        set({ user: null, profile: null, accessToken: null,
              refreshToken: null, isAuthenticated: false })
      },

      setTokens: (access_token) => {
        set({ accessToken: access_token })
      },

      getRole: () => get().user?.role
    }),
    {
      name: 'edustack-auth',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export default useAuthStore
