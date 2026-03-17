import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import LegalContentViewer from '../../components/search/LegalContentViewer/LegalContentViewer'
import Loader from '../../components/common/Loader/Loader'
import api from '../../services/api'
import './LegalContentViewPage.css'

const LegalContentViewPage = () => {
  const { id } = useParams()
  const { currentLanguage } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [content, setContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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
    } catch (error) {
      console.error('Failed to fetch content:', error)
      setError(error.message || 'Failed to load legal content')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="legal-content-loading">
        <Loader size="large" />
        <p>Loading legal document...</p>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="legal-content-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Content</h3>
        <p>{error || 'Article not found'}</p>
        <button onClick={fetchContent} className="retry-btn">
          Try Again
        </button>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="legal-content-page">
      <LegalContentViewer />
    </div>
  )
}

export default LegalContentViewPage