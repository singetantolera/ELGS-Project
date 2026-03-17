import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import AdminDashboard from '../../components/admin/AdminDashboard/AdminDashboard'
import Loader from '../../components/common/Loader/Loader'
import './AdminDashboardPage.css'

const AdminDashboardPage = () => {
  const { user, isLoading } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [redirecting, setRedirecting] = useState(false)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    // If not loading and user exists but is not admin, redirect to regular dashboard
    if (!isLoading && user && user.role !== 'admin') {
      setRedirecting(true)
      
      // Show countdown before redirect
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            navigate('/dashboard')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
    
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      navigate('/login')
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="admin-page-loading">
        <Loader size="large" />
        <p>{t('loadingAdminDashboard') || 'Loading admin dashboard...'}</p>
      </div>
    )
  }

  // Show unauthorized access message with redirect countdown
  if (redirecting || (user && user.role !== 'admin')) {
    return (
      <div className="unauthorized-container">
        <div className="unauthorized-card">
          <div className="unauthorized-icon">🔒</div>
          <h2>{t('accessDenied') || 'Access Denied'}</h2>
          <p>{t('adminOnlyMessage') || 'This area is restricted to administrators only.'}</p>
          <div className="redirect-info">
            <p>{t('redirectingIn') || 'Redirecting to dashboard in'} {countdown}s</p>
          </div>
          <button onClick={() => navigate('/dashboard')}>
            {t('redirectNow') || 'Go to Dashboard Now'}
          </button>
        </div>
      </div>
    )
  }

  // Show message if user is not logged in
  if (!user) {
    return (
      <div className="unauthorized-container">
        <div className="unauthorized-card">
          <div className="unauthorized-icon">⚠️</div>
          <h2>{t('notLoggedIn') || 'Not Logged In'}</h2>
          <p>{t('pleaseLogin') || 'Please log in to access this page.'}</p>
          <button onClick={() => navigate('/login')}>
            {t('goToLogin') || 'Go to Login'}
          </button>
        </div>
      </div>
    )
  }

  // Admin user - show the dashboard
  return (
    <div className="admin-page">
      <AdminDashboard />
    </div>
  )
}

export default AdminDashboardPage