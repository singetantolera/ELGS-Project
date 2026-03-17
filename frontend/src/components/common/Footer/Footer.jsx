import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useLanguage } from '../../../hooks/useLanguage'
import './Footer.css'

const Footer = () => {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()
  const [hoveredLink, setHoveredLink] = useState(null)

  const socialLinks = [
    { icon: 'Ⓕ', name: 'Facebook', url: 'https://facebook.com', color: '#1877f2' },
    { icon: '𝕏', name: 'Twitter', url: 'https://twitter.com', color: '#1da1f2' },
    { icon: 'in', name: 'LinkedIn', url: 'https://linkedin.com', color: '#0a66c2' },
    { icon: '📲', name: 'Telegram', url: 'https://telegram.org', color: '#26a5e4' }
  ]

  const quickLinks = [
    { path: '/', label: t('home') },
    { path: '/categories', label: t('laws') },
    { path: '/chatbot', label: t('assistant') },
    { path: '/about', label: t('about') }
  ]

  const legalAreas = [
    { path: '/category/criminal', label: t('criminalLaw'), icon: '⚖️', color: '#fee2e2' },
    { path: '/category/family', label: t('familyLaw'), icon: '👨‍👩‍👧‍👦', color: '#dbeafe' },
    { path: '/category/labor', label: t('laborLaw'), icon: '💼', color: '#dcfce7' },
    // ✅ FEDERAL HIGH COURT LINK ADDED HERE
    { 
      external: true, 
      path: 'https://www.fsc.gov.et/', 
      label: 'Federal High Court', 
      icon: '⚖️', 
      color: '#cbd5e1' 
    }
  ]

  const contactInfo = [
    { icon: '📍', text: 'ELGS Experts Team' },
    { icon: '📧', text: 'info@elgs.edu.et', link: 'mailto:info@elgs.edu.et' },
    { icon: '📞', text: '+251903921026', link: 'tel:+251903921026' },
    { icon: '🕒', text: '24/7 Online Access' }
  ]

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-section brand-section">
            <h3 className="footer-title">
              <span className="title-ethiopia"></span>
              ELGS
            </h3>
            <p className="footer-description">
              {t('footerDescription') || 'Ethiopian Law Guidance System - Making justice accessible to all through technology.'}
            </p>
            <div className="footer-social">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="social-link"
                  style={{ '--social-color': social.color }}
                  onMouseEnter={() => setHoveredLink(`social-${index}`)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <span className="social-icon">{social.icon}</span>
                  <span className="social-tooltip">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h4>{t('quickLinks') || 'Quick Links'}</h4>
            <ul className="footer-links-list">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="footer-link"
                    onMouseEnter={() => setHoveredLink(`quick-${index}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <span className="link-arrow">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Areas Section - WITH FEDERAL HIGH COURT LINK */}
          <div className="footer-section">
            <h4>{t('legalAreas') || 'Legal Areas'}</h4>
            <ul className="footer-links-list legal-areas">
              {legalAreas.map((area, index) => (
                <li key={index}>
                  {area.external ? (
                    // External link for Federal High Court
                    <a
                      href={area.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="legal-area-link external"
                      style={{ '--area-color': area.color }}
                      onMouseEnter={() => setHoveredLink(`external-${index}`)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      <span className="area-icon">{area.icon}</span>
                      <span className="area-name">{area.label}</span>
                      <span className="area-external">↗</span>
                    </a>
                  ) : (
                    // Internal links for ELGS categories
                    <Link 
                      to={area.path} 
                      className="legal-area-link"
                      style={{ '--area-color': area.color }}
                      onMouseEnter={() => setHoveredLink(`legal-${index}`)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      <span className="area-icon">{area.icon}</span>
                      <span className="area-name">{area.label}</span>
                      <span className="area-arrow">→</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h4>{t('contact') || 'Contact Info'}</h4>
            <ul className="contact-info">
              {contactInfo.map((item, index) => (
                <li key={index} className="contact-item">
                  {item.link ? (
                    <a 
                      href={item.link} 
                      className="contact-link"
                      onMouseEnter={() => setHoveredLink(`contact-${index}`)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      <span className="contact-icon">{item.icon}</span>
                      <span>{item.text}</span>
                    </a>
                  ) : (
                    <>
                      <span className="contact-icon">{item.icon}</span>
                      <span>{item.text}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} {t('copyright') || 'Ethiopian Law Guidance System. All rights reserved.'}
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy" className="bottom-link">{t('privacy') || 'Privacy Policy'}</Link>
            <span className="separator">•</span>
            <Link to="/terms" className="bottom-link">{t('terms') || 'Terms of Service'}</Link>
            <span className="separator">•</span>
            <Link to="/accessibility" className="bottom-link">Accessibility</Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button 
        className="scroll-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </footer>
  )
}

export default Footer