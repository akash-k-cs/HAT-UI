import { motion } from 'framer-motion'
import { Shield, Leaf, Users, Compass, Sparkles, Play, CheckCircle2 } from 'lucide-react'
import { useEntries, useSingleEntry } from '../hooks/useContentstack'
import './Features.css'

// Icon mapping for CMS data
const iconMap = {
  shield: Shield,
  leaf: Leaf,
  users: Users,
  compass: Compass,
  sparkles: Sparkles
}

// Fallback data when CMS is not configured
const defaultFeatures = [
  {
    icon: 'shield',
    title: "Our No-Compromise Safety Promise",
    description: "We are known for our pioneering safety practices in trekking. Microspikes, oximeters, and BP checks became standards thanks to us.",
    highlights: ["Expedition-grade gear", "Trained professionals", "Strict safety protocols"],
    color: "#e85d04"
  },
  {
    icon: 'leaf',
    title: "Our No-Compromise Sustainability Promise",
    description: "Our commitment to the environment is relentless. We don't just encourage responsible trekking; we insist on it with Green Trails principles.",
    highlights: ["Zero waste policy", "Eco-friendly practices", "Leave no trace"],
    color: "#22c55e"
  },
  {
    icon: 'users',
    title: "India's Largest Trekking Organisation",
    description: "More than 30,000 trekkers trek with us every year. Our outdoor learning division has participants from India's top institutions.",
    highlights: ["30,000+ annual trekkers", "Top educational partners", "Zero advertising spend"],
    color: "#3b82f6"
  },
  {
    icon: 'compass',
    title: "Pioneers of Trekking in India",
    description: "We have documented and brought out most of India's famous treks: Roopkund, Rupin Pass, Buran Ghati, Kedarkantha, Kashmir Great Lakes.",
    highlights: ["50+ documented trails", "9 new treks in 2023-24", "Everyone must trek"],
    color: "#8b5cf6"
  },
  {
    icon: 'sparkles',
    title: "Our Treks are Transformative",
    description: "We focus on designing transformative experiences. Our trek leaders conduct thought-provoking exercises that help you reflect and contemplate.",
    highlights: ["Mindful experiences", "Life-changing journeys", "Personal growth"],
    color: "#ec4899"
  }
]

const defaultAdvantages = [
  { title: "Trek Again Philosophy", description: "If you are unable to complete a trek, or if you love a trek, you can repeat it with us anytime." },
  { title: "Expert Guidance", description: "Get personalised support from our expert Experience Coordinators from registration to departure." },
  { title: "Women-Friendly Groups", description: "With around 30% of our trekkers being women, all women including solo travelers are comfortable to join." },
  { title: "Like-Minded Community", description: "Join a strong spirit of trekking with fitness, minimalism, mindfulness and deep love for nature." },
  { title: "Leave Mountains Better", description: "Our commitment to mindful trekking means actively cleaning up the mountains. You contribute positively." },
  { title: "Best Equipment in India", description: "Our decades of outdoor expertise have culminated in the industry's finest trekking gear." }
]

const defaultSettings = {
  label: 'Why Choose Us',
  title: '5 Reasons Why High Altitude Trekkers',
  advantages_title: 'The High Altitude Trekkers Advantage'
}

function Features() {
  // Fetch features from CMS
  const { data: features } = useEntries('feature', defaultFeatures, { orderBy: 'order' })
  
  // Fetch advantages from CMS
  const { data: advantages } = useEntries('advantage', defaultAdvantages, { orderBy: 'order' })
  
  // Fetch section settings from CMS
  const { data: settings } = useSingleEntry('features_section', defaultSettings)

  return (
    <section className="features section">
      <div className="container">
        <motion.div 
          className="features__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="features__label">{settings?.label || 'Why Choose Us'}</span>
          <h2 className="section-title">{settings?.title}</h2>
        </motion.div>

        <div className="features__grid">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Shield
            const highlights = Array.isArray(feature.highlights) 
              ? feature.highlights 
              : feature.highlights?.split(',').map(h => h.trim()) || []
            
            return (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div 
                  className="feature-card__icon"
                  style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                >
                  <IconComponent size={28} />
                </div>
                
                <div className="feature-card__content">
                  <h3 className="feature-card__title">{feature.title}</h3>
                  <p className="feature-card__description">{feature.description}</p>
                  
                  <ul className="feature-card__highlights">
                    {highlights.map((highlight, i) => (
                      <li key={i} className="feature-card__highlight">
                        <CheckCircle2 size={16} style={{ color: feature.color }} />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="feature-card__play">
                  <Play size={20} fill="currentColor" />
                  <span>Watch Video</span>
                </button>

                <div 
                  className="feature-card__accent"
                  style={{ backgroundColor: feature.color }}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Advantages Section */}
        <motion.div 
          className="advantages"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="advantages__title">{settings?.advantages_title}</h3>
          
          <div className="advantages__grid">
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                className="advantage-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <div className="advantage-item__check">
                  <CheckCircle2 size={24} />
                </div>
                <div className="advantage-item__content">
                  <h4 className="advantage-item__title">{advantage.title}</h4>
                  <p className="advantage-item__description">{advantage.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
