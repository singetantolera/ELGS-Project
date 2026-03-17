import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useLanguage } from '../../../hooks/useLanguage'
import LanguageSelector from '../LanguageSelector/LanguageSelector'
import logo from '../../../assets/images/logo.png' // Import logo image
import './Navbar.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false) // Added for dropdown
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
    setShowUserDropdown(false) // Close dropdown on route change
  }, [location])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    setShowUserDropdown(false)
  }

  // Handle external link click for logo
  const handleLogoClick = (e) => {
    e.preventDefault()
    // Open external website in a new tab
    window.open('#', '_blank', 'noopener,noreferrer')
  }

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown)
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo with external link */}
        <a 
          href="#" 
          className="navbar-logo"
          onClick={handleLogoClick}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={logo} alt="ELGS Logo" className="logo-image" />
          <span className="logo-text">ELGS</span>
        </a>

        {/* Mobile Toggle Button */}
        <button 
          className={`navbar-toggle ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className="hamburger"></span>
        </button>

        {/* Navigation Menu */}
        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                className={location.pathname === '/' ? 'active' : ''}
                onClick={() => setIsOpen(false)}
              >
                {t('home')}
              </Link>
            </li>
            <li>
              <Link 
                to="/categories" 
                className={location.pathname.includes('/category') ? 'active' : ''}
                onClick={() => setIsOpen(false)}
              >
                {t('laws')}
              </Link>
            </li>
            <li>
              <Link 
                to="/chatbot" 
                className={location.pathname === '/chatbot' ? 'active' : ''}
                onClick={() => setIsOpen(false)}
              >
                {t('assistant')}
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={location.pathname === '/about' ? 'active' : ''}
                onClick={() => setIsOpen(false)}
              >
                {t('about')}
              </Link>
            </li>
          </ul>

          <div className="nav-actions">
            <LanguageSelector />
            
            {user ? (
              <div className="user-menu user-dropdown-container">
                {/* User Dropdown Toggle */}
                <button 
                  className="user-dropdown-toggle"
                  onClick={toggleUserDropdown}
                  aria-label="User menu"
                >
                  <span className="user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.fullName} />
                    ) : (
                      <span className="avatar-placeholder">
                        {user.fullName?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </span>
                  <span className="user-name">{user.fullName?.split(' ')[0]}</span>
                  <span className={`dropdown-arrow ${showUserDropdown ? 'open' : ''}`}>▼</span>
                </button>

                {/* User Dropdown Menu */}
                {showUserDropdown && (
                  <div className="user-dropdown-menu">
                    <Link 
                      to="/dashboard" 
                      className="dropdown-item"
                      onClick={() => {
                        setShowUserDropdown(false)
                        setIsOpen(false)
                      }}
                    >
                      <span className="item-icon">📊</span>
                      <span className="item-text">Dashboard</span>
                    </Link>
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => {
                        setShowUserDropdown(false)
                        setIsOpen(false)
                      }}
                    >
                      <span className="item-icon">👤</span>
                      <span className="item-text">Profile</span>
                    </Link>
                    <Link 
                      to="/bookmarks" 
                      className="dropdown-item"
                      onClick={() => {
                        setShowUserDropdown(false)
                        setIsOpen(false)
                      }}
                    >
                      <span className="item-icon">🔖</span>
                      <span className="item-text">Bookmarks</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="dropdown-item"
                        onClick={() => {
                          setShowUserDropdown(false)
                          setIsOpen(false)
                        }}
                      >
                        <span className="item-icon">⚙️</span>
                        <span className="item-text">Admin</span>
                      </Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <span className="item-icon">🚪</span>
                      <span className="item-text">{t('logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login">{t('login')}</Link>
                <Link to="/register" className="btn-register">{t('register')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar