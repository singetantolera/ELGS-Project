import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import SearchBar from '../../components/search/SearchBar/SearchBar'
import Loader from '../../components/common/Loader/Loader'
import api from '../../services/api'
import './DashboardPage.css'

const DashboardPage = () => {
  const { user } = useAuth()
  const { currentLanguage, t } = useLanguage()
  const navigate = useNavigate()
  
  const [recentActivity, setRecentActivity] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [stats, setStats] = useState({
    bookmarks: 0,
    searches: 0,
    chatSessions: 0,
    savedArticles: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [greeting, setGreeting] = useState('')
  const [greetingEmoji, setGreetingEmoji] = useState('')
  const [dailyQuote, setDailyQuote] = useState({ text: '', author: '' })

  // Collection of inspirational legal quotes
  const quotes = [
    { text: "Justice delayed is justice denied.", author: "William E. Gladstone" },
    { text: "The law is reason, free from passion.", author: "Aristotle" },
    { text: "Equality is the soul of liberty.", author: "Robert G. Ingersoll" },
    { text: "Where law ends, tyranny begins.", author: "John Locke" },
    { text: "Laws are the very bulwarks of liberty.", author: "John Milton" },
    { text: "Injustice anywhere is a threat to justice everywhere.", author: "Martin Luther King Jr." },
    { text: "The first duty of society is justice.", author: "Alexander Hamilton" },
    { text: "Justice is the constant and perpetual will to allot to every man his due.", author: "Ulpian" },
    { text: "The life of the law has not been logic; it has been experience.", author: "Oliver Wendell Holmes Jr." },
    { text: "It is better to risk saving a guilty person than to condemn an innocent one.", author: "Voltaire" }
  ]

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    // If user is admin, redirect to admin dashboard
    if (user.role === 'admin') {
      navigate('/admin')
      return
    }
    
    setTimeBasedGreeting()
    setDailyQuote(getRandomQuote())
    fetchDashboardData()
  }, [user, navigate])

  // Set greeting based on time of day
  const setTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    
    if (hour < 12) {
      setGreeting(t('Good Morning') || 'Good morning')
      setGreetingEmoji('☀️')
    } else if (hour < 18) {
      setGreeting(t('Good Afternoon') || 'Good afternoon')
      setGreetingEmoji('⛅')
    } else {
      setGreeting(t('Good Evening') || 'Good evening')
      setGreetingEmoji('🌙')
    }
  }

  // Get random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    return quotes[randomIndex]
  }

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Try to fetch real data from API
      const [activityRes, recommendationsRes, statsRes] = await Promise.allSettled([
        api.get('/user/recent-activity'),
        api.get('/user/recommendations'),
        api.get('/user/stats')
      ])

      // Handle recent activity
      if (activityRes.status === 'fulfilled') {
        setRecentActivity(activityRes.value.data.activities)
      } else {
        // Use empty array if no data - no mock data
        setRecentActivity([])
      }

      // Handle recommendations
      if (recommendationsRes.status === 'fulfilled') {
        setRecommendations(recommendationsRes.value.data.recommendations)
      } else {
        // Use empty array if no data - no mock data
        setRecommendations([])
      }

      // Handle stats with real data
      if (statsRes.status === 'fulfilled') {
        setStats({
          bookmarks: statsRes.value.data.bookmarks || 0,
          searches: statsRes.value.data.searches || 0,
          chatSessions: statsRes.value.data.chatSessions || 0,
          savedArticles: statsRes.value.data.savedArticles || 0
        })
      } else {
        // Only use user stats if available, otherwise default to 0
        setStats({
          bookmarks: user?.stats?.bookmarks || 0,
          searches: user?.stats?.searches || 0,
          chatSessions: user?.stats?.chatSessions || 0,
          savedArticles: user?.stats?.savedArticles || 0
        })
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <Loader size="large" />
        <p>{t('loadingDashboard') || 'Loading your dashboard...'}</p>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <section className="welcome-section">
        <div className="welcome-content">
          <div className="greeting-badge">
            <span className="greeting-emoji">{greetingEmoji}</span>
            <span className="greeting-text">{greeting}</span>
          </div>
          <h1>
            {user?.fullName}!
          </h1>
          <p>
            {currentLanguage === 'en' && 'Ready to continue your legal research?'}
            {currentLanguage === 'am' && 'የሕግ ጥናትዎን ለመቀጠል ዝግጁ ነዎት?'}
            {currentLanguage === 'om' && 'Qorannoo seeraa kee itti fufuuf qophii dha?'}
          </p>
          <div className="daily-quote">
            <span className="quote-icon">💭</span>
            <span className="quote-text">"{dailyQuote.text}" — {dailyQuote.author}</span>
          </div>
        </div>
        <div className="quick-search">
          <SearchBar placeholder={t('quickSearch') || 'Quick search...'} />
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">🔖</div>
          <div className="stat-details">
            <span className="stat-value">{stats.bookmarks}</span>
            <span className="stat-label">{t('bookmarks')}</span>
          </div>
          <Link to="/bookmarks" className="stat-link">{t('viewAll')} →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-details">
            <span className="stat-value">{stats.searches}</span>
            <span className="stat-label">{t('searches')}</span>
          </div>
          <Link to="/search" className="stat-link">{t('newSearch')} →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-details">
            <span className="stat-value">{stats.chatSessions}</span>
            <span className="stat-label">{t('chatSessions')}</span>
          </div>
          <Link to="/chatbot" className="stat-link">{t('startChat')} →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-details">
            <span className="stat-value">{stats.savedArticles}</span>
            <span className="stat-label">{t('savedArticles')}</span>
          </div>
          <Link to="/saved" className="stat-link">{t('viewAll')} →</Link>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <h2>{t('recentActivity')}</h2>
          <div className="activity-feed">
            {recentActivity.length > 0 ? (
              recentActivity.map(activity => (
                <div key={activity.id} className={`activity-item ${activity.type}`}>
                  <div className="activity-icon">{activity.icon || '📋'}</div>
                  <div className="activity-details">
                    <p className="activity-action">{activity.action}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state-message">{t('noRecentActivity') || 'No recent activity'}</p>
            )}
          </div>
          {recentActivity.length > 0 && (
            <button className="view-all-btn">{t('viewAllActivity')}</button>
          )}
        </section>

        <section className="dashboard-section">
          <h2>{t('recommended')}</h2>
          <div className="recommendations-list">
            {recommendations.length > 0 ? (
              recommendations.map(rec => (
                <div key={rec.id} className="recommendation-card">
                  <div className="recommendation-header">
                    <span className="rec-category">{rec.category}</span>
                    <span className="rec-relevance">{rec.relevance}</span>
                  </div>
                  <h3 className="rec-title">
                    <Link to={`/legal-content/${rec.id}`}>{rec.title}</Link>
                  </h3>
                  <button className="rec-action">{t('readMore')} →</button>
                </div>
              ))
            ) : (
              <p className="empty-state-message">{t('noRecommendations') || 'No recommendations available'}</p>
            )}
          </div>
        </section>
      </div>

      <section className="quick-categories">
        <h2>{t('quickAccess')}</h2>
        <div className="category-pills">
          <Link to="/category/criminal" className="category-pill criminal">
            <span className="pill-icon">⚖️</span>
            <span>{t('criminalLaw')}</span>
          </Link>
          <Link to="/category/family" className="category-pill family">
            <span className="pill-icon">👨‍👩‍👧‍👦</span>
            <span>{t('familyLaw')}</span>
          </Link>
          <Link to="/category/labor" className="category-pill labor">
            <span className="pill-icon">💼</span>
            <span>{t('laborLaw')}</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage