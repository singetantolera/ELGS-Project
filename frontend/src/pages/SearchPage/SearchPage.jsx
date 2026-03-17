import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import SearchBar from '../../components/search/SearchBar/SearchBar'
import SearchResults from '../../components/search/SearchResults/SearchResults'
import Loader from '../../components/common/Loader/Loader'
import api from '../../services/api'
import './SearchPage.css'

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { currentLanguage, t } = useLanguage()
  const { user } = useAuth()
  
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    category: 'all',
    language: 'all',
    date: 'all',
    type: 'all'
  })
  const [searchHistory, setSearchHistory] = useState([])
  const [trendingSearches, setTrendingSearches] = useState([])
  const [activeFilter, setActiveFilter] = useState(null)
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [error, setError] = useState(null)
  
  const searchInputRef = useRef(null)
  const filtersRef = useRef(null)
  const loadingRef = useRef(null)

  const query = searchParams.get('q') || ''
  const searchType = searchParams.get('type') || 'all'

  useEffect(() => {
    if (query) {
      performSearch()
      fetchSearchSuggestions(query)
      if (user) {
        saveSearchToHistory(query)
      }
    }
  }, [query, searchType, currentPage, filters, currentLanguage, user])

  useEffect(() => {
    fetchTrendingSearches()
    loadSearchHistory()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setActiveFilter(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSearchSuggestions = useCallback(async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSearchSuggestions([])
      return
    }
    
    try {
      const response = await api.get('/search/suggestions', {
        params: { q: searchQuery, language: currentLanguage }
      })
      setSearchSuggestions(response.data.suggestions)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
    }
  }, [currentLanguage])

  const performSearch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.get('/search', {
        params: {
          q: query,
          type: searchType,
          category: filters.category !== 'all' ? filters.category : undefined,
          language: filters.language !== 'all' ? filters.language : undefined,
          date: filters.date !== 'all' ? filters.date : undefined,
          page: currentPage,
          limit: 10
        }
      })

      if (currentPage === 1) {
        setResults(response.data.results)
      } else {
        setResults(prev => [...prev, ...response.data.results])
      }
      
      setTotalResults(response.data.total)
      setTotalPages(response.data.pages)
      
    } catch (error) {
      console.error('Search failed:', error)
      setError(error.response?.data?.message || 'Search failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [query, searchType, filters, currentPage, currentLanguage])

  const fetchTrendingSearches = useCallback(async () => {
    try {
      const response = await api.get('/search/trending', {
        params: { limit: 10 }
      })
      setTrendingSearches(response.data.trending)
    } catch (error) {
      console.error('Failed to fetch trending searches:', error)
    }
  }, [])

  const loadSearchHistory = () => {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }

  const saveSearchToHistory = async (searchTerm) => {
    const updatedHistory = [searchTerm, ...searchHistory.filter(s => s !== searchTerm)].slice(0, 5)
    setSearchHistory(updatedHistory)
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))
    
    if (user) {
      try {
        await api.post('/search/history', { term: searchTerm })
      } catch (error) {
        console.error('Failed to save search history:', error)
      }
    }
  }

  const clearHistory = async () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
    
    if (user) {
      try {
        await api.delete('/search/history')
      } catch (error) {
        console.error('Failed to clear search history:', error)
      }
    }
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
    setCurrentPage(1)
    setActiveFilter(null)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTrendingClick = (term) => {
    setSearchParams({ q: term, type: 'keyword' })
  }

  const toggleFilter = (filterName) => {
    setActiveFilter(activeFilter === filterName ? null : filterName)
  }

  // Categories without constitution
  const categories = [
    { id: 'criminal', name: t('criminalLaw'), icon: '⚖️', color: '#fee2e2' },
    { id: 'family', name: t('familyLaw'), icon: '👨‍👩‍👧‍👦', color: '#dbeafe' },
    { id: 'labor', name: t('laborLaw'), icon: '💼', color: '#dcfce7' }
  ]

  const languages = [
    { id: 'en', name: 'English', flag: '🇬🇧' },
    { id: 'am', name: 'አማርኛ', flag: '🇪🇹' },
    { id: 'om', name: 'Afaan Oromoo', flag: '🇪🇹' }
  ]

  const dateRanges = [
    { id: 'today', name: t('today'), icon: '📅' },
    { id: 'week', name: t('thisWeek'), icon: '📆' },
    { id: 'month', name: t('thisMonth'), icon: '📅' },
    { id: 'year', name: t('thisYear'), icon: '🗓️' }
  ]

  return (
    <div className="search-page">
      {/* Search Header */}
      <section className="search-header">
        <div className="search-stats">
          <span className="stat-badge">
            <span className="stat-icon">📚</span>
            <span>1,000+ Legal Articles</span>
          </span>
          <span className="stat-badge">
            <span className="stat-icon">🌐</span>
            <span>3 Languages</span>
          </span>
          <span className="stat-badge">
            <span className="stat-icon">⚡</span>
            <span>Instant Results</span>
          </span>
        </div>

        <h1 className="search-title">
          <span className="title-highlight">🔍</span>
          {currentLanguage === 'en' && 'Search Ethiopian Laws'}
          {currentLanguage === 'am' && 'የኢትዮጵያ ሕጎችን ይፈልጉ'}
          {currentLanguage === 'om' && 'Seera Etiyophiaa Barbaadi'}
        </h1>
        
        <div className="search-bar-wrapper" ref={searchInputRef}>
          <SearchBar onFocus={() => setShowSuggestions(true)} />
          
          {/* Live Search Suggestions */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="search-suggestions">
              {searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => {
                    setSearchParams({ q: suggestion.text, type: 'keyword' })
                    setShowSuggestions(false)
                  }}
                >
                  <span className="suggestion-icon">🔍</span>
                  <div className="suggestion-content">
                    <span className="suggestion-text">{suggestion.text}</span>
                    <span className="suggestion-category">{suggestion.category}</span>
                  </div>
                  <span className="suggestion-count">{suggestion.count} results</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {query && (
          <div className="search-query-info">
            <div className="query-badge">
              <span className="query-icon">🔎</span>
              <span className="query-text">
                {currentLanguage === 'en' && `"${query}"`}
                {currentLanguage === 'am' && `"${query}"`}
                {currentLanguage === 'om' && `"${query}"`}
              </span>
            </div>
            <span className="result-count">
              {totalResults} {totalResults === 1 ? 'result' : 'results'}
            </span>
          </div>
        )}
      </section>

      <div className="search-layout">
        {/* Filters Sidebar */}
        <aside className="search-filters" ref={filtersRef}>
          <div className="filters-header">
            <h3>
              <span className="header-icon">🎯</span>
              {currentLanguage === 'en' && 'Filters'}
              {currentLanguage === 'am' && 'ማጣሪያዎች'}
              {currentLanguage === 'om' && 'Feeltira'}
            </h3>
            <button 
              className="clear-filters" 
              onClick={() => {
                setFilters({ category: 'all', language: 'all', date: 'all', type: 'all' })
                setActiveFilter(null)
              }}
            >
              <span className="clear-icon">✕</span>
              {t('clearAll') || 'Clear All'}
            </button>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <div 
              className={`filter-header ${activeFilter === 'category' ? 'active' : ''}`}
              onClick={() => toggleFilter('category')}
            >
              <h4>
                <span className="filter-icon">📋</span>
                {currentLanguage === 'en' && 'Category'}
                {currentLanguage === 'am' && 'ምድብ'}
                {currentLanguage === 'om' && 'Ramaddii'}
              </h4>
              <span className="filter-arrow">{activeFilter === 'category' ? '−' : '+'}</span>
            </div>
            
            {activeFilter === 'category' && (
              <div className="filter-options animate-slide">
                <label className="filter-option all-option">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={filters.category === 'all'}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  />
                  <span className="option-content">
                    <span className="option-icon">🌐</span>
                    <span>{t('allCategories') || 'All Categories'}</span>
                  </span>
                  <span className="option-count">579</span>
                </label>
                
                {categories.map(cat => (
                  <label key={cat.id} className="filter-option" style={{ '--option-color': cat.color }}>
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={filters.category === cat.id}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    />
                    <span className="option-content">
                      <span className="option-icon">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className="option-count">
                      {cat.id === 'criminal' ? '245' : cat.id === 'family' ? '178' : '156'}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Language Filter */}
          <div className="filter-section">
            <div 
              className={`filter-header ${activeFilter === 'language' ? 'active' : ''}`}
              onClick={() => toggleFilter('language')}
            >
              <h4>
                <span className="filter-icon">🗣️</span>
                {currentLanguage === 'en' && 'Language'}
                {currentLanguage === 'am' && 'ቋንቋ'}
                {currentLanguage === 'om' && 'Afaan'}
              </h4>
              <span className="filter-arrow">{activeFilter === 'language' ? '−' : '+'}</span>
            </div>
            
            {activeFilter === 'language' && (
              <div className="filter-options animate-slide">
                <label className="filter-option all-option">
                  <input
                    type="radio"
                    name="language"
                    value="all"
                    checked={filters.language === 'all'}
                    onChange={(e) => handleFilterChange('language', e.target.value)}
                  />
                  <span className="option-content">
                    <span className="option-icon">🌐</span>
                    <span>{t('allLanguages') || 'All Languages'}</span>
                  </span>
                </label>
                
                {languages.map(lang => (
                  <label key={lang.id} className="filter-option">
                    <input
                      type="radio"
                      name="language"
                      value={lang.id}
                      checked={filters.language === lang.id}
                      onChange={(e) => handleFilterChange('language', e.target.value)}
                    />
                    <span className="option-content">
                      <span className="option-icon">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Date Filter */}
          <div className="filter-section">
            <div 
              className={`filter-header ${activeFilter === 'date' ? 'active' : ''}`}
              onClick={() => toggleFilter('date')}
            >
              <h4>
                <span className="filter-icon">📅</span>
                {currentLanguage === 'en' && 'Date'}
                {currentLanguage === 'am' && 'ቀን'}
                {currentLanguage === 'om' && 'Guyyaa'}
              </h4>
              <span className="filter-arrow">{activeFilter === 'date' ? '−' : '+'}</span>
            </div>
            
            {activeFilter === 'date' && (
              <div className="filter-options animate-slide">
                <label className="filter-option all-option">
                  <input
                    type="radio"
                    name="date"
                    value="all"
                    checked={filters.date === 'all'}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  />
                  <span className="option-content">
                    <span className="option-icon">∞</span>
                    <span>{t('allTime') || 'All Time'}</span>
                  </span>
                </label>
                
                {dateRanges.map(range => (
                  <label key={range.id} className="filter-option">
                    <input
                      type="radio"
                      name="date"
                      value={range.id}
                      checked={filters.date === range.id}
                      onChange={(e) => handleFilterChange('date', e.target.value)}
                    />
                    <span className="option-content">
                      <span className="option-icon">{range.icon}</span>
                      <span>{range.name}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Active Filters Summary */}
          {Object.values(filters).some(v => v !== 'all') && (
            <div className="active-filters">
              <h5>Active Filters:</h5>
              <div className="filter-tags">
                {filters.category !== 'all' && (
                  <span className="filter-tag">
                    {categories.find(c => c.id === filters.category)?.name || filters.category}
                    <button onClick={() => handleFilterChange('category', 'all')}>✕</button>
                  </span>
                )}
                {filters.language !== 'all' && (
                  <span className="filter-tag">
                    {languages.find(l => l.id === filters.language)?.name || filters.language}
                    <button onClick={() => handleFilterChange('language', 'all')}>✕</button>
                  </span>
                )}
                {filters.date !== 'all' && (
                  <span className="filter-tag">
                    {dateRanges.find(d => d.id === filters.date)?.name || filters.date}
                    <button onClick={() => handleFilterChange('date', 'all')}>✕</button>
                  </span>
                )}
              </div>
            </div>
          )}
        </aside>

        <main className="search-main">
          {/* Error State */}
          {error && (
            <div className="search-error">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <button className="retry-btn" onClick={performSearch}>Try Again</button>
            </div>
          )}

          {/* Search History */}
          {!query && searchHistory.length > 0 && (
            <section className="search-history">
              <div className="history-header">
                <h3>
                  <span className="header-icon">🕒</span>
                  {currentLanguage === 'en' && 'Recent Searches'}
                  {currentLanguage === 'am' && 'የቅርብ ጊዜ ፍለጋዎች'}
                  {currentLanguage === 'om' && 'Barbaacha Dhihoo'}
                </h3>
                <button className="clear-history" onClick={clearHistory}>
                  <span className="clear-icon">🗑️</span>
                  {t('clearHistory') || 'Clear History'}
                </button>
              </div>
              <div className="history-list">
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    className="history-item"
                    onClick={() => setSearchParams({ q: term, type: 'keyword' })}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="history-icon">🕒</span>
                    <span className="history-term">{term}</span>
                    <span className="history-arrow">→</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Trending Searches */}
          {!query && trendingSearches.length > 0 && (
            <section className="trending-searches">
              <h3>
                <span className="header-icon">🔥</span>
                {currentLanguage === 'en' && 'Trending Searches'}
                {currentLanguage === 'am' && 'በአዝማሚያ ላይ ያሉ ፍለጋዎች'}
                {currentLanguage === 'om' && 'Barbaacha Beeksisaa'}
              </h3>
              <div className="trending-list">
                {trendingSearches.map((item, index) => (
                  <button
                    key={index}
                    className="trending-item"
                    onClick={() => handleTrendingClick(item.term)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="trending-rank">#{index + 1}</span>
                    <span className="trending-content">
                      <span className="trending-term">{item.term}</span>
                      <span className="trending-category">{item.category}</span>
                    </span>
                    <span className="trending-count">{item.count} searches</span>
                    <span className="trending-arrow">→</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Search Results */}
          {query && (
            <SearchResults
              results={results}
              isLoading={isLoading}
              totalResults={totalResults}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}

          {/* Search Tips */}
          {!query && (
            <section className="search-tips">
              <h3>
                <span className="header-icon">💡</span>
                {currentLanguage === 'en' && 'Search Tips'}
                {currentLanguage === 'am' && 'የፍለጋ ምክሮች'}
                {currentLanguage === 'om' && 'Qarqarsa Barbaacha'}
              </h3>
              <div className="tips-grid">
                <div className="tip-card" style={{ animationDelay: '0s' }}>
                  <div className="tip-icon">🔍</div>
                  <h4>{t('useKeywords') || 'Use Keywords'}</h4>
                  <p>{t('keywordsTip') || 'Try specific terms like "divorce", "theft", or "minimum wage"'}</p>
                  <div className="tip-examples">
                    <span className="example-tag">divorce</span>
                    <span className="example-tag">theft</span>
                    <span className="example-tag">minimum wage</span>
                  </div>
                </div>
                <div className="tip-card" style={{ animationDelay: '0.1s' }}>
                  <div className="tip-icon">🗣️</div>
                  <h4>{t('naturalLanguage') || 'Natural Language'}</h4>
                  <p>{t('naturalLanguageTip') || 'Ask questions like "What are the grounds for divorce?"'}</p>
                  <div className="tip-examples">
                    <span className="example-tag">grounds for divorce</span>
                    <span className="example-tag">employee rights</span>
                  </div>
                </div>
                <div className="tip-card" style={{ animationDelay: '0.2s' }}>
                  <div className="tip-icon">📚</div>
                  <h4>{t('browseCategories') || 'Browse Categories'}</h4>
                  <p>{t('browseTip') || 'Or explore laws by category if you\'re not sure what to search'}</p>
                  <div className="tip-examples">
                    <span className="example-tag">Criminal Law</span>
                    <span className="example-tag">Family Law</span>
                    <span className="example-tag">Labor Law</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default SearchPage