import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react'
import { useEntries, useSingleEntry } from '../hooks/useContentstack'
import './FAQ.css'

// Fallback data when CMS is not configured
const defaultFaqs = [
  {
    id: 1,
    question: "What is the best time to do a Himalayan trek?",
    answer: "The best time depends on the trek you choose. Spring (March-May) and Autumn (September-November) are generally ideal for most treks. Winter treks like Kedarkantha are best from December to March. Monsoon (July-September) is perfect for treks like Valley of Flowers and Kashmir Great Lakes."
  },
  {
    id: 2,
    question: "I'm a beginner. Which trek should I start with?",
    answer: "For beginners, we recommend starting with easy to easy-moderate treks like Kedarkantha, Brahmatal, or Dayara Bugyal. These treks have well-defined trails, moderate altitudes, and shorter durations - perfect for building your trekking confidence."
  },
  {
    id: 3,
    question: "What fitness level is required for your treks?",
    answer: "Basic fitness is essential for all treks. You should be able to jog 5 km in 30 minutes as a minimum. Start preparing at least 6-8 weeks before your trek with cardio, strength training, and stair climbing. Our fitness module provides detailed guidance for trek-specific preparation."
  },
  {
    id: 4,
    question: "Can I trek solo or should I join a group?",
    answer: "All our treks are conducted in groups (usually 15-25 trekkers), even if you register alone. This ensures safety and enriches the experience. Solo trekkers often find the group experience transformative as they meet like-minded people from diverse backgrounds."
  },
  {
    id: 5,
    question: "What equipment do I need to bring?",
    answer: "We provide all camping gear including tents, sleeping bags, and mattresses. You need to bring personal items like trekking shoes, warm layers, rain gear, and personal medications. A detailed gear list is shared after registration, and you can rent most items from our gear shop."
  },
  {
    id: 6,
    question: "What are the toilets like on the trek?",
    answer: "We have bio-toilets designed for high altitudes - deep pits with sturdy tent covers for privacy. Sawdust is used after each use to keep them odor-free and aid decomposition. Most trekkers find them surprisingly comfortable and environmentally conscious."
  },
  {
    id: 7,
    question: "I have health issues like BP, asthma, or diabetes. Can I trek?",
    answer: "It depends on the severity of your condition. Please consult your doctor first and then speak to our team. Many trekkers with controlled conditions successfully complete our treks. Carry your medications and disclose your health status during the safety check-in on Day 1."
  },
  {
    id: 8,
    question: "What is your cancellation and refund policy?",
    answer: "Cancellations made 30+ days before the trek receive 95% refund. 15-30 days before: 75% refund. 7-14 days: 50% refund. Less than 7 days: No refund. We also offer the option to transfer your booking to another date or person with minimal charges."
  }
]

const defaultSettings = {
  label: 'FAQs',
  title: 'Frequently Asked Questions',
  subtitle: 'Everything you need to know before embarking on your Himalayan adventure',
  contact_title: 'Still have questions?',
  contact_description: 'Our team of experienced coordinators is here to help you plan your perfect trek.',
  contact_cta_primary: 'Talk to an Expert',
  contact_cta_secondary: 'Watch FAQ Videos',
  phone_number: '+91 98765 43210',
  hours_weekday: 'Mon - Fri: 9:30 AM to 7:30 PM',
  hours_weekend: 'Sat - Sun: 9:30 AM to 6:30 PM'
}

function FAQ() {
  const [openId, setOpenId] = useState(null)

  // Fetch FAQs from CMS
  const { data: faqs } = useEntries('faq', defaultFaqs, { orderBy: 'order' })
  
  // Fetch section settings from CMS
  const { data: settings } = useSingleEntry('faq_section', defaultSettings)

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section className="faq section">
      <div className="container">
        <motion.div 
          className="faq__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="faq__label">
            <HelpCircle size={16} />
            {settings?.label || 'FAQs'}
          </span>
          <h2 className="section-title">{settings?.title}</h2>
          <p className="section-subtitle">{settings?.subtitle}</p>
        </motion.div>

        <div className="faq__grid">
          <div className="faq__list">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id || index}
                className={`faq-item ${openId === (faq.id || index) ? 'faq-item--open' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <button
                  className="faq-item__question"
                  onClick={() => toggleFaq(faq.id || index)}
                  aria-expanded={openId === (faq.id || index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    className={`faq-item__icon ${openId === (faq.id || index) ? 'rotated' : ''}`}
                    size={20}
                  />
                </button>
                
                <AnimatePresence>
                  {openId === (faq.id || index) && (
                    <motion.div
                      className="faq-item__answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="faq__contact"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="faq__contact-card">
              <div className="faq__contact-icon">
                <MessageCircle size={32} />
              </div>
              <h3>{settings?.contact_title || 'Still have questions?'}</h3>
              <p>{settings?.contact_description}</p>
              <div className="faq__contact-actions">
                <a href="#" className="btn btn-primary">
                  {settings?.contact_cta_primary || 'Talk to an Expert'}
                </a>
                <a href="#" className="btn btn-secondary">
                  {settings?.contact_cta_secondary || 'Watch FAQ Videos'}
                </a>
              </div>
              <div className="faq__contact-hours">
                <span>📞 {settings?.phone_number || '080 468 01269'}</span>
                <span>{settings?.hours_weekday || 'Mon - Fri: 9:30 AM to 7:30 PM'}</span>
                <span>{settings?.hours_weekend || 'Sat - Sun: 9:30 AM to 6:30 PM'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FAQ
