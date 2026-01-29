import { useState, useEffect } from 'react'
import { getEntries, getSingleEntry, getEntryByField, isConfigured } from '../lib/contentstack'

/**
 * Custom hook to fetch multiple entries from Contentstack
 * Falls back to provided default data if CMS is not configured or fetch fails
 */
export function useEntries(contentType, fallbackData = [], options = {}) {
  const [data, setData] = useState(fallbackData)
  const [loading, setLoading] = useState(isConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }

    async function fetchData() {
      try {
        setLoading(true)
        const entries = await getEntries(contentType, options)
        
        if (entries && entries.length > 0) {
          setData(entries)
        }
      } catch (err) {
        console.error(`Error in useEntries for ${contentType}:`, err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [contentType])

  return { data, loading, error, isFromCMS: isConfigured }
}

/**
 * Custom hook to fetch a single entry from Contentstack
 * Falls back to provided default data if CMS is not configured or fetch fails
 */
export function useSingleEntry(contentType, fallbackData = null) {
  const [data, setData] = useState(fallbackData)
  const [loading, setLoading] = useState(isConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }

    async function fetchData() {
      try {
        setLoading(true)
        const entry = await getSingleEntry(contentType)
        
        if (entry) {
          setData(entry)
        }
      } catch (err) {
        console.error(`Error in useSingleEntry for ${contentType}:`, err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [contentType])

  return { data, loading, error, isFromCMS: isConfigured }
}

/**
 * Custom hook to fetch a single entry by a field value (e.g., slug)
 * Falls back to provided default data if CMS is not configured or fetch fails
 */
export function useEntryByField(contentType, field, value, fallbackData = null) {
  const [data, setData] = useState(fallbackData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!value) {
      setLoading(false)
      return
    }

    if (!isConfigured) {
      setLoading(false)
      return
    }

    async function fetchData() {
      try {
        setLoading(true)
        const entry = await getEntryByField(contentType, field, value)
        
        if (entry) {
          setData(entry)
        }
      } catch (err) {
        console.error(`Error in useEntryByField for ${contentType}:`, err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [contentType, field, value])

  return { data, loading, error, isFromCMS: isConfigured }
}

/**
 * Custom hook to fetch all page content at once
 * Useful for SSG or initial page load
 */
export function usePageContent() {
  const [content, setContent] = useState({
    siteSettings: null,
    navigation: [],
    heroSlides: [],
    testimonials: [],
    features: [],
    advantages: [],
    trekCategories: null,
    featuredTreks: [],
    faqs: [],
    footer: null
  })
  const [loading, setLoading] = useState(isConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }

    async function fetchAllContent() {
      try {
        setLoading(true)
        
        // Fetch all content types in parallel
        const [
          siteSettings,
          navigation,
          heroSlides,
          testimonials,
          features,
          advantages,
          trekCategories,
          featuredTreks,
          faqs,
          footer
        ] = await Promise.all([
          getSingleEntry('site_settings'),
          getEntries('navigation', { orderBy: 'order' }),
          getEntries('hero_slide', { orderBy: 'order' }),
          getEntries('testimonial', { orderBy: 'order' }),
          getEntries('feature', { orderBy: 'order' }),
          getEntries('advantage', { orderBy: 'order' }),
          getSingleEntry('trek_categories'),
          getEntries('featured_trek', { orderBy: 'order' }),
          getEntries('faq', { orderBy: 'order' }),
          getSingleEntry('footer')
        ])

        setContent({
          siteSettings,
          navigation,
          heroSlides,
          testimonials,
          features,
          advantages,
          trekCategories,
          featuredTreks,
          faqs,
          footer
        })
      } catch (err) {
        console.error('Error fetching page content:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllContent()
  }, [])

  return { content, loading, error, isFromCMS: isConfigured }
}
