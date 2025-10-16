// AI Service for Gemini API Integration
// This service handles all AI-related operations including sentiment analysis, auto-categorization, and intelligent routing

export interface SentimentAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  emotions: {
    joy: number
    anger: number
    fear: number
    sadness: number
    surprise: number
  }
}

export interface AutoCategorizationResult {
  category: string
  confidence: number
  suggestedTags: string[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  reasoning: string
}

export interface IntelligentRoutingResult {
  suggestedAssignee: string | null
  department: string
  confidence: number
  reasoning: string
}

export interface AIInsights {
  sentiment: SentimentAnalysisResult
  categorization: AutoCategorizationResult
  routing: IntelligentRoutingResult
  summary: string
  suggestedActions: string[]
}

class AIService {
  private apiKey: string
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta'

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
    if (!this.apiKey) {
      console.warn('Gemini API key not found. AI features will be disabled.')
    }
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured')
    }

    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('AI Service Error:', error)
      throw error
    }
  }

  async analyzeSentiment(text: string): Promise<SentimentAnalysisResult> {
    const prompt = `
    Analyze the sentiment of the following customer support message and provide:
    1. Overall sentiment (positive, negative, neutral)
    2. Confidence score (0-1)
    3. Emotion breakdown (joy, anger, fear, sadness, surprise) as percentages
    
    Message: "${text}"
    
    Respond in JSON format:
    {
      "sentiment": "positive|negative|neutral",
      "confidence": 0.85,
      "emotions": {
        "joy": 20,
        "anger": 5,
        "fear": 10,
        "sadness": 15,
        "surprise": 50
      }
    }
    `

    try {
      const response = await this.makeRequest('models/gemini-pro:generateContent', {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 200,
        }
      })

      const result = JSON.parse(response.candidates[0].content.parts[0].text)
      return result
    } catch (error) {
      console.error('Sentiment analysis failed:', error)
      // Fallback to neutral sentiment
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        emotions: {
          joy: 0,
          anger: 0,
          fear: 0,
          sadness: 0,
          surprise: 0
        }
      }
    }
  }

  async autoCategorizeTicket(title: string, description: string): Promise<AutoCategorizationResult> {
    const prompt = `
    Analyze this support ticket and provide:
    1. Most appropriate category from: Technical Support, Account Issues, Billing, Feature Request, Bug Report, General Inquiry, Training, Other
    2. Confidence score (0-1)
    3. Suggested tags (max 5)
    4. Priority level (low, medium, high, urgent)
    5. Brief reasoning
    
    Title: "${title}"
    Description: "${description}"
    
    Respond in JSON format:
    {
      "category": "Technical Support",
      "confidence": 0.9,
      "suggestedTags": ["login", "authentication", "error"],
      "priority": "high",
      "reasoning": "User unable to access account, indicates urgent technical issue"
    }
    `

    try {
      const response = await this.makeRequest('models/gemini-pro:generateContent', {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 300,
        }
      })

      const result = JSON.parse(response.candidates[0].content.parts[0].text)
      return result
    } catch (error) {
      console.error('Auto-categorization failed:', error)
      // Fallback categorization
      return {
        category: 'General Inquiry',
        confidence: 0.5,
        suggestedTags: ['general'],
        priority: 'medium',
        reasoning: 'Unable to analyze automatically'
      }
    }
  }

  async suggestRouting(ticketData: {
    title: string
    description: string
    category: string
    priority: string
  }): Promise<IntelligentRoutingResult> {
    const prompt = `
    Based on this support ticket, suggest:
    1. Most appropriate department/team
    2. Specific assignee (if available from: tech-support, billing-team, account-team, general-support)
    3. Confidence score (0-1)
    4. Reasoning
    
    Ticket: "${ticketData.title}" - "${ticketData.description}"
    Category: ${ticketData.category}
    Priority: ${ticketData.priority}
    
    Respond in JSON format:
    {
      "suggestedAssignee": "tech-support",
      "department": "Technical Support",
      "confidence": 0.85,
      "reasoning": "Technical login issue requires specialized support team"
    }
    `

    try {
      const response = await this.makeRequest('models/gemini-pro:generateContent', {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 200,
        }
      })

      const result = JSON.parse(response.candidates[0].content.parts[0].text)
      return result
    } catch (error) {
      console.error('Intelligent routing failed:', error)
      // Fallback routing
      return {
        suggestedAssignee: 'general-support',
        department: 'General Support',
        confidence: 0.5,
        reasoning: 'Unable to analyze automatically'
      }
    }
  }

  async generateInsights(ticketData: {
    title: string
    description: string
    customerHistory?: any[]
  }): Promise<AIInsights> {
    try {
      const sentiment = await this.analyzeSentiment(ticketData.description)
      const categorization = await this.autoCategorizeTicket(ticketData.title, ticketData.description)
      const routing = await this.suggestRouting({
        title: ticketData.title,
        description: ticketData.description,
        category: categorization.category,
        priority: categorization.priority
      })

      // Generate summary and suggested actions
      const summaryPrompt = `
      Generate a brief summary and suggested actions for this support ticket:
      
      Title: "${ticketData.title}"
      Description: "${ticketData.description}"
      Sentiment: ${sentiment.sentiment} (${sentiment.confidence})
      Category: ${categorization.category}
      Priority: ${categorization.priority}
      
      Provide:
      1. Brief summary (1-2 sentences)
      2. Top 3 suggested actions
      
      Respond in JSON format:
      {
        "summary": "Customer experiencing login issues with high urgency",
        "suggestedActions": [
          "Verify account status and reset password if needed",
          "Check for system-wide authentication issues",
          "Follow up within 2 hours due to high priority"
        ]
      }
      `

      const summaryResponse = await this.makeRequest('models/gemini-pro:generateContent', {
        contents: [{
          parts: [{
            text: summaryPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 200,
        }
      })

      const summaryResult = JSON.parse(summaryResponse.candidates[0].content.parts[0].text)

      return {
        sentiment,
        categorization,
        routing,
        summary: summaryResult.summary,
        suggestedActions: summaryResult.suggestedActions
      }
    } catch (error) {
      console.error('AI insights generation failed:', error)
      throw error
    }
  }

  async generateResponse(ticketData: {
    title: string
    description: string
    category: string
    priority: string
  }): Promise<string> {
    const prompt = `
    Generate a professional, helpful response for this support ticket:
    
    Title: "${ticketData.title}"
    Description: "${ticketData.description}"
    Category: ${ticketData.category}
    Priority: ${ticketData.priority}
    
    The response should:
    - Acknowledge the customer's issue
    - Show empathy and understanding
    - Provide initial troubleshooting steps if applicable
    - Set appropriate expectations
    - Be professional and friendly
    
    Keep it concise (2-3 paragraphs max).
    `

    try {
      const response = await this.makeRequest('models/gemini-pro:generateContent', {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 300,
        }
      })

      return response.candidates[0].content.parts[0].text
    } catch (error) {
      console.error('Response generation failed:', error)
      return "Thank you for contacting us. We've received your request and will get back to you shortly."
    }
  }

  async analyzeKnowledgeBase(query: string, articles: any[]): Promise<{
    relevantArticles: any[]
    suggestedAnswer: string
  }> {
    const articlesText = articles.map(article => 
      `Title: ${article.title}\nContent: ${article.content}\nCategory: ${article.category}`
    ).join('\n\n')

    const prompt = `
    Based on the following knowledge base articles, find the most relevant ones for this customer query and suggest an answer:
    
    Customer Query: "${query}"
    
    Knowledge Base Articles:
    ${articlesText}
    
    Provide:
    1. List of relevant article IDs (max 3)
    2. Suggested answer based on the articles
    
    Respond in JSON format:
    {
      "relevantArticles": ["article-id-1", "article-id-2"],
      "suggestedAnswer": "Based on our knowledge base, here's how to resolve your issue..."
    }
    `

    try {
      const response = await this.makeRequest('models/gemini-pro:generateContent', {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 400,
        }
      })

      return JSON.parse(response.candidates[0].content.parts[0].text)
    } catch (error) {
      console.error('Knowledge base analysis failed:', error)
      return {
        relevantArticles: [],
        suggestedAnswer: "I couldn't find relevant information in our knowledge base. Please contact our support team for assistance."
      }
    }
  }
}

// Export singleton instance
export const aiService = new AIService()



