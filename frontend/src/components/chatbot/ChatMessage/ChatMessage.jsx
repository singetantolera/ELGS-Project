import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../../hooks/useLanguage'
import './ChatMessage.css'

const ChatMessage = ({ message, isConsecutive = false }) => {
  const [showSources, setShowSources] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  
  const messageRef = useRef(null)
  const { currentLanguage } = useLanguage()

  // Auto-dismiss source list after 10 seconds
  useEffect(() => {
    if (showSources) {
      const timer = setTimeout(() => setShowSources(false), 10000)
      return () => clearTimeout(timer)
    }
  }, [showSources])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleFeedback = async (type) => {
    setFeedback(type)
    try {
      // Send feedback to backend
      const response = await fetch('/api/chatbot/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: message.id,
          feedback: type,
          conversationId: message.conversationId
        })
      })
      
      if (!response.ok) {
        console.error('Failed to send feedback')
      }
    } catch (error) {
      console.error('Feedback error:', error)
    }
  }

  const handleBookmark = async () => {
    setIsBookmarked(!isBookmarked)
    try {
      await fetch('/api/chatbot/bookmark', {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: message.id })
      })
    } catch (error) {
      console.error('Bookmark error:', error)
      setIsBookmarked(!isBookmarked) // Revert on error
    }
  }

  const handleShare = async (platform) => {
    const shareData = {
      title: 'Legal Assistant Message',
      text: message.content,
      url: window.location.href
    }

    try {
      if (platform === 'native' && navigator.share) {
        await navigator.share(shareData)
      } else if (platform === 'copy') {
        await handleCopy()
      } else {
        // Handle social media sharing
        const urls = {
          twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message.content)}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message.content)}`,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
        }
        if (urls[platform]) {
          window.open(urls[platform], '_blank')
        }
      }
    } catch (error) {
      console.error('Share error:', error)
    }
    setShowShareOptions(false)
  }

  const handleSourceClick = (source) => {
    // Track source click
    console.log('Source clicked:', source)
    setShowSources(false)
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const renderMessageContent = () => {
    if (message.type === 'bot' && message.content.includes('```')) {
      // Handle code blocks
      const parts = message.content.split('```')
      return parts.map((part, index) => {
        if (index % 2 === 1) {
          // This is a code block
          return (
            <pre key={index} className="code-block">
              <code>{part}</code>
              <button 
                className="copy-code-btn"
                onClick={() => navigator.clipboard.writeText(part)}
              >
                📋
              </button>
            </pre>
          )
        }
        return <p key={index}>{part}</p>
      })
    }

    // Handle lists
    if (message.content.includes('\n• ')) {
      const parts = message.content.split('\n')
      return parts.map((part, index) => {
        if (part.startsWith('• ')) {
          return <li key={index} className="list-item">{part.substring(2)}</li>
        }
        if (part.match(/^\d+\./)) {
          return <li key={index} className="list-item numbered">{part}</li>
        }
        return <p key={index}>{part}</p>
      })
    }

    return <p>{message.content}</p>
  }

  return (
    <div 
      className={`message-wrapper ${message.type} ${isConsecutive ? 'consecutive' : ''} ${message.isError ? 'error' : ''}`}
      ref={messageRef}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false)
        setShowShareOptions(false)
      }}
    >
      {!isConsecutive && (
        <div className="message-avatar">
          {message.type === 'bot' ? (
            <div className="bot-avatar">
              <span className="avatar-emoji">🤖</span>
              <span className="avatar-status"></span>
            </div>
          ) : (
            <div className="user-avatar">
              <span className="avatar-emoji">👤</span>
            </div>
          )}
        </div>
      )}

      <div className="message-content">
        {!isConsecutive && (
          <div className="message-header">
            <span className="message-sender">
              {message.type === 'bot' ? 'ELGS AI Assistant' : 'You'}
              {message.type === 'bot' && message.model && (
                <span className="model-badge">{message.model}</span>
              )}
            </span>
            <span className="message-time">{formatTime(message.timestamp)}</span>
          </div>
        )}

        <div className={`message-bubble ${message.isError ? 'error' : ''} ${message.isImportant ? 'important' : ''}`}>
          <div className="message-text">
            {renderMessageContent()}
          </div>

          {/* Message Metadata */}
          {message.metadata && (
            <div className="message-metadata">
              {message.metadata.category && (
                <span className="metadata-category">{message.metadata.category}</span>
              )}
              {message.metadata.confidence && (
                <span className="metadata-confidence" title="Confidence score">
                  {Math.round(message.metadata.confidence * 100)}% accurate
                </span>
              )}
            </div>
          )}
        </div>

        {/* Sources Section */}
        {message.sources && message.sources.length > 0 && (
          <div className="message-sources">
            <button
              className={`sources-toggle ${showSources ? 'active' : ''}`}
              onClick={() => setShowSources(!showSources)}
            >
              <span className="toggle-icon">📚</span>
              <span className="toggle-text">
                {message.sources.length} {message.sources.length === 1 ? 'Source' : 'Sources'}
              </span>
              <span className="toggle-arrow">{showSources ? '▼' : '▶'}</span>
            </button>
            
            {showSources && (
              <div className="sources-list">
                {message.sources.map((source, index) => (
                  <Link
                    key={index}
                    to={source.url}
                    className="source-link"
                    onClick={() => handleSourceClick(source)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="source-icon">
                      {source.type === 'law' ? '⚖️' : 
                       source.type === 'article' ? '📄' : 
                       source.type === 'case' ? '⚖️' : '📚'}
                    </span>
                    <div className="source-content">
                      <span className="source-title">{source.title}</span>
                      {source.description && (
                        <span className="source-description">{source.description}</span>
                      )}
                      {source.relevance && (
                        <span className="source-relevance">{source.relevance}% relevant</span>
                      )}
                    </div>
                    <span className="source-arrow">→</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {(showActions || message.type === 'user') && (
          <div className="message-actions">
            {message.type === 'bot' && !message.isError && (
              <>
                <button
                  className={`action-btn feedback-btn ${feedback === 'helpful' ? 'active' : ''}`}
                  onClick={() => handleFeedback('helpful')}
                  title="Helpful"
                >
                  <span className="btn-icon">👍</span>
                  <span className="btn-text">Helpful</span>
                </button>
                
                <button
                  className={`action-btn feedback-btn ${feedback === 'not-helpful' ? 'active' : ''}`}
                  onClick={() => handleFeedback('not-helpful')}
                  title="Not helpful"
                >
                  <span className="btn-icon">👎</span>
                  <span className="btn-text">Not helpful</span>
                </button>
              </>
            )}

            <button
              className={`action-btn copy-btn ${isCopied ? 'active' : ''}`}
              onClick={handleCopy}
              title={isCopied ? 'Copied!' : 'Copy message'}
            >
              <span className="btn-icon">{isCopied ? '✅' : '📋'}</span>
              <span className="btn-text">{isCopied ? 'Copied' : 'Copy'}</span>
            </button>

            {message.type === 'bot' && (
              <>
                <button
                  className={`action-btn bookmark-btn ${isBookmarked ? 'active' : ''}`}
                  onClick={handleBookmark}
                  title={isBookmarked ? 'Remove bookmark' : 'Save message'}
                >
                  <span className="btn-icon">{isBookmarked ? '🔖' : '📑'}</span>
                  <span className="btn-text">{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>

                <div className="share-wrapper">
                  <button
                    className="action-btn share-btn"
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    title="Share"
                  >
                    <span className="btn-icon">📤</span>
                    <span className="btn-text">Share</span>
                  </button>
                  
                  {showShareOptions && (
                    <div className="share-options">
                      {navigator.share && (
                        <button onClick={() => handleShare('native')}>
                          <span className="option-icon">📱</span>
                          Share via...
                        </button>
                      )}
                      <button onClick={() => handleShare('copy')}>
                        <span className="option-icon">📋</span>
                        Copy link
                      </button>
                      <button onClick={() => handleShare('twitter')}>
                        <span className="option-icon">𝕏</span>
                        Twitter
                      </button>
                      <button onClick={() => handleShare('facebook')}>
                        <span className="option-icon">f</span>
                        Facebook
                      </button>
                      <button onClick={() => handleShare('linkedin')}>
                        <span className="option-icon">in</span>
                        LinkedIn
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Delivery Status for User Messages */}
        {message.type === 'user' && message.status && (
          <div className="message-status">
            {message.status === 'sending' && <span className="status-icon">⏳</span>}
            {message.status === 'sent' && <span className="status-icon">✓</span>}
            {message.status === 'delivered' && <span className="status-icon">✓✓</span>}
            {message.status === 'read' && <span className="status-icon read">✓✓</span>}
            {message.status === 'error' && <span className="status-icon error">⚠️</span>}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage