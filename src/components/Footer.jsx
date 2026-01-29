import { motion } from 'framer-motion'
import { Mountain, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Linkedin, ArrowRight, Heart } from 'lucide-react'
import { useEntries, useSingleEntry } from '../hooks/useContentstack'
import './Footer.css'

// Icon mapping for social links
const socialIconMap = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin
}

// Fallback data when CMS is not configured
const defaultQuickLinks = [
  { title: 'Treks', links: ['Upcoming Treks', 'Summer Camps 2026', 'Treks by Month', 'Treks by Difficulty', 'Treks by Region'] },
  { title: 'About Us', links: ['Our Story', 'Safety Practices', 'Sustainability', 'Careers', 'Contact Us'] },
  { title: 'Resources', links: ['Fitness Module', 'Trek FAQs', 'Gear Rental', 'Shop', 'Blog'] }
]

const defaultSocialLinks = [
  { icon: 'facebook', url: '#', label: 'Facebook' },
  { icon: 'instagram', url: '#', label: 'Instagram' },
  { icon: 'youtube', url: '#', label: 'YouTube' },
  { icon: 'linkedin', url: '#', label: 'LinkedIn' }
]

const defaultTrustedBy = [
  { name: 'IIM Bangalore' },
  { name: 'BITS Pilani' },
  { name: 'IIT Delhi' },
  { name: 'Accenture' },
  { name: 'Google' },
  { name: 'Microsoft' }
]

const defaultOffices = [
  {
    city: 'Bengaluru',
    address: '42, Mountain View Road, Koramangala, Bengaluru - 560034'
  },
  {
    city: 'Dehradun',
    address: '15, Himalayan Heights, Rajpur Road, Dehradun - 248001'
  }
]

const defaultSettings = {
  logo_main_text: 'High Altitude',
  logo_sub_text: 'Trekkers',
  description: "India's largest and most trusted trekking organisation. Transforming lives through mindful high altitude experiences since 2015.",
  phone: '+91 98765 43210',
  email: 'hello@hatrekkers.com',
  hours_weekday: 'Mon to Fri: 9:30 AM - 7:30 PM',
  hours_weekend: 'Sat & Sun: 9:30 AM - 6:30 PM',
  trusted_by_label: 'Trusted by leading institutions',
  newsletter_title: 'Get Weekly Trail Updates',
  newsletter_subtitle: 'Subscribe to our newsletter for trek updates, mountain stories, and exclusive offers.',
  newsletter_placeholder: 'Enter your email address',
  newsletter_button: 'Subscribe',
  copyright_text: '© 2026 High Altitude Trekkers. Made with',
  copyright_suffix: 'in India'
}

const defaultLegalLinks = [
  { title: 'Privacy Policy', url: '#' },
  { title: 'Terms & Conditions', url: '#' },
  { title: 'Cancellation Policy', url: '#' }
]

function Footer() {
  // Fetch footer content from CMS
  const { data: settings } = useSingleEntry('footer_settings', defaultSettings)
  const { data: quickLinks } = useEntries('footer_link_group', defaultQuickLinks, { orderBy: 'order' })
  const { data: socialLinks } = useEntries('social_link', defaultSocialLinks, { orderBy: 'order' })
  const { data: trustedBy } = useEntries('trusted_by', defaultTrustedBy, { orderBy: 'order' })
  const { data: offices } = useEntries('office', defaultOffices, { orderBy: 'order' })
  const { data: legalLinks } = useEntries('legal_link', defaultLegalLinks, { orderBy: 'order' })

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="footer__newsletter">
        <div className="container">
          <motion.div 
            className="newsletter"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="newsletter__content">
              <h3>{settings?.newsletter_title || 'Get Weekly Trail Updates'}</h3>
              <p>{settings?.newsletter_subtitle}</p>
            </div>
            <form className="newsletter__form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={settings?.newsletter_placeholder || 'Enter your email address'}
                className="newsletter__input"
              />
              <button type="submit" className="btn btn-primary">
                {settings?.newsletter_button || 'Subscribe'}
                <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            {/* Brand Column */}
            <div className="footer__brand">
              <a href="/" className="footer__logo">
                <Mountain className="footer__logo-icon" />
                <span className="footer__logo-text">
                  <span className="footer__logo-main">
                    {settings?.logo_main_text || 'High Altitude'}
                  </span>
                  <span className="footer__logo-sub">
                    {settings?.logo_sub_text || 'Trekkers'}
                  </span>
                </span>
              </a>
              <p className="footer__description">{settings?.description}</p>
              
              <div className="footer__contact">
                <a href={`tel:${settings?.phone?.replace(/\s/g, '')}`} className="footer__contact-item">
                  <Phone size={18} />
                  <span>{settings?.phone || '080 468 01269'}</span>
                </a>
                <a href={`mailto:${settings?.email}`} className="footer__contact-item">
                  <Mail size={18} />
                  <span>{settings?.email || 'info@highaltitudetrekkers.com'}</span>
                </a>
              </div>

              <div className="footer__social">
                {socialLinks.map((social) => {
                  const IconComponent = socialIconMap[social.icon] || Facebook
                  return (
                    <a 
                      key={social.label}
                      href={social.url || '#'}
                      className="footer__social-link"
                      aria-label={social.label}
                    >
                      <IconComponent size={20} />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Quick Links */}
            {quickLinks.map((section, index) => (
              <div key={index} className="footer__links">
                <h4 className="footer__links-title">{section.title}</h4>
                <ul className="footer__links-list">
                  {(section.links || []).map((link, linkIndex) => {
                    const linkText = typeof link === 'string' ? link : link.title
                    const linkUrl = typeof link === 'string' ? '#' : link.url
                    return (
                      <li key={linkIndex}>
                        <a href={linkUrl}>{linkText}</a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}

            {/* Office Locations */}
            <div className="footer__offices">
              <h4 className="footer__links-title">Our Offices</h4>
              
              {offices.map((office, index) => (
                <div key={index} className="footer__office">
                  <h5>{office.city}</h5>
                  <p>
                    <MapPin size={14} />
                    {office.address}
                  </p>
                </div>
              ))}

              <div className="footer__hours">
                <p>{settings?.hours_weekday || 'Mon to Fri: 9:30 AM - 7:30 PM'}</p>
                <p>{settings?.hours_weekend || 'Sat & Sun: 9:30 AM - 6:30 PM'}</p>
              </div>
            </div>
          </div>

          {/* Trusted By */}
          <div className="footer__trusted">
            <span className="footer__trusted-label">
              {settings?.trusted_by_label || 'Trusted by leading institutions'}
            </span>
            <div className="footer__trusted-logos">
              {trustedBy.map((item, index) => (
                <span key={index} className="footer__trusted-item">{item.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="container">
          <div className="footer__bottom-content">
            <p className="footer__copyright">
              {settings?.copyright_text || '© 2026 High Altitude Trekkers. Made with'}{' '}
              <Heart size={14} fill="#ef4444" color="#ef4444" />{' '}
              {settings?.copyright_suffix || 'in India'}
            </p>
            <div className="footer__legal">
              {legalLinks.map((link, index) => (
                <a key={index} href={link.url || '#'}>{link.title}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
