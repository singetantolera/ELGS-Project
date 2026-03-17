import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import BookmarkList from '../../components/bookmarks/BookmarkList/BookmarkList'
import Loader from '../../components/common/Loader/Loader'
import api from '../../services/api'
import './BookmarksPage.css'

const BookmarksPage = () => {
  const { user } = useAuth()
  const { currentLanguage, t } = useLanguage()
  const navigate = useNavigate()
  
  const [collections, setCollections] = useState([])
  const [selectedCollection, setSelectedCollection] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchAllData()
  }, [user, navigate])

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      const [collectionsRes, statsRes, recentRes] = await Promise.allSettled([
        api.get('/bookmarks/collections'),
        api.get('/bookmarks/stats'),
        api.get('/user/recently-viewed')
      ])

      // Handle collections
      if (collectionsRes.status === 'fulfilled') {
        setCollections(collectionsRes.value.data.collections)
      } else {
        setCollections([])
      }

      // Handle stats
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data)
      } else {
        setStats({})
      }

      // Handle recently viewed
      if (recentRes.status === 'fulfilled') {
        setRecentlyViewed(recentRes.value.data.items)
      } else {
        setRecentlyViewed([])
      }

    } catch (error) {
      console.error('Failed to fetch bookmarks data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await api.get('/bookmarks/export?format=json', {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'bookmarks.json')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Failed to export bookmarks:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    try {
      const shareData = {
        title: 'My ELGS Bookmarks',
        text: `Check out my bookmarks from Ethiopian Law Guidance System`,
        url: window.location.href
      }
      
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Failed to share:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="bookmarks-page-loading">
        <Loader size="large" />
        <p>{t('loadingBookmarks') || 'Loading your bookmarks...'}</p>
      </div>
    )
  }

  return (
    <div className="bookmarks-page">
      <section className="bookmarks-header">
        <div className="header-content">
          <h1>
            {currentLanguage === 'en' && 'My Bookmarks'}
            {currentLanguage === 'am' && 'የእኔ ዕልባቶች'}
            {currentLanguage === 'om' && 'Qabiyyee Ko'}
          </h1>
          <p>
            {currentLanguage === 'en' && 'Access your saved legal content anytime'}
            {currentLanguage === 'am' && 'የተቀመጡ የሕግ ይዘቶችዎን በማንኛውም ጊዜ ይድረሱ'}
            {currentLanguage === 'om' && 'Qabiyyee seeraa kayyoo kee yeroo barbaaddu argadhu'}
          </p>
        </div>

        <div className="header-stats">
          <div className="stat-badge">
            <span className="stat-icon">📚</span>
            <div>
              <strong>{stats.totalBookmarks || 0}</strong>
              <small>{t('total')}</small>
            </div>
          </div>
          <div className="stat-badge">
            <span className="stat-icon">📊</span>
            <div>
              <strong>{stats.totalCollections || 0}</strong>
              <small>{t('categories')}</small>
            </div>
          </div>
          <div className="stat-badge">
            <span className="stat-icon">⏱️</span>
            <div>
              <strong>{stats.lastAdded || 'N/A'}</strong>
              <small>{t('lastAdded')}</small>
            </div>
          </div>
        </div>
      </section>

      <section className="collections-section">
        <h2>
          {currentLanguage === 'en' && 'Collections'}
          {currentLanguage === 'am' && 'ስብስቦች'}
          {currentLanguage === 'om' && 'Kaayyoo'}
        </h2>
        <div className="collections-grid">
          <button
            className={`collection-card ${selectedCollection === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCollection('all')}
          >
            <div className="collection-icon">📋</div>
            <div className="collection-info">
              <h3>{t('allBookmarks') || 'All Bookmarks'}</h3>
              <p>{stats.totalBookmarks || 0} {t('items')}</p>
            </div>
          </button>

          {collections.length > 0 ? (
            collections.map(collection => (
              <button
                key={collection.id}
                className={`collection-card ${selectedCollection === collection.id ? 'active' : ''}`}
                onClick={() => setSelectedCollection(collection.id)}
              >
                <div className="collection-icon">{collection.icon || '📁'}</div>
                <div className="collection-info">
                  <h3>{collection.name}</h3>
                  <p>{collection.count || 0} {t('items')}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="empty-collections">
              <p>{t('noCollections') || 'No collections found'}</p>
            </div>
          )}
        </div>
      </section>

      <section className="bookmarks-list-section">
        <div className="list-header">
          <h2>
            {selectedCollection === 'all' 
              ? (t('allBookmarks') || 'All Bookmarks')
              : collections.find(c => c.id === selectedCollection)?.name}
          </h2>
          
          <div className="list-actions">
            <button 
              className="action-btn export"
              onClick={handleExport}
              disabled={isExporting}
            >
              <span className="btn-icon">
                {isExporting ? '⏳' : '📥'}
              </span>
              {isExporting ? 'Exporting...' : t('export')}
            </button>
            <button 
              className="action-btn share"
              onClick={handleShare}
            >
              <span className="btn-icon">📤</span>
              {t('share')}
            </button>
          </div>
        </div>

        <BookmarkList collectionId={selectedCollection} />
      </section>

      <section className="recently-viewed">
        <h2>
          {currentLanguage === 'en' && 'Recently Viewed'}
          {currentLanguage === 'am' && 'በቅርብ ጊዜ የታዩ'}
          {currentLanguage === 'om' && 'Dhihoo Ilaalame'}
        </h2>
        <div className="recent-grid">
          {recentlyViewed.length > 0 ? (
            recentlyViewed.map(item => (
              <div key={item.id} className="recent-card">
                <div className="recent-icon">📄</div>
                <div className="recent-info">
                  <h4>{item.title || t('untitled')}</h4>
                  <p>{item.time || formatTimeAgo(item.timestamp)}</p>
                </div>
                <Link to={`/legal-content/${item.id}`} className="recent-link">→</Link>
              </div>
            ))
          ) : (
            <div className="empty-recent">
              <p>{t('noRecentlyViewed') || 'No recently viewed articles'}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default BookmarksPage