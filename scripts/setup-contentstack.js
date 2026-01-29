#!/usr/bin/env node

/**
 * Contentstack Setup Script
 * 
 * This script creates all content types and populates them with initial content
 * from the default data in the React components.
 * 
 * Usage:
 *   node scripts/setup-contentstack.js
 * 
 * Required environment variables:
 *   CONTENTSTACK_API_KEY - Your stack API key
 *   CONTENTSTACK_MANAGEMENT_TOKEN - Management token (not delivery token)
 *   CONTENTSTACK_ENVIRONMENT - Environment name (e.g., 'production')
 *   CONTENTSTACK_REGION - Region ('us' or 'eu')
 */

import dotenv from 'dotenv'
import https from 'https'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') })

// Configuration
const config = {
  apiKey: process.env.CONTENTSTACK_API_KEY || '',
  managementToken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN || '',
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'production',
  region: process.env.CONTENTSTACK_REGION || 'us'
}

// API Host (note: .io not .com)
const API_HOST = config.region === 'eu' 
  ? 'eu-api.contentstack.io'
  : 'api.contentstack.io'

// Validate configuration
if (!config.apiKey || !config.managementToken) {
  console.error('❌ Error: Missing required environment variables.')
  console.error('')
  console.error('Please create a .env file with:')
  console.error('  CONTENTSTACK_API_KEY=your_api_key')
  console.error('  CONTENTSTACK_MANAGEMENT_TOKEN=your_management_token')
  console.error('  CONTENTSTACK_ENVIRONMENT=production')
  console.error('  CONTENTSTACK_REGION=us')
  console.error('')
  console.error('Get your Management Token from:')
  console.error('  Contentstack Dashboard > Settings > Tokens > Management Tokens')
  process.exit(1)
}

// ============================================================================
// API HELPER FUNCTIONS
// ============================================================================

