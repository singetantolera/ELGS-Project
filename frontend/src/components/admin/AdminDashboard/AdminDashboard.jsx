import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useLanguage } from '../../../hooks/useLanguage'
import Loader from '../../common/Loader/Loader'
import api from '../../../services/api'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { user, isLoading: authLoading } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [contentStats, setContentStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Automatic redirect for non-admin users
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login')
      } else if (user.role !== 'admin') {
        navigate('/dashboard')
      }
    }
  }, [user, authLoading, navigate])

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Parallel API calls for better performance
      const [
        statsResponse,
        activityResponse,
        contentResponse
      ] = await Promise.allSettled([
        api.get('/admin/stats', { params: { timeRange } }),
        api.get('/admin/recent-activity', { params: { limit: 10 } }),
        api.get('/admin/content-stats')
      ])

      // Handle stats
      if (statsResponse.status === 'fulfilled') {
        setStats(statsResponse.value.data)
      } else {
        console.error('Stats fetch failed:', statsResponse.reason)
        setStats(null)
      }

      // Handle recent activity
      if (activityResponse.status === 'fulfilled') {
        setRecentActivity(activityResponse.value.data.activities)
      } else {
        setRecentActivity([])
      }

      // Handle content stats
      if (contentResponse.status === 'fulfilled') {
        setContentStats(contentResponse.value.data)
      } else {
        setContentStats(null)
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setError('Failed to load dashboard data. Please refresh.')
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }, [timeRange])

  // Initial data fetch
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData()
    }
  }, [user, timeRange, fetchDashboardData])

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
  }

  // Quick action handlers
  const handleQuickAction = (path) => {
    navigate(`/admin${path}`)
  }

  // Format numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num?.toString() || '0'
  }

  if (authLoading || (isLoading && !refreshing)) {
    return (
      <div className="admin-loading">
        <Loader size="large" />
        <p>{t('loadingAdminDashboard') || 'Loading admin dashboard...'}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={fetchDashboardData}>
          🔄 Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>{t('adminDashboard') || 'Admin Dashboard'}</h1>
          <p className="welcome-text">{t('welcomeBack') || 'Welcome back'}, {user?.fullName}</p>
        </div>

        <div className="header-controls">
          <select 
            className="time-range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="day">{t('last24Hours') || 'Last 24 Hours'}</option>
            <option value="week">{t('lastWeek') || 'Last Week'}</option>
            <option value="month">{t('lastMonth') || 'Last Month'}</option>
            <option value="year">{t('lastYear') || 'Last Year'}</option>
          </select>

          <button 
            className={`refresh-btn ${refreshing ? 'refreshing' : ''}`} 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <span className="refresh-icon">{refreshing ? '⋯' : '🔄'}</span>
            {refreshing ? 'Refreshing...' : (t('refresh') || 'Refresh')}
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary" onClick={() => navigate('/admin/users')}>
          <div className="stat-icon">👥</div>
          <div className="stat-details">
            <span className="stat-value">{formatNumber(stats?.totalUsers)}</span>
            <span className="stat-label">{t('totalUsers') || 'Total Users'}</span>
            <span className="stat-trend positive">
              +{formatNumber(stats?.newUsers)} {t('today') || 'today'}
            </span>
          </div>
        </div>

        <div className="stat-card success" onClick={() => navigate('/admin/content')}>
          <div className="stat-icon">📄</div>
          <div className="stat-details">
            <span className="stat-value">{formatNumber(stats?.totalContent)}</span>
            <span className="stat-label">{t('legalArticles') || 'Legal Articles'}</span>
            <span className="stat-sub">
              +{stats?.newContent} this {timeRange}
            </span>
          </div>
        </div>

        <div className="stat-card info" onClick={() => navigate('/admin/analytics')}>
          <div className="stat-icon">🔍</div>
          <div className="stat-details">
            <span className="stat-value">{formatNumber(stats?.searches)}</span>
            <span className="stat-label">{t('searchesToday') || 'Searches'}</span>
            <span className="stat-sub">
              Avg. {stats?.avgResponseTime}s response
            </span>
          </div>
        </div>

        <div className="stat-card warning" onClick={() => navigate('/admin/chat-logs')}>
          <div className="stat-icon">💬</div>
          <div className="stat-details">
            <span className="stat-value">{formatNumber(stats?.chatSessions)}</span>
            <span className="stat-label">{t('chatSessions') || 'Chat Sessions'}</span>
            <span className="stat-sub">
              {stats?.activeChats} active now
            </span>
          </div>
        </div>

        <div className="stat-card danger" onClick={() => navigate('/admin/bookmarks')}>
          <div className="stat-icon">🔖</div>
          <div className="stat-details">
            <span className="stat-value">{formatNumber(stats?.bookmarks)}</span>
            <span className="stat-label">{t('bookmarks') || 'Bookmarks'}</span>
            <span className="stat-sub">
              +{stats?.newBookmarks} new
            </span>
          </div>
        </div>

        <div className="stat-card dark" onClick={() => navigate('/admin/system')}>
          <div className="stat-icon">⚙️</div>
          <div className="stat-details">
            <span className="stat-value">{stats?.systemHealth}%</span>
            <span className="stat-label">{t('systemHealth') || 'System Health'}</span>
            <span className="stat-sub">
              API: {stats?.apiCalls?.toLocaleString()} {t('calls') || 'calls'}
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>{t('contentByCategory') || 'Content by Category'}</h2>
          <div className="category-chart">
            {contentStats?.categories?.map((category) => (
              <div key={category.name} className="category-bar">
                <div className="category-label">
                  <span className="category-name">
                    <span className="category-dot" style={{ backgroundColor: category.color }}></span>
                    {category.name}
                  </span>
                  <span className="category-count">{category.count}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${category.percentage}%`,
                      backgroundColor: category.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>{t('quickActions') || 'Quick Actions'}</h2>
          <div className="quick-actions">
            <button className="action-btn" onClick={() => handleQuickAction('/content/new')}>
              <span className="action-icon">➕</span>
              {t('addNewContent') || 'Add New Content'}
            </button>
            <button className="action-btn" onClick={() => handleQuickAction('/users')}>
              <span className="action-icon">👥</span>
              {t('manageUsers') || 'Manage Users'}
            </button>
            <button className="action-btn" onClick={() => handleQuickAction('/content')}>
              <span className="action-icon">📄</span>
              {t('editContent') || 'Edit Content'}
            </button>
            <button className="action-btn" onClick={() => handleQuickAction('/analytics')}>
              <span className="action-icon">📊</span>
              {t('viewAnalytics') || 'View Analytics'}
            </button>
            <button className="action-btn" onClick={() => handleQuickAction('/backup')}>
              <span className="action-icon">💾</span>
              {t('backupSystem') || 'Backup System'}
            </button>
            <button className="action-btn" onClick={() => handleQuickAction('/settings')}>
              <span className="action-icon">⚙️</span>
              {t('systemSettings') || 'System Settings'}
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>{t('recentActivity') || 'Recent Activity'}</h2>
        <div className="activity-feed">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className={`activity-item ${activity.type}`}>
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-details">
                  <div className="activity-header">
                    <span className="activity-action">{activity.action}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                  <div className="activity-meta">
                    {activity.user && <span className="activity-user">{t('by')}: {activity.user}</span>}
                    {activity.details && <span className="activity-info">{activity.details}</span>}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state">{t('noRecentActivity') || 'No recent activity'}</p>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>{t('adminTasks') || 'Admin Tasks'}</h2>
          <div className="task-list">
            <div className="task-item">
              <input type="checkbox" id="task1" />
              <label htmlFor="task1">{t('reviewPendingContent') || 'Review pending content updates'}</label>
            </div>
            <div className="task-item">
              <input type="checkbox" id="task2" />
              <label htmlFor="task2">{t('approveNewUsers') || 'Approve new user registrations'}</label>
            </div>
            <div className="task-item">
              <input type="checkbox" id="task3" />
              <label htmlFor="task3">{t('updateDocumentation') || 'Update system documentation'}</label>
            </div>
            <div className="task-item">
              <input type="checkbox" id="task4" />
              <label htmlFor="task4">{t('backupDatabase') || 'Backup database'}</label>
            </div>
            <div className="task-item">
              <input type="checkbox" id="task5" />
              <label htmlFor="task5">{t('reviewErrorLogs') || 'Review error logs'}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard