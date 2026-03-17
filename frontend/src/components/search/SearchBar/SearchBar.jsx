import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../hooks/useLanguage'
import { useAuth } from '../../../hooks/useAuth'
import api from '../../../services/api'
import './SearchBar.css'

const SearchBar = ({ onSearch, placeholder = 'Search laws, articles, or ask a question...' }) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchType, setSearchType] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const [recentSearches, setRecentSearches] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  
  const searchRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { t, currentLanguage } = useLanguage()
  const { user } = useAuth()

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setRecentSearches(JSON.parse(history).slice(0, 5))
    }
  }, [])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
        setShowHistory(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const response = await api.get('/search/suggestions', {
          params: { 
            q: query,
            language: currentLanguage,
            limit: 6
          }
        })
        setSuggestions(response.data.suggestions)
        setShowSuggestions(true)
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query, currentLanguage])

  const saveToHistory = (searchTerm) => {
    const updatedHistory = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
    setRecentSearches(updatedHistory)
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))

    // Save to backend if user is logged in
    if (user) {
      api.post('/search/history', { term: searchTerm }).catch(console.error)
    }
  }

  const handleSearch = (e, searchTerm = query) => {
    e?.preventDefault()
    
    const trimmedQuery = searchTerm.trim()
    if (!trimmedQuery) return

    saveToHistory(trimmedQuery)
    
    onSearch?.({ query: trimmedQuery, type: searchType })
    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}&type=${searchType}`)
    
    setShowSuggestions(false)
    setShowHistory(false)
  }

  const handleKeyDown = (e) => {
    // Keyboard navigation for suggestions
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1)
      } else if (e.key === 'Enter' && selectedSuggestion >= 0) {
        e.preventDefault()
        const suggestion = suggestions[selectedSuggestion]
        setQuery(suggestion.text)
        handleSearch(e, suggestion.text)
      }
    } else if (e.key === 'ArrowDown' && !showSuggestions) {
      setShowHistory(true)
    }
  }

  const handleQueryChange = (e) => {
    setQuery(e.target.value)
    if (!e.target.value) {
      setShowHistory(true)
    }
  }

  const clearSearch = () => {
    setQuery('')
    inputRef.current?.focus()
    setShowSuggestions(false)
    setShowHistory(true)
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text)
    setShowSuggestions(false)
    handleSearch(null, suggestion.text)
  }

  const handleHistoryClick = (term) => {
    setQuery(term)
    setShowHistory(false)
    handleSearch(null, term)
  }

  const clearHistory = () => {
    setRecentSearches([])
    localStorage.removeItem('searchHistory')
    if (user) {
      api.delete('/search/history').catch(console.error)
    }
  }

  return (
    <div className="search-container" ref={searchRef}>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <span className="search-icon">
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              '🔍'
            )}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => {
              if (recentSearches.length > 0) {
                setShowHistory(true)
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={t('searchPlaceholder') || placeholder}
            className="search-input"
          />
          {query && (
            <button 
              type="button"
              className="clear-btn"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          <div className="search-type-selector">
            <select 
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="search-type"
            >
              <option value="all">{t('all') || 'All'}</option>
              <option value="keyword">{t('keyword') || 'Keyword'}</option>
              <option value="natural">{t('naturalLanguage') || 'Natural Language'}</option>
            </select>
          </div>
          <button type="submit" className="search-btn">
            {t('search') || 'Search'}
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id || index}
              className={`suggestion-item ${selectedSuggestion === index ? 'selected' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setSelectedSuggestion(index)}
            >
              <span className="suggestion-text">{suggestion.text}</span>
              {suggestion.category && (
                <span className="suggestion-category">{suggestion.category}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Search History */}
      {showHistory && !query && recentSearches.length > 0 && (
        <div className="history-dropdown">
          <div className="history-header">
            <span className="header-title">Recent Searches</span>
            <button className="clear-history-btn" onClick={clearHistory}>
              Clear
            </button>
          </div>
          {recentSearches.map((term, index) => (
            <div
              key={index}
              className="history-item"
              onClick={() => handleHistoryClick(term)}
            >
              <span className="history-icon">🕒</span>
              <span className="history-text">{term}</span>
              <button 
                className="remove-history"
                onClick={(e) => {
                  e.stopPropagation()
                  const newHistory = recentSearches.filter((_, i) => i !== index)
                  setRecentSearches(newHistory)
                  localStorage.setItem('searchHistory', JSON.stringify(newHistory))
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar