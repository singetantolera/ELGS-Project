import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../../../hooks/useLanguage'
import './LanguageSelector.css'

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [recentLanguages, setRecentLanguages] = useState([])
  
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage()
  const dropdownRef = useRef(null)

  // Get current language details
  const currentLang = availableLanguages?.find(lang => lang.code === currentLanguage) || 
    { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' }

  // Load recent languages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentLanguages')
    if (saved) {
      setRecentLanguages(JSON.parse(saved))
    }
  }, [])

  // Save recent languages to localStorage
  const saveRecentLanguage = (langCode) => {
    const updated = [langCode, ...recentLanguages.filter(l => l !== langCode)].slice(0, 3)
    setRecentLanguages(updated)
    localStorage.setItem('recentLanguages', JSON.stringify(updated))
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode)
    saveRecentLanguage(langCode)
    setIsOpen(false)
  }

  const languages = availableLanguages || [
    { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
    { code: 'am', name: 'Amharic', flag: '🇪🇹', nativeName: 'አማርኛ' },
    { code: 'om', name: 'Oromo', flag: '🇪🇹', nativeName: 'Afaan Oromoo' }
  ]

  return (
    <div className="language-selector-wrapper" ref={dropdownRef}>
      <button 
        className={`language-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="trigger-icon">🌐</span>
        <span className="trigger-text">Language</span>
        <span className="trigger-current">{currentLang.nativeName}</span>
        <span className={`trigger-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {/* Recent Languages */}
          {recentLanguages.length > 0 && (
            <div className="recent-section">
              <h5 className="section-label">Recent</h5>
              <div className="recent-list">
                {recentLanguages.map(code => {
                  const lang = languages.find(l => l.code === code)
                  if (!lang) return null
                  return (
                    <button
                      key={code}
                      className={`recent-chip ${currentLanguage === code ? 'active' : ''}`}
                      onClick={() => handleLanguageChange(code)}
                    >
                      <span className="chip-flag">{lang.flag}</span>
                      <span className="chip-name">{lang.nativeName}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Language List */}
          <div className="language-list">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span className="option-flag">{lang.flag}</span>
                <div className="option-text">
                  <span className="option-name">{lang.name}</span>
                  <span className="option-native">{lang.nativeName}</span>
                </div>
                {currentLanguage === lang.code && (
                  <span className="option-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSelector