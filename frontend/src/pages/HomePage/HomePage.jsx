import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import SearchBar from '../../components/search/SearchBar/SearchBar'
import LegalCategoryGrid from '../../components/categories/LegalCategoryGrid/LegalCategoryGrid'
import './HomePage.css'

const HomePage = () => {
  const { currentLanguage, t } = useLanguage()

  const features = [
    {
      icon: '🔍',
      title: { en: 'Smart Search', am: 'ብልህ ፍለጋ', om: 'Barbaacha Ogeessa' },
      description: {
        en: 'Search laws using keywords or natural language',
        am: 'ሕጎችን በቁልፍ ቃላት ወይም በተፈጥሮ ቋንቋ ይፈልጉ',
        om: 'Seera dubbii cimdii ykn afaan uumamaan barbaadi'
      }
    },
    {
      icon: '🗣️',
      title: { en: 'AI Assistant', am: 'አይ ረዳት', om: 'Gargaarsa AI' },
      description: {
        en: 'Get instant answers to your legal questions',
        am: 'ለሕግ ጥያቄዎችዎ ፈጣን መልስ ያግኙ',
        om: 'Deebii battalamaa gaaffii seeraa keetiif argadhu'
      }
    },
    {
      icon: '🌐',
      title: { en: 'Multilingual', am: 'ባለብዙ ቋንቋ', om: 'Afaan Baay\'ee' },
      description: {
        en: 'Available in English, Amharic, and Afaan Oromoo',
        am: 'በእንግሊዝኛ፣ በአማርኛ እና በአፋን ኦሮሞ ይገኛል',
        om: 'Afaan Inglizii, Amaaraa fi Afaan Oromoo ta\'een argama'
      }
    },
    {
      icon: '⚖️',
      title: { en: 'Verified Content', am: 'የተረጋገጠ ይዘት', om: 'Qabiyyee Mirkanaa\'e' },
      description: {
        en: 'All laws sourced from official Ethiopian legal documents',
        am: 'ሁሉም ሕጎች ከኢትዮጵያ ኦፊሴላዊ የሕግ ሰነዶች የተወሰዱ',
        om: 'Seerri hundi waraqaa seeraa Etiyophiaa kan mirkanaa\'e irraa argame'
      }
    }
  ]

  const stats = [
    { value: '1000+', label: { en: 'Legal Articles', am: 'የሕግ አንቀጾች', om: 'Artikiloota Seeraa' } },
    { value: '3', label: { en: 'Languages', am: 'ቋንቋዎች', om: 'Afaanota' } },
    { value: '24/7', label: { en: 'Access', am: 'መዳረሻ', om: 'Fayyadamuu' } },
    { value: 'Free', label: { en: 'For Everyone', am: 'ለሁሉም ነፃ', om: 'Kan Hundaaf' } }
  ]

  return (
    <div className="home-page">
      {/* Hero Section - Modified */}
      <section className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1 className="hero-title">
              {currentLanguage === 'en' && 'Ethiopian Law Guidance System'}
              {currentLanguage === 'am' && 'የኢትዮጵያ የሕግ መመሪያ ሥርዓት'}
              {currentLanguage === 'om' && 'Sirna Qajeelfama Seera Etiyophiaa'}
            </h1>
            <p className="hero-description">
              {currentLanguage === 'en' && 'Making Ethiopian law accessible to everyone in their preferred language'}
              {currentLanguage === 'am' && 'የኢትዮጵያን ሕግ ለሁሉም ሰው በሚመርጡት ቋንቋ ተደራሽ ማድረግ'}
              {currentLanguage === 'om' && 'Seera Etiyophiaa afaan isaan filataniin nama hundaaf dhaqqabsiisuu'}
            </p>
            
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label[currentLanguage]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-search-container">
            <div className="search-card">
              <div className="search-card-header">
                <span className="search-icon-large">🔍</span>
                <h3>Find Legal Information</h3>
              </div>
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>
          {currentLanguage === 'en' && 'Why Choose ELGS?'}
          {currentLanguage === 'am' && 'ለምን ELGS ን ይምረጡ?'}
          {currentLanguage === 'om' && 'Maaliif ELGS filattu?'}
        </h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title[currentLanguage]}</h3>
              <p>{feature.description[currentLanguage]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Preview */}
      <section className="categories-section">
        <h2>
          {currentLanguage === 'en' && 'Browse by Legal Category'}
          {currentLanguage === 'am' && 'በሕግ ምድብ ይመልከቱ'}
          {currentLanguage === 'om' && 'Ramaddii Seeraan Ilaali'}
        </h2>
        <LegalCategoryGrid preview />
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>
            {currentLanguage === 'en' && 'Start Your Legal Journey Today'}
            {currentLanguage === 'am' && 'የሕግ ጉዞዎን ዛሬ ይጀምሩ'}
            {currentLanguage === 'om' && 'Imala Seera Kee Har\'a Jalqabi'}
          </h2>
          <p>
            {currentLanguage === 'en' && 'Join thousands of Ethiopians accessing legal information with ease'}
            {currentLanguage === 'am' && 'ሕጋዊ መረጃን በቀላሉ ከሚያገኙ በሺዎች ከሚቆጠሩ ኢትዮጵያውያን ጋር ይቀላቀሉ'}
            {currentLanguage === 'om' && 'Kumaan Etiyophiyaa oduu seeraa salphaatti argatan wajjin makami'}
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-primary">
              {currentLanguage === 'en' && 'Get Started'}
              {currentLanguage === 'am' && 'ይጀምሩ'}
              {currentLanguage === 'om' && 'Jalqabi'}
            </Link>
            <Link to="/about" className="btn-secondary">
              {currentLanguage === 'en' && 'Learn More'}
              {currentLanguage === 'am' && 'ተጨማሪ ይወቁ'}
              {currentLanguage === 'om' && 'Dabalata Baradhu'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage                       