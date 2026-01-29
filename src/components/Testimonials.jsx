import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useEntries, useSingleEntry } from '../hooks/useContentstack'
import './Testimonials.css'

// Fallback data when CMS is not configured
const defaultTestimonials = [
  {
    id: 1,
    name: "Arjun Mehta",
    role: "Software Engineer",
    location: "Mumbai",
    image: { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
    quote: "This trek changed my perspective on life. The way the team organized everything was flawless. From the moment we started to the summit, every detail was taken care of. I came back a different person.",
    highlight: "The values helped transform my life",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Marketing Manager",
    location: "Delhi",
    image: { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
    quote: "They taught me everything from holding trekpoles correctly to managing my energy on uphill climbs. The guides were patient and encouraging. I discovered a completely new version of myself.",
    highlight: "A trek that transforms you completely",
    rating: 5
  },
  {
    id: 3,
    name: "Vikram Desai",
    role: "Startup Founder",
    location: "Pune",
    image: { url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
    quote: "I took my entire team of 12 on this trek as a team-building exercise. The experience brought us closer than any corporate offsite ever could. We bonded, discovered each other, and grew together.",
    highlight: "Perfect for team bonding experiences",
    rating: 5
  },
  {
    id: 4,
    name: "Ananya Krishnan",
    role: "UX Designer",
    location: "Chennai",
    image: { url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" },
    quote: "The treks are thoughtfully designed to give you time for introspection. At the summit, they handed us postcards to write to our future selves. Such beautiful touches made this unforgettable.",
    highlight: "Each trek is truly life-changing",
    rating: 5
  },
  {
    id: 5,
    name: "Rahul Nair",
    role: "Financial Analyst",
    location: "Bangalore",
    image: { url: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80" },
    quote: "Their commitment to sustainability impressed me deeply. The zero waste policy was followed religiously, and by the end of the trek, every trekker in our group had adopted these values.",
    highlight: "Sustainability is in their DNA",
    rating: 5
  },
  {
    id: 6,
    name: "Kavitha Reddy",
    role: "Product Manager",
    location: "Hyderabad",
    image: { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" },
    quote: "This wasn't just an adventure; it was a holistic journey of self-discovery. The organization goes beyond being a business - they're building a community of mindful trekkers.",
    highlight: "Carefully curated and enriching",
    rating: 5
  }
]

const defaultSettings = {
  label: 'Testimonials',
  title: 'Read Why Trekkers Love Our Transformative Treks',
  subtitle: 'Stories from thousands of trekkers whose lives were transformed in the mountains'
}

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef(null)

  // Fetch testimonials from CMS
  const { data: testimonials } = useEntries('testimonial', defaultTestimonials, { orderBy: 'order' })
  
  // Fetch section settings from CMS
  const { data: settings } = useSingleEntry('testimonials_section', defaultSettings)

  const scroll = (direction) => {
    const container = scrollRef.current
    const cardWidth = 400
    const newIndex = direction === 'left' 
      ? Math.max(0, activeIndex - 1)
      : Math.min(testimonials.length - 1, activeIndex + 1)
    
    setActiveIndex(newIndex)
    container.scrollTo({
      left: newIndex * cardWidth,
      behavior: 'smooth'
    })
  }

  return (
    <section className="testimonials section">
      <div className="container">
        <motion.div 
          className="testimonials__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="testimonials__label">{settings?.label || 'Testimonials'}</span>
          <h2 className="section-title">{settings?.title}</h2>
          <p className="section-subtitle">{settings?.subtitle}</p>
        </motion.div>

        <div className="testimonials__wrapper">
          <button 
            className="testimonials__nav testimonials__nav--left"
            onClick={() => scroll('left')}
            disabled={activeIndex === 0}
            aria-label="Previous testimonials"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="testimonials__carousel" ref={scrollRef}>
            {testimonials.map((testimonial, index) => {
              const imageUrl = testimonial.image?.url || testimonial.image
              return (
                <motion.div
                  key={testimonial.id || index}
                  className="testimonial-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="testimonial-card__quote-icon">
                    <Quote size={32} />
                  </div>
                  
                  <div className="testimonial-card__rating">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} fill="#facc15" color="#facc15" />
                    ))}
                  </div>

                  <h3 className="testimonial-card__highlight">{testimonial.highlight}</h3>
                  
                  <p className="testimonial-card__quote">{testimonial.quote}</p>
                  
                  <div className="testimonial-card__author">
                    <img 
                      src={imageUrl} 
                      alt={testimonial.name}
                      className="testimonial-card__avatar"
                    />
                    <div className="testimonial-card__info">
                      <span className="testimonial-card__name">{testimonial.name}</span>
                      <span className="testimonial-card__role">{testimonial.role}</span>
                      <span className="testimonial-card__location">{testimonial.location}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <button 
            className="testimonials__nav testimonials__nav--right"
            onClick={() => scroll('right')}
            disabled={activeIndex === testimonials.length - 1}
            aria-label="Next testimonials"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="testimonials__dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`testimonials__dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => {
                setActiveIndex(index)
                scrollRef.current.scrollTo({
                  left: index * 400,
                  behavior: 'smooth'
                })
              }}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
