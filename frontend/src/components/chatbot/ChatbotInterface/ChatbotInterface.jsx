import { useState, useRef, useEffect, useCallback } from 'react'
import { useLanguage } from '../../../hooks/useLanguage'
import { useAuth } from '../../../hooks/useAuth'
import ChatMessage from '../ChatMessage/ChatMessage'
import Loader from '../../common/Loader/Loader'
import api from '../../../services/api'
import './ChatbotInterface.css'

const ChatbotInterface = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [suggestedQuestions, setSuggestedQuestions] = useState([])
  const [conversationId, setConversationId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quickReplies, setQuickReplies] = useState([])
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const { currentLanguage, t } = useLanguage()
  const { user } = useAuth()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    initializeChat()
    fetchSuggestedQuestions()
  }, [currentLanguage])

  const initializeChat = async () => {
    setIsLoading(true)
    
    try {
      if (user) {
        const response = await api.post('/chatbot/conversations', {
          language: currentLanguage
        })
        setConversationId(response.data.conversationId)
      }

      const welcomeMessage = {
        id: 'welcome',
        type: 'bot',
        content: {
          en: "👋 Hello! I'm your Ethiopian Law Assistant. I can help you understand Criminal, Family, and Labor Law. What would you like to know?",
          am: "👋 ሰላም! እኔ የኢትዮጵያ ሕግ ረዳትዎ ነኝ። በወንጀል፣ በቤተሰብ እና በሠራተኛ ሕግ ላይ ልረዳዎ እችላለሁ። ምን ማወቅ ይፈልጋሉ?",
          om: "👋 Akkam! An gargaaraa seera Etiyophiya ti. Seera Cubbuu, Maatii fi Hojii irratti si gargaaruu danda'a. Maal beekuu barbaadda?"
        }[currentLanguage],
        timestamp: new Date()
      }

      setMessages([welcomeMessage])
      
    } catch (error) {
      console.error('Failed to initialize chat:', error)
      
      const fallbackMessage = {
        id: 'welcome',
        type: 'bot',
        content: {
          en: "👋 Hello! I'm your Ethiopian Law Assistant. I can help you understand Criminal, Family, and Labor Law. What would you like to know?",
          am: "👋 ሰላም! እኔ የኢትዮጵያ ሕግ ረዳትዎ ነኝ። በወንጀል፣ በቤተሰብ እና በሠራተኛ ሕግ ላይ ልረዳዎ እችላለሁ። ምን ማወቅ ይፈልጋሉ?",
          om: "👋 Akkam! An gargaaraa seera Etiyophiya ti. Seera Cubbuu, Maatii fi Hojii irratti si gargaaruu danda'a. Maal beekuu barbaadda?"
        }[currentLanguage],
        timestamp: new Date()
      }
      setMessages([fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSuggestedQuestions = async () => {
    try {
      const response = await api.get('/chatbot/suggested-questions', {
        params: { language: currentLanguage }
      })
      setSuggestedQuestions(response.data.questions)
    } catch (error) {
      console.error('Failed to fetch suggested questions:', error)
      
      setSuggestedQuestions([
        {
          id: 1,
          en: "What are the grounds for divorce under Family Law?",
          am: "በቤተሰብ ሕግ መሠረት ለፍቺ ምክንያቶች ምንድን ናቸው?",
          om: "Seera Maatii tiin sababni hiikkaa maal fa'a?",
          category: "Family Law"
        },
        {
          id: 2,
          en: "What is the penalty for theft?",
          am: "ለስርቆት የሚደረገው ቅጣት ምንድን ነው?",
          om: "Adabbiin hattoomaa maali?",
          category: "Criminal Law"
        },
        {
          id: 3,
          en: "What are my rights during employment termination?",
          am: "ከሥራ ሲባረሩ መብቶችዎ ምንድን ናቸው?",
          om: "Yeroo hojii irraa gara galfamu mirgni kiyya maal fa'a?",
          category: "Labor Law"
        }
      ])
    }
  }

  const handleSendMessage = async (e, quickReply = null) => {
    e?.preventDefault()
    
    const messageText = quickReply || inputMessage
    if (!messageText.trim() || isTyping) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)
    setQuickReplies([])

    try {
      if (user && conversationId) {
        const response = await api.post('/chatbot/message', {
          message: messageText,
          conversationId,
          language: currentLanguage
        })

        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.data.message,
          timestamp: new Date(),
          sources: response.data.sources || []
        }

        setMessages(prev => [...prev, botMessage])
        setQuickReplies(response.data.quickReplies || [])
        
        if (response.data.conversationId) {
          setConversationId(response.data.conversationId)
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const botResponse = generateBotResponse(messageText)
        
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: botResponse,
          timestamp: new Date(),
          sources: [
            { title: "Criminal Code Article 101", url: "/legal-content/1" },
            { title: "Family Law Article 45", url: "/legal-content/2" }
          ]
        }

        setMessages(prev => [...prev, botMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: {
          en: "I'm having trouble answering that. Please try rephrasing your question.",
          am: "ይህንን መመለስ እየተቸገርኩ ነው። እባክዎ ጥያቄዎን በሌላ መልኩ ይጠይቁ።",
          om: "Gaaffii kana deebisuun rakkisaa jira. Mee gaaffii kee bifa biraan gaafadhu."
        }[currentLanguage],
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase()
    
    if (input.includes('divorce') || input.includes('ፍቺ') || input.includes('hiikkaa')) {
      return {
        en: "Under Ethiopian Family Law, grounds for divorce include: 1) Adultery, 2) Willful desertion for more than 2 years, 3) Cruelty, 4) Incurable insanity for more than 3 years, 5) Conversion to another religion (for Christian marriages), and 6) Mutual consent.",
        am: "በኢትዮጵያ ቤተሰብ ሕግ መሠረት ለፍቺ ምክንያቶች፡- 1) ምንዝር፣ 2) ሆን ተብሎ ለሁለት ዓመት ያህል መተው፣ 3) ጭካኔ፣ 4) ለሦስት ዓመት ያህል የማይድን እብደት፣ 5) ወደ ሌላ ሃይማኖት መለወጥ፣ እና 6) የሁለቱም ፈቃድ።",
        om: "Seera Maatii Etiyophia tiin sababni hiikkaa kanneen fa'a: 1) Ejjaa, 2) Waggaa 2 ol ka'umsa fedha, 3) Hamaa, 4) Waggaa 3 maraatumma fayyuu dhabuu, 5) Amantii gara biraa jijjiirrachaa, fi 6) Fedha walii."
      }[currentLanguage]
    }
    
    if (input.includes('theft') || input.includes('ስርቆት') || input.includes('hattooma')) {
      return {
        en: "Under Ethiopian Criminal Code, theft is punishable based on the value stolen: Simple theft (up to 1,500 Birr) - fine or simple imprisonment; Serious theft (above 1,500 Birr) - rigorous imprisonment from 1 to 5 years; Aggravated theft (with violence, at night, etc.) - rigorous imprisonment from 3 to 10 years.",
        am: "በኢትዮጵያ የወንጀል ሕግ መሠረት ስርቆት በተሰረቀው ንብረት ዋጋ ላይ ተመርኩዞ ይቀጣል፡ ቀላል ስርቆት - ቅጣት ወይም ቀላል እስራት፣ ከባድ ስርቆት - ከ1 እስከ 5 ዓመት እስራት፣ የተባባሰ ስርቆት - ከ3 እስከ 10 ዓመት እስራት።",
        om: "Seera Cubbuu Etiyophia tiin hattooma gatii waan hatame irratti hundaa'a: Hattooma salphaa (Qarshii 1,500 gadi) - adabbii maallaqaa ykn hidhaa salphaa; Hattooma cimaa (Qarshii 1,500 ol) - hidhaa waggaa 1-5; Hattooma cimtuu (cabsaa wajjin, halkan, etc.) - hidhaa waggaa 3-10."
      }[currentLanguage]
    }

    return {
      en: "I understand you're asking about Ethiopian law. Could you provide more details or rephrase your question? I can help with Criminal, Family, and Labor Law specifically.",
      am: "ስለ ኢትዮጵያ ሕግ እየጠየቁ እንደሆነ ተረድቻለሁ። እባክዎ ተጨማሪ ዝርዝር መረጃ ይስጡ ወይም ጥያቄዎን በሌላ መልኩ ይጠይቁ።",
      om: "Gaaffii kee waa'ee seera Etiyophia ta'uu hubadheera. Mee odoo dabalataa naaf kenni ykn gaaffii kee bifa biraan gaafadhu."
    }[currentLanguage]
  }

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question[currentLanguage])
    inputRef.current?.focus()
  }

  const handleQuickReply = (reply) => {
    if (reply.action === 'retry') {
      const lastUserMessage = [...messages].reverse().find(m => m.type === 'user')
      if (lastUserMessage) {
        handleSendMessage(null, lastUserMessage.content)
      }
    } else if (reply.action === 'new') {
      setMessages([])
      initializeChat()
    } else {
      handleSendMessage(null, reply.text)
    }
  }

  if (isLoading) {
    return (
      <div className="chatbot-loading">
        <div className="loading-spinner">
          <Loader size="large" />
        </div>
        <p className="loading-text">Initializing AI Assistant...</p>
      </div>
    )
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-content">
          <div className="bot-avatar">⚖️</div>
          <div>
            <h2>{t('aiAssistant') || 'Legal AI Assistant'}</h2>
            <p>{t('aiAssistantDescription') || 'Ask me about Ethiopian Criminal, Family & Labor Law'}</p>
          </div>
        </div>
        <div className="header-status">
          <span className="status-dot"></span>
          <span>{t('online') || 'Online - 24/7'}</span>
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {quickReplies.length > 0 && (
        <div className="quick-replies">
          <p className="quick-replies-title">Suggested replies:</p>
          <div className="quick-replies-grid">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                className="quick-reply-btn"
                onClick={() => handleQuickReply(reply)}
                disabled={isTyping}
              >
                {reply.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.length === 1 && suggestedQuestions.length > 0 && (
        <div className="suggested-questions">
          <p className="suggested-title">{t('suggestedQuestions') || 'Suggested questions:'}</p>
          <div className="question-grid">
            {suggestedQuestions.map((q) => (
              <button
                key={q.id}
                className="question-btn"
                onClick={() => handleSuggestedQuestion(q)}
              >
                <span className="question-category">{q.category}</span>
                <span className="question-text">{q[currentLanguage]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="chatbot-input">
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={t('chatPlaceholder') || "Type your legal question here..."}
          disabled={isTyping}
        />
        <button 
          type="submit" 
          disabled={!inputMessage.trim() || isTyping}
          className="send-btn"
        >
          {isTyping ? <Loader size="small" /> : (t('send') || 'Send')}
        </button>
      </form>

      <div className="chatbot-footer">
        <p>⚠️ {t('aiDisclaimer') || 'This AI provides general legal information only. For specific legal advice, consult a qualified lawyer.'}</p>
      </div>
    </div>
  )
}

export default ChatbotInterface