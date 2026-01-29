import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Mountain, Clock, MapPin, ArrowRight, Star } from 'lucide-react'
import { useEntries, useSingleEntry } from '../hooks/useContentstack'
import './TrekCategories.css'

// Icon mapping for CMS data
const iconMap = {
  calendar: Calendar,
  mountain: Mountain,
  clock: Clock,
  map_pin: MapPin
}

// Fallback data when CMS is not configured
const defaultCategories = [
  { id: 'month', label: 'By Month', icon: 'calendar' },
  { id: 'difficulty', label: 'By Difficulty', icon: 'mountain' },
  { id: 'duration', label: 'By Duration', icon: 'clock' },
  { id: 'region', label: 'By Region', icon: 'map_pin' }
]

const defaultCategoryData = {
  month: [
    { name: 'January', count: 12 },
    { name: 'February', count: 15 },
    { name: 'March', count: 18 },
    { name: 'April', count: 22 },
    { name: 'May', count: 25 },
    { name: 'June', count: 20 },
    { name: 'July', count: 8 },
    { name: 'August', count: 6 },
    { name: 'September', count: 14 },
    { name: 'October', count: 18 },
    { name: 'November', count: 16 },
    { name: 'December', count: 14 }
  ],
  difficulty: [
    { name: 'Easy', count: 8, color: '#22c55e' },
    { name: 'Easy - Moderate', count: 12, color: '#84cc16' },
    { name: 'Moderate', count: 15, color: '#eab308' },
    { name: 'Moderate - Difficult', count: 10, color: '#f97316' },
    { name: 'Difficult', count: 6, color: '#ef4444' }
  ],
  duration: [
    { name: '2 Days', count: 4 },
    { name: '3 Days', count: 6 },
    { name: '4 Days', count: 10 },
    { name: '5 Days', count: 12 },
    { name: '6 Days', count: 14 },
    { name: '7+ Days', count: 8 }
  ],
  region: [
    { name: 'Uttarakhand', count: 18 },
    { name: 'Himachal Pradesh', count: 15 },
    { name: 'Kashmir', count: 8 },
    { name: 'Sikkim', count: 6 },
    { name: 'Ladakh', count: 5 },
    { name: 'Nepal', count: 4 }
  ]
}

const defaultFeaturedTreks = [
  {
    id: 1,
    name: "Kedarkantha",
    image: { url: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80" },
    difficulty: "Easy - Moderate",
    duration: "6 Days",
    altitude: "12,500 ft",
    price: "₹11,850",
    rating: 4.9,
    reviews: 2450,
    region: "Uttarakhand",
    best_time: "Dec - Apr"
  },
  {
    id: 2,
    name: "Kashmir Great Lakes",
    image: { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" },
    difficulty: "Moderate - Difficult",
    duration: "7 Days",
    altitude: "13,750 ft",
    price: "₹18,950",
    rating: 4.9,
    reviews: 1820,
    region: "Kashmir",
    best_time: "Jul - Sep"
  },
  {
    id: 3,
    name: "Rupin Pass",
    image: { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
    difficulty: "Difficult",
    duration: "8 Days",
    altitude: "15,250 ft",
    price: "₹16,450",
    rating: 4.8,
    reviews: 1560,
    region: "Himachal",
    best_time: "May - Jun"
  },
  {
    id: 4,
    name: "Valley of Flowers",
    image: { url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80" },
    difficulty: "Moderate",
    duration: "6 Days",
    altitude: "14,100 ft",
    price: "₹14,850",
    rating: 4.9,
    reviews: 2100,
    region: "Uttarakhand",
    best_time: "Jul - Sep"
  }
]

const defaultSettings = {
  label: 'Explore Treks',
  title: 'Find Your Perfect Adventure',
  subtitle: 'Discover treks that match your schedule, experience level, and dream destinations',
  featured_title: 'Popular Treks This Season',
  view_all_text: 'View All Treks'
}

function TrekCategories() {
  const [activeCategory, setActiveCategory] = useState('month')

  // Fetch category tabs from CMS
  const { data: categories } = useEntries('trek_category_tab', defaultCategories, { orderBy: 'order' })
  
  // Fetch category items from CMS
  const { data: categoryData } = useSingleEntry('trek_category_data', defaultCategoryData)
  
  // Fetch featured treks from CMS
  const { data: featuredTreks } = useEntries('featured_trek', defaultFeaturedTreks, { orderBy: 'order' })
  
  // Fetch section settings from CMS
  const { data: settings } = useSingleEntry('trek_categories_section', defaultSettings)

  // Get current category items
  const currentCategoryItems = categoryData?.[activeCategory] || defaultCategoryData[activeCategory] || []

  return (
    <section className="trek-categories section">
      <div className="container">
        <motion.div 
          className="trek-categories__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="trek-categories__label">{settings?.label || 'Explore Treks'}</span>
          <h2 className="section-title">{settings?.title}</h2>
          <p className="section-subtitle">{settings?.subtitle}</p>
        </motion.div>

        {/* Category Tabs */}
        <div className="trek-categories__tabs">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Calendar
            return (
              <button
                key={cat.id}
                className={`trek-categories__tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <IconComponent size={20} />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Category Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="trek-categories__content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="category-items">
              {currentCategoryItems.map((item, index) => (
                <motion.a
                  href="#"
                  key={item.name}
                  className="category-item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  style={item.color ? { '--item-color': item.color } : {}}
                >
                  <span className="category-item__name">{item.name}</span>
                  <span className="category-item__count">{item.count} treks</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Featured Treks */}
        <motion.div 
          className="featured-treks"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="featured-treks__header">
            <h3 className="featured-treks__title">{settings?.featured_title || 'Popular Treks This Season'}</h3>
            <a href="#" className="featured-treks__link">
              {settings?.view_all_text || 'View All Treks'}
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="featured-treks__grid">
            {featuredTreks.map((trek, index) => {
              const imageUrl = trek.image?.url || trek.image
              return (
                <motion.div
                  key={trek.id || index}
                  className="trek-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="trek-card__image">
                    <img src={imageUrl} alt={trek.name} />
                    <div className="trek-card__badge">{trek.difficulty}</div>
                    <div className="trek-card__overlay">
                      <button className="btn btn-light">View Details</button>
                    </div>
                  </div>
                  
                  <div className="trek-card__content">
                    <div className="trek-card__header">
                      <h4 className="trek-card__name">{trek.name}</h4>
                      <div className="trek-card__rating">
                        <Star size={14} fill="#facc15" color="#facc15" />
                        <span>{trek.rating}</span>
                        <span className="trek-card__reviews">({trek.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="trek-card__meta">
                      <span><MapPin size={14} /> {trek.region}</span>
                      <span><Clock size={14} /> {trek.duration}</span>
                      <span><Mountain size={14} /> {trek.altitude}</span>
                    </div>
                    
                    <div className="trek-card__footer">
                      <div className="trek-card__price">
                        <span className="trek-card__price-label">Starting from</span>
                        <span className="trek-card__price-value">{trek.price}</span>
                      </div>
                      <div className="trek-card__best-time">
                        <Calendar size={14} />
                        <span>{trek.best_time || trek.bestTime}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TrekCategories
