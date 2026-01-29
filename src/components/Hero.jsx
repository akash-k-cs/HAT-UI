import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight, Star, Users, Shield, Compass } from 'lucide-react'
import { useEntries, useSingleEntry } from '../hooks/useContentstack'
import './Hero.css'

// Fallback slides when CMS is not configured
const defaultSlides = [
  {
    id: 1,
    title: "Meet the Organisation That Changed Trekking in India",
    subtitle: "The treks you hear about today — Kedarkantha, Rupin Pass, Buran Ghati — were once little-known trails. We documented and brought them out, changing the way India treks.",
    stat_text: "India's largest trekking organisation",
    image: { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80" }
  },
  {
    id: 2,
    title: "What If Your Next Trek Changed Everything?",
    subtitle: "Join us on a mindfully designed trek experience that connects you to yourself. The person before and after the trek are rarely the same.",
    stat_text: "13,000+ Google reviews with an average of 4.9",
    image: { url: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1920&q=80" }
  },
  {
    id: 3,
    title: "This Summer, Let The Mountains Shape Your Child",
    subtitle: "Send them on a Trekking Summer Camp where children build confidence, independence, and resilience through a 9-day Himalayan programme.",
    stat_text: "1000+ parents have sent their children on summer camp with us",
    image: { url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80" }
  },
  {
    id: 4,
    title: "Trek with India's Safest Trekking Organisation",
    subtitle: "Behind every trek lies a system built on expertly trained professionals, expedition-grade gear, and strict safety protocols tested over years.",
    stat_text: "35,000+ trust our safety standards every year",
    image: { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80" }
  }
]

const defaultStats = [
  { icon: 'users', value: "35,000+", label: "Trekkers Annually" },
  { icon: 'star', value: "4.9", label: "Google Rating" },
  { icon: 'shield', value: "17+", label: "Years Experience" },
  { icon: 'compass', value: "50+", label: "Trek Routes" }
]

const defaultHeroSettings = {
  badge_text: 'Discover the Himalayas',
  cta_primary_text: 'View Upcoming Treks',
  cta_secondary_text: 'Watch Our Story',
  scroll_text: 'Scroll to explore'
}

const iconMap = {
  users: Users,
  star: Star,
  shield: Shield,
  compass: Compass
}

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Fetch hero slides from CMS
  const { data: slides } = useEntries('hero_slide', defaultSlides, { orderBy: 'order' })
  
  // Fetch hero stats from CMS
  const { data: stats } = useEntries('hero_stat', defaultStats, { orderBy: 'order' })
  
  // Fetch hero settings from CMS
  const { data: heroSettings } = useSingleEntry('hero_settings', defaultHeroSettings)

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 6000)
    
    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
  }

  const currentSlideData = slides[currentSlide] || slides[0]
  const imageUrl = currentSlideData?.image?.url || currentSlideData?.image

  return (
    <section className="hero">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="hero__slide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div 
            className="hero__background"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className="hero__overlay" />
          
          <div className="hero__content">
            <motion.div 
              className="hero__text"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="hero__badge">
                <Compass size={16} />
                {heroSettings?.badge_text || 'Discover the Himalayas'}
              </span>
              
              <h1 className="hero__title">{currentSlideData?.title}</h1>
              
              <p className="hero__subtitle">{currentSlideData?.subtitle}</p>
              
              <motion.div 
                className="hero__stat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Star className="hero__stat-icon" fill="currentColor" />
                <span>{currentSlideData?.stat_text}</span>
              </motion.div>
              
              <div className="hero__actions">
                <a href="#" className="btn btn-primary">
                  {heroSettings?.cta_primary_text || 'View Upcoming Treks'}
                  <ArrowRight size={18} />
                </a>
                <a href="#" className="btn btn-light">
                  {heroSettings?.cta_secondary_text || 'Watch Our Story'}
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="hero__nav">
        <button className="hero__nav-btn" onClick={prevSlide} aria-label="Previous slide">
          <ChevronLeft size={24} />
        </button>
        
        <div className="hero__dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero__dot ${index === currentSlide ? 'hero__dot--active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <button className="hero__nav-btn" onClick={nextSlide} aria-label="Next slide">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Stats Bar */}
      <motion.div 
        className="hero__stats"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        {stats.map((stat, index) => {
          const IconComponent = iconMap[stat.icon] || Compass
          return (
            <div key={index} className="hero__stats-item">
              <IconComponent className="hero__stats-icon" />
              <div className="hero__stats-content">
                <span className="hero__stats-value">{stat.value}</span>
                <span className="hero__stats-label">{stat.label}</span>
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="hero__scroll-mouse">
          <div className="hero__scroll-wheel" />
        </div>
        <span>{heroSettings?.scroll_text || 'Scroll to explore'}</span>
      </motion.div>
    </section>
  )
}

export default Hero
