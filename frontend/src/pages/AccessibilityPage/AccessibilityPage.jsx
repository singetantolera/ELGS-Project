import { useLanguage } from '../../hooks/useLanguage'
import './AccessibilityPage.css'

const AccessibilityPage = () => {
  const { currentLanguage, t } = useLanguage()
  
  return (
    <div className="accessibility-page">
      <div className="container">
        <h1>
          {currentLanguage === 'en' && 'Accessibility Statement'}
          {currentLanguage === 'am' && 'የተደራሽነት መግለጫ'}
          {currentLanguage === 'om' && 'Ibsa Dhaqqabsiisummaa'}
        </h1>
        
        <div className="last-updated">
          {t('lastUpdated') || 'Last Updated'}: March 4, 2026
        </div>

        <section className="accessibility-section">
          <h2>Our Commitment</h2>
          <p>The Ethiopian Law Guidance System (ELGS) is committed to ensuring digital accessibility for all users, including people with disabilities. We are continually improving the user experience for everyone and applying relevant accessibility standards.</p>
        </section>

        <section className="accessibility-section">
          <h2>Accessibility Features</h2>
          <p>ELGS incorporates the following accessibility features to make legal information accessible to everyone:</p>
          <ul>
            <li><strong>Multilingual Support:</strong> Content available in English, Amharic, and Afaan Oromoo</li>
            <li><strong>Keyboard Navigation:</strong> Full functionality available using keyboard only</li>
            <li><strong>Screen Reader Compatible:</strong> Semantic HTML structure for assistive technologies</li>
            <li><strong>Clear Visual Design:</strong> High contrast colors and readable fonts</li>
            <li><strong>Responsive Design:</strong> Accessible on desktop, tablet, and mobile devices</li>
            <li><strong>Adjustable Text Size:</strong> Browser text zoom supported</li>
          </ul>
        </section>

        <section className="accessibility-section">
          <h2>Conformance Status</h2>
          <p>The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to improve accessibility for people with disabilities. ELGS aims to conform to WCAG 2.1 Level AA standards.</p>
          <p>We are actively working to achieve and maintain compliance with these standards across our platform.</p>
        </section>

        <section className="accessibility-section">
          <h2>Known Limitations</h2>
          <p>While we strive to make all content accessible, some limitations may exist:</p>
          <ul>
            <li>Some older PDF documents may not be fully accessible</li>
            <li>Third-party content may not meet our accessibility standards</li>
            <li>Some features may require JavaScript enabled</li>
          </ul>
          <p>If you encounter any accessibility barriers, please contact us so we can address them.</p>
        </section>

        <section className="accessibility-section">
          <h2>Browser Compatibility</h2>
          <p>ELGS works best with modern browsers that support accessibility features:</p>
          <ul>
            <li>Google Chrome (latest version)</li>
            <li>Mozilla Firefox (latest version)</li>
            <li>Safari (latest version)</li>
            <li>Microsoft Edge (latest version)</li>
          </ul>
        </section>

        <section className="accessibility-section">
          <h2>Feedback and Assistance</h2>
          <p>We welcome your feedback on the accessibility of ELGS. If you encounter accessibility barriers or have suggestions for improvement, please contact us:</p>
          <div className="contact-info">
            <p><strong>Email:</strong> accessibility@elgs.edu.et</p>
            <p><strong>Phone:</strong> +251 903 921 026</p>
            <p><strong>In Person:</strong> Jimma Town, Jimma, Ethiopia</p>
          </div>
          <p>We aim to respond to accessibility feedback within 5 business days.</p>
        </section>

        <section className="accessibility-section">
          <h2>Alternative Access</h2>
          <p>If you are unable to access any content on our website, please contact us and we will provide the information in an alternative format, such as:</p>
          <ul>
            <li>Email with plain text version</li>
            <li>Printed documents</li>
            <li>In-person assistance at Jimma Institute of Technology</li>
          </ul>
        </section>

        <section className="accessibility-section">
          <h2>Continuous Improvement</h2>
          <p>Accessibility is an ongoing effort at ELGS. We regularly review our platform and make improvements to ensure all users can access Ethiopian legal information. This statement will be updated as we enhance our accessibility features.</p>
        </section>
      </div>
    </div>
  )
}

export default AccessibilityPage