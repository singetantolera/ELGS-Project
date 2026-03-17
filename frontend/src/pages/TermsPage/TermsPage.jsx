import { useLanguage } from '../../hooks/useLanguage'
import './TermsPage.css'

const TermsPage = () => {
  const { currentLanguage, t } = useLanguage()
  
  return (
    <div className="terms-page">
      <div className="container">
        <h1>
          {currentLanguage === 'en' && 'Terms of Service'}
          {currentLanguage === 'am' && 'የአገልግሎት ውል'}
          {currentLanguage === 'om' && 'Qabiyyee Tajaajila'}
        </h1>
        
        <div className="last-updated">
          {t('lastUpdated') || 'Last Updated'}: March 4, 2026
        </div>

        <section className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using the Ethiopian Law Guidance System (ELGS), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
        </section>

        <section className="terms-section">
          <h2>2. Description of Service</h2>
          <p>ELGS provides a multilingual digital platform for accessing Ethiopian legal information, including Criminal Law, Family Law, and Labor Law. The service includes:</p>
          <ul>
            <li>Searchable database of legal documents</li>
            <li>AI-powered chatbot for legal questions</li>
            <li>Multilingual content in English, Amharic, and Afaan Oromoo</li>
            <li>Personalized user accounts and bookmarks</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>3. User Accounts</h2>
          <p>To access certain features, you must register for an account. You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and complete information</li>
            <li>Notifying us immediately of any unauthorized use</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>4. Acceptable Use</h2>
          <p>You agree to use ELGS only for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul>
            <li>Use the service for any illegal purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the service</li>
            <li>Misrepresent your identity or affiliation</li>
            <li>Use the service to provide legal advice without qualification</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>5. Intellectual Property Rights</h2>
          <p>The legal content provided through ELGS is sourced from official Ethiopian government publications. The platform itself, including its code, design, and original content, is protected by copyright and other intellectual property laws.</p>
          <p>Users may access and use legal content for personal, educational, and research purposes. Commercial use or redistribution requires permission.</p>
        </section>

        <section className="terms-section">
          <h2>6. Disclaimer of Warranties</h2>
          <p>ELGS provides legal information for educational and informational purposes only. We do not provide legal advice. The information provided:</p>
          <ul>
            <li>Is for general informational purposes only</li>
            <li>May not reflect the most current legal developments</li>
            <li>Should not be relied upon without consulting a qualified legal professional</li>
            <li>Does not create an attorney-client relationship</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>7. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, ELGS and its contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.</p>
        </section>

        <section className="terms-section">
          <h2>8. Third-Party Links</h2>
          <p>Our service may contain links to third-party websites or services that are not owned or controlled by ELGS. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites.</p>
        </section>

        <section className="terms-section">
          <h2>9. Termination</h2>
          <p>We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
        </section>

        <section className="terms-section">
          <h2>10. Changes to Terms</h2>
          <p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.</p>
        </section>

        <section className="terms-section">
          <h2>11. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us:</p>
          <p>Email: legal@elgs.edu.et</p>
          <p>Address: Jimma Town, Jimma, Ethiopia</p>
        </section>
      </div>
    </div>
  )
}

export default TermsPage