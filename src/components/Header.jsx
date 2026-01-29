import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Mountain, ChevronDown, User, Phone, ShoppingBag } from 'lucide-react'
import { useEntries, useSingleEntry } from '../hooks/useContentstack'
import './Header.css'

// Fallback data when CMS is not configured
const defaultNavItems = [
  { 
    title: 'All Treks',
    url: '/treks',
    has_dropdown: true,
    dropdown_items: [
      { title: 'Treks by Month', url: '/treks?month=January' },
      { title: 'Treks by Difficulty', url: '/treks?difficulty=Moderate' },
      { title: 'Treks by Region', url: '/treks?region=Uttarakhand' },
      { title: 'Treks by Duration', url: '/treks?duration=5-6+Days' }
    ]
  },
  { title: 'Upcoming Treks', url: '/treks', has_dropdown: false },
  { title: 'Summer Camps 2026', url: '/treks?month=May', has_dropdown: false },
  { 
    title: 'Special Treks', 
    url: '/treks',
    has_dropdown: true,
    dropdown_items: [
      { title: 'Easy Treks', url: '/treks?difficulty=Easy' },
      { title: 'Moderate Treks', url: '/treks?difficulty=Moderate' },
      { title: 'Difficult Treks', url: '/treks?difficulty=Difficult' },
      { title: 'Winter Treks', url: '/treks?month=December' }
    ]
  },
  { title: 'Our Story', url: '/about', has_dropdown: false },
]

const defaultSiteSettings = {
  logo_main_text: 'High Altitude',
  logo_sub_text: 'Trekkers',
  contact_label: 'Contact',
  shop_label: 'Shop'
}

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()

  // Fetch navigation items from CMS
  const { data: navItems } = useEntries('navigation', defaultNavItems)
  
  // Fetch site settings from CMS
  const { data: siteSettings } = useSingleEntry('site_settings', defaultSiteSettings)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  // Map CMS data to component format
  const mappedNavItems = navItems.map(item => ({
    label: item.title || item.label,
    url: item.url || '/treks',
    hasDropdown: item.has_dropdown || item.hasDropdown || false,
    dropdownItems: item.dropdown_items?.map(d => ({
      label: d.title || d,
      url: d.url || '/treks'
    })) || item.dropdownItems || []
  }))

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        <Link to="/" className="header__logo">
          <Mountain className="header__logo-icon" />
          <span className="header__logo-text">
            <span className="header__logo-main">
              {siteSettings?.logo_main_text || 'High Altitude'}
            </span>
            <span className="header__logo-sub">
              {siteSettings?.logo_sub_text || 'Trekkers'}
            </span>
          </span>
        </Link>

        <nav className="header__nav">
          {mappedNavItems.map((item, index) => (
            <div 
              key={index} 
              className="header__nav-item"
              onMouseEnter={() => item.hasDropdown && setActiveDropdown(index)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link to={item.url} className="header__nav-link">
                {item.label}
                {item.hasDropdown && <ChevronDown className="header__nav-chevron" />}
              </Link>
              
              <AnimatePresence>
                {item.hasDropdown && activeDropdown === index && (
                  <motion.div 
                    className="header__dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.dropdownItems.map((dropItem, dropIndex) => (
                      <Link 
                        key={dropIndex} 
                        to={dropItem.url || '/treks'} 
                        className="header__dropdown-item"
                      >
                        {dropItem.label || dropItem}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="header__actions">
          <Link to="/treks" className="header__action-btn">
            <Phone size={18} />
            <span>{siteSettings?.contact_label || 'Contact'}</span>
          </Link>
          <Link to="/treks" className="header__action-btn">
            <ShoppingBag size={18} />
            <span>{siteSettings?.shop_label || 'Shop'}</span>
          </Link>
          <Link to="/treks" className="header__profile-btn">
            <User size={20} />
          </Link>
        </div>

        <button 
          className="header__mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="header__mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {mappedNavItems.map((item, index) => (
              <Link key={index} to={item.url} className="header__mobile-link">
                {item.label}
              </Link>
            ))}
            <div className="header__mobile-actions">
              <Link to="/treks" className="btn btn-primary">View All Treks</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
