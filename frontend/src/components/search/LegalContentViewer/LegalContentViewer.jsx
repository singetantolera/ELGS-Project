import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../hooks/useLanguage'
import { useAuth } from '../../../hooks/useAuth'
import Loader from '../../common/Loader/Loader'
import api from '../../../services/api'
import './LegalContentViewer.css'

const LegalContentViewer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentLanguage } = useLanguage()
  const { user } = useAuth()
  
  const [content, setContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [fontSize, setFontSize] = useState('medium')
  const [showSimplified, setShowSimplified] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [id, currentLanguage])

  const fetchContent = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const contentRes = await api.get(`/legal-content/${id}`, { 
        params: { language: currentLanguage } 
      })
      
      setContent(contentRes.data.content)

      // Check bookmark status if user is logged in
      if (user) {
        const bookmarkRes = await api.get(`/bookmarks/check/${id}`)
        setIsBookmarked(bookmarkRes.data.isBookmarked)
      }

    } catch (error) {
      console.error('Failed to fetch content:', error)
      setError(error.message || 'Failed to load legal content')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      if (isBookmarked) {
        await api.delete(`/bookmarks/${id}`)
        setIsBookmarked(false)
      } else {
        await api.post('/bookmarks', { articleId: id })
        setIsBookmarked(true)
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title[currentLanguage],
          text: content.excerpt?.[currentLanguage] || content.originalText?.[currentLanguage]?.substring(0, 100) + '...',
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className="content-viewer-loading">
        <Loader size="large" />
        <p>Loading legal document...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="content-viewer-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Content</h3>
        <p>{error}</p>
        <button onClick={fetchContent} className="retry-btn">
          Try Again
        </button>
      </div>
    )
  }

  if (!content) return null

  const fontSizeClasses = {
    small: 'text-small',
    medium: 'text-medium',
    large: 'text-large'
  }

  return (
    <div className="legal-content-viewer">
      <div className="content-header">
        <div className="header-left">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
          <div className="content-badge" data-category={content.category}>
            {content.category}
          </div>
        </div>

        <div className="header-actions">
          <div className="font-size-controls">
            <button
              className={`size-btn ${fontSize === 'small' ? 'active' : ''}`}
              onClick={() => setFontSize('small')}
              title="Small text"
            >
              A-
            </button>
            <button
              className={`size-btn ${fontSize === 'medium' ? 'active' : ''}`}
              onClick={() => setFontSize('medium')}
              title="Medium text"
            >
              A
            </button>
            <button
              className={`size-btn ${fontSize === 'large' ? 'active' : ''}`}
              onClick={() => setFontSize('large')}
              title="Large text"
            >
              A+
            </button>
          </div>

          <button
            className={`action-btn ${isBookmarked ? 'active' : ''}`}
            onClick={handleBookmark}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <span className="btn-icon">{isBookmarked ? '🔖' : '📑'}</span>
          </button>

          <button className="action-btn" onClick={handlePrint} title="Print">
            <span className="btn-icon">🖨️</span>
          </button>

          <button className="action-btn" onClick={handleShare} title="Share">
            <span className="btn-icon">📤</span>
          </button>
        </div>
      </div>

      <div className="content-body">
        <h1 className={`content-title ${fontSizeClasses[fontSize]}`}>
          {content.title[currentLanguage]}
        </h1>

        {content.metadata && (
          <div className="content-metadata">
            {content.metadata.articleNumber && (
              <div className="metadata-item">
                <span className="metadata-label">Article:</span>
                <span className="metadata-value">{content.metadata.articleNumber}</span>
              </div>
            )}
            {content.metadata.proclamationNo && (
              <div className="metadata-item">
                <span className="metadata-label">Proclamation:</span>
                <span className="metadata-value">{content.metadata.proclamationNo}</span>
              </div>
            )}
            {content.metadata.dateEnacted && (
              <div className="metadata-item">
                <span className="metadata-label">Enacted:</span>
                <span className="metadata-value">{content.metadata.dateEnacted}</span>
              </div>
            )}
            {content.metadata.lastAmended && (
              <div className="metadata-item">
                <span className="metadata-label">Last Amended:</span>
                <span className="metadata-value">{content.metadata.lastAmended}</span>
              </div>
            )}
            {content.metadata.source && (
              <div className="metadata-item">
                <span className="metadata-label">Source:</span>
                <span className="metadata-value">{content.metadata.source}</span>
              </div>
            )}
          </div>
        )}

        {content.views !== undefined && content.bookmarks !== undefined && (
          <div className="content-stats">
            <span className="stat">👁️ {content.views?.toLocaleString() || 0} views</span>
            <span className="stat">🔖 {content.bookmarks || 0} saved</span>
          </div>
        )}

        <div className="content-display-toggle">
          <button
            className={`toggle-btn ${!showSimplified ? 'active' : ''}`}
            onClick={() => setShowSimplified(false)}
          >
            Original Text
          </button>
          <button
            className={`toggle-btn ${showSimplified ? 'active' : ''}`}
            onClick={() => setShowSimplified(true)}
          >
            Simplified Version
          </button>
        </div>

        <div className={`content-text ${fontSizeClasses[fontSize]}`}>
          {showSimplified ? (
            <div className="simplified-text">
              {content.simplifiedContent?.[currentLanguage] ? (
                <p>{content.simplifiedContent[currentLanguage]}</p>
              ) : content.simplifiedText?.[currentLanguage] ? (
                <p>{content.simplifiedText[currentLanguage]}</p>
              ) : (
                <p className="no-simplified">Simplified version not available for this article.</p>
              )}
            </div>
          ) : (
            <div className="original-text">
              {(content.content?.[currentLanguage] || content.originalText?.[currentLanguage] || '').split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>

        {content.relatedArticles && content.relatedArticles.length > 0 && (
          <div className="related-articles">
            <h3>Related Articles</h3>
            <div className="related-list">
              {content.relatedArticles.map(article => (
                <button
                  key={article.id}
                  className="related-link"
                  onClick={() => navigate(`/legal-content/${article.id}`)}
                >
                  {article.title?.[currentLanguage] || article.title} →
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LegalContentViewer