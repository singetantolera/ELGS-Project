import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../hooks/useLanguage'
import { useAuth } from '../../../hooks/useAuth'
import Loader from '../../common/Loader/Loader'
import api from '../../../services/api'
import './SearchResults.css'

const SearchResults = ({ results, isLoading, totalResults, onPageChange, currentPage }) => {
  const { t, currentLanguage } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [viewMode, setViewMode] = useState('list')
  const [sortBy, setSortBy] = useState('relevance')
  const [bookmarkedItems, setBookmarkedItems] = useState([])
  const [hoveredItem, setHoveredItem] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [quickViewItem, setQuickViewItem] = useState(null)
  const [feedback, setFeedback] = useState({})
  
  const resultsRef = useRef([])

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('result-visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    resultsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [results])

  // Check bookmark status for all results
  useEffect(() => {
    if (user && results.length > 0) {
      checkBookmarks()
    }
  }, [results, user])

  const checkBookmarks = async () => {
    try {
      const ids = results.map(r => r.id)
      const response = await api.post('/bookmarks/check-bulk', { ids })
      setBookmarkedItems(response.data.bookmarked)
    } catch (error) {
      console.error('Failed to check bookmarks:', error)
    }
  }

  const handleBookmark = async (resultId, e) => {
    e?.stopPropagation()
    
    if (!user) {
      navigate('/login')
      return
    }

    try {
      if (bookmarkedItems.includes(resultId)) {
        await api.delete(`/bookmarks/${resultId}`)
        setBookmarkedItems(prev => prev.filter(id => id !== resultId))
      } else {
        await api.post('/bookmarks', { articleId: resultId })
        setBookmarkedItems(prev => [...prev, resultId])
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    }
  }

  const handleFeedback = async (resultId, type) => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      await api.post(`/search/results/${resultId}/feedback`, { type })
      setFeedback(prev => ({ ...prev, [resultId]: type }))
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    }
  }

  const handleSelectItem = (resultId, e) => {
    e?.stopPropagation()
    setSelectedItems(prev =>
      prev.includes(resultId)
        ? prev.filter(id => id !== resultId)
        : [...prev, resultId]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === results.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(results.map(r => r.id))
    }
  }

  const handleExportSelected = async () => {
    if (selectedItems.length === 0) return

    try {
      const response = await api.post('/search/export', {
        ids: selectedItems,
        format: 'json'
      }, { responseType: 'blob' })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `search-results-${new Date().toISOString()}.json`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Failed to export results:', error)
    }
  }

  const handleSortChange = (e) => {
    const newSort = e.target.value
    setSortBy(newSort)
  }

  const handleQuickView = (result) => {
    setQuickViewItem(result)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="search-results-loading">
        <Loader size="large" />
        <p>{t('searching') || 'Searching legal database...'}</p>
      </div>
    )
  }

  if (!results || results.length === 0) {
    return (
      <div className="search-results-empty">
        <div className="empty-state-icon">🔍</div>
        <h3>{t('noResults') || 'No results found'}</h3>
        <p>{t('tryDifferentKeywords') || 'Try different keywords or browse legal categories below'}</p>
        <div className="empty-state-suggestions">
          <Link to="/category/criminal" className="suggestion-link criminal">{t('criminalLaw')}</Link>
          <Link to="/category/family" className="suggestion-link family">{t('familyLaw')}</Link>
          <Link to="/category/labor" className="suggestion-link labor">{t('laborLaw')}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="search-results">
      {/* Results Header */}
      <div className="results-header">
        <div className="results-info">
          <span className="results-count">{totalResults} {t('results')}</span>
          <span className="results-time">{t('foundIn')} {currentLanguage}</span>
        </div>

        <div className="results-controls">
          {selectedItems.length > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">{selectedItems.length} selected</span>
              <button className="bulk-export-btn" onClick={handleExportSelected}>
                <span className="btn-icon">📥</span>
                Export
              </button>
              <button className="bulk-clear-btn" onClick={() => setSelectedItems([])}>
                ✕
              </button>
            </div>
          )}

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              📋
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              🔲
            </button>
          </div>

          <select 
            className="sort-select"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="relevance">{t('sortByRelevance') || 'Sort by: Relevance'}</option>
            <option value="date">{t('sortByDate') || 'Sort by: Date'}</option>
            <option value="title">{t('sortByTitle') || 'Sort by: Title'}</option>
          </select>

          <button
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            title="Toggle filters"
          >
            <span className="btn-icon">🎯</span>
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {showFilters && (
        <div className="active-filters">
          <div className="filter-chip">
            <span className="chip-label">All Categories</span>
            <button className="chip-remove">✕</button>
          </div>
          <div className="filter-chip">
            <span className="chip-label">All Languages</span>
            <button className="chip-remove">✕</button>
          </div>
        </div>
      )}

      {/* Results Container */}
      <div className={`results-container results-${viewMode}`}>
        {results.map((result, index) => (
          <div
            key={result.id}
            ref={el => resultsRef.current[index] = el}
            className={`result-card ${viewMode} ${selectedItems.includes(result.id) ? 'selected' : ''}`}
            onMouseEnter={() => setHoveredItem(result.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Selection Checkbox */}
            <div className="result-checkbox">
              <input
                type="checkbox"
                checked={selectedItems.includes(result.id)}
                onChange={(e) => handleSelectItem(result.id, e)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Result Badge */}
            <div className="result-badge" data-category={result.category}>
              {result.category}
            </div>

            {/* Result Content */}
            <div className="result-content">
              <h3 className="result-title">
                <Link to={`/legal-content/${result.id}`}>
                  {result.title[currentLanguage]}
                </Link>
              </h3>

              <p className="result-excerpt">
                {result.excerpt[currentLanguage]}
              </p>

              {/* Result Metadata */}
              <div className="result-meta">
                <span className="result-language">
                  {result.language === 'en' && '🇬🇧 English'}
                  {result.language === 'am' && '🇪🇹 አማርኛ'}
                  {result.language === 'om' && '🇪🇹 Afaan Oromoo'}
                </span>
                <span className="result-date">
                  {formatDate(result.updatedAt)}
                </span>
                <span className="result-views">
                  👁️ {result.views?.toLocaleString()} {t('views')}
                </span>
                {result.relevance && (
                  <span className="result-relevance">
                    📊 {result.relevance}% match
                  </span>
                )}
              </div>

              {/* Result Actions */}
              <div className="result-actions">
                <button
                  className={`action-btn bookmark-btn ${bookmarkedItems.includes(result.id) ? 'active' : ''}`}
                  onClick={(e) => handleBookmark(result.id, e)}
                  title={bookmarkedItems.includes(result.id) ? 'Remove bookmark' : 'Save for later'}
                >
                  <span className="btn-icon">{bookmarkedItems.includes(result.id) ? '🔖' : '📑'}</span>
                  <span className="btn-text">{t('save')}</span>
                </button>

                <button
                  className="action-btn share-btn"
                  title="Share"
                >
                  <span className="btn-icon">📤</span>
                  <span className="btn-text">{t('share')}</span>
                </button>

                <button
                  className="action-btn quick-view-btn"
                  onClick={() => handleQuickView(result)}
                  title="Quick view"
                >
                  <span className="btn-icon">👁️</span>
                  <span className="btn-text">Quick view</span>
                </button>

                {user && (
                  <div className="feedback-buttons">
                    <button
                      className={`feedback-btn ${feedback[result.id] === 'helpful' ? 'active' : ''}`}
                      onClick={() => handleFeedback(result.id, 'helpful')}
                      title="Helpful"
                    >
                      👍
                    </button>
                    <button
                      className={`feedback-btn ${feedback[result.id] === 'not-helpful' ? 'active' : ''}`}
                      onClick={() => handleFeedback(result.id, 'not-helpful')}
                      title="Not helpful"
                    >
                      👎
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalResults > 10 && (
        <div className="pagination">
          <button
            className="page-btn prev"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            ← {t('previous')}
          </button>
          
          <div className="page-numbers">
            {[...Array(Math.ceil(totalResults / 10))].map((_, i) => {
              const pageNum = i + 1
              const isActive = currentPage === pageNum
              const isNearActive = Math.abs(currentPage - pageNum) <= 2

              if (!isNearActive && pageNum !== 1 && pageNum !== Math.ceil(totalResults / 10)) {
                if (pageNum === 2 || pageNum === Math.ceil(totalResults / 10) - 1) {
                  return <span key={i} className="page-dots">⋯</span>
                }
                return null
              }

              return (
                <button
                  key={pageNum}
                  className={`page-number ${isActive ? 'active' : ''}`}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            className="page-btn next"
            disabled={currentPage === Math.ceil(totalResults / 10)}
            onClick={() => onPageChange(currentPage + 1)}
          >
            {t('next')} →
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewItem && (
        <div className="modal-overlay" onClick={() => setQuickViewItem(null)}>
          <div className="modal-content quick-view-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setQuickViewItem(null)}>✕</button>
            <h3 className="modal-title">{quickViewItem.title[currentLanguage]}</h3>
            <div className="modal-metadata">
              <span className="meta-badge">{quickViewItem.category}</span>
              <span className="meta-badge">
                {quickViewItem.language === 'en' ? 'English' : 
                 quickViewItem.language === 'am' ? 'አማርኛ' : 'Afaan Oromoo'}
              </span>
            </div>
            <p className="modal-excerpt">{quickViewItem.excerpt[currentLanguage]}</p>
            <div className="modal-actions">
              <Link to={`/legal-content/${quickViewItem.id}`} className="modal-btn primary">
                Read Full Article →
              </Link>
              <button className="modal-btn secondary" onClick={() => setQuickViewItem(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchResults