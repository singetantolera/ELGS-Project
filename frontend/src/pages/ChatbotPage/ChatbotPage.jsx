import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import ChatbotInterface from '../../components/chatbot/ChatbotInterface/ChatbotInterface'
import api from '../../services/api'
import './ChatbotPage.css'

const ChatbotPage = () => {
  const { user } = useAuth()
  const { currentLanguage, t } = useLanguage()
  const navigate = useNavigate()
  
  const [faqs, setFaqs] = useState([])
  const [quickTopics, setQuickTopics] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchChatbotData()
  }, [user, navigate, currentLanguage])

  const fetchChatbotData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [faqsRes, topicsRes] = await Promise.allSettled([
        api.get('/chatbot/faqs', { params: { language: currentLanguage } }),
        api.get('/chatbot/quick-topics', { params: { language: currentLanguage } })
      ])

      if (faqsRes.status === 'fulfilled') {
        setFaqs(faqsRes.value.data.faqs)
      }

      if (topicsRes.status === 'fulfilled') {
        setQuickTopics(topicsRes.value.data.topics)
      }

    } catch (error) {
      console.error('Failed to fetch chatbot data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentLanguage])

  const handleTopicClick = (topic) => {
    window.dispatchEvent(new CustomEvent('chatbot-topic', { detail: topic }))
  }

  if (isLoading) {
    return (
      <div className="chatbot-page-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p className="loading-text">Loading AI Assistant...</p>
      </div>
    )
  }

  return (
    <div className="chatbot-page">
      <div className="chatbot-layout">
        <div className="chat-main">
          <ChatbotInterface />
        </div>

        <aside className="chat-sidebar">
          <div className="info-card">
            <h3>
              {currentLanguage === 'en' && '💡 How to Use'}
              {currentLanguage === 'am' && '💡 እንዴት መጠቀም እንደሚቻል'}
              {currentLanguage === 'om' && '💡 Akkaataa Itti Fayyadaman'}
            </h3>
            <ul className="info-list">
              <li>{t('askNaturalLanguage') || 'Ask questions in natural language'}</li>
              <li>{t('beSpecific') || 'Be specific about your legal area'}</li>
              <li>{t('askClarification') || 'Ask for clarification if needed'}</li>
              <li>{t('checkSources') || 'Check sources for verification'}</li>
            </ul>
          </div>

          <div className="faq-card">
            <h3>
              {currentLanguage === 'en' && '❓ Frequently Asked'}
              {currentLanguage === 'am' && '❓ በተደጋጋሚ የሚጠየቁ'}
              {currentLanguage === 'om' && '❓ Yeroo Baay\'ee Gaafatamu'}
            </h3>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <details key={index} className="faq-item">
                  <summary className="faq-question">
                    {faq.question[currentLanguage]}
                  </summary>
                  <p className="faq-answer">
                    {faq.answer[currentLanguage]}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <div className="topics-card">
            <h3>
              {currentLanguage === 'en' && '📚 Quick Topics'}
              {currentLanguage === 'am' && '📚 ፈጣን ርዕሶች'}
              {currentLanguage === 'om' && '📚 Mata Duree Salphaa'}
            </h3>
            <div className="topics-list">
              {quickTopics.map((topic, index) => (
                <button 
                  key={index}
                  className="topic-btn"
                  onClick={() => handleTopicClick(topic.name[currentLanguage])}
                >
                  {topic.icon} {topic.name[currentLanguage]}
                </button>
              ))}
            </div>
          </div>

          <div className="disclaimer-card">
            <p>
              ⚖️ {t('aiDisclaimer') || 'This AI assistant provides general legal information only. Not a substitute for professional legal advice.'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ChatbotPage