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
        { display_name: 'Slug', uid: 'slug', data_type: 'text', mandatory: true },
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
  },
  {
    content_type: {
      title: 'Trek Detail',
      uid: 'trek_detail',
      schema: [
        { display_name: 'Title', uid: 'title', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'URL', uid: 'url', data_type: 'text', mandatory: true, unique: true, field_metadata: { description: 'Page URL path (e.g., /trek/kedarkantha)' } },
        { display_name: 'Slug', uid: 'slug', data_type: 'text', mandatory: true, unique: true },
        { display_name: 'Name', uid: 'name', data_type: 'text', mandatory: true },
        { display_name: 'Tagline', uid: 'tagline', data_type: 'text' },
        { display_name: 'Hero Image URL', uid: 'hero_image', data_type: 'text' },
        { display_name: 'Gallery URLs (JSON)', uid: 'gallery', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Difficulty', uid: 'difficulty', data_type: 'text', mandatory: true },
        { display_name: 'Duration', uid: 'duration', data_type: 'text', mandatory: true },
        { display_name: 'Altitude', uid: 'altitude', data_type: 'text', mandatory: true },
        { display_name: 'Price', uid: 'price', data_type: 'number', mandatory: true },
        { display_name: 'Original Price', uid: 'original_price', data_type: 'number' },
        { display_name: 'Rating', uid: 'rating', data_type: 'number' },
        { display_name: 'Reviews Count', uid: 'reviews_count', data_type: 'number' },
        { display_name: 'Region', uid: 'region', data_type: 'text', mandatory: true },
        { display_name: 'State', uid: 'state', data_type: 'text' },
        { display_name: 'Best Months (JSON)', uid: 'best_months', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Trek Distance', uid: 'trek_distance', data_type: 'text' },
        { display_name: 'Base Camp', uid: 'base_camp', data_type: 'text' },
        { display_name: 'Group Size', uid: 'group_size', data_type: 'text' },
        { display_name: 'Pickup Point', uid: 'pickup_point', data_type: 'text' },
        { display_name: 'Short Description', uid: 'short_description', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Overview', uid: 'overview', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Highlights (JSON)', uid: 'highlights', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Itinerary (JSON)', uid: 'itinerary', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Inclusions (JSON)', uid: 'inclusions', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Exclusions (JSON)', uid: 'exclusions', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Things to Carry (JSON)', uid: 'things_to_carry', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Weather (JSON)', uid: 'weather', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Upcoming Batches (JSON)', uid: 'upcoming_batches', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Reviews (JSON)', uid: 'reviews', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'FAQs (JSON)', uid: 'faqs', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Trek Leader (JSON)', uid: 'trek_leader', data_type: 'text', field_metadata: { multiline: true } },
        { display_name: 'Order', uid: 'order', data_type: 'number' }
      ],
      options: { is_page: true, singleton: false }
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
      slug: 'kedarkantha',
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
      slug: 'kashmir-great-lakes',
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
      slug: 'rupin-pass',
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
      slug: 'valley-of-flowers',
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
  ],

  trek_detail: [
    {
      title: 'Kedarkantha Trek',
      url: '/trek/kedarkantha',
      slug: 'kedarkantha',
      name: 'Kedarkantha',
      tagline: 'The Perfect Winter Trek for Everyone',
      hero_image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1920&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80',
        'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80',
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'
      ]),
      difficulty: 'Easy - Moderate',
      duration: '6 Days',
      altitude: '12,500 ft',
      price: 11850,
      original_price: 13500,
      rating: 4.9,
      reviews_count: 2450,
      region: 'Uttarakhand',
      state: 'Uttarakhand',
      best_months: JSON.stringify(['December', 'January', 'February', 'March', 'April']),
      trek_distance: '20 km',
      base_camp: 'Sankri',
      group_size: '15-25 trekkers',
      pickup_point: 'Dehradun Railway Station',
      short_description: 'Kedarkantha is one of the most popular winter treks in India, offering stunning views of snow-capped Himalayan peaks and pristine forests.',
      overview: `Kedarkantha is a quintessential Himalayan experience that combines moderate difficulty with extraordinary rewards. This trek takes you through dense pine and oak forests, charming mountain villages, and vast alpine meadows blanketed in snow during winter.

The summit climb on day 4 is the highlight, where you're rewarded with 360-degree views of some of the most spectacular peaks in the Garhwal Himalayas - Swargarohini, Bandarpoonch, Black Peak, and Kedarnath.

What makes this trek special is its accessibility. The trails are well-marked, the altitude is manageable, and the duration is perfect for a first Himalayan experience.`,
      highlights: JSON.stringify([
        'Summit climb with 360° views of Himalayan peaks',
        'Camp in snow-covered meadows at Kedarkantha Base',
        'Walk through ancient oak and pine forests',
        'Visit the pristine Juda Ka Talab (frozen lake)',
        'Experience authentic Garhwali village culture',
        'Perfect winter trek with stunning snow trails'
      ]),
      itinerary: JSON.stringify([
        { day: 1, title: 'Dehradun to Sankri', altitude: '6,400 ft', distance: '210 km drive', time: '8-9 hours', description: 'Our team will pick you up from Dehradun Railway Station early morning. The scenic drive takes you through Mussoorie, Naugaon, Purola, and Mori before reaching Sankri.', meals: ['Lunch', 'Dinner'], stay: 'Guesthouse in Sankri' },
        { day: 2, title: 'Sankri to Juda Ka Talab', altitude: '9,100 ft', distance: '4 km', time: '4-5 hours', description: 'Begin your trek through a beautiful oak and pine forest. The trail gradually ascends, offering glimpses of snow-capped peaks.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Tents at Juda Ka Talab' },
        { day: 3, title: 'Juda Ka Talab to Kedarkantha Base', altitude: '11,250 ft', distance: '4 km', time: '3-4 hours', description: 'A shorter day allows for acclimatization. The trail opens up to vast meadows offering panoramic views.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Tents at Kedarkantha Base' },
        { day: 4, title: 'Summit Day & Descent to Hargaon', altitude: '12,500 ft (summit)', distance: '6 km', time: '7-8 hours', description: 'Wake up early for the summit push. The final ascent offers incredible views as the sun rises over the Himalayas.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Tents at Hargaon' },
        { day: 5, title: 'Hargaon to Sankri', altitude: '6,400 ft', distance: '6 km', time: '4-5 hours', description: 'Descend through the forest back to Sankri. Celebrate your successful summit with fellow trekkers.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Guesthouse in Sankri' },
        { day: 6, title: 'Sankri to Dehradun', altitude: '2,200 ft', distance: '210 km drive', time: '8-9 hours', description: 'After breakfast, begin your drive back to Dehradun. Carry memories and friendships that will last a lifetime.', meals: ['Breakfast'], stay: 'Own arrangement' }
      ]),
      inclusions: JSON.stringify([
        'Accommodation (guesthouses and tents)', 'All meals during the trek (veg)', 'Experienced trek leaders and support staff',
        'First aid and medical kit', 'Sleeping bags and mattresses', 'Permits and forest entry fees',
        'Transport from Dehradun to Sankri and back', 'Safety equipment (microspikes, gaiters)'
      ]),
      exclusions: JSON.stringify([
        'Personal expenses and tips', 'Travel insurance', 'Personal trekking gear (shoes, backpack, layers)',
        'Anything not mentioned in inclusions', 'Buffer day accommodation', 'Early morning pickup charges'
      ]),
      things_to_carry: JSON.stringify([
        'Trekking shoes with good grip', 'Warm layers (down jacket, fleece)', 'Rain jacket or poncho',
        'Gloves and woolen cap', 'Sunglasses and sunscreen', 'Personal water bottle (1L minimum)',
        'Head torch with extra batteries', 'Personal medications', 'Daypack (20-30L)'
      ]),
      weather: JSON.stringify({
        december: { high: '5°C', low: '-8°C', condition: 'Heavy Snow' },
        january: { high: '2°C', low: '-12°C', condition: 'Peak Winter' },
        february: { high: '4°C', low: '-10°C', condition: 'Heavy Snow' },
        march: { high: '10°C', low: '-5°C', condition: 'Snow Melting' },
        april: { high: '15°C', low: '2°C', condition: 'Clear Skies' }
      }),
      upcoming_batches: JSON.stringify([
        { date: 'Feb 15-20, 2026', slots: 8, price: 11850 },
        { date: 'Feb 22-27, 2026', slots: 12, price: 11850 },
        { date: 'Mar 1-6, 2026', slots: 15, price: 11850 },
        { date: 'Mar 8-13, 2026', slots: 10, price: 11850 },
        { date: 'Mar 15-20, 2026', slots: 18, price: 10850 },
        { date: 'Apr 5-10, 2026', slots: 20, price: 10850 }
      ]),
      reviews: JSON.stringify([
        { id: 1, name: 'Rohit Sharma', location: 'Delhi', date: 'January 2026', rating: 5, title: 'Absolutely magical experience!', review: 'This was my first Himalayan trek and I couldn\'t have asked for a better experience. The trek leaders were incredibly supportive.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
        { id: 2, name: 'Meera Iyer', location: 'Bangalore', date: 'December 2025', rating: 5, title: 'Perfect winter wonderland', review: 'Walking through knee-deep snow to the summit was challenging but so rewarding. The sunrise from the top is something I\'ll never forget.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
        { id: 3, name: 'Aditya Menon', location: 'Chennai', date: 'February 2026', rating: 5, title: 'Life-changing journey', review: 'The organization was flawless. From pickup to drop, everything was seamless. The campsite at Kedarkantha base was spectacular.', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&q=80' }
      ]),
      faqs: JSON.stringify([
        { question: 'Is Kedarkantha suitable for beginners?', answer: 'Yes! Kedarkantha is one of the best treks for beginners. The trails are well-marked and the altitude is manageable.' },
        { question: 'What is the best time to do this trek?', answer: 'December to April is the best time. December-February offers heavy snow experience. March-April has milder weather.' },
        { question: 'How cold does it get?', answer: 'Temperatures can drop to -10°C to -15°C at night during peak winter. Good quality warm layers are essential.' }
      ]),
      trek_leader: JSON.stringify({
        name: 'Vikash Kumar',
        experience: '8 years',
        treks_led: 150,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
        bio: 'Vikash has been leading Himalayan treks for over 8 years. Born in the Garhwal region, he has an intimate knowledge of these mountains.'
      }),
      order: 1
    },
    {
      title: 'Kashmir Great Lakes Trek',
      url: '/trek/kashmir-great-lakes',
      slug: 'kashmir-great-lakes',
      name: 'Kashmir Great Lakes',
      tagline: 'A Journey Through Seven Alpine Lakes',
      hero_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80'
      ]),
      difficulty: 'Moderate - Difficult',
      duration: '7 Days',
      altitude: '13,750 ft',
      price: 18950,
      original_price: 21500,
      rating: 4.9,
      reviews_count: 1820,
      region: 'Kashmir',
      state: 'Jammu & Kashmir',
      best_months: JSON.stringify(['July', 'August', 'September']),
      trek_distance: '70 km',
      base_camp: 'Sonamarg',
      group_size: '15-20 trekkers',
      pickup_point: 'Srinagar Airport',
      short_description: 'Kashmir Great Lakes is arguably the most beautiful trek in India, taking you through seven stunning alpine lakes set amidst pristine meadows.',
      overview: `Kashmir Great Lakes (KGL) is often called the most beautiful trek in India, and for good reason. This 7-day expedition takes you through some of the most spectacular landscapes the Himalayas have to offer.

The trek connects seven high-altitude lakes, each with its unique character and color. From the deep blue of Vishansar to the emerald green of Gadsar, each lake is a masterpiece of nature.

This is a moderately challenging trek that requires good fitness and prior trekking experience.`,
      highlights: JSON.stringify([
        'Camp beside 7 stunning alpine lakes',
        'Cross the dramatic Gadsar Pass (13,750 ft)',
        'Walk through flower-carpeted meadows',
        'Experience the legendary beauty of Kashmir',
        'Witness diverse landscapes daily',
        'See rare Himalayan wildlife'
      ]),
      itinerary: JSON.stringify([
        { day: 1, title: 'Srinagar to Sonamarg to Nichnai', altitude: '11,500 ft', distance: '12 km', time: '6-7 hours', description: 'Drive from Srinagar to Sonamarg and begin your trek through beautiful alpine meadows.', meals: ['Lunch', 'Dinner'], stay: 'Tents at Nichnai' },
        { day: 2, title: 'Nichnai to Vishansar Lake', altitude: '12,000 ft', distance: '13 km', time: '7-8 hours', description: 'Cross the Nichnai Pass and descend to the stunning Vishansar Lake.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Tents at Vishansar' },
        { day: 3, title: 'Vishansar to Gadsar Lake', altitude: '12,500 ft', distance: '14 km', time: '8-9 hours', description: 'Cross Gadsar Pass (13,750 ft), the highest point of the trek.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Tents at Gadsar' },
        { day: 4, title: 'Gadsar to Satsar Lakes', altitude: '12,000 ft', distance: '12 km', time: '6-7 hours', description: 'Trek to Satsar, a collection of seven small lakes.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Tents at Satsar' },
        { day: 5, title: 'Satsar to Gangabal Lake', altitude: '11,500 ft', distance: '11 km', time: '6-7 hours', description: 'Trek to the twin lakes of Gangabal and Nundkol with stunning views of Mt. Harmukh.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Tents at Gangabal' },
        { day: 6, title: 'Gangabal to Naranag', altitude: '7,450 ft', distance: '8 km', time: '5-6 hours', description: 'Descend through pine forests to Naranag. Drive to Srinagar by evening.', meals: ['Breakfast', 'Lunch'], stay: 'Hotel in Srinagar' },
        { day: 7, title: 'Departure from Srinagar', altitude: '5,200 ft', distance: 'N/A', time: 'Flexible', description: 'Explore Srinagar or depart. Trek ends with lifelong memories.', meals: ['Breakfast'], stay: 'Own arrangement' }
      ]),
      inclusions: JSON.stringify(['All meals during the trek', 'Camping equipment and tents', 'Expert trek leaders and local guides', 'Transport from/to Srinagar', 'Permits and entry fees', 'Medical kit and safety equipment']),
      exclusions: JSON.stringify(['Personal porter/mule', 'Travel insurance', 'Personal trekking equipment', 'Srinagar stay before/after trek']),
      things_to_carry: JSON.stringify(['Waterproof trekking shoes', 'Rain gear (essential for monsoon)', 'Warm layers for cold nights', 'Trekking poles', 'Camera (fully charged!)']),
      weather: JSON.stringify({
        july: { high: '18°C', low: '5°C', condition: 'Monsoon' },
        august: { high: '17°C', low: '4°C', condition: 'Peak Flowers' },
        september: { high: '15°C', low: '2°C', condition: 'Clear Skies' }
      }),
      upcoming_batches: JSON.stringify([
        { date: 'Jul 5-11, 2026', slots: 6, price: 18950 },
        { date: 'Jul 15-21, 2026', slots: 10, price: 18950 },
        { date: 'Aug 1-7, 2026', slots: 15, price: 18950 },
        { date: 'Sep 1-7, 2026', slots: 18, price: 17950 }
      ]),
      reviews: JSON.stringify([
        { id: 1, name: 'Priya Nair', location: 'Mumbai', date: 'August 2025', rating: 5, title: 'Paradise on Earth!', review: 'No words can describe the beauty of these lakes. Every day brought a new spectacle.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
        { id: 2, name: 'Karthik Venkatesh', location: 'Hyderabad', date: 'September 2025', rating: 5, title: 'Best trek of my life', review: 'I\'ve done 15+ treks across the Himalayas, and KGL remains unmatched in terms of sheer beauty.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' }
      ]),
      faqs: JSON.stringify([
        { question: 'Is prior trekking experience required?', answer: 'Yes, we recommend at least one high-altitude trek experience before attempting KGL.' },
        { question: 'Is it safe to trek in Kashmir?', answer: 'Absolutely. The areas we trek through are completely safe and have been frequented by trekkers for decades.' }
      ]),
      trek_leader: JSON.stringify({
        name: 'Sameer Sheikh',
        experience: '10 years',
        treks_led: 200,
        image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80',
        bio: 'A Kashmir native, Sameer has been leading KGL expeditions for a decade. His knowledge of the terrain adds depth to every trek.'
      }),
      order: 2
    },
    {
      title: 'Rupin Pass Trek',
      url: '/trek/rupin-pass',
      slug: 'rupin-pass',
      name: 'Rupin Pass',
      tagline: 'The Ultimate Himalayan Challenge',
      hero_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
        'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80',
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
        'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80'
      ]),
      difficulty: 'Difficult',
      duration: '8 Days',
      altitude: '15,250 ft',
      price: 16450,
      original_price: 18500,
      rating: 4.8,
      reviews_count: 1560,
      region: 'Himachal Pradesh',
      state: 'Himachal Pradesh',
      best_months: JSON.stringify(['May', 'June', 'September', 'October']),
      trek_distance: '52 km',
      base_camp: 'Dhaula',
      group_size: '12-18 trekkers',
      pickup_point: 'Shimla',
      short_description: 'Rupin Pass is a challenging crossover trek from Uttarakhand to Himachal Pradesh, featuring stunning waterfalls and the dramatic snow-covered pass.',
      overview: `Rupin Pass is considered one of the most dramatic treks in the Himalayas. This crossover trek takes you from Dhaula in Uttarakhand to Sangla in Himachal Pradesh, crossing the formidable Rupin Pass at 15,250 feet.

What sets this trek apart is the sheer variety of landscapes - thick forests, spectacular waterfalls, glacial moraines, and the stunning snow-covered pass.

This is a challenging trek recommended for experienced trekkers.`,
      highlights: JSON.stringify([
        'Cross the dramatic Rupin Pass at 15,250 ft',
        'Witness the spectacular Rupin waterfall',
        'Trek through the unique hanging village of Jakha',
        'Experience the crossover from Uttarakhand to Himachal',
        'Walk through diverse terrains and ecosystems'
      ]),
      itinerary: JSON.stringify([
        { day: 1, title: 'Shimla to Dhaula', altitude: '5,500 ft', distance: '240 km drive', time: '10-11 hours', description: 'Scenic drive from Shimla to Dhaula through Kinnaur landscapes.', meals: ['Lunch', 'Dinner'], stay: 'Homestay in Dhaula' },
        { day: 2, title: 'Dhaula to Sewa', altitude: '6,500 ft', distance: '6 km', time: '4-5 hours', description: 'Begin trekking through forested trails. First views of the magnificent Rupin waterfall.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Tents at Sewa' },
        { day: 3, title: 'Sewa to Jhaka', altitude: '8,900 ft', distance: '10 km', time: '7-8 hours', description: 'Trek to the famous hanging village of Jhaka.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Homestay in Jhaka' },
        { day: 4, title: 'Jhaka to Saruwas Thach', altitude: '11,300 ft', distance: '8 km', time: '6-7 hours', description: 'Gradual ascent through meadows and forests. Acclimatization day.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Tents at Saruwas Thach' },
        { day: 5, title: 'Saruwas Thach to Dhanderas Thach', altitude: '12,800 ft', distance: '6 km', time: '5-6 hours', description: 'Trek to the base of the pass. Final acclimatization.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Tents at Dhanderas Thach' },
        { day: 6, title: 'Dhanderas to Rupin Pass to Ronti Gad', altitude: '15,250 ft (pass)', distance: '11 km', time: '10-12 hours', description: 'The big day! Early start for the challenging climb to Rupin Pass.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Tents at Ronti Gad' },
        { day: 7, title: 'Ronti Gad to Sangla', altitude: '8,800 ft', distance: '11 km', time: '6-7 hours', description: 'Descend through pine forests to the picturesque Sangla Valley.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Hotel in Sangla' },
        { day: 8, title: 'Sangla to Shimla', altitude: '7,200 ft', distance: '260 km drive', time: '10-11 hours', description: 'Drive back to Shimla through the beautiful Kinnaur Valley.', meals: ['Breakfast'], stay: 'Own arrangement' }
      ]),
      inclusions: JSON.stringify(['All meals during the trek', 'Camping equipment', 'Expert trek leaders', 'Transport from/to Shimla', 'Technical equipment', 'Permits and entry fees']),
      exclusions: JSON.stringify(['Personal porter', 'Travel insurance (mandatory)', 'Personal trekking gear', 'Tips and gratuities']),
      things_to_carry: JSON.stringify(['Technical trekking boots', 'Gaiters', 'Trekking poles', 'Down jacket (-10°C rated)', 'Sunglasses and sunscreen']),
      weather: JSON.stringify({
        may: { high: '10°C', low: '-2°C', condition: 'Snow at Pass' },
        june: { high: '12°C', low: '0°C', condition: 'Clear' },
        september: { high: '10°C', low: '-3°C', condition: 'Post Monsoon' },
        october: { high: '5°C', low: '-5°C', condition: 'Early Snow' }
      }),
      upcoming_batches: JSON.stringify([
        { date: 'May 10-17, 2026', slots: 8, price: 16450 },
        { date: 'May 20-27, 2026', slots: 10, price: 16450 },
        { date: 'Jun 1-8, 2026', slots: 12, price: 16450 },
        { date: 'Sep 15-22, 2026', slots: 10, price: 16450 }
      ]),
      reviews: JSON.stringify([
        { id: 1, name: 'Arjun Singh', location: 'Chandigarh', date: 'May 2025', rating: 5, title: 'Challenging but worth every step!', review: 'The pass crossing was intense but our guides were excellent. The view from the top is unmatched.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' }
      ]),
      faqs: JSON.stringify([
        { question: 'How difficult is Rupin Pass compared to other treks?', answer: 'Rupin Pass is rated as difficult. The pass crossing involves steep snow slopes and requires 10-12 hours of walking.' }
      ]),
      trek_leader: JSON.stringify({
        name: 'Deepak Thakur',
        experience: '12 years',
        treks_led: 180,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
        bio: 'A certified mountaineer from NIM, Deepak specializes in challenging high-altitude treks.'
      }),
      order: 3
    },
    {
      title: 'Valley of Flowers Trek',
      url: '/trek/valley-of-flowers',
      slug: 'valley-of-flowers',
      name: 'Valley of Flowers',
      tagline: 'UNESCO World Heritage Trek',
      hero_image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
        'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80'
      ]),
      difficulty: 'Moderate',
      duration: '6 Days',
      altitude: '14,100 ft',
      price: 14850,
      original_price: 16500,
      rating: 4.9,
      reviews_count: 2100,
      region: 'Uttarakhand',
      state: 'Uttarakhand',
      best_months: JSON.stringify(['July', 'August', 'September']),
      trek_distance: '38 km',
      base_camp: 'Govindghat',
      group_size: '15-25 trekkers',
      pickup_point: 'Haridwar/Rishikesh',
      short_description: 'Valley of Flowers is a UNESCO World Heritage Site, home to over 600 species of flowering plants. Combined with Hemkund Sahib, this trek offers natural beauty and spiritual experience.',
      overview: `The Valley of Flowers is a UNESCO World Heritage Site nestled in the Chamoli district of Uttarakhand. This 10 km stretch of pristine alpine meadows comes alive with over 600 species of wildflowers during the monsoon months.

This trek combines the floral paradise of the Valley with the pilgrimage to Hemkund Sahib, one of the highest Gurudwaras in the world at 14,100 feet.

The valley was unknown to the world until 1931 when British mountaineer Frank Smythe stumbled upon it.`,
      highlights: JSON.stringify([
        'Walk through 600+ species of wildflowers',
        'Visit UNESCO World Heritage Site',
        'Pilgrimage to Hemkund Sahib (14,100 ft)',
        'Spot rare Himalayan wildlife',
        'Perfect monsoon trek'
      ]),
      itinerary: JSON.stringify([
        { day: 1, title: 'Haridwar to Govindghat', altitude: '6,000 ft', distance: '290 km drive', time: '10-11 hours', description: 'Scenic drive along the Ganges through Rishikesh, Devprayag, and Joshimath.', meals: ['Lunch', 'Dinner'], stay: 'Hotel in Govindghat' },
        { day: 2, title: 'Govindghat to Ghangaria', altitude: '10,000 ft', distance: '14 km', time: '6-7 hours', description: 'Trek along the Pushpawati River through scenic villages and waterfalls.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Guesthouse in Ghangaria' },
        { day: 3, title: 'Ghangaria to Valley of Flowers', altitude: '12,500 ft', distance: '8 km (round)', time: '5-6 hours', description: 'Enter the valley and spend the day amidst thousands of blooming flowers.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Guesthouse in Ghangaria' },
        { day: 4, title: 'Ghangaria to Hemkund Sahib', altitude: '14,100 ft', distance: '12 km (round)', time: '7-8 hours', description: 'Trek to the sacred Hemkund Sahib Gurudwara and pristine glacial lake.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Guesthouse in Ghangaria' },
        { day: 5, title: 'Ghangaria to Joshimath', altitude: '6,100 ft', distance: '14 km trek + 20 km drive', time: '6-7 hours', description: 'Descend to Govindghat and drive to Joshimath.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Hotel in Joshimath' },
        { day: 6, title: 'Joshimath to Haridwar', altitude: '1,100 ft', distance: '270 km drive', time: '10 hours', description: 'Return drive to Haridwar. Optional Ganga Aarti before departure.', meals: ['Breakfast'], stay: 'Own arrangement' }
      ]),
      inclusions: JSON.stringify(['All meals during the trek', 'Guesthouse accommodation', 'Expert guide and support', 'Transport from/to Haridwar', 'Valley entry permits']),
      exclusions: JSON.stringify(['Personal porter/mule', 'Travel insurance', 'Personal expenses', 'Haridwar stay before/after']),
      things_to_carry: JSON.stringify(['Rain jacket and poncho (essential)', 'Waterproof trekking shoes', 'Warm layers', 'Camera with waterproof cover']),
      weather: JSON.stringify({
        july: { high: '15°C', low: '8°C', condition: 'Peak Bloom' },
        august: { high: '14°C', low: '7°C', condition: 'Maximum Flowers' },
        september: { high: '12°C', low: '5°C', condition: 'Late Bloom' }
      }),
      upcoming_batches: JSON.stringify([
        { date: 'Jul 10-15, 2026', slots: 15, price: 14850 },
        { date: 'Jul 20-25, 2026', slots: 12, price: 14850 },
        { date: 'Aug 1-6, 2026', slots: 18, price: 14850 },
        { date: 'Sep 1-6, 2026', slots: 20, price: 13850 }
      ]),
      reviews: JSON.stringify([
        { id: 1, name: 'Lakshmi Sundaram', location: 'Coimbatore', date: 'August 2025', rating: 5, title: 'Nature\'s canvas at its finest', review: 'The variety of flowers was mind-boggling. Our guide knew the names of so many species. Hemkund Sahib was spiritually uplifting.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' }
      ]),
      faqs: JSON.stringify([
        { question: 'When is the best time to see flowers?', answer: 'Late July to mid-August is peak bloom time. Different flowers bloom at different times.' }
      ]),
      trek_leader: JSON.stringify({
        name: 'Sunita Rawat',
        experience: '6 years',
        treks_led: 100,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
        bio: 'Sunita is a trained botanist and passionate trekker. Her knowledge of flora adds an educational dimension.'
      }),
      order: 4
    },
    {
      title: 'Har Ki Dun Trek',
      url: '/trek/har-ki-dun',
      slug: 'har-ki-dun',
      name: 'Har Ki Dun',
      tagline: 'The Valley of Gods',
      hero_image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1920&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80']),
      difficulty: 'Moderate',
      duration: '7 Days',
      altitude: '11,700 ft',
      price: 13450,
      original_price: 15000,
      rating: 4.8,
      reviews_count: 1890,
      region: 'Uttarakhand',
      state: 'Uttarakhand',
      best_months: JSON.stringify(['March', 'April', 'May', 'September', 'October', 'November']),
      trek_distance: '47 km',
      base_camp: 'Taluka',
      group_size: '15-20 trekkers',
      pickup_point: 'Dehradun',
      short_description: 'An ancient valley trek rich in mythology, culture and natural beauty.',
      overview: 'Har Ki Dun is a cradle-shaped valley in the Garhwal Himalayas, known for its rich mythology and pristine beauty. The valley is surrounded by ancient forests and offers views of Swargarohini peaks.',
      highlights: JSON.stringify(['Ancient village culture', 'Rich mythology', 'Pristine valley views', 'Diverse flora and fauna']),
      itinerary: JSON.stringify([
        { day: 1, title: 'Dehradun to Taluka', altitude: '7,000 ft', distance: '220 km', time: '9-10 hours', description: 'Scenic drive to Taluka base camp.', meals: ['Dinner'], stay: 'Guesthouse' },
        { day: 2, title: 'Taluka to Osla', altitude: '8,500 ft', distance: '14 km', time: '6-7 hours', description: 'Trek through forests and villages.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Tents' }
      ]),
      inclusions: JSON.stringify(['All meals', 'Camping equipment', 'Expert guides', 'Permits']),
      exclusions: JSON.stringify(['Personal expenses', 'Travel insurance', 'Personal gear']),
      things_to_carry: JSON.stringify(['Trekking shoes', 'Warm layers', 'Rain gear']),
      weather: JSON.stringify({ march: { high: '15°C', low: '2°C', condition: 'Clear' } }),
      upcoming_batches: JSON.stringify([{ date: 'Mar 10-16, 2026', slots: 12, price: 13450 }]),
      reviews: JSON.stringify([{ id: 1, name: 'Nikhil Jain', location: 'Jaipur', date: 'October 2025', rating: 5, title: 'Magical experience', review: 'The valley is absolutely stunning. The ancient villages add so much cultural richness.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' }]),
      faqs: JSON.stringify([{ question: 'Is Har Ki Dun good for beginners?', answer: 'Yes, with moderate fitness levels it is achievable for beginners.' }]),
      trek_leader: JSON.stringify({ name: 'Rajesh Bisht', experience: '9 years', treks_led: 120, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', bio: 'Born in the Garhwal region with deep knowledge of local culture.' }),
      order: 5
    },
    {
      title: 'Brahmatal Trek',
      url: '/trek/brahmatal',
      slug: 'brahmatal',
      name: 'Brahmatal',
      tagline: 'Winter Wonderland with Frozen Lakes',
      hero_image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80']),
      difficulty: 'Easy - Moderate',
      duration: '6 Days',
      altitude: '12,250 ft',
      price: 11850,
      original_price: 13500,
      rating: 4.9,
      reviews_count: 2100,
      region: 'Uttarakhand',
      state: 'Uttarakhand',
      best_months: JSON.stringify(['December', 'January', 'February', 'March']),
      trek_distance: '22 km',
      base_camp: 'Lohajung',
      group_size: '15-25 trekkers',
      pickup_point: 'Kathgodam',
      short_description: 'A winter wonderland trek featuring frozen lakes and stunning Himalayan views.',
      overview: 'Brahmatal offers one of the best winter trekking experiences in India. The frozen Brahmatal lake, panoramic views of Mt. Trishul and Nanda Ghunti, and pristine snow trails make this trek magical.',
      highlights: JSON.stringify(['Frozen Brahmatal Lake', 'Views of Mt. Trishul', 'Snow-covered trails', 'Perfect winter trek']),
      itinerary: JSON.stringify([{ day: 1, title: 'Kathgodam to Lohajung', altitude: '7,600 ft', distance: '210 km', time: '9 hours', description: 'Drive to base camp.', meals: ['Dinner'], stay: 'Guesthouse' }]),
      inclusions: JSON.stringify(['All meals', 'Tents and sleeping bags', 'Expert guides']),
      exclusions: JSON.stringify(['Personal expenses', 'Travel insurance']),
      things_to_carry: JSON.stringify(['Trekking shoes', 'Down jacket', 'Gloves']),
      weather: JSON.stringify({ january: { high: '0°C', low: '-10°C', condition: 'Snow' } }),
      upcoming_batches: JSON.stringify([{ date: 'Jan 15-20, 2026', slots: 15, price: 11850 }]),
      reviews: JSON.stringify([{ id: 1, name: 'Shreya Kapoor', location: 'Noida', date: 'January 2026', rating: 5, title: 'Magical winter experience', review: 'The frozen lake was surreal!', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' }]),
      faqs: JSON.stringify([{ question: 'How cold does it get?', answer: 'Temperatures drop to -10°C at night during peak winter.' }]),
      trek_leader: JSON.stringify({ name: 'Mohan Negi', experience: '7 years', treks_led: 90, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', bio: 'Expert in winter treks with extensive knowledge of snow conditions.' }),
      order: 6
    },
    {
      title: 'Roopkund Trek',
      url: '/trek/roopkund',
      slug: 'roopkund',
      name: 'Roopkund',
      tagline: 'The Mysterious Skeleton Lake',
      hero_image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80']),
      difficulty: 'Difficult',
      duration: '8 Days',
      altitude: '15,750 ft',
      price: 15950,
      original_price: 18000,
      rating: 4.7,
      reviews_count: 1450,
      region: 'Uttarakhand',
      state: 'Uttarakhand',
      best_months: JSON.stringify(['May', 'June', 'September', 'October']),
      trek_distance: '53 km',
      base_camp: 'Lohajung',
      group_size: '12-18 trekkers',
      pickup_point: 'Kathgodam',
      short_description: 'Trek to the mysterious glacial lake with ancient human skeletons.',
      overview: 'Roopkund is one of the most intriguing treks in India, featuring a glacial lake with hundreds of ancient human skeletons. The trek passes through beautiful meadows and offers stunning Himalayan views.',
      highlights: JSON.stringify(['Mysterious skeleton lake', 'Bedni Bugyal meadows', 'High altitude challenge', 'Ancient history']),
      itinerary: JSON.stringify([{ day: 1, title: 'Kathgodam to Lohajung', altitude: '7,600 ft', distance: '210 km', time: '9 hours', description: 'Drive to base.', meals: ['Dinner'], stay: 'Guesthouse' }]),
      inclusions: JSON.stringify(['All meals', 'Camping gear', 'Expert guides', 'Permits']),
      exclusions: JSON.stringify(['Personal gear', 'Travel insurance']),
      things_to_carry: JSON.stringify(['Technical boots', 'Down jacket', 'Trekking poles']),
      weather: JSON.stringify({ may: { high: '8°C', low: '-5°C', condition: 'Clear' } }),
      upcoming_batches: JSON.stringify([{ date: 'May 15-22, 2026', slots: 10, price: 15950 }]),
      reviews: JSON.stringify([{ id: 1, name: 'Anand Kulkarni', location: 'Pune', date: 'September 2025', rating: 5, title: 'Challenging but rewarding', review: 'The mystery of the lake adds to the adventure.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' }]),
      faqs: JSON.stringify([{ question: 'Why is Roopkund famous?', answer: 'For the mysterious human skeletons found in the glacial lake dating back centuries.' }]),
      trek_leader: JSON.stringify({ name: 'Amit Pandey', experience: '11 years', treks_led: 140, image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80', bio: 'Certified mountaineer specializing in challenging high-altitude treks.' }),
      order: 7
    },
    {
      title: 'Hampta Pass Trek',
      url: '/trek/hampta-pass',
      slug: 'hampta-pass',
      name: 'Hampta Pass',
      tagline: 'From Lush Valleys to Barren Landscapes',
      hero_image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80']),
      difficulty: 'Moderate',
      duration: '5 Days',
      altitude: '14,100 ft',
      price: 12450,
      original_price: 14000,
      rating: 4.8,
      reviews_count: 1780,
      region: 'Himachal Pradesh',
      state: 'Himachal Pradesh',
      best_months: JSON.stringify(['June', 'July', 'August', 'September']),
      trek_distance: '26 km',
      base_camp: 'Manali',
      group_size: '15-20 trekkers',
      pickup_point: 'Manali',
      short_description: 'A dramatic crossover from green Kullu Valley to barren Lahaul.',
      overview: 'Hampta Pass is unique for its dramatic landscape transformation. You start from the lush green Kullu Valley and cross over to the stark, barren beauty of the Lahaul Valley.',
      highlights: JSON.stringify(['Dramatic landscape change', 'Chandratal Lake visit', 'River crossings', 'Short yet adventurous']),
      itinerary: JSON.stringify([{ day: 1, title: 'Manali to Jobra', altitude: '9,800 ft', distance: '4 km', time: '3 hours', description: 'Begin trek through forests.', meals: ['Lunch', 'Dinner'], stay: 'Tents' }]),
      inclusions: JSON.stringify(['All meals', 'Camping gear', 'Expert guides']),
      exclusions: JSON.stringify(['Personal expenses', 'Travel insurance']),
      things_to_carry: JSON.stringify(['Waterproof shoes', 'Rain gear', 'Warm layers']),
      weather: JSON.stringify({ july: { high: '12°C', low: '3°C', condition: 'Monsoon' } }),
      upcoming_batches: JSON.stringify([{ date: 'Jun 20-24, 2026', slots: 18, price: 12450 }]),
      reviews: JSON.stringify([{ id: 1, name: 'Pooja Malhotra', location: 'Delhi', date: 'July 2025', rating: 5, title: 'Perfect short trek', review: 'The contrast between valleys is incredible.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' }]),
      faqs: JSON.stringify([{ question: 'Can we visit Chandratal?', answer: 'Yes, Chandratal Lake visit is included on the last day.' }]),
      trek_leader: JSON.stringify({ name: 'Kuldeep Singh', experience: '8 years', treks_led: 110, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', bio: 'Expert in Himachal treks with deep knowledge of local terrain.' }),
      order: 8
    },
    {
      title: 'Chadar Trek',
      url: '/trek/chadar-trek',
      slug: 'chadar-trek',
      name: 'Chadar Trek',
      tagline: 'Walk on the Frozen Zanskar River',
      hero_image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1920&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80']),
      difficulty: 'Difficult',
      duration: '9 Days',
      altitude: '11,000 ft',
      price: 24950,
      original_price: 28000,
      rating: 4.9,
      reviews_count: 980,
      region: 'Ladakh',
      state: 'Ladakh',
      best_months: JSON.stringify(['January', 'February']),
      trek_distance: '62 km',
      base_camp: 'Leh',
      group_size: '10-15 trekkers',
      pickup_point: 'Leh Airport',
      short_description: 'Walk on the frozen Zanskar River in extreme winter conditions.',
      overview: 'The Chadar Trek is one of the most extreme and unique treks in the world. You walk on the frozen Zanskar River through dramatic gorges with temperatures dropping to -30°C.',
      highlights: JSON.stringify(['Walk on frozen river', 'Extreme winter experience', 'Unique Zanskar gorges', 'Ultimate adventure']),
      itinerary: JSON.stringify([{ day: 1, title: 'Arrive Leh', altitude: '11,500 ft', distance: 'N/A', time: 'Rest', description: 'Acclimatization day in Leh.', meals: ['Dinner'], stay: 'Hotel' }]),
      inclusions: JSON.stringify(['All meals', 'Specialized winter gear', 'Expert guides', 'Permits']),
      exclusions: JSON.stringify(['Flights to Leh', 'Travel insurance (mandatory)', 'Personal gear']),
      things_to_carry: JSON.stringify(['Extreme cold gear (-30°C rated)', 'Gumboots', 'Hand warmers']),
      weather: JSON.stringify({ january: { high: '-5°C', low: '-30°C', condition: 'Extreme Cold' } }),
      upcoming_batches: JSON.stringify([{ date: 'Jan 20-28, 2026', slots: 8, price: 24950 }]),
      reviews: JSON.stringify([{ id: 1, name: 'Varun Aggarwal', location: 'Gurgaon', date: 'February 2025', rating: 5, title: 'Once in a lifetime', review: 'Walking on the frozen river is an unreal experience.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' }]),
      faqs: JSON.stringify([{ question: 'How cold does it get?', answer: 'Temperatures can drop to -30°C. Specialized gear is essential.' }]),
      trek_leader: JSON.stringify({ name: 'Tashi Namgyal', experience: '15 years', treks_led: 200, image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80', bio: 'Ladakhi native with unmatched expertise in the Zanskar region.' }),
      order: 9
    },
    {
      title: 'Goechala Trek',
      url: '/trek/goechala',
      slug: 'goechala',
      name: 'Goechala',
      tagline: 'Face to Face with Kanchenjunga',
      hero_image: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=1920&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=800&q=80']),
      difficulty: 'Difficult',
      duration: '10 Days',
      altitude: '16,000 ft',
      price: 19950,
      original_price: 22500,
      rating: 4.8,
      reviews_count: 1120,
      region: 'Sikkim',
      state: 'Sikkim',
      best_months: JSON.stringify(['March', 'April', 'May', 'October', 'November']),
      trek_distance: '90 km',
      base_camp: 'Yuksom',
      group_size: '10-15 trekkers',
      pickup_point: 'Bagdogra Airport',
      short_description: 'Get face-to-face views of the mighty Kanchenjunga.',
      overview: 'Goechala offers the closest views of Kanchenjunga, the third highest peak in the world. The trek passes through rhododendron forests, alpine meadows, and pristine glacial lakes.',
      highlights: JSON.stringify(['Kanchenjunga views', 'Samiti Lake', 'Rhododendron forests', 'Pristine Sikkim wilderness']),
      itinerary: JSON.stringify([{ day: 1, title: 'Bagdogra to Yuksom', altitude: '5,700 ft', distance: '150 km', time: '6 hours', description: 'Drive to historic Yuksom.', meals: ['Dinner'], stay: 'Guesthouse' }]),
      inclusions: JSON.stringify(['All meals', 'Camping gear', 'Permits', 'Expert guides']),
      exclusions: JSON.stringify(['Travel to Bagdogra', 'Travel insurance', 'Personal gear']),
      things_to_carry: JSON.stringify(['Sturdy trekking boots', 'Rain gear', 'Down jacket']),
      weather: JSON.stringify({ april: { high: '10°C', low: '-5°C', condition: 'Clear' } }),
      upcoming_batches: JSON.stringify([{ date: 'Apr 10-19, 2026', slots: 10, price: 19950 }]),
      reviews: JSON.stringify([{ id: 1, name: 'Divya Nair', location: 'Kochi', date: 'October 2025', rating: 5, title: 'Kanchenjunga up close', review: 'The sunrise view of Kanchenjunga is worth every difficult step.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' }]),
      faqs: JSON.stringify([{ question: 'Is prior experience needed?', answer: 'Yes, this is a challenging trek. Prior high-altitude experience is recommended.' }]),
      trek_leader: JSON.stringify({ name: 'Pemba Sherpa', experience: '14 years', treks_led: 160, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', bio: 'Sikkim native with extensive mountaineering experience.' }),
      order: 10
    },
    {
      title: 'Dayara Bugyal Trek',
      url: '/trek/dayara-bugyal',
      slug: 'dayara-bugyal',
      name: 'Dayara Bugyal',
      tagline: 'The Meadow of Dreams',
      hero_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80']),
      difficulty: 'Easy',
      duration: '5 Days',
      altitude: '11,950 ft',
      price: 9850,
      original_price: 11000,
      rating: 4.9,
      reviews_count: 2350,
      region: 'Uttarakhand',
      state: 'Uttarakhand',
      best_months: JSON.stringify(['December', 'January', 'February', 'March', 'April', 'May']),
      trek_distance: '18 km',
      base_camp: 'Raithal',
      group_size: '20-30 trekkers',
      pickup_point: 'Dehradun',
      short_description: 'Vast alpine meadows perfect for beginners and families.',
      overview: 'Dayara Bugyal is one of the most beautiful and accessible high-altitude meadows in India. Perfect for beginners, it offers stunning views and gentle trails through pristine landscapes.',
      highlights: JSON.stringify(['Vast alpine meadows', 'Beginner-friendly', 'Panoramic Himalayan views', 'Perfect for families']),
      itinerary: JSON.stringify([{ day: 1, title: 'Dehradun to Raithal', altitude: '7,500 ft', distance: '180 km', time: '7 hours', description: 'Drive to charming Raithal village.', meals: ['Dinner'], stay: 'Homestay' }]),
      inclusions: JSON.stringify(['All meals', 'Tents', 'Expert guides']),
      exclusions: JSON.stringify(['Personal expenses', 'Travel insurance']),
      things_to_carry: JSON.stringify(['Trekking shoes', 'Warm layers', 'Camera']),
      weather: JSON.stringify({ march: { high: '12°C', low: '0°C', condition: 'Clear' } }),
      upcoming_batches: JSON.stringify([{ date: 'Mar 5-9, 2026', slots: 25, price: 9850 }]),
      reviews: JSON.stringify([{ id: 1, name: 'Sanjana Reddy', location: 'Hyderabad', date: 'March 2026', rating: 5, title: 'Perfect first trek', review: 'The meadows are absolutely beautiful and the trek is very doable.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' }]),
      faqs: JSON.stringify([{ question: 'Is this trek suitable for children?', answer: 'Yes, Dayara Bugyal is suitable for children above 8 years with basic fitness.' }]),
      trek_leader: JSON.stringify({ name: 'Geeta Bhandari', experience: '5 years', treks_led: 70, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', bio: 'Passionate about introducing beginners to the joy of trekking.' }),
      order: 11
    },
    {
      title: 'Kuari Pass Trek',
      url: '/trek/kuari-pass',
      slug: 'kuari-pass',
      name: 'Kuari Pass',
      tagline: "Lord Curzon's Trail",
      hero_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80']),
      difficulty: 'Moderate',
      duration: '6 Days',
      altitude: '12,500 ft',
      price: 12950,
      original_price: 14500,
      rating: 4.8,
      reviews_count: 1650,
      region: 'Uttarakhand',
      state: 'Uttarakhand',
      best_months: JSON.stringify(['March', 'April', 'May', 'October', 'November', 'December']),
      trek_distance: '33 km',
      base_camp: 'Joshimath',
      group_size: '15-20 trekkers',
      pickup_point: 'Haridwar',
      short_description: "Follow Lord Curzon's historic trail with panoramic Himalayan views.",
      overview: 'Kuari Pass, also known as the Curzon Trail, was a favorite of Lord Curzon, the Viceroy of India. The trek offers unparalleled views of Nanda Devi, Kamet, and other Himalayan giants.',
      highlights: JSON.stringify(['Historic Curzon Trail', 'Views of Nanda Devi', 'Oak and rhododendron forests', 'Cultural village experience']),
      itinerary: JSON.stringify([{ day: 1, title: 'Haridwar to Joshimath', altitude: '6,100 ft', distance: '280 km', time: '10 hours', description: 'Scenic drive to Joshimath.', meals: ['Dinner'], stay: 'Hotel' }]),
      inclusions: JSON.stringify(['All meals', 'Camping gear', 'Expert guides', 'Permits']),
      exclusions: JSON.stringify(['Personal expenses', 'Travel insurance']),
      things_to_carry: JSON.stringify(['Trekking boots', 'Layered clothing', 'Rain jacket']),
      weather: JSON.stringify({ april: { high: '15°C', low: '2°C', condition: 'Clear' } }),
      upcoming_batches: JSON.stringify([{ date: 'Apr 1-6, 2026', slots: 15, price: 12950 }]),
      reviews: JSON.stringify([{ id: 1, name: 'Raghav Mehta', location: 'Ahmedabad', date: 'November 2025', rating: 5, title: 'Stunning views', review: 'The 360-degree views from Kuari Pass are unforgettable.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' }]),
      faqs: JSON.stringify([{ question: 'Why is it called Curzon Trail?', answer: 'Lord Curzon, the Viceroy of India, frequented this trail in the early 1900s.' }]),
      trek_leader: JSON.stringify({ name: 'Prakash Rawat', experience: '10 years', treks_led: 130, image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80', bio: 'History enthusiast who loves sharing stories of the Curzon Trail.' }),
      order: 12
    }
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
