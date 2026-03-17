import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import Loader from '../../components/common/Loader/Loader'
import api from '../../services/api'
import './CategoryPage.css'

const CategoryPage = () => {
  const { categoryId } = useParams()
  const { currentLanguage, t } = useLanguage()
  
  const [category, setCategory] = useState(null)
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState('relevance')
  const [filterBy, setFilterBy] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalArticles, setTotalArticles] = useState(0)

  useEffect(() => {
    fetchCategoryData()
  }, [categoryId, currentPage, sortBy, filterBy])

  const fetchCategoryData = async () => {
    setIsLoading(true)
    try {
      // Fetch category details
      const categoryResponse = await api.get(`/categories/${categoryId}`, {
        params: { language: currentLanguage }
      })
      setCategory(categoryResponse.data.category)

      // Fetch articles for this category
      const articlesResponse = await api.get(`/categories/${categoryId}/articles`, {
        params: {
          page: currentPage,
          limit: 10,
          sort: sortBy,
          filter: filterBy,
          language: currentLanguage
        }
      })
      
      setArticles(articlesResponse.data.articles || [])
      setTotalPages(articlesResponse.data.pages || 1)
      setTotalArticles(articlesResponse.data.total || 0)
    } catch (error) {
      console.error('Failed to fetch category data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="category-loading">
        <Loader size="large" />
        <p>{t('loadingCategory') || 'Loading category...'}</p>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="category-error">
        <div className="error-icon">⚠️</div>
        <h3>{t('categoryNotFound') || 'Category not found'}</h3>
        <Link to="/categories" className="back-link">← {t('backToCategories') || 'Back to Categories'}</Link>
      </div>
    )
  }

  return (
    <div className="category-page">
      <section className="category-header" style={{ backgroundColor: category.color }}>
        <div className="header-content">
          <div className="category-icon-large">{category.icon}</div>
          <div className="category-info">
            <h1>{category.title[currentLanguage]}</h1>
            <p>{category.description[currentLanguage]}</p>
            <div className="category-meta">
              <span className="meta-item">
                <strong>{totalArticles || category.totalArticles}</strong> {t('articles') || 'Articles'}
              </span>
              {category.lastUpdated && (
                <span className="meta-item">
                  <strong>{t('lastUpdated')}:</strong> {new Date(category.lastUpdated).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="category-controls">
        <div className="results-info">
          {t('showing')} <strong>{articles.length}</strong> {t('of')} <strong>{totalArticles || category.totalArticles}</strong> {t('articles')}
        </div>

        <div className="control-group">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="relevance">{t('sortByRelevance')}</option>
            <option value="date">{t('sortByDate')}</option>
            <option value="views">{t('sortByViews')}</option>
            <option value="title">{t('sortByTitle')}</option>
          </select>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('allArticles')}</option>
            <option value="recent">{t('last30Days')}</option>
            <option value="popular">{t('mostPopular')}</option>
          </select>
        </div>
      </section>

      <section className="articles-list">
        {articles.length > 0 ? (
          articles.map(article => (
            <div key={article.id} className="article-card">
              <div className="article-main">
                <h2 className="article-title">
                  <Link to={`/legal-content/${article.id}`}>
                    {article.title[currentLanguage]}
                  </Link>
                </h2>
                <p className="article-excerpt">{article.excerpt?.[currentLanguage] || ''}</p>
                <div className="article-meta">
                  <span className="meta-views">👁️ {article.views?.toLocaleString() || 0} {t('views')}</span>
                  <span className="meta-bookmarks">🔖 {article.bookmarks || 0} {t('saves')}</span>
                  <span className="meta-date">📅 {article.date ? new Date(article.date).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              <button className="save-article-btn">🔖 {t('save')}</button>
            </div>
          ))
        ) : (
          <div className="no-articles">
            <p>{t('noArticlesFound') || 'No articles found in this category'}</p>
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-btn prev" 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ← {t('previous')}
          </button>
          <div className="page-numbers">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Show first page, last page, and pages around current page
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              }
              // Show dots for gaps
              if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return <span key={pageNum} className="page-dots">...</span>;
              }
              return null;
            })}
          </div>
          <button 
            className="page-btn next"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {t('next')} →
          </button>
        </div>
      )}
    </div>
  )
}

export default CategoryPage