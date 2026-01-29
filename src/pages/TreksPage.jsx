import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Filter, X, Calendar, Mountain, Clock, MapPin, 
  Star, ChevronDown, Grid, List, SlidersHorizontal
} from 'lucide-react'
import { useEntries } from '../hooks/useContentstack'
import './TreksPage.css'

// Default treks data for fallback
const defaultTreks = [
  {
    slug: 'kedarkantha',
    name: 'Kedarkantha',
    image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80',
    difficulty: 'Easy - Moderate',
    duration: '6 Days',
    altitude: '12,500 ft',
    price: 11850,
    rating: 4.9,
    reviews: 2450,
    region: 'Uttarakhand',
    best_months: ['December', 'January', 'February', 'March', 'April'],
    short_description: 'The perfect winter trek for beginners with stunning summit views.'
  },
  {
    slug: 'kashmir-great-lakes',
    name: 'Kashmir Great Lakes',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    difficulty: 'Moderate - Difficult',
    duration: '7 Days',
    altitude: '13,750 ft',
    price: 18950,
    rating: 4.9,
    reviews: 1820,
    region: 'Kashmir',
    best_months: ['July', 'August', 'September'],
    short_description: 'Journey through seven stunning alpine lakes in Kashmir.'
  },
  {
    slug: 'rupin-pass',
    name: 'Rupin Pass',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    difficulty: 'Difficult',
    duration: '8 Days',
    altitude: '15,250 ft',
    price: 16450,
    rating: 4.8,
    reviews: 1560,
    region: 'Himachal Pradesh',
    best_months: ['May', 'June', 'September', 'October'],
    short_description: 'A challenging crossover trek with dramatic landscapes.'
  },
  {
    slug: 'valley-of-flowers',
    name: 'Valley of Flowers',
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
    difficulty: 'Moderate',
    duration: '6 Days',
    altitude: '14,100 ft',
    price: 14850,
    rating: 4.9,
    reviews: 2100,
    region: 'Uttarakhand',
    best_months: ['July', 'August', 'September'],
    short_description: 'UNESCO World Heritage Site with 600+ species of flowers.'
  },
  {
    slug: 'har-ki-dun',
    name: 'Har Ki Dun',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80',
    difficulty: 'Moderate',
    duration: '7 Days',
    altitude: '11,700 ft',
    price: 13450,
    rating: 4.8,
    reviews: 1890,
    region: 'Uttarakhand',
    best_months: ['March', 'April', 'May', 'September', 'October', 'November'],
    short_description: 'Ancient valley trek with rich mythology and culture.'
  },
  {
    slug: 'brahmatal',
    name: 'Brahmatal',
    image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
    difficulty: 'Easy - Moderate',
    duration: '6 Days',
    altitude: '12,250 ft',
    price: 11850,
    rating: 4.9,
    reviews: 2100,
    region: 'Uttarakhand',
    best_months: ['December', 'January', 'February', 'March'],
    short_description: 'Winter wonderland trek with frozen lake views.'
  },
  {
    slug: 'roopkund',
    name: 'Roopkund',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    difficulty: 'Difficult',
    duration: '8 Days',
    altitude: '15,750 ft',
    price: 15950,
    rating: 4.7,
    reviews: 1450,
    region: 'Uttarakhand',
    best_months: ['May', 'June', 'September', 'October'],
    short_description: 'The mysterious skeleton lake at high altitude.'
  },
  {
    slug: 'hampta-pass',
    name: 'Hampta Pass',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    difficulty: 'Moderate',
    duration: '5 Days',
    altitude: '14,100 ft',
    price: 12450,
    rating: 4.8,
    reviews: 1780,
    region: 'Himachal Pradesh',
    best_months: ['June', 'July', 'August', 'September'],
    short_description: 'Dramatic crossover from Kullu to Lahaul Valley.'
  },
  {
    slug: 'chadar-trek',
    name: 'Chadar Trek',
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
    difficulty: 'Difficult',
    duration: '9 Days',
    altitude: '11,000 ft',
    price: 24950,
    rating: 4.9,
    reviews: 980,
    region: 'Ladakh',
    best_months: ['January', 'February'],
    short_description: 'Walk on the frozen Zanskar River in extreme winter.'
  },
  {
    slug: 'goechala',
    name: 'Goechala',
    image: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=800&q=80',
    difficulty: 'Difficult',
    duration: '10 Days',
    altitude: '16,000 ft',
    price: 19950,
    rating: 4.8,
    reviews: 1120,
    region: 'Sikkim',
    best_months: ['March', 'April', 'May', 'October', 'November'],
    short_description: 'Face-to-face with the mighty Kanchenjunga.'
  },
  {
    slug: 'dayara-bugyal',
    name: 'Dayara Bugyal',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    difficulty: 'Easy',
    duration: '5 Days',
    altitude: '11,950 ft',
    price: 9850,
    rating: 4.9,
    reviews: 2350,
    region: 'Uttarakhand',
    best_months: ['December', 'January', 'February', 'March', 'April', 'May'],
    short_description: 'Vast alpine meadows perfect for beginners.'
  },
  {
    slug: 'kuari-pass',
    name: 'Kuari Pass',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    difficulty: 'Moderate',
    duration: '6 Days',
    altitude: '12,500 ft',
    price: 12950,
    rating: 4.8,
    reviews: 1650,
    region: 'Uttarakhand',
    best_months: ['March', 'April', 'May', 'October', 'November', 'December'],
    short_description: 'Lord Curzon\'s trail with panoramic Himalayan views.'
  }
]

// Filter options
const difficultyOptions = ['Easy', 'Easy - Moderate', 'Moderate', 'Moderate - Difficult', 'Difficult']
const regionOptions = ['Uttarakhand', 'Himachal Pradesh', 'Kashmir', 'Ladakh', 'Sikkim']
const durationOptions = ['3-4 Days', '5-6 Days', '7-8 Days', '9+ Days']
const monthOptions = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function TreksPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  
  // Filter states
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || '')
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || '')
  const [selectedDuration, setSelectedDuration] = useState(searchParams.get('duration') || '')
  const [selectedMonth, setSelectedMonth] = useState(searchParams.get('month') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular')

  // Fetch treks from CMS
  const { data: cmsData } = useEntries('trek_detail', [], { orderBy: 'order' })
  
  // Transform CMS data to match expected format
  const treks = useMemo(() => {
    if (cmsData && cmsData.length > 0) {
      return cmsData.map(trek => ({
        slug: trek.slug,
        name: trek.name,
        image: trek.hero_image || trek.image_url,
        difficulty: trek.difficulty,
        duration: trek.duration,
        altitude: trek.altitude,
        price: trek.price,
        rating: trek.rating,
        reviews: trek.reviews_count || trek.reviews,
        region: trek.region,
        best_months: typeof trek.best_months === 'string' ? JSON.parse(trek.best_months) : trek.best_months || [],
        short_description: trek.short_description || trek.tagline
      }))
    }
    return defaultTreks
  }, [cmsData])

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (selectedDifficulty) params.set('difficulty', selectedDifficulty)
    if (selectedRegion) params.set('region', selectedRegion)
    if (selectedDuration) params.set('duration', selectedDuration)
    if (selectedMonth) params.set('month', selectedMonth)
    if (sortBy !== 'popular') params.set('sort', sortBy)
    setSearchParams(params, { replace: true })
  }, [searchQuery, selectedDifficulty, selectedRegion, selectedDuration, selectedMonth, sortBy, setSearchParams])

  // Filter and sort treks
  const filteredTreks = useMemo(() => {
    let result = [...treks]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(trek => 
        trek.name.toLowerCase().includes(query) ||
        trek.region.toLowerCase().includes(query) ||
        trek.short_description?.toLowerCase().includes(query)
      )
    }

    // Difficulty filter
    if (selectedDifficulty) {
      result = result.filter(trek => trek.difficulty === selectedDifficulty)
    }

    // Region filter
    if (selectedRegion) {
      result = result.filter(trek => trek.region === selectedRegion)
    }

    // Duration filter
    if (selectedDuration) {
      result = result.filter(trek => {
        const days = parseInt(trek.duration)
        if (selectedDuration === '3-4 Days') return days >= 3 && days <= 4
        if (selectedDuration === '5-6 Days') return days >= 5 && days <= 6
        if (selectedDuration === '7-8 Days') return days >= 7 && days <= 8
        if (selectedDuration === '9+ Days') return days >= 9
        return true
      })
    }

    // Month filter
    if (selectedMonth) {
      result = result.filter(trek => 
        trek.best_months && trek.best_months.includes(selectedMonth)
      )
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'duration') {
      result.sort((a, b) => parseInt(a.duration) - parseInt(b.duration))
    } else {
      // Popular - sort by reviews
      result.sort((a, b) => b.reviews - a.reviews)
    }

    return result
  }, [treks, searchQuery, selectedDifficulty, selectedRegion, selectedDuration, selectedMonth, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedDifficulty('')
    setSelectedRegion('')
    setSelectedDuration('')
    setSelectedMonth('')
    setSortBy('popular')
  }

  const activeFiltersCount = [selectedDifficulty, selectedRegion, selectedDuration, selectedMonth].filter(Boolean).length

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="treks-page">
      {/* Hero Section */}
      <section className="treks-hero">
        <div className="treks-hero__bg"></div>
        <div className="treks-hero__content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Explore All Treks
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Find your perfect Himalayan adventure from our collection of {treks.length}+ handpicked treks
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            className="treks-search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Search size={20} />
            <input
              type="text"
              placeholder="Search treks by name, region, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <X size={18} />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      <div className="treks-container">
        {/* Filter Bar */}
        <div className="treks-toolbar">
          <div className="treks-toolbar__left">
            <button 
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={18} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="filter-count">{activeFiltersCount}</span>
              )}
            </button>

            {/* Quick Filters */}
            <div className="quick-filters">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="quick-filter"
              >
                <option value="">All Months</option>
                {monthOptions.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>

              <select 
                value={selectedDifficulty} 
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="quick-filter"
              >
                <option value="">All Difficulty</option>
                {difficultyOptions.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>

              <select 
                value={selectedRegion} 
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="quick-filter"
              >
                <option value="">All Regions</option>
                {regionOptions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="treks-toolbar__right">
            <span className="results-count">{filteredTreks.length} treks found</span>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Duration: Short to Long</option>
            </select>

            <div className="view-toggle">
              <button 
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button 
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              className="filters-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Difficulty Level</label>
                  <div className="filter-options">
                    {difficultyOptions.map(diff => (
                      <button
                        key={diff}
                        className={`filter-chip ${selectedDifficulty === diff ? 'active' : ''}`}
                        onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? '' : diff)}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label>Region</label>
                  <div className="filter-options">
                    {regionOptions.map(region => (
                      <button
                        key={region}
                        className={`filter-chip ${selectedRegion === region ? 'active' : ''}`}
                        onClick={() => setSelectedRegion(selectedRegion === region ? '' : region)}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label>Duration</label>
                  <div className="filter-options">
                    {durationOptions.map(dur => (
                      <button
                        key={dur}
                        className={`filter-chip ${selectedDuration === dur ? 'active' : ''}`}
                        onClick={() => setSelectedDuration(selectedDuration === dur ? '' : dur)}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label>Best Month</label>
                  <div className="filter-options months">
                    {monthOptions.map(month => (
                      <button
                        key={month}
                        className={`filter-chip ${selectedMonth === month ? 'active' : ''}`}
                        onClick={() => setSelectedMonth(selectedMonth === month ? '' : month)}
                      >
                        {month.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <button className="clear-filters" onClick={clearFilters}>
                  <X size={16} />
                  Clear All Filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Tags */}
        {activeFiltersCount > 0 && (
          <div className="active-filters">
            {selectedDifficulty && (
              <span className="filter-tag">
                {selectedDifficulty}
                <button onClick={() => setSelectedDifficulty('')}><X size={14} /></button>
              </span>
            )}
            {selectedRegion && (
              <span className="filter-tag">
                {selectedRegion}
                <button onClick={() => setSelectedRegion('')}><X size={14} /></button>
              </span>
            )}
            {selectedDuration && (
              <span className="filter-tag">
                {selectedDuration}
                <button onClick={() => setSelectedDuration('')}><X size={14} /></button>
              </span>
            )}
            {selectedMonth && (
              <span className="filter-tag">
                {selectedMonth}
                <button onClick={() => setSelectedMonth('')}><X size={14} /></button>
              </span>
            )}
          </div>
        )}

        {/* Trek Cards Grid */}
        <div className={`treks-grid ${viewMode}`}>
          <AnimatePresence>
            {filteredTreks.map((trek, index) => (
              <motion.div
                key={trek.slug}
                className="trek-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <Link to={`/trek/${trek.slug}`} className="trek-card__link">
                  <div className="trek-card__image">
                    <img src={trek.image} alt={trek.name} loading="lazy" />
                    <div className="trek-card__badge">{trek.difficulty}</div>
                    <div className="trek-card__overlay">
                      <span>View Details</span>
                    </div>
                  </div>
                  
                  <div className="trek-card__content">
                    <div className="trek-card__header">
                      <h3 className="trek-card__name">{trek.name}</h3>
                      <div className="trek-card__rating">
                        <Star size={14} fill="#facc15" color="#facc15" />
                        <span>{trek.rating}</span>
                        <span className="reviews">({trek.reviews?.toLocaleString()})</span>
                      </div>
                    </div>

                    <p className="trek-card__description">{trek.short_description}</p>
                    
                    <div className="trek-card__meta">
                      <span><MapPin size={14} /> {trek.region}</span>
                      <span><Clock size={14} /> {trek.duration}</span>
                      <span><Mountain size={14} /> {trek.altitude}</span>
                    </div>
                    
                    <div className="trek-card__footer">
                      <div className="trek-card__price">
                        <span className="label">Starting from</span>
                        <span className="value">₹{trek.price?.toLocaleString()}</span>
                      </div>
                      <div className="trek-card__months">
                        <Calendar size={14} />
                        <span>{trek.best_months?.slice(0, 3).map(m => m.substring(0, 3)).join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredTreks.length === 0 && (
          <div className="no-results">
            <Mountain size={48} />
            <h3>No treks found</h3>
            <p>Try adjusting your filters or search query</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TreksPage

