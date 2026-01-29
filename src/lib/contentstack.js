import Contentstack from 'contentstack'

/**
 * Contentstack Configuration
 * 
 * Create a .env file in the root directory with these variables:
 * 
 * VITE_CONTENTSTACK_API_KEY=your_api_key_here
 * VITE_CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token_here
 * VITE_CONTENTSTACK_ENVIRONMENT=production
 * VITE_CONTENTSTACK_REGION=us
 * 
 * Get these values from your Contentstack dashboard:
 * Settings > Stack > API Keys
 */

const config = {
  apiKey: import.meta.env.VITE_CONTENTSTACK_API_KEY || '',
  deliveryToken: import.meta.env.VITE_CONTENTSTACK_DELIVERY_TOKEN || '',
  environment: import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT || 'production',
  region: import.meta.env.VITE_CONTENTSTACK_REGION || 'us'
}

// Validate configuration
const isConfigured = Boolean(config.apiKey && config.deliveryToken)

// Initialize Contentstack SDK
let Stack = null

if (isConfigured) {
  const stackConfig = {
    api_key: config.apiKey,
    delivery_token: config.deliveryToken,
    environment: config.environment
  }

  // Add region if EU
  if (config.region === 'eu') {
    stackConfig.region = Contentstack.Region.EU
  }

  Stack = Contentstack.Stack(stackConfig)
}

/**
 * Fetch a single entry by content type and entry UID
 */
export async function getEntry(contentType, entryUid) {
  if (!Stack) {
    console.warn('Contentstack not configured. Using fallback data.')
    return null
  }
  
  try {
    const result = await Stack
      .ContentType(contentType)
      .Entry(entryUid)
      .toJSON()
      .fetch()
    
    return result
  } catch (error) {
    console.error(`Error fetching entry ${entryUid} from ${contentType}:`, error)
    return null
  }
}

/**
 * Fetch all entries from a content type
 */
export async function getEntries(contentType, options = {}) {
  if (!Stack) {
    console.warn('Contentstack not configured. Using fallback data.')
    return []
  }
  
  try {
    const Query = Stack.ContentType(contentType).Query()
    
    // Apply ordering if specified
    if (options.orderBy) {
      Query.ascending(options.orderBy)
    }
    
    if (options.orderByDesc) {
      Query.descending(options.orderByDesc)
    }
    
    // Apply limit if specified
    if (options.limit) {
      Query.limit(options.limit)
    }
    
    // Include references if specified
    if (options.includeReference) {
      options.includeReference.forEach(ref => {
        Query.includeReference(ref)
      })
    }
    
    const result = await Query.toJSON().find()
    return result[0] || []
  } catch (error) {
    console.error(`Error fetching entries from ${contentType}:`, error)
    return []
  }
}

/**
 * Fetch a single entry by content type (first entry found)
 */
export async function getSingleEntry(contentType) {
  if (!Stack) {
    console.warn('Contentstack not configured. Using fallback data.')
    return null
  }
  
  try {
    const result = await Stack
      .ContentType(contentType)
      .Query()
      .limit(1)
      .toJSON()
      .find()
    
    return result[0]?.[0] || null
  } catch (error) {
    console.error(`Error fetching single entry from ${contentType}:`, error)
    return null
  }
}

/**
 * Fetch a single entry by a specific field value (e.g., slug)
 */
export async function getEntryByField(contentType, field, value) {
  if (!Stack) {
    console.warn('Contentstack not configured. Using fallback data.')
    return null
  }
  
  try {
    const result = await Stack
      .ContentType(contentType)
      .Query()
      .where(field, value)
      .limit(1)
      .toJSON()
      .find()
    
    return result[0]?.[0] || null
  } catch (error) {
    console.error(`Error fetching entry by ${field}=${value} from ${contentType}:`, error)
    return null
  }
}

export { Stack, isConfigured }
export default Stack
