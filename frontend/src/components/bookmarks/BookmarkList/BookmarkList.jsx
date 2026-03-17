import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useLanguage } from '../../../hooks/useLanguage'
import Loader from '../../common/Loader/Loader'
import api from '../../../services/api'
import './BookmarkList.css'

const BookmarkList = ({ collectionId = 'all' }) => {
  const [bookmarks, setBookmarks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBookmarks, setSelectedBookmarks] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [totalBookmarks, setTotalBookmarks] = useState(0)
  
  const { user } = useAuth()
  const { currentLanguage, t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      fetchBookmarks()
    }
  }, [user, collectionId])

  const fetchBookmarks = async () => {
    setIsLoading(true)
    try {
      const params = {
        collection: collectionId !== 'all' ? collectionId : undefined
      }

      const response = await api.get('/bookmarks', { params })
      
      setBookmarks(response.data.bookmarks || [])
      setTotalBookmarks(response.data.total || 0)
      
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error)
      setBookmarks([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveBookmark = async (bookmarkId, e) => {
    e?.stopPropagation()
    
    try {
      await api.delete(`/bookmarks/${bookmarkId}`)
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId))
      setSelectedBookmarks(prev => prev.filter(id => id !== bookmarkId))
      setTotalBookmarks(prev => prev - 1)
    } catch (error) {
      console.error('Failed to remove bookmark:', error)
    }
  }

  const handleBulkRemove = async () => {
    if (selectedBookmarks.length === 0) return
    
    try {
      await api.post('/bookmarks/bulk-delete', { ids: selectedBookmarks })
      setBookmarks(prev => prev.filter(b => !selectedBookmarks.includes(b.id)))
      setSelectedBookmarks([])
      setTotalBookmarks(prev => prev - selectedBookmarks.length)
    } catch (error) {
      console.error('Failed to remove bookmarks:', error)
    }
  }

  const handleSelectAll = () => {
    if (selectedBookmarks.length === bookmarks.length) {
      setSelectedBookmarks([])
    } else {
      setSelectedBookmarks(bookmarks.map(b => b.id))
    }
  }

  const handleSelectBookmark = (bookmarkId, e) => {
    e?.stopPropagation()
    setSelectedBookmarks(prev =>
      prev.includes(bookmarkId)
        ? prev.filter(id => id !== bookmarkId)
        : [...prev, bookmarkId]
    )
  }

  const handleExport = async () => {
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
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="bookmarks-loading">
        <Loader size="large" />
        <p>{t('loadingBookmarks') || 'Loading your saved content...'}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bookmarks-empty">
        <div className="empty-icon">🔖</div>
        <h3>{t('loginToViewBookmarks') || 'Please log in to view your bookmarks'}</h3>
        <button onClick={() => navigate('/login')} className="login-btn">
          {t('goToLogin') || 'Go to Login'}
        </button>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bookmarks-empty">
        <div className="empty-icon">📚</div>
        <h3>{t('noBookmarks') || 'No bookmarks yet'}</h3>
        <p>{t('startSavingContent') || 'Start saving legal content to access them quickly here'}</p>
        <button onClick={() => navigate('/categories')} className="browse-btn">
          {t('browseLaws') || 'Browse Laws'}
        </button>
      </div>
    )
  }

  return (
    <div className="bookmarks-container">
      <div className="bookmarks-toolbar">
        <label className="select-all">
          <input
            type="checkbox"
            checked={selectedBookmarks.length === bookmarks.length && bookmarks.length > 0}
            onChange={handleSelectAll}
          />
          <span>{t('selectAll') || 'Select All'}</span>
          {selectedBookmarks.length > 0 && (
            <span className="selected-count">({selectedBookmarks.length})</span>
          )}
        </label>
        
        <div className="toolbar-actions">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              🔲
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              📋
            </button>
          </div>

          <button className="export-btn" onClick={handleExport}>
            📥 {t('export') || 'Export'}
          </button>

          {selectedBookmarks.length > 0 && (
            <button className="remove-btn" onClick={handleBulkRemove}>
              🗑️ {t('remove') || 'Remove'} ({selectedBookmarks.length})
            </button>
          )}
        </div>
      </div>

      {totalBookmarks > 0 && (
        <div className="results-info">
          <span className="results-count">
            Showing <strong>{bookmarks.length}</strong> of <strong>{totalBookmarks}</strong> bookmarks
          </span>
        </div>
      )}

      <div className={`bookmarks-grid bookmarks-${viewMode}`}>
        {bookmarks.map((bookmark) => (
          <div 
            key={bookmark.id} 
            className={`bookmark-card ${selectedBookmarks.includes(bookmark.id) ? 'selected' : ''}`}
          >
            <div className="bookmark-checkbox">
              <input
                type="checkbox"
                checked={selectedBookmarks.includes(bookmark.id)}
                onChange={(e) => handleSelectBookmark(bookmark.id, e)}
              />
            </div>

            <div 
              className="bookmark-content"
              onClick={() => navigate(`/legal-content/${bookmark.contentId || bookmark.id}`)}
            >
              <div className="bookmark-header">
                <span className="bookmark-category" data-category={bookmark.category}>
                  {bookmark.category}
                </span>
                <span className="bookmark-date">
                  {formatDate(bookmark.savedAt || bookmark.createdAt)}
                </span>
              </div>

              <h3 className="bookmark-title">
                {bookmark.title?.[currentLanguage] || bookmark.title?.en || 'Untitled'}
              </h3>

              {bookmark.excerpt && (
                <p className="bookmark-excerpt">
                  {bookmark.excerpt[currentLanguage] || bookmark.excerpt.en}
                </p>
              )}

              {bookmark.metadata && (
                <div className="bookmark-metadata">
                  {bookmark.metadata.articleNumber && (
                    <span className="meta-item">
                      <span className="meta-icon">📄</span>
                      Art. {bookmark.metadata.articleNumber}
                    </span>
                  )}
                  {bookmark.metadata.proclamationNo && (
                    <span className="meta-item">
                      <span className="meta-icon">📜</span>
                      Proc. {bookmark.metadata.proclamationNo}
                    </span>
                  )}
                </div>
              )}

              <div className="bookmark-footer">
                <button
                  className="remove-single"
                  onClick={(e) => handleRemoveBookmark(bookmark.id, e)}
                >
                  🗑️ {t('remove') || 'Remove'}
                </button>
                <Link 
                  to={`/legal-content/${bookmark.contentId || bookmark.id}`} 
                  className="read-more"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t('readMore') || 'Read More'} →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bookmarks.length > 0 && bookmarks.length < totalBookmarks && (
        <div className="load-more-trigger">
          <p className="end-message">Load more bookmarks</p>
        </div>
      )}
    </div>
  )
}

export default BookmarkList