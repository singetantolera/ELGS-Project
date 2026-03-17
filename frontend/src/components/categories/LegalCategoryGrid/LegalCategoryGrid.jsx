import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../hooks/useLanguage'
import CategoryCard from '../CategoryCard/CategoryCard'
import api from '../../../services/api'
import Loader from '../../common/Loader/Loader'
import './LegalCategoryGrid.css'

const LegalCategoryGrid = ({ preview = false }) => {
  const { t, currentLanguage } = useLanguage()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const sectionRef = useRef(null)

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.get('/categories', { 
        params: { language: currentLanguage } 
      })
      setCategories(response.data.categories || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      setError('Failed to load categories. Please refresh the page.')
    } finally {
      setIsLoading(false)
    }
  }, [currentLanguage])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('category-visible')
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('.category-card-animate');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [categories]);
//Gidduu kana ture
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId)
    navigate(`/category/${categoryId}`)
  }

  const handleMouseEnter = (categoryId) => {
    setHoveredCategory(categoryId)
  }

  const handleMouseLeave = () => {
    setHoveredCategory(null)
  }

  const handleRefresh = () => {
    fetchCategories()
  }

  // Calculate stats
  const totalArticles = categories.reduce((sum, cat) => sum + (cat.articleCount || 0), 0)
  const trendingCount = categories.filter(cat => cat.trending).length

  if (isLoading) {
    return (
      <div className="categories-loading">
        <Loader size="large" />
        <p className="loading-text">Loading legal categories...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="categories-error">
        <div className="error-icon">⚠️</div>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={handleRefresh}>
          🔄 Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="category-grid-container" ref={sectionRef}>
      {!preview && (
        <div className="category-header">
          <span className="section-badge">📚 Legal Areas</span>
          <h1>{t('legalCategories') || 'Explore Ethiopian Laws'}</h1>
          <p>{t('categoryDescription') || 'Browse our comprehensive collection of Ethiopian laws organized by category'}</p>
          
          {/* Stats Overview */}
          <div className="category-stats">
            <div className="stat-chip">
              <span className="stat-chip-icon">📖</span>
              <div>
                <strong>{totalArticles}+</strong>
                <span>Articles</span>
              </div>
            </div>
            <div className="stat-chip">
              <span className="stat-chip-icon">⚡</span>
              <div>
                <strong>{trendingCount}</strong>
                <span>Trending</span>
              </div>
            </div>
            <div className="stat-chip">
              <span className="stat-chip-icon">🌐</span>
              <div>
                <strong>3</strong>
                <span>Languages</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`categories-grid ${preview ? 'preview-grid' : ''}`}>
        {(preview ? categories.slice(0, 3) : categories).map((category, index) => (
          <div 
            key={category.id}
            className="category-card-wrapper"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CategoryCard
              category={category}
              onClick={() => handleCategoryClick(category.id)}
              isSelected={selectedCategory === category.id}
              isHovered={hoveredCategory === category.id}
              onMouseEnter={() => handleMouseEnter(category.id)}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Trending Badge */}
            {category.trending && (
              <div className="trending-badge">
                <span className="trending-icon">🔥</span>
                <span className="trending-text">Trending</span>
                {category.newArticles && (
                  <span className="trending-count">+{category.newArticles} new</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {preview && categories.length > 3 && (
        <div className="view-all-link">
          <button onClick={() => navigate('/categories')} className="view-all-btn">
            {t('viewAllCategories') || 'Explore All Categories'} 
            <span className="btn-arrow">→</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default LegalCategoryGrid