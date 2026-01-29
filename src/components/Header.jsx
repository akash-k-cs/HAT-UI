import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Mountain, ChevronDown, User, Phone, ShoppingBag } from 'lucide-react'
import { useEntries, useSingleEntry } from '../hooks/useContentstack'
import './Header.css'

// Fallback data when CMS is not configured
const defaultNavItems = [
  { 
    title: 'All Treks', 
    has_dropdown: true,
    dropdown_items: [
      { title: 'Treks by Month' },
      { title: 'Treks by Difficulty' },
      { title: 'Treks by Region' },
      { title: 'Treks by Duration' }
    ]
  },
  { title: 'Upcoming Treks', has_dropdown: false },
  { title: 'Summer Camps 2026', has_dropdown: false },
  { 
    title: 'Special Treks', 
    has_dropdown: true,
    dropdown_items: [
      { title: 'Family Treks' },
      { title: 'Senior Treks' },
      { title: 'Adventure Therapy' },
      { title: 'Stargazing Treks' }
    ]
  },
  { title: 'Our Story', has_dropdown: false },
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

  // Map CMS data to component format
  const mappedNavItems = navItems.map(item => ({
    label: item.title || item.label,
    hasDropdown: item.has_dropdown || item.hasDropdown || false,
    dropdownItems: item.dropdown_items?.map(d => d.title || d) || item.dropdownItems || []
  }))

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        <a href="/" className="header__logo">
          <Mountain className="header__logo-icon" />
          <span className="header__logo-text">
            <span className="header__logo-main">
              {siteSettings?.logo_main_text || 'High Altitude'}
            </span>
            <span className="header__logo-sub">
              {siteSettings?.logo_sub_text || 'Trekkers'}
            </span>
          </span>
        </a>

        <nav className="header__nav">
          {mappedNavItems.map((item, index) => (
            <div 
              key={index} 
              className="header__nav-item"
              onMouseEnter={() => item.hasDropdown && setActiveDropdown(index)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a href="#" className="header__nav-link">
                {item.label}
                {item.hasDropdown && <ChevronDown className="header__nav-chevron" />}
              </a>
              
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
                      <a key={dropIndex} href="#" className="header__dropdown-item">
                        {dropItem}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="header__actions">
          <a href="#" className="header__action-btn">
            <Phone size={18} />
            <span>{siteSettings?.contact_label || 'Contact'}</span>
          </a>
          <a href="#" className="header__action-btn">
            <ShoppingBag size={18} />
            <span>{siteSettings?.shop_label || 'Shop'}</span>
          </a>
          <a href="#" className="header__profile-btn">
            <User size={20} />
          </a>
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
              <a key={index} href="#" className="header__mobile-link">
                {item.label}
              </a>
            ))}
            <div className="header__mobile-actions">
              <a href="#" className="btn btn-primary">View Upcoming Treks</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
