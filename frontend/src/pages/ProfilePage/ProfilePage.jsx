import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import UserProfile from '../../components/profile/UserProfile/UserProfile'
import Loader from '../../components/common/Loader/Loader'
import api from '../../services/api'
import './ProfilePage.css'

const ProfilePage = () => {
  const { user, isLoading: authLoading } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
      return
    }
    
    if (user) {
      fetchProfileData()
    }
  }, [user, authLoading, navigate])

  const fetchProfileData = async () => {
    try {
      const [statsRes] = await Promise.allSettled([
        api.get('/user/stats')
      ])

      // Handle stats
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data)
      } else {
        setStats(null)
      }

    } catch (error) {
      console.error('Failed to fetch profile data:', error)
    }
  }

  if (authLoading) {
    return (
      <div className="profile-page-loading">
        <Loader size="large" />
        <p>{t('loadingProfile') || 'Loading profile...'}</p>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-layout">
        <div className="profile-main">
          <UserProfile />
        </div>

        <aside className="profile-sidebar">
          <div className="security-card">
            <h3>🛡️ {t('securityTips') || 'Security Tips'}</h3>
            <ul className="security-tips">
              <li>{t('useStrongPassword') || 'Use a strong password'}</li>
              <li>{t('enable2FA') || 'Enable 2-factor authentication'}</li>
              <li>{t('dontShareCredentials') || 'Don\'t share your credentials'}</li>
              <li>{t('logoutFromSharedDevices') || 'Log out from shared devices'}</li>
            </ul>
          </div>

          <div className="connected-accounts">
            <h3>🔗 {t('connectedAccounts') || 'Connected Accounts'}</h3>
            <div className="accounts-list">
              <div className="account-item">
                <span className="account-icon">G</span>
                <span>Google</span>
                <span className="account-status connected">{t('connected')}</span>
              </div>
              <div className="account-item">
                <span className="account-icon">GH</span>
                <span>GitHub</span>
                <span className="account-status not-connected">{t('connect')}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ProfilePage