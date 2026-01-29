import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, X, Send, Bot, User, Loader2, 
  Sparkles, ChevronDown, Minimize2
} from 'lucide-react'
import './AIAssistant.css'

// Get environment variables
const API_URL = import.meta.env.VITE_ASSISTANT_API_URL
const AUTH_HEADER_KEY = import.meta.env.VITE_ASSISTANT_AUTH_HEADER_KEY
const AUTH_HEADER_VALUE = import.meta.env.VITE_ASSISTANT_AUTH_HEADER_VALUE

function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: `<p>Hello! 👋 I'm your High Altitude Trekkers assistant. I can help you with:</p>
        <ul>
          <li>Finding the perfect trek for you</li>
          <li>Trek details, itineraries & pricing</li>
          <li>Best time to visit</li>
          <li>Fitness requirements</li>
          <li>Booking queries</li>
        </ul>
        <p>How can I assist you today?</p>`,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Make API call
      const headers = {
        'Content-Type': 'application/json'
      }
      
      // Add auth header if configured
      if (AUTH_HEADER_KEY && AUTH_HEADER_VALUE) {
        headers[AUTH_HEADER_KEY] = AUTH_HEADER_VALUE
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: userMessage.content,
          conversation_id: `session_${Date.now()}`
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const assistantContent = await response.text()
  

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Assistant API error:', error)
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `<p>I apologize, but I'm having trouble connecting right now. Please try again in a moment, or contact us directly:</p>
          <p><strong>📞 Phone:</strong> +91 98765 43210</p>
          <p><strong>📧 Email:</strong> hello@hatrekkers.com</p>`,
        timestamp: new Date(),
        isError: true
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false)
    } else {
      setIsOpen(!isOpen)
    }
  }

  const minimizeChat = () => {
    setIsMinimized(true)
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  // Suggested quick questions
  const quickQuestions = [
    "Best trek for beginners?",
    "Kedarkantha trek details",
    "Treks in December",
    "Fitness requirements"
  ]

  const handleQuickQuestion = (question) => {
    setInputValue(question)
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  return (
    <div className="ai-assistant">
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="ai-assistant__trigger"
            onClick={toggleChat}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="ai-assistant__trigger-icon">
              <MessageCircle size={24} />
              <Sparkles className="ai-assistant__sparkle" size={12} />
            </div>
            <span className="ai-assistant__trigger-pulse"></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`ai-assistant__window ${isMinimized ? 'minimized' : ''}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '720px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="ai-assistant__header" onClick={isMinimized ? toggleChat : undefined}>
              <div className="ai-assistant__header-info">
                <div className="ai-assistant__avatar">
                  <Bot size={20} />
                </div>
                <div className="ai-assistant__header-text">
                  <h4>Trek Assistant</h4>
                  <span className="ai-assistant__status">
                    <span className="ai-assistant__status-dot"></span>
                    Online
                  </span>
                </div>
              </div>
              <div className="ai-assistant__header-actions">
                {!isMinimized && (
                  <button 
                    className="ai-assistant__header-btn"
                    onClick={minimizeChat}
                    aria-label="Minimize"
                  >
                    <Minimize2 size={18} />
                  </button>
                )}
                {isMinimized && (
                  <button 
                    className="ai-assistant__header-btn"
                    onClick={toggleChat}
                    aria-label="Expand"
                  >
                    <ChevronDown size={18} style={{ transform: 'rotate(180deg)' }} />
                  </button>
                )}
                <button 
                  className="ai-assistant__header-btn ai-assistant__close-btn"
                  onClick={closeChat}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Body - Hidden when minimized */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="ai-assistant__messages">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`ai-assistant__message ${message.type}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="ai-assistant__message-avatar">
                        {message.type === 'assistant' ? (
                          <Bot size={16} />
                        ) : (
                          <User size={16} />
                        )}
                      </div>
                      <div className="ai-assistant__message-content">
                        {message.type === 'assistant' ? (
                          <div 
                            className="ai-assistant__message-html"
                            dangerouslySetInnerHTML={{ __html: message.content }}
                          />
                        ) : (
                          <p>{message.content}</p>
                        )}
                        <span className="ai-assistant__message-time">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Loading indicator */}
                  {isLoading && (
                    <motion.div
                      className="ai-assistant__message assistant"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="ai-assistant__message-avatar">
                        <Bot size={16} />
                      </div>
                      <div className="ai-assistant__message-content">
                        <div className="ai-assistant__typing">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions - Show only if few messages */}
                {messages.length <= 2 && !isLoading && (
                  <div className="ai-assistant__quick-questions">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        className="ai-assistant__quick-btn"
                        onClick={() => handleQuickQuestion(question)}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <div className="ai-assistant__input-area">
                  <div className="ai-assistant__input-wrapper">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Ask me anything about treks..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                    />
                    <button
                      className="ai-assistant__send-btn"
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                    >
                      {isLoading ? (
                        <Loader2 size={18} className="spinning" />
                      ) : (
                        <Send size={18} />
                      )}
                    </button>
                  </div>
                  <p className="ai-assistant__disclaimer">
                    AI assistant may make mistakes. Verify important info.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AIAssistant

