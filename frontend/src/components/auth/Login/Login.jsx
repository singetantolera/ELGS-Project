import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import Loader from '../../common/Loader/Loader'
import './Login.css'

// API URL for social login
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  
  // Forgot password states
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotStep, setForgotStep] = useState('email') // 'email', 'success', 'error'
  const [forgotMessage, setForgotMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Check for OAuth callback params
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const error = params.get('error')
    
    if (token) {
      // Store token and redirect
      localStorage.setItem('token', token)
      navigate('/dashboard')
    } else if (error) {
      setErrors({ general: `Google login failed: ${error}` })
    }
  }, [location, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: error.response?.data?.message || 'Login failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Enhanced Google Login handler
  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    try {
      // Show loading state for 1 second minimum for better UX
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Store return URL in session storage
      sessionStorage.setItem('oauth_return_url', window.location.pathname)
      
      // Redirect to Google OAuth
      window.location.href = `${API_URL}/auth/google`;
    } catch (error) {
      console.error('Google login error:', error)
      setErrors({ general: 'Failed to initiate Google login. Please try again.' })
      setGoogleLoading(false)
    }
  }

  // Forgot Password Handlers
  const openForgotModal = (e) => {
    e.preventDefault()
    setForgotEmail(formData.email || '')
    setForgotStep('email')
    setForgotMessage('')
    setShowForgotModal(true)
  }

  const closeForgotModal = () => {
    setShowForgotModal(false)
    setForgotEmail('')
    setForgotStep('email')
    setForgotMessage('')
  }

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    
    if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotMessage('Please enter a valid email address')
      return
    }

    setIsSending(true)
    setForgotMessage('')

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email')
      }
      
      setForgotStep('success')
      setForgotMessage(`Password reset link sent to ${forgotEmail}`)
    } catch (error) {
      console.error('Forgot password error:', error)
      setForgotStep('error')
      setForgotMessage(error.message || 'Failed to send reset email. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleResendEmail = () => {
    setForgotStep('email')
    setTimeout(() => {
      handleForgotSubmit(new Event('submit'))
    }, 100)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back! 👋</h2>
          <p>Sign in to access Ethiopian laws and legal guidance</p>
        </div>

        {errors.general && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
              />
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>
            <button 
              type="button"
              onClick={openForgotModal}
              className="forgot-link"
            >
              Forgot password?
            </button>
          </div>

          <button 
            type="submit" 
            className="btn-login-submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader size="small" /> : 'Sign In'}
          </button>
        </form>

        {/* Enhanced Google Login */}
        <div className="google-divider">
          <span className="divider-line"></span>
          <span className="divider-text">or continue with</span>
          <span className="divider-line"></span>
        </div>

        <button 
          type="button" 
          className={`google-btn ${googleLoading ? 'loading' : ''}`}
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          aria-label="Continue with Google"
        >
          {googleLoading ? (
            <>
              <span className="google-spinner"></span>
              <span className="google-text">Connecting...</span>
            </>
          ) : (
            <>
              <svg className="google-icon" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="google-text">Continue with Google</span>
              <span className="google-arrow">→</span>
            </>
          )}
        </button>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="register-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={closeForgotModal}>
          <div className="forgot-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeForgotModal}>×</button>
            
            {forgotStep === 'email' && (
              <>
                <div className="modal-icon">🔐</div>
                <h3>Forgot Password?</h3>
                <p className="modal-subtitle">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <form onSubmit={handleForgotSubmit}>
                  <div className="form-group">
                    <label htmlFor="forgotEmail">Email Address</label>
                    <div className="input-wrapper">
                      <span className="input-icon">📧</span>
                      <input
                        type="email"
                        id="forgotEmail"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter your email"
                        className={forgotMessage && !forgotEmail ? 'error' : ''}
                        autoFocus
                      />
                    </div>
                    {forgotMessage && !forgotEmail.includes('@') && (
                      <span className="error-message">{forgotMessage}</span>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="modal-btn"
                    disabled={isSending}
                  >
                    {isSending ? <Loader size="small" /> : 'Send Reset Link'}
                  </button>
                </form>
              </>
            )}

            {forgotStep === 'success' && (
              <>
                <div className="modal-icon success">✅</div>
                <h3>Check Your Email</h3>
                <p className="modal-subtitle">
                  {forgotMessage}
                </p>
                <div className="modal-message">
                  <p>Click the link in the email to reset your password. The link will expire in 1 hour.</p>
                </div>
                <div className="modal-actions">
                  <button className="modal-btn secondary" onClick={closeForgotModal}>
                    Close
                  </button>
                  <button className="modal-btn" onClick={handleResendEmail}>
                    Resend Email
                  </button>
                </div>
              </>
            )}

            {forgotStep === 'error' && (
              <>
                <div className="modal-icon error">❌</div>
                <h3>Something Went Wrong</h3>
                <p className="modal-subtitle error">
                  {forgotMessage}
                </p>
                <div className="modal-actions">
                  <button className="modal-btn secondary" onClick={closeForgotModal}>
                    Cancel
                  </button>
                  <button className="modal-btn" onClick={() => setForgotStep('email')}>
                    Try Again
                  </button>
                </div>
              </>
            )}

            <div className="modal-footer">
              <button onClick={closeForgotModal} className="back-to-login">
                Back to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login