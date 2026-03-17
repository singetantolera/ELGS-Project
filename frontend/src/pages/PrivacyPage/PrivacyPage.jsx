import { useLanguage } from '../../hooks/useLanguage'
import './PrivacyPage.css'

const PrivacyPage = () => {
  const { currentLanguage, t } = useLanguage()
  
  return (
    <div className="privacy-page">
      <div className="container">
        <h1>
          {currentLanguage === 'en' && 'Privacy Policy'}
          {currentLanguage === 'am' && 'የግላዊነት ፖሊሲ'}
          {currentLanguage === 'om' && 'Imaammata Dhuunfaa'}
        </h1>
        
        <div className="last-updated">
          {t('lastUpdated') || 'Last Updated'}: March 4, 2026
        </div>

        <section className="policy-section">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>
          <ul>
            <li>Account information (name, email, profession)</li>
            <li>Usage data (searches, bookmarks, chat history)</li>
            <li>Device information (browser type, IP address)</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and improve our legal guidance services</li>
            <li>Personalize your experience</li>
            <li>Communicate with you about updates</li>
            <li>Ensure platform security</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. Information Sharing</h2>
          <p>We do not sell your personal information. We may share information:</p>
          <ul>
            <li>With your consent</li>
            <li>For legal compliance</li>
            <li>To protect rights and safety</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        </section>

        <section className="policy-section">
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of communications</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>6. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at:</p>
          <p>Email: privacy@elgs.edu.et</p>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPage