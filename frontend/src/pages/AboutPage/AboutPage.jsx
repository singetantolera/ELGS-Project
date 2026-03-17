import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import './AboutPage.css'
import singetan from '../../assets/images/singetan.jpg'
import { useState } from 'react'

const AboutPage = () => {
  const { currentLanguage, t } = useLanguage()
  const [activeSolution, setActiveSolution] = useState(null)

const team = [
  {
    name: 'Abdulwahid Mohammedamin',
    role: 'Chatbot & Cross-Platform Testing',
    image: singetan,
    social: {
      linkedin: '#',
      telegram: '#',
      facebook: '#',
      instagram: '#'
    }
  },
  {
    name: 'Medina Mustefa',
    role: 'Documentation Specialist',
    image: singetan,
    social: {
      linkedin: '#',
      telegram: '#',
      facebook: '#',
      instagram: '#'
    }
  },
  {
    name: 'Singetan Tolera',
    role: 'Frontend & Mobile App Developer',
    image: singetan,
    social: {
      linkedin: '#',
      telegram: '#',
      facebook: '#',
      instagram: '#'
    }
  },
  {
    name: 'Sumeya Sabit',
    role: 'Backend & API Developer',
    image: singetan,
    social: {
      linkedin: '#',
      telegram: '#',
      facebook: '#',
      instagram: '#'
    }
  }
]

  const solutions = [
    {
      id: 1,
      icon: '📱',
      title: t('multiPlatform') || 'Multi-Platform Access',
      description: t('multiPlatformDesc') || 'Web and mobile applications for anytime, anywhere access'
    },
    {
      id: 2,
      icon: '🗣️',
      title: t('multilingualSupport') || 'Multilingual Support',
      description: t('multilingualSupportDesc') || 'Content available in English, Amharic, and Afaan Oromoo'
    },
    {
      id: 3,
      icon: '🤖',
      title: t('aiPowered') || 'AI-Powered Assistant',
      description: t('aiPoweredDesc') || 'Natural language processing for instant legal queries'
    },
    {
      id: 4,
      icon: '📚',
      title: t('centralizedRepo') || 'Centralized Repository',
      description: t('centralizedRepoDesc') || 'All Ethiopian laws in one verified database'
    }
  ]

  const toggleSolution = (id) => {
    setActiveSolution(activeSolution === id ? null : id)
  }

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>
            {currentLanguage === 'en' && 'About Ethiopian Law Guidance System'}
            {currentLanguage === 'am' && 'ስለ ኢትዮጵያ የሕግ መመሪያ ሥርዓት'}
            {currentLanguage === 'om' && 'Waa\'ee Sirna Qajeelfama Seera Etiyophiaa'}
          </h1>
          <p>
            {currentLanguage === 'en' && 'Making justice accessible to all Ethiopians through technology'}
            {currentLanguage === 'am' && 'በቴክኖሎጂ አማካኝነት ፍትህን ለሁሉም ኢትዮጵያውያን ተደራሽ ማድረግ'}
            {currentLanguage === 'om' && 'Teeknooloojiidhaan haqa Etiyophiyaa hundaaf dhaqqabsiisuu'}
          </p>
        </div>
      </section>

      <section className="mission-section">
        <div className="mission-grid">
          <div className="mission-card">
            <div className="mission-icon">🎯</div>
            <h2>
              {currentLanguage === 'en' && 'Our Mission'}
              {currentLanguage === 'am' && 'ተልዕኳችን'}
              {currentLanguage === 'om' && 'Kaayyoo Keenna'}
            </h2>
            <p>
              {currentLanguage === 'en' && 
                'To provide accessible, reliable, and multilingual legal information to Ethiopian citizens, empowering them to understand and exercise their rights.'}
              {currentLanguage === 'am' && 
                'ለኢትዮጵያ ዜጎች ተደራሽ፣ አስተማማኝ እና ባለብዙ ቋንቋ የሕግ መረጃ ለማቅረብ፣ መብቶቻቸውን እንዲረዱ እና እንዲጠቀሙ ኃይል መስጠት።'}
              {currentLanguage === 'om' && 
                'Oduu seeraa Etiyophiyaa hundaaf dhaqqabsiisaa, amanamaa fi afaan baay\'ee ta\'e kennuudhaan, mirga isaanii akka hubatanii fi fayyadaman gochuu.'}
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">👁️</div>
            <h2>
              {currentLanguage === 'en' && 'Our Vision'}
              {currentLanguage === 'am' && 'ራዕያችን'}
              {currentLanguage === 'om' && 'Mul\'ata Keenna'}
            </h2>
            <p>
              {currentLanguage === 'en' && 
                'A digitally empowered Ethiopia where every citizen has access to legal information in their preferred language.'}
              {currentLanguage === 'am' && 
                'ዲጂታል ኃይል የተሰጠው ኢትዮጵያ እያንዳንዱ ዜጋ በሚመርጠው ቋንቋ የሕግ መረጃ የሚያገኝበት።'}
              {currentLanguage === 'om' && 
                'Etiyophiyaa teeknooloojiin kan jajjabeeffamte, Etiyophiyaan hundinuu afaan isaan filataniin oduu seeraa argatan.'}
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">⚖️</div>
            <h2>
              {currentLanguage === 'en' && 'Our Values'}
              {currentLanguage === 'am' && 'እሴቶቻችን'}
              {currentLanguage === 'om' && 'Faayidaa Keenna'}
            </h2>
            <ul className="values-list">
              <li>{t('accessibility') || 'Accessibility for all'}</li>
              <li>{t('accuracy') || 'Accuracy and reliability'}</li>
              <li>{t('multilingual') || 'Multilingual inclusion'}</li>
              <li>{t('userCentered') || 'User-centered design'}</li>
              <li>{t('continuousImprovement') || 'Continuous improvement'}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="problem-section">
        <h2>
          {currentLanguage === 'en' && 'The Problem We Address'}
          {currentLanguage === 'am' && 'እኛ የምንፈታው ተግዳሮት'}
          {currentLanguage === 'om' && 'Rakkina Hiikuu Barbaannu'}
        </h2>
        <div className="problem-grid">
          <div className="problem-card">
            <span className="problem-number">1</span>
            <h3>{t('fragmentedInfo') || 'Fragmented Information'}</h3>
            <p>{t('fragmentedInfoDesc') || 'Legal information scattered across multiple sources'}</p>
          </div>
          <div className="problem-card">
            <span className="problem-number">2</span>
            <h3>{t('languageBarriers') || 'Language Barriers'}</h3>
            <p>{t('languageBarriersDesc') || 'Limited access in local languages'}</p>
          </div>
          <div className="problem-card">
            <span className="problem-number">3</span>
            <h3>{t('noRealTime') || 'No Real-time Assistance'}</h3>
            <p>{t('noRealTimeDesc') || 'Lack of instant legal guidance'}</p>
          </div>
          <div className="problem-card">
            <span className="problem-number">4</span>
            <h3>{t('geographicLimitations') || 'Geographic Limitations'}</h3>
            <p>{t('geographicLimitationsDesc') || 'Rural areas have limited access'}</p>
          </div>
        </div>
      </section>

      <section className="solution-section">
        <h2>
          {currentLanguage === 'en' && 'Our Solution'}
          {currentLanguage === 'am' && 'መፍትሄያችን'}
          {currentLanguage === 'om' && 'Furmaata Keenna'}
        </h2>
        
        <div className="solution-showcase">
          {solutions.map((solution) => (
            <div key={solution.id} className="solution-item">
              <div className="solution-icon">{solution.icon}</div>
              <div>
                <h3 
                  onClick={() => toggleSolution(solution.id)}
                  className={activeSolution === solution.id ? 'active' : ''}
                >
                  {solution.title}
                  <span className="toggle-icon">
                    {activeSolution === solution.id ? '−' : '+'}
                  </span>
                </h3>
                {activeSolution === solution.id && (
                  <p className="solution-description">{solution.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

     <section className="team-section">
  <h2>
    {currentLanguage === 'en' && 'Meet Our Team'}
    {currentLanguage === 'am' && 'ቡድናችንን ይወቁ'}
    {currentLanguage === 'om' && 'Garee Keenna Wal Simaa'}
  </h2>

  <div className="team-grid">
    {team.map((member, index) => (
      <div key={index} className="team-card">

        <div className="team-image">
          <img src={member.image} alt={member.name} />
        </div>

      <h3 className="team-name">{member.name}</h3>
<p className="team-role">{member.role}</p>

<div className="team-socials">
  <a href={member.social.linkedin} target="_blank" rel="noreferrer">
    <i className="fab fa-linkedin-in"></i>
  </a>
  <a href={member.social.telegram} target="_blank" rel="noreferrer">
    <i className="fab fa-telegram-plane"></i>
  </a>
  <a href={member.social.facebook} target="_blank" rel="noreferrer">
    <i className="fab fa-facebook-f"></i>
  </a>
  <a href={member.social.instagram} target="_blank" rel="noreferrer">
    <i className="fab fa-instagram"></i>
  </a>
</div>

      </div>
    ))}
  </div>
</section>

      <section className="about-cta">
        <h2>
          {currentLanguage === 'en' && 'Ready to Get Started?'}
          {currentLanguage === 'am' && 'ለመጀመር ዝግጁ ነዎት?'}
          {currentLanguage === 'om' && 'Jalqabuuf Qophiidhaa?'}
        </h2>
        <p>
          {currentLanguage === 'en' && 'Join thousands of Ethiopians accessing legal information with ease'}
          {currentLanguage === 'am' && 'ሕጋዊ መረጃን በቀላሉ ከሚያገኙ በሺዎች ከሚቆጠሩ ኢትዮጵያውያን ጋር ይቀላቀሉ'}
          {currentLanguage === 'om' && 'Kumaan Etiyophiyaa oduu seeraa salphaatti argatan wajjin makami'}
        </p>
        <div className="cta-buttons">
          <Link to="/register" className="btn-primary">{t('getStarted')}</Link>
          <Link to="/contact" className="btn-secondary">{t('contactUs')}</Link>
        </div>
      </section>
    </div>
  )
}

export default AboutPage