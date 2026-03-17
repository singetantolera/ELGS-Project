class ChatbotService {
  constructor() {
    this.responses = {
      criminal: {
        keywords: ['crime', 'criminal', 'theft', 'murder', 'homicide', 'assault', 'fraud'],
        response: {
          en: 'Under Ethiopian Criminal Law, this offense is addressed in the Criminal Code. The penalty depends on the severity and circumstances of the crime.',
          am: 'በኢትዮጵያ የወንጀል ሕግ መሠረት ይህ ወንጀል በወንጀል ሕጉ ውስጥ ተደንግጓል። ቅጣቱ በወንጀሉ ከባድነት እና በሁኔታዎች ላይ ይወሰናል።',
          om: 'Seera Cubbuu Etiyophiaa tiin yakki kun Seera Cubbuu keessatti ibsameera. Adabbiin ulfina fi haala yakkaa irratti hundaa\'a.'
        }
      },
      family: {
        keywords: ['family', 'marriage', 'divorce', 'child', 'custody', 'adoption', 'inheritance'],
        response: {
          en: 'Family Law in Ethiopia covers marriage, divorce, child custody, and inheritance. The law recognizes both civil and religious marriages.',
          am: 'የቤተሰብ ሕግ በኢትዮጵያ ጋብቻን፣ ፍቺን፣ የልጅ አሳዳጊነትን እና ውርስን ይሸፍናል። ሕጉ ሲቪል እና ሃይማኖታዊ ጋብቻዎችን ይገነዘባል።',
          om: 'Seera Maatii Etiyophiaa keessatti fuudhaa fi heeruma, hiikkaa, kunuunsa ijoollee fi dhaala kan hammatedha. Seerri fuudhaa fi heeruma hawaasaa fi amantii ni beekkama.'
        }
      },
      labor: {
        keywords: ['labor', 'work', 'employee', 'employer', 'salary', 'wage', 'termination', 'leave'],
        response: {
          en: 'Ethiopian Labor Law protects worker rights including fair wages, working hours, leave, and termination procedures. Employers must follow specific regulations.',
          am: 'የኢትዮጵያ የሠራተኛ ሕግ ፍትሃዊ ደመወዝ፣ የሥራ ሰዓት፣ ፈቃድ እና የሥራ ማቋረጥ ሥነ-ሥርዓትን ጨምሮ የሠራተኛ መብቶችን ይጠብቃል።',
          om: 'Seera Hojii Etiyophiaan mirga hojjataa mindaa haqa qabu, sa\'aatii hojii, boqonnaa fi adeemsa hojii dhaabuu kan of eeggate dha.'
        }
      }
    };

    this.generalResponse = {
      en: 'I can help you with Ethiopian Criminal, Family and Labor Law. Please ask a specific question about one of these areas.',
      am: 'በኢትዮጵያ የወንጀል፣ የቤተሰብ እና የሠራተኛ ሕግ ላይ መርዳት እችላለሁ። እባክዎ ከነዚህ አካባቢዎች በአንዱ ላይ የተወሰነ ጥያቄ ይጠይቁ።',
      om: 'Seera Yakkaa, Maatii fi Hojjettota Etiyophiaa irratti si gargaaruu danda\'a. Maaloo waa\'ee kutaa kanaa keessaa tokkoo gaaffii addaa gaafadhu.'
    };
  }

  // Process user message and generate response
  async processMessage(message, language = 'en') {
    const lowercaseMessage = message.toLowerCase();
    
    // Check each category for keyword matches
    for (const [category, data] of Object.entries(this.responses)) {
      if (data.keywords.some(keyword => lowercaseMessage.includes(keyword))) {
        return {
          response: data.response[language] || data.response.en,
          category,
          confidence: 0.8
        };
      }
    }

    // Default response
    return {
      response: this.generalResponse[language] || this.generalResponse.en,
      category: 'general',
      confidence: 0.3
    };
  }

  // Get suggested questions
  getSuggestedQuestions(language = 'en') {
    const suggestions = {
      en: [
        'What are the grounds for divorce?',
        'What is the penalty for theft?',
        'What are my rights as an employee?'
      ],
      am: [
        'ለፍቺ ምክንያቶች ምንድን ናቸው?',
        'ለስርቆት ቅጣቱ ምንድን ነው?',
        'እንደ ሠራተኛ መብቶቼ ምንድን ናቸው?'
      ],
      om: [
        'Sababootni hiikkaa maal fa\'a?',
        'Adabbiin hattoomaa maali?',
        'Mirgni kiyya akka hojjataatti maal fa\'a?'
      ]
    };

    return suggestions[language] || suggestions.en;
  }

  // Log conversation for analytics
  async logConversation(userId, message, response) {
    // This would save to database in production
    console.log('Conversation logged:', { userId, message, response, timestamp: new Date() });
  }

  // Get conversation history
  async getConversationHistory(userId, limit = 10) {
    // This would fetch from database in production
    return [];
  }
}

module.exports = new ChatbotService();