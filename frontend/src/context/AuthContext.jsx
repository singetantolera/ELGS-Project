import { createContext, useReducer, useEffect, useState } from 'react'
import authService from '../services/authService'

export const AuthContext = createContext()

const initialState = {
  user: null,
  isLoading: true,
  error: null
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isLoading: false,
        error: null
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = authService.getCurrentUser()
        const token = authService.getToken()
        
        if (user && token) {
          dispatch({ type: 'SET_USER', payload: user })
        } else {
          dispatch({ type: 'SET_USER', payload: null })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        dispatch({ type: 'SET_USER', payload: null })
      } finally {
        setIsInitialized(true)
      }
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authService.login(email, password)
      dispatch({ type: 'SET_USER', payload: response.user })
      return response
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.response?.data?.message || 'Login failed' 
      })
      throw error
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authService.register(userData)
      dispatch({ type: 'SET_USER', payload: response.user })
      return response
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.response?.data?.message || 'Registration failed' 
      })
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      console.error('Logout error:', error)
      dispatch({ type: 'LOGOUT' })
    }
  }

  const updateProfile = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authService.updateProfile(userData)
      dispatch({ type: 'SET_USER', payload: response.user })
      return response
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.response?.data?.message || 'Profile update failed' 
      })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const changePassword = async (passwordData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authService.changePassword(passwordData)
      return response
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.response?.data?.message || 'Password change failed' 
      })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null })
  }

  const value = {
    user: state.user,
    isLoading: state.isLoading || !isInitialized,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    isAuthenticated: !!state.user,
    isAdmin: state.user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}