function apiRequest(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null
    
    const options = {
      hostname: API_HOST,
      port: 443,
      path: `/v3${endpoint}`,
      method: method,
      headers: {
        'api_key': config.apiKey,
        'authorization': config.managementToken,
        'Content-Type': 'application/json'
      }
    }

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData)
    }

    const req = https.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed)
          } else {
            const error = new Error(parsed.error_message || parsed.message || 'API request failed')
            error.status = res.statusCode
            error.code = parsed.error_code
            error.data = parsed
            reject(error)
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data.substring(0, 200)}`))
        }
      })
    })

    req.on('error', (e) => {
      reject(new Error(`Request failed: ${e.message}`))
    })

    req.setTimeout(30000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    if (postData) {
      req.write(postData)
    }
    
    req.end()
  })
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ============================================================================
// CONTENT TYPE DEFINITIONS
// ============================================================================

const contentTypes = [
  {
    content_type: {
      title: 'Site Settings',
      uid: 'site_settings',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Logo Main Text', uid: 'logo_main_text', data_type: 'text', mandatory: true },
        { display_name: 'Logo Sub Text', uid: 'logo_sub_text', data_type: 'text', mandatory: true },
        { display_name: 'Contact Label', uid: 'contact_label', data_type: 'text' },
        { display_name: 'Shop Label', uid: 'shop_label', data_type: 'text' }
      ],
      options: { is_page: false, singleton: true }
    }
  },
  {
    content_type: {
      title: 'Navigation',
      uid: 'navigation',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'URL', uid: 'url', data_type: 'text' },
        { display_name: 'Order', uid: 'order', data_type: 'number', mandatory: true },
        { display_name: 'Has Dropdown', uid: 'has_dropdown', data_type: 'boolean' },
        {
          display_name: 'Dropdown Items',
          uid: 'dropdown_items',
          data_type: 'group',
          multiple: true,
          schema: [
            { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true },
            { display_name: 'URL', uid: 'url', data_type: 'text' }
          ]
        }
      ],
      options: { is_page: false, singleton: false }
    }
  },
  {
    content_type: {
      title: 'Hero Slide',
      uid: 'hero_slide',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Subtitle', uid: 'subtitle', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Stat Text', uid: 'stat_text', data_type: 'text' },
        { display_name: 'Image URL', uid: 'image_url', data_type: 'text', field_metadata: { description: 'URL to the hero image' } },
        { display_name: 'Order', uid: 'order', data_type: 'number', mandatory: true }
      ],
      options: { is_page: false, singleton: false }
    }
  },
  {
    content_type: {
      title: 'Hero Stat',
      uid: 'hero_stat',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Icon', uid: 'icon', data_type: 'text', mandatory: true },
        { display_name: 'Value', uid: 'value', data_type: 'text', mandatory: true },
        { display_name: 'Label', uid: 'label', data_type: 'text', mandatory: true },
        { display_name: 'Order', uid: 'order', data_type: 'number', mandatory: true }
      ],
      options: { is_page: false, singleton: false }
    }
  },
  {
    content_type: {
      title: 'Hero Settings',
      uid: 'hero_settings',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Badge Text', uid: 'badge_text', data_type: 'text' },
        { display_name: 'CTA Primary Text', uid: 'cta_primary_text', data_type: 'text' },
        { display_name: 'CTA Secondary Text', uid: 'cta_secondary_text', data_type: 'text' },
        { display_name: 'Scroll Text', uid: 'scroll_text', data_type: 'text' }
      ],
      options: { is_page: false, singleton: true }
    }
  },
  {
    content_type: {
      title: 'Testimonial',
      uid: 'testimonial',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Name', uid: 'name', data_type: 'text', mandatory: true },
        { display_name: 'Role', uid: 'role', data_type: 'text', mandatory: true },
        { display_name: 'Location', uid: 'location', data_type: 'text' },
        { display_name: 'Image URL', uid: 'image_url', data_type: 'text' },
        { display_name: 'Quote', uid: 'quote', data_type: 'text', field_metadata: { multiline: true }, mandatory: true },
        { display_name: 'Highlight', uid: 'highlight', data_type: 'text', mandatory: true },
        { display_name: 'Rating', uid: 'rating', data_type: 'number', mandatory: true },
        { display_name: 'Order', uid: 'order', data_type: 'number', mandatory: true }
      ],
      options: { is_page: false, singleton: false }
    }
  },
  {
    content_type: {
      title: 'Testimonials Section',
      uid: 'testimonials_section',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Label', uid: 'label', data_type: 'text' },
        { display_name: 'Subtitle', uid: 'subtitle', data_type: 'text', field_metadata: { multiline: true } }
      ],
      options: { is_page: false, singleton: true }
    }
  },
  {
    content_type: {
      title: 'Feature',
      uid: 'feature',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Description', uid: 'description', data_type: 'text', field_metadata: { multiline: true }, mandatory: true },
        { display_name: 'Icon', uid: 'icon', data_type: 'text', mandatory: true },
        { display_name: 'Color', uid: 'color', data_type: 'text', mandatory: true },
        { display_name: 'Highlights', uid: 'highlights', data_type: 'text', field_metadata: { description: 'Comma-separated list' } },
        { display_name: 'Order', uid: 'order', data_type: 'number', mandatory: true }
      ],
      options: { is_page: false, singleton: false }
    }
  },
  {
    content_type: {
      title: 'Advantage',
      uid: 'advantage',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Description', uid: 'description', data_type: 'text', field_metadata: { multiline: true }, mandatory: true },
        { display_name: 'Order', uid: 'order', data_type: 'number', mandatory: true }
      ],
      options: { is_page: false, singleton: false }
    }
  },
  {
    content_type: {
      title: 'Features Section',
      uid: 'features_section',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Label', uid: 'label', data_type: 'text' },
        { display_name: 'Advantages Title', uid: 'advantages_title', data_type: 'text' }
      ],
      options: { is_page: false, singleton: true }
    }
  },
  {
    content_type: {
      title: 'Trek Category Tab',
      uid: 'trek_category_tab',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Tab ID', uid: 'tab_id', data_type: 'text', mandatory: true },
        { display_name: 'Label', uid: 'label', data_type: 'text', mandatory: true },
        { display_name: 'Icon Name', uid: 'icon_name', data_type: 'text', mandatory: true },
        { display_name: 'Sort Order', uid: 'sort_order', data_type: 'number', mandatory: true }
      ],
      options: { is_page: false, singleton: false }
    }
  },
  {
    content_type: {
      title: 'Trek Filter Data',
      uid: 'trek_filter_data',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'By Month (JSON)', uid: 'by_month', data_type: 'text', field_metadata: { multiline: true, description: 'JSON array of month data' } },
        { display_name: 'By Difficulty (JSON)', uid: 'by_difficulty', data_type: 'text', field_metadata: { multiline: true, description: 'JSON array of difficulty data' } },
        { display_name: 'By Duration (JSON)', uid: 'by_duration', data_type: 'text', field_metadata: { multiline: true, description: 'JSON array of duration data' } },
        { display_name: 'By Region (JSON)', uid: 'by_region', data_type: 'text', field_metadata: { multiline: true, description: 'JSON array of region data' } }
      ],
      options: { is_page: false, singleton: true }
    }
  },
  {
    content_type: {
      title: 'Featured Trek',
      uid: 'featured_trek',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Name', uid: 'name', data_type: 'text', mandatory: true },
        { display_name: 'Image URL', uid: 'image_url', data_type: 'text' },
        { display_name: 'Difficulty', uid: 'difficulty', data_type: 'text', mandatory: true },
        { display_name: 'Duration', uid: 'duration', data_type: 'text', mandatory: true },
        { display_name: 'Altitude', uid: 'altitude', data_type: 'text', mandatory: true },
        { display_name: 'Price', uid: 'price', data_type: 'text', mandatory: true },
        { display_name: 'Rating', uid: 'rating', data_type: 'number', mandatory: true },
        { display_name: 'Reviews', uid: 'reviews', data_type: 'number' },
        { display_name: 'Region', uid: 'region', data_type: 'text', mandatory: true },
        { display_name: 'Best Time', uid: 'best_time', data_type: 'text' },
        { display_name: 'Order', uid: 'order', data_type: 'number', mandatory: true }
      ],
      options: { is_page: false, singleton: false }
    }
  },
  {
    content_type: {
      title: 'Trek Categories Section',
      uid: 'trek_categories_section',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Label', uid: 'label', data_type: 'text' },
        { display_name: 'Subtitle', uid: 'subtitle', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Featured Title', uid: 'featured_title', data_type: 'text' },
        { display_name: 'View All Text', uid: 'view_all_text', data_type: 'text' }
      ],
      options: { is_page: false, singleton: true }
    }
  },
  {
    content_type: {
      title: 'FAQ',
      uid: 'faq',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Question', uid: 'question', data_type: 'text', mandatory: true },
        { display_name: 'Answer', uid: 'answer', data_type: 'text', field_metadata: { multiline: true }, mandatory: true },
        { display_name: 'Order', uid: 'order', data_type: 'number', mandatory: true }
      ],
      options: { is_page: false, singleton: false }
    }
  },
  {
    content_type: {
      title: 'FAQ Section',
      uid: 'faq_section',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Label', uid: 'label', data_type: 'text' },
        { display_name: 'Subtitle', uid: 'subtitle', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Contact Title', uid: 'contact_title', data_type: 'text' },
        { display_name: 'Contact Description', uid: 'contact_description', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Contact CTA Primary', uid: 'contact_cta_primary', data_type: 'text' },
        { display_name: 'Contact CTA Secondary', uid: 'contact_cta_secondary', data_type: 'text' },
        { display_name: 'Phone Number', uid: 'phone_number', data_type: 'text' },
        { display_name: 'Hours Weekday', uid: 'hours_weekday', data_type: 'text' },
        { display_name: 'Hours Weekend', uid: 'hours_weekend', data_type: 'text' }
      ],
      options: { is_page: false, singleton: true }
    }
  },
  {
    content_type: {
      title: 'Footer Settings',
      uid: 'footer_settings',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Logo Main Text', uid: 'logo_main_text', data_type: 'text' },
        { display_name: 'Logo Sub Text', uid: 'logo_sub_text', data_type: 'text' },
        { display_name: 'Description', uid: 'description', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Phone', uid: 'phone', data_type: 'text' },
        { display_name: 'Email', uid: 'email', data_type: 'text' },
        { display_name: 'Hours Weekday', uid: 'hours_weekday', data_type: 'text' },
        { display_name: 'Hours Weekend', uid: 'hours_weekend', data_type: 'text' },
        { display_name: 'Trusted By Label', uid: 'trusted_by_label', data_type: 'text' },
        { display_name: 'Newsletter Title', uid: 'newsletter_title', data_type: 'text' },
        { display_name: 'Newsletter Subtitle', uid: 'newsletter_subtitle', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Newsletter Placeholder', uid: 'newsletter_placeholder', data_type: 'text' },
        { display_name: 'Newsletter Button', uid: 'newsletter_button', data_type: 'text' },
        { display_name: 'Copyright Text', uid: 'copyright_text', data_type: 'text' },
        { display_name: 'Copyright Suffix', uid: 'copyright_suffix', data_type: 'text' }
      ],
      options: { is_page: false, singleton: true }
    }
  },
  {
    content_type: {
      title: 'Footer Link Group',
      uid: 'footer_link_group',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        {
          display_name: 'Links',
          uid: 'links',
          data_type: 'group',
          multiple: true,
          schema: [
            { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true },
            { display_name: 'URL', uid: 'url', data_type: 'text' }
          ]
        },
        { display_name: 'Order', uid: 'order', data_type: 'number', mandatory: true }
      ],
      options: { is_page: false, singleton: false }
    }
  },
  {
    content_type: {
      title: 'Social Link',
      uid: 'social_link',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Icon', uid: 'icon', data_type: 'text', mandatory: true },
        { display_name: 'Label', uid: 'label', data_type: 'text', mandatory: true },
        { display_name: 'URL', uid: 'url', data_type: 'text', mandatory: true },
        { display_name: 'Order', uid: 'order', data_type: 'number', mandatory: true }
      ],
      options: { is_page: false, singleton: false }
    }
  },
  {
    content_type: {
      title: 'Office',
      uid: 'office',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'City', uid: 'city', data_type: 'text', mandatory: true },
        { display_name: 'Address', uid: 'address', data_type: 'text', field_metadata: { multiline: true }, mandatory: true },
        { display_name: 'Order', uid: 'order', data_type: 'number', mandatory: true }
      ],
      options: { is_page: false, singleton: false }
    }
  },
  {
    content_type: {
      title: 'Trusted By',
      uid: 'trusted_by',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Name', uid: 'name', data_type: 'text', mandatory: true },
        { display_name: 'Order', uid: 'order', data_type: 'number', mandatory: true }
      ],
      options: { is_page: false, singleton: false }
    }
  },
  {
    content_type: {
      title: 'Legal Link',
      uid: 'legal_link',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'URL', uid: 'url', data_type: 'text', mandatory: true },
        { display_name: 'Order', uid: 'order', data_type: 'number', mandatory: true }
      ],
      options: { is_page: false, singleton: false }
    }
  }
]

// ============================================================================
// DEFAULT CONTENT DATA
// ============================================================================

const defaultContent = {
  site_settings: {
    title: 'Site Settings',
    logo_main_text: 'High Altitude',
    logo_sub_text: 'Trekkers',
    contact_label: 'Contact',
    shop_label: 'Shop'
  },

  navigation: [
    {
      title: 'All Treks',
      url: '/treks',
      order: 1,
      has_dropdown: true,
      dropdown_items: [
        { title: 'Treks by Month', url: '/treks/by-month' },
        { title: 'Treks by Difficulty', url: '/treks/by-difficulty' },
        { title: 'Treks by Region', url: '/treks/by-region' },
        { title: 'Treks by Duration', url: '/treks/by-duration' }
      ]
    },
    { title: 'Upcoming Treks', url: '/upcoming', order: 2, has_dropdown: false },
    { title: 'Summer Camps 2026', url: '/summer-camps', order: 3, has_dropdown: false },
    {
      title: 'Special Treks',
      url: '/special',
      order: 4,
      has_dropdown: true,
      dropdown_items: [
        { title: 'Family Treks', url: '/special/family' },
        { title: 'Senior Treks', url: '/special/senior' },
        { title: 'Adventure Therapy', url: '/special/therapy' },
        { title: 'Stargazing Treks', url: '/special/stargazing' }
      ]
    },
    { title: 'Our Story', url: '/about', order: 5, has_dropdown: false }
  ],

  hero_slide: [
    {
      title: 'Meet the Organisation That Changed Trekking in India',
      subtitle: "The treks you hear about today — Kedarkantha, Rupin Pass, Buran Ghati — were once little-known trails. We documented and brought them out, changing the way India treks.",
      stat_text: "India's largest trekking organisation",
      image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
      order: 1
    },
    {
      title: 'What If Your Next Trek Changed Everything?',
      subtitle: 'Join us on a mindfully designed trek experience that connects you to yourself. The person before and after the trek are rarely the same.',
      stat_text: '13,000+ Google reviews with an average of 4.9',
      image_url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1920&q=80',
      order: 2
    },
    {
      title: 'This Summer, Let The Mountains Shape Your Child',
      subtitle: 'Send them on a Trekking Summer Camp where children build confidence, independence, and resilience through a 9-day Himalayan programme.',
      stat_text: '1000+ parents have sent their children on summer camp with us',
      image_url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80',
      order: 3
    },
    {
      title: "Trek with India's Safest Trekking Organisation",
      subtitle: 'Behind every trek lies a system built on expertly trained professionals, expedition-grade gear, and strict safety protocols tested over years.',
      stat_text: '35,000+ trust our safety standards every year',
      image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
      order: 4
    }
  ],

  hero_stat: [
    { title: 'Trekkers Stat', icon: 'users', value: '35,000+', label: 'Trekkers Annually', order: 1 },
    { title: 'Rating Stat', icon: 'star', value: '4.9', label: 'Google Rating', order: 2 },
    { title: 'Experience Stat', icon: 'shield', value: '17+', label: 'Years Experience', order: 3 },
    { title: 'Routes Stat', icon: 'compass', value: '50+', label: 'Trek Routes', order: 4 }
  ],

  hero_settings: {
    title: 'Hero Settings',
    badge_text: 'Discover the Himalayas',
    cta_primary_text: 'View Upcoming Treks',
    cta_secondary_text: 'Watch Our Story',
    scroll_text: 'Scroll to explore'
  },

  testimonial: [
    {
      title: 'Arjun Mehta Testimonial',
      name: 'Arjun Mehta',
      role: 'Software Engineer',
      location: 'Mumbai',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      quote: "This trek changed my perspective on life. The way the team organized everything was flawless. From the moment we started to the summit, every detail was taken care of. I came back a different person.",
      highlight: 'The values helped transform my life',
      rating: 5,
      order: 1
    },
    {
      title: 'Priya Sharma Testimonial',
      name: 'Priya Sharma',
      role: 'Marketing Manager',
      location: 'Delhi',
      image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      quote: 'They taught me everything from holding trekpoles correctly to managing my energy on uphill climbs. The guides were patient and encouraging. I discovered a completely new version of myself.',
      highlight: 'A trek that transforms you completely',
      rating: 5,
      order: 2
    },
    {
      title: 'Vikram Desai Testimonial',
      name: 'Vikram Desai',
      role: 'Startup Founder',
      location: 'Pune',
      image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
      quote: "I took my entire team of 12 on this trek as a team-building exercise. The experience brought us closer than any corporate offsite ever could. We bonded, discovered each other, and grew together.",
      highlight: 'Perfect for team bonding experiences',
      rating: 5,
      order: 3
    },
    {
      title: 'Ananya Krishnan Testimonial',
      name: 'Ananya Krishnan',
      role: 'UX Designer',
      location: 'Chennai',
      image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
      quote: "The treks are thoughtfully designed to give you time for introspection. At the summit, they handed us postcards to write to our future selves. Such beautiful touches made this unforgettable.",
      highlight: 'Each trek is truly life-changing',
      rating: 5,
      order: 4
    },
    {
      title: 'Rahul Nair Testimonial',
      name: 'Rahul Nair',
      role: 'Financial Analyst',
      location: 'Bangalore',
      image_url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80',
      quote: 'Their commitment to sustainability impressed me deeply. The zero waste policy was followed religiously, and by the end of the trek, every trekker in our group had adopted these values.',
      highlight: 'Sustainability is in their DNA',
      rating: 5,
      order: 5
    },
    {
      title: 'Kavitha Reddy Testimonial',
      name: 'Kavitha Reddy',
      role: 'Product Manager',
      location: 'Hyderabad',
      image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      quote: "This wasn't just an adventure; it was a holistic journey of self-discovery. The organization goes beyond being a business - they're building a community of mindful trekkers.",
      highlight: 'Carefully curated and enriching',
      rating: 5,
      order: 6
    }
  ],

  testimonials_section: {
    title: 'Testimonials Section',
    label: 'Testimonials',
    subtitle: 'Stories from thousands of trekkers whose lives were transformed in the mountains'
  },

  feature: [
    {
      title: 'Our No-Compromise Safety Promise',
      description: 'We are known for our pioneering safety practices in trekking. Microspikes, oximeters, and BP checks became standards thanks to us.',
      icon: 'shield',
      color: '#e85d04',
      highlights: 'Expedition-grade gear, Trained professionals, Strict safety protocols',
      order: 1
    },
    {
      title: 'Our No-Compromise Sustainability Promise',
      description: "Our commitment to the environment is relentless. We don't just encourage responsible trekking; we insist on it with Green Trails principles.",
      icon: 'leaf',
      color: '#22c55e',
      highlights: 'Zero waste policy, Eco-friendly practices, Leave no trace',
      order: 2
    },
    {
      title: "India's Largest Trekking Organisation",
      description: "More than 30,000 trekkers trek with us every year. Our outdoor learning division has participants from India's top institutions.",
      icon: 'users',
      color: '#3b82f6',
      highlights: '30,000+ annual trekkers, Top educational partners, Zero advertising spend',
      order: 3
    },
    {
      title: 'Pioneers of Trekking in India',
      description: "We have documented and brought out most of India's famous treks: Roopkund, Rupin Pass, Buran Ghati, Kedarkantha, Kashmir Great Lakes.",
      icon: 'compass',
      color: '#8b5cf6',
      highlights: '50+ documented trails, 9 new treks in 2023-24, Everyone must trek',
      order: 4
    },
    {
      title: 'Our Treks are Transformative',
      description: 'We focus on designing transformative experiences. Our trek leaders conduct thought-provoking exercises that help you reflect and contemplate.',
      icon: 'sparkles',
      color: '#ec4899',
      highlights: 'Mindful experiences, Life-changing journeys, Personal growth',
      order: 5
    }
  ],

  advantage: [
    { title: 'Trek Again Philosophy', description: 'If you are unable to complete a trek, or if you love a trek, you can repeat it with us anytime.', order: 1 },
    { title: 'Expert Guidance', description: 'Get personalised support from our expert Experience Coordinators from registration to departure.', order: 2 },
    { title: 'Women-Friendly Groups', description: 'With around 30% of our trekkers being women, all women including solo travelers are comfortable to join.', order: 3 },
    { title: 'Like-Minded Community', description: 'Join a strong spirit of trekking with fitness, minimalism, mindfulness and deep love for nature.', order: 4 },
    { title: 'Leave Mountains Better', description: 'Our commitment to mindful trekking means actively cleaning up the mountains. You contribute positively.', order: 5 },
    { title: 'Best Equipment in India', description: "Our decades of outdoor expertise have culminated in the industry's finest trekking gear.", order: 6 }
  ],

  features_section: {
    title: 'Features Section',
    label: 'Why Choose Us',
    advantages_title: 'The High Altitude Trekkers Advantage'
  },

  trek_category_tab: [
    { title: 'By Month Tab', tab_id: 'month', label: 'By Month', icon_name: 'calendar', sort_order: 1 },
    { title: 'By Difficulty Tab', tab_id: 'difficulty', label: 'By Difficulty', icon_name: 'mountain', sort_order: 2 },
    { title: 'By Duration Tab', tab_id: 'duration', label: 'By Duration', icon_name: 'clock', sort_order: 3 },
    { title: 'By Region Tab', tab_id: 'region', label: 'By Region', icon_name: 'map_pin', sort_order: 4 }
  ],

  trek_filter_data: {
    title: 'Trek Filter Data',
    by_month: JSON.stringify([
      { name: 'January', count: 12 }, { name: 'February', count: 15 }, { name: 'March', count: 18 },
      { name: 'April', count: 22 }, { name: 'May', count: 25 }, { name: 'June', count: 20 },
      { name: 'July', count: 8 }, { name: 'August', count: 6 }, { name: 'September', count: 14 },
      { name: 'October', count: 18 }, { name: 'November', count: 16 }, { name: 'December', count: 14 }
    ]),
    by_difficulty: JSON.stringify([
      { name: 'Easy', count: 8, color: '#22c55e' },
      { name: 'Easy - Moderate', count: 12, color: '#84cc16' },
      { name: 'Moderate', count: 15, color: '#eab308' },
      { name: 'Moderate - Difficult', count: 10, color: '#f97316' },
      { name: 'Difficult', count: 6, color: '#ef4444' }
    ]),
    by_duration: JSON.stringify([
      { name: '2 Days', count: 4 }, { name: '3 Days', count: 6 }, { name: '4 Days', count: 10 },
      { name: '5 Days', count: 12 }, { name: '6 Days', count: 14 }, { name: '7+ Days', count: 8 }
    ]),
    by_region: JSON.stringify([
      { name: 'Uttarakhand', count: 18 }, { name: 'Himachal Pradesh', count: 15 },
      { name: 'Kashmir', count: 8 }, { name: 'Sikkim', count: 6 },
      { name: 'Ladakh', count: 5 }, { name: 'Nepal', count: 4 }
    ])
  },

  featured_trek: [
    {
      title: 'Kedarkantha Trek',
      name: 'Kedarkantha',
      image_url: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80',
      difficulty: 'Easy - Moderate',
      duration: '6 Days',
      altitude: '12,500 ft',
      price: '₹11,850',
      rating: 4.9,
      reviews: 2450,
      region: 'Uttarakhand',
      best_time: 'Dec - Apr',
      order: 1
    },
    {
      title: 'Kashmir Great Lakes Trek',
      name: 'Kashmir Great Lakes',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      difficulty: 'Moderate - Difficult',
      duration: '7 Days',
      altitude: '13,750 ft',
      price: '₹18,950',
      rating: 4.9,
      reviews: 1820,
      region: 'Kashmir',
      best_time: 'Jul - Sep',
      order: 2
    },
    {
      title: 'Rupin Pass Trek',
      name: 'Rupin Pass',
      image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      difficulty: 'Difficult',
      duration: '8 Days',
      altitude: '15,250 ft',
      price: '₹16,450',
      rating: 4.8,
      reviews: 1560,
      region: 'Himachal',
      best_time: 'May - Jun',
      order: 3
    },
    {
      title: 'Valley of Flowers Trek',
      name: 'Valley of Flowers',
      image_url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
      difficulty: 'Moderate',
      duration: '6 Days',
      altitude: '14,100 ft',
      price: '₹14,850',
      rating: 4.9,
      reviews: 2100,
      region: 'Uttarakhand',
      best_time: 'Jul - Sep',
      order: 4
    }
  ],

  trek_categories_section: {
    title: 'Trek Categories Section',
    label: 'Explore Treks',
    subtitle: 'Discover treks that match your schedule, experience level, and dream destinations',
    featured_title: 'Popular Treks This Season',
    view_all_text: 'View All Treks'
  },

  faq: [
    {
      title: 'Best Time FAQ',
      question: 'What is the best time to do a Himalayan trek?',
      answer: 'The best time depends on the trek you choose. Spring (March-May) and Autumn (September-November) are generally ideal for most treks. Winter treks like Kedarkantha are best from December to March. Monsoon (July-September) is perfect for treks like Valley of Flowers and Kashmir Great Lakes.',
      order: 1
    },
    {
      title: 'Beginner FAQ',
      question: "I'm a beginner. Which trek should I start with?",
      answer: 'For beginners, we recommend starting with easy to easy-moderate treks like Kedarkantha, Brahmatal, or Dayara Bugyal. These treks have well-defined trails, moderate altitudes, and shorter durations - perfect for building your trekking confidence.',
      order: 2
    },
    {
      title: 'Fitness FAQ',
      question: 'What fitness level is required for your treks?',
      answer: 'Basic fitness is essential for all treks. You should be able to jog 5 km in 30 minutes as a minimum. Start preparing at least 6-8 weeks before your trek with cardio, strength training, and stair climbing. Our fitness module provides detailed guidance for trek-specific preparation.',
      order: 3
    },
    {
      title: 'Solo Trek FAQ',
      question: 'Can I trek solo or should I join a group?',
      answer: 'All our treks are conducted in groups (usually 15-25 trekkers), even if you register alone. This ensures safety and enriches the experience. Solo trekkers often find the group experience transformative as they meet like-minded people from diverse backgrounds.',
      order: 4
    },
    {
      title: 'Equipment FAQ',
      question: 'What equipment do I need to bring?',
      answer: "We provide all camping gear including tents, sleeping bags, and mattresses. You need to bring personal items like trekking shoes, warm layers, rain gear, and personal medications. A detailed gear list is shared after registration, and you can rent most items from our gear shop.",
      order: 5
    },
    {
      title: 'Toilets FAQ',
      question: 'What are the toilets like on the trek?',
      answer: 'We have bio-toilets designed for high altitudes - deep pits with sturdy tent covers for privacy. Sawdust is used after each use to keep them odor-free and aid decomposition. Most trekkers find them surprisingly comfortable and environmentally conscious.',
      order: 6
    },
    {
      title: 'Health FAQ',
      question: 'I have health issues like BP, asthma, or diabetes. Can I trek?',
      answer: 'It depends on the severity of your condition. Please consult your doctor first and then speak to our team. Many trekkers with controlled conditions successfully complete our treks. Carry your medications and disclose your health status during the safety check-in on Day 1.',
      order: 7
    },
    {
      title: 'Cancellation FAQ',
      question: 'What is your cancellation and refund policy?',
      answer: 'Cancellations made 30+ days before the trek receive 95% refund. 15-30 days before: 75% refund. 7-14 days: 50% refund. Less than 7 days: No refund. We also offer the option to transfer your booking to another date or person with minimal charges.',
      order: 8
    }
  ],

  faq_section: {
    title: 'FAQ Section',
    label: 'FAQs',
    subtitle: 'Everything you need to know before embarking on your Himalayan adventure',
    contact_title: 'Still have questions?',
    contact_description: 'Our team of experienced coordinators is here to help you plan your perfect trek.',
    contact_cta_primary: 'Talk to an Expert',
    contact_cta_secondary: 'Watch FAQ Videos',
    phone_number: '+91 98765 43210',
    hours_weekday: 'Mon - Fri: 9:30 AM to 7:30 PM',
    hours_weekend: 'Sat - Sun: 9:30 AM to 6:30 PM'
  },

  footer_settings: {
    title: 'Footer Settings',
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
  },

  footer_link_group: [
    {
      title: 'Treks',
      links: [
        { title: 'Upcoming Treks', url: '/upcoming' },
        { title: 'Summer Camps 2026', url: '/summer-camps' },
        { title: 'Treks by Month', url: '/treks/by-month' },
        { title: 'Treks by Difficulty', url: '/treks/by-difficulty' },
        { title: 'Treks by Region', url: '/treks/by-region' }
      ],
      order: 1
    },
    {
      title: 'About Us',
      links: [
        { title: 'Our Story', url: '/about' },
        { title: 'Safety Practices', url: '/safety' },
        { title: 'Sustainability', url: '/sustainability' },
        { title: 'Careers', url: '/careers' },
        { title: 'Contact Us', url: '/contact' }
      ],
      order: 2
    },
    {
      title: 'Resources',
      links: [
        { title: 'Fitness Module', url: '/fitness' },
        { title: 'Trek FAQs', url: '/faqs' },
        { title: 'Gear Rental', url: '/gear' },
        { title: 'Shop', url: '/shop' },
        { title: 'Blog', url: '/blog' }
      ],
      order: 3
    }
  ],

  social_link: [
    { title: 'Facebook', icon: 'facebook', label: 'Facebook', url: 'https://facebook.com', order: 1 },
    { title: 'Instagram', icon: 'instagram', label: 'Instagram', url: 'https://instagram.com', order: 2 },
    { title: 'YouTube', icon: 'youtube', label: 'YouTube', url: 'https://youtube.com', order: 3 },
    { title: 'LinkedIn', icon: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com', order: 4 }
  ],

  office: [
    { title: 'Bengaluru Office', city: 'Bengaluru', address: '42, Mountain View Road, Koramangala, Bengaluru - 560034', order: 1 },
    { title: 'Dehradun Office', city: 'Dehradun', address: '15, Himalayan Heights, Rajpur Road, Dehradun - 248001', order: 2 }
  ],

  trusted_by: [
    { title: 'IIM Bangalore', name: 'IIM Bangalore', order: 1 },
    { title: 'BITS Pilani', name: 'BITS Pilani', order: 2 },
    { title: 'IIT Delhi', name: 'IIT Delhi', order: 3 },
    { title: 'Accenture', name: 'Accenture', order: 4 },
    { title: 'Google', name: 'Google', order: 5 },
    { title: 'Microsoft', name: 'Microsoft', order: 6 }
  ],

  legal_link: [
    { title: 'Privacy Policy', url: '/privacy', order: 1 },
    { title: 'Terms & Conditions', url: '/terms', order: 2 },
    { title: 'Cancellation Policy', url: '/cancellation', order: 3 }
  ]
}

// ============================================================================
// CONTENT TYPE & ENTRY CREATION
// ============================================================================

async function createContentType(contentTypeData) {
  const uid = contentTypeData.content_type.uid
  
  try {
    // Check if content type already exists
    await apiRequest('GET', `/content_types/${uid}`)
    console.log(`  ⏭️  Content type "${uid}" already exists, skipping...`)
    return true
  } catch (error) {
    if (error.status === 404 || error.code === 118) {
      // Content type doesn't exist, create it
      try {
        await apiRequest('POST', '/content_types', contentTypeData)
        console.log(`  ✅ Created content type: ${uid}`)
        await delay(500) // Rate limiting
        return true
      } catch (createError) {
        console.error(`  ❌ Failed to create content type "${uid}":`, createError.message)
        if (createError.data) {
          console.error(`     Details:`, JSON.stringify(createError.data, null, 2).substring(0, 500))
        }
        return false
      }
    } else {
      console.error(`  ❌ Error checking content type "${uid}":`, error.message)
      return false
    }
  }
}

async function createEntry(contentTypeUid, entryData) {
  try {
    await apiRequest('POST', `/content_types/${contentTypeUid}/entries?locale=en-us`, { entry: entryData })
    console.log(`    ✅ Created entry: ${entryData.title}`)
    await delay(300) // Rate limiting
    return true
  } catch (error) {
    if (error.code === 119 || error.message?.includes('already exists') || error.message?.includes('unique')) {
      console.log(`    ⏭️  Entry "${entryData.title}" already exists, skipping...`)
      return true
    }
    console.error(`    ❌ Failed to create entry "${entryData.title}":`, error.message)
    return false
  }
}

// ============================================================================
// MAIN SCRIPT
// ============================================================================

async function main() {
  console.log('')
  console.log('🏔️  Contentstack Setup Script')
  console.log('━'.repeat(50))
  console.log('')
  console.log(`📍 API Host: ${API_HOST}`)
  console.log(`🔑 API Key: ${config.apiKey.substring(0, 8)}...`)
  console.log(`🌍 Environment: ${config.environment}`)
  console.log('')

  // Test connection
  try {
    await apiRequest('GET', '/content_types')
    console.log('✅ Connected to Contentstack successfully!')
    console.log('')
  } catch (error) {
    console.error('❌ Failed to connect to Contentstack:', error.message)
    if (error.data) {
      console.error('   Details:', JSON.stringify(error.data, null, 2))
    }
    process.exit(1)
  }

  // Step 1: Create all content types
  console.log('📋 Step 1: Creating Content Types')
  console.log('─'.repeat(40))
  
  for (const ct of contentTypes) {
    await createContentType(ct)
  }
  
  console.log('')
  console.log('⏳ Waiting for content types to be ready...')
  await delay(3000)
  console.log('')

  // Step 2: Create entries
  console.log('📝 Step 2: Creating Entries')
  console.log('─'.repeat(40))

  for (const [contentTypeUid, data] of Object.entries(defaultContent)) {
    console.log(`\n  Creating entries for: ${contentTypeUid}`)
    
    if (Array.isArray(data)) {
      for (const entry of data) {
        await createEntry(contentTypeUid, entry)
      }
    } else {
      await createEntry(contentTypeUid, data)
    }
  }

  console.log('')
  console.log('━'.repeat(50))
  console.log('🎉 Setup complete!')
  console.log('')
  console.log('Next steps:')
  console.log('  1. Go to your Contentstack dashboard')
  console.log('  2. Review the created content types and entries')
  console.log('  3. Publish all entries to make them available via Delivery API')
  console.log('')
}

main().catch(error => {
  console.error('❌ Script failed:', error.message)
  process.exit(1)
})
