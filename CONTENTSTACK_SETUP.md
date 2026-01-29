# Contentstack CMS Setup Guide

This guide will help you set up Contentstack CMS for the High Altitude Trekkers website.

## 🚀 Quick Setup (Automated)

Use the included setup script to automatically create all content types and populate them with default content.

### Step 1: Create a Contentstack Stack

1. Log in to [Contentstack](https://app.contentstack.com/)
2. Create a new Stack (or use an existing one)

### Step 2: Get Your Credentials

1. Go to **Settings > Stack > API Keys**
2. Copy your **API Key**
3. Go to **Settings > Tokens > Management Tokens**
4. Create a new Management Token with full permissions
5. Copy the **Management Token**
6. Note your **Environment** name (usually `production`)

### Step 3: Create Environment File

Create a `.env` file in the project root:

```env
# For the website (Delivery API)
VITE_CONTENTSTACK_API_KEY=your_api_key_here
VITE_CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token_here
VITE_CONTENTSTACK_ENVIRONMENT=production
VITE_CONTENTSTACK_REGION=us

# For the setup script (Management API)
CONTENTSTACK_API_KEY=your_api_key_here
CONTENTSTACK_MANAGEMENT_TOKEN=your_management_token_here
CONTENTSTACK_ENVIRONMENT=production
CONTENTSTACK_REGION=us
```

### Step 4: Install Dependencies & Run Setup

```bash
# Install dependencies
npm install

# Run the setup script
npm run setup:cms
```

The script will:
- ✅ Create all 22 content types
- ✅ Populate them with default content from the website
- ✅ Skip any content types or entries that already exist

### Step 5: Upload Images & Publish

After running the script:
1. Go to your Contentstack dashboard
2. Upload images for hero slides, testimonials, and featured treks
3. **Publish all entries** to make them available via the Delivery API

---

## 📖 Manual Setup (Alternative)

If you prefer to create content types manually, follow the detailed guide below.

### 1. Create a Contentstack Stack

1. Log in to [Contentstack](https://app.contentstack.com/)
2. Create a new Stack (or use an existing one)
3. Go to **Settings > Stack > API Keys**
4. Copy your:
   - API Key
   - Delivery Token
   - Environment name

### 2. Environment Variables

Create a `.env` file in the project root:

```env
VITE_CONTENTSTACK_API_KEY=your_api_key_here
VITE_CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token_here
VITE_CONTENTSTACK_ENVIRONMENT=production
VITE_CONTENTSTACK_REGION=us
```

> **Note:** Use `eu` for region if your stack is in the EU data center.

### 3. Content Types to Create

Create the following content types in your Contentstack dashboard:

---

### 📋 site_settings (Single Entry)

Global site settings like logo text and contact info.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Logo Main Text | logo_main_text | Single Line Text | Yes |
| Logo Sub Text | logo_sub_text | Single Line Text | Yes |
| Contact Label | contact_label | Single Line Text | No |
| Shop Label | shop_label | Single Line Text | No |

---

### 🔗 navigation (Multiple Entries)

Navigation menu items.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| URL | url | Single Line Text | No |
| Order | order | Number | Yes |
| Has Dropdown | has_dropdown | Boolean | No |
| Dropdown Items | dropdown_items | Group (Multiple) | No |

**Dropdown Items Group:**
- Title (Single Line Text)
- URL (Single Line Text)

---

### 🖼️ hero_slide (Multiple Entries)

Hero carousel slides.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Subtitle | subtitle | Multi Line Text | Yes |
| Stat Text | stat_text | Single Line Text | No |
| Image | image | File | Yes |
| Order | order | Number | Yes |

---

### 📊 hero_stat (Multiple Entries)

Stats displayed in the hero section.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Icon | icon | Single Line Text | Yes |
| Value | value | Single Line Text | Yes |
| Label | label | Single Line Text | Yes |
| Order | order | Number | Yes |

**Icon options:** `users`, `star`, `shield`, `compass`

---

### ⚙️ hero_settings (Single Entry)

Hero section settings.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Badge Text | badge_text | Single Line Text | No |
| CTA Primary Text | cta_primary_text | Single Line Text | No |
| CTA Secondary Text | cta_secondary_text | Single Line Text | No |
| Scroll Text | scroll_text | Single Line Text | No |

---

### 💬 testimonial (Multiple Entries)

Customer testimonials.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Name | name | Single Line Text | Yes |
| Role | role | Single Line Text | Yes |
| Location | location | Single Line Text | No |
| Image | image | File | Yes |
| Quote | quote | Multi Line Text | Yes |
| Highlight | highlight | Single Line Text | Yes |
| Rating | rating | Number | Yes |
| Order | order | Number | Yes |

---

### ⚙️ testimonials_section (Single Entry)

Testimonials section settings.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Label | label | Single Line Text | No |
| Subtitle | subtitle | Multi Line Text | No |

---

### ✨ feature (Multiple Entries)

"Why Choose Us" feature cards.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Description | description | Multi Line Text | Yes |
| Icon | icon | Single Line Text | Yes |
| Color | color | Single Line Text | Yes |
| Highlights | highlights | Single Line Text | No |
| Order | order | Number | Yes |

**Icon options:** `shield`, `leaf`, `users`, `compass`, `sparkles`
**Highlights:** Comma-separated list (e.g., "Feature 1, Feature 2, Feature 3")

---

### ✅ advantage (Multiple Entries)

Advantage items.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Description | description | Multi Line Text | Yes |
| Order | order | Number | Yes |

---

### ⚙️ features_section (Single Entry)

Features section settings.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Label | label | Single Line Text | No |
| Advantages Title | advantages_title | Single Line Text | No |

---

### 🏷️ trek_category_tab (Multiple Entries)

Category filter tabs.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| ID | id | Single Line Text | Yes |
| Label | label | Single Line Text | Yes |
| Icon | icon | Single Line Text | Yes |
| Order | order | Number | Yes |

**Icon options:** `calendar`, `mountain`, `clock`, `map_pin`
**ID options:** `month`, `difficulty`, `duration`, `region`

---

### 📂 trek_category_data (Single Entry)

Category data (JSON structure).

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Month | month | JSON | No |
| Difficulty | difficulty | JSON | No |
| Duration | duration | JSON | No |
| Region | region | JSON | No |

**Example JSON for month:**
```json
[
  { "name": "January", "count": 12 },
  { "name": "February", "count": 15 }
]
```

---

### 🏔️ featured_trek (Multiple Entries)

Featured trek cards displayed on the homepage.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Slug | slug | Single Line Text | Yes |
| Name | name | Single Line Text | Yes |
| Image | image | File | Yes |
| Difficulty | difficulty | Single Line Text | Yes |
| Duration | duration | Single Line Text | Yes |
| Altitude | altitude | Single Line Text | Yes |
| Price | price | Single Line Text | Yes |
| Rating | rating | Number | Yes |
| Reviews | reviews | Number | No |
| Region | region | Single Line Text | Yes |
| Best Time | best_time | Single Line Text | No |
| Order | order | Number | Yes |

---

### ⚙️ trek_categories_section (Single Entry)

Trek categories section settings.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Label | label | Single Line Text | No |
| Subtitle | subtitle | Multi Line Text | No |
| Featured Title | featured_title | Single Line Text | No |
| View All Text | view_all_text | Single Line Text | No |

---

### ❓ faq (Multiple Entries)

FAQ items.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Question | question | Single Line Text | Yes |
| Answer | answer | Multi Line Text | Yes |
| Order | order | Number | Yes |

---

### ⚙️ faq_section (Single Entry)

FAQ section settings.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Label | label | Single Line Text | No |
| Subtitle | subtitle | Multi Line Text | No |
| Contact Title | contact_title | Single Line Text | No |
| Contact Description | contact_description | Multi Line Text | No |
| Contact CTA Primary | contact_cta_primary | Single Line Text | No |
| Contact CTA Secondary | contact_cta_secondary | Single Line Text | No |
| Phone Number | phone_number | Single Line Text | No |
| Hours Weekday | hours_weekday | Single Line Text | No |
| Hours Weekend | hours_weekend | Single Line Text | No |

---

### ⚙️ footer_settings (Single Entry)

Footer settings and content.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Logo Main Text | logo_main_text | Single Line Text | No |
| Logo Sub Text | logo_sub_text | Single Line Text | No |
| Description | description | Multi Line Text | No |
| Phone | phone | Single Line Text | No |
| Email | email | Single Line Text | No |
| Hours Weekday | hours_weekday | Single Line Text | No |
| Hours Weekend | hours_weekend | Single Line Text | No |
| Trusted By Label | trusted_by_label | Single Line Text | No |
| Newsletter Title | newsletter_title | Single Line Text | No |
| Newsletter Subtitle | newsletter_subtitle | Multi Line Text | No |
| Newsletter Placeholder | newsletter_placeholder | Single Line Text | No |
| Newsletter Button | newsletter_button | Single Line Text | No |
| Copyright Text | copyright_text | Single Line Text | No |
| Copyright Suffix | copyright_suffix | Single Line Text | No |

---

### 📁 footer_link_group (Multiple Entries)

Footer link groups.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Links | links | Group (Multiple) | Yes |
| Order | order | Number | Yes |

**Links Group:**
- Title (Single Line Text)
- URL (Single Line Text)

---

### 🔗 social_link (Multiple Entries)

Social media links.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Icon | icon | Single Line Text | Yes |
| Label | label | Single Line Text | Yes |
| URL | url | Single Line Text | Yes |
| Order | order | Number | Yes |

**Icon options:** `facebook`, `instagram`, `youtube`, `linkedin`

---

### 🏢 office (Multiple Entries)

Office locations.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| City | city | Single Line Text | Yes |
| Address | address | Multi Line Text | Yes |
| Order | order | Number | Yes |

---

### ✅ trusted_by (Multiple Entries)

Trusted by logos/names.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| Name | name | Single Line Text | Yes |
| Logo | logo | File | No |
| Order | order | Number | Yes |

---

### 📜 legal_link (Multiple Entries)

Legal/footer links.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| URL | url | Single Line Text | Yes |
| Order | order | Number | Yes |

---

### 🏔️ trek_detail (Multiple Entries - Page)

Detailed trek information pages.

| Field Name | Field UID | Field Type | Required |
|------------|-----------|------------|----------|
| Title | title | Single Line Text | Yes |
| URL | url | Single Line Text | Yes (unique) |
| Slug | slug | Single Line Text | Yes (unique) |
| Name | name | Single Line Text | Yes |
| Tagline | tagline | Single Line Text | No |
| Hero Image URL | hero_image | Single Line Text | No |
| Gallery URLs (JSON) | gallery | Multi Line Text | No |
| Difficulty | difficulty | Single Line Text | Yes |
| Duration | duration | Single Line Text | Yes |
| Altitude | altitude | Single Line Text | Yes |
| Price | price | Number | Yes |
| Original Price | original_price | Number | No |
| Rating | rating | Number | No |
| Reviews Count | reviews_count | Number | No |
| Region | region | Single Line Text | Yes |
| State | state | Single Line Text | No |
| Best Months (JSON) | best_months | Multi Line Text | No |
| Trek Distance | trek_distance | Single Line Text | No |
| Base Camp | base_camp | Single Line Text | No |
| Group Size | group_size | Single Line Text | No |
| Pickup Point | pickup_point | Single Line Text | No |
| Short Description | short_description | Multi Line Text | No |
| Overview | overview | Multi Line Text | No |
| Highlights (JSON) | highlights | Multi Line Text | No |
| Itinerary (JSON) | itinerary | Multi Line Text | No |
| Inclusions (JSON) | inclusions | Multi Line Text | No |
| Exclusions (JSON) | exclusions | Multi Line Text | No |
| Things to Carry (JSON) | things_to_carry | Multi Line Text | No |
| Weather (JSON) | weather | Multi Line Text | No |
| Upcoming Batches (JSON) | upcoming_batches | Multi Line Text | No |
| Reviews (JSON) | reviews | Multi Line Text | No |
| FAQs (JSON) | faqs | Multi Line Text | No |
| Trek Leader (JSON) | trek_leader | Multi Line Text | No |
| Order | order | Number | No |

**Note:** JSON fields should contain stringified JSON arrays or objects. Use `JSON.stringify()` when setting values and `JSON.parse()` when reading.

---

## 4. Publish Entries

After creating content types and adding entries:

1. Go to each entry
2. Click **Publish**
3. Select your environment (e.g., `production`)
4. Click **Publish**

## 5. Test the Integration

1. Make sure your `.env` file has the correct credentials
2. Restart the development server: `npm run dev`
3. Check the browser console for any errors
4. Content should now be fetched from Contentstack

## Fallback Behavior

The website includes fallback data for all content. If Contentstack is not configured or an API call fails:
- The website will display the default hardcoded content
- A warning will appear in the browser console
- The website remains fully functional

This ensures the site works even without CMS configuration during development.

## Need Help?

- [Contentstack Documentation](https://www.contentstack.com/docs/content-managers)
- [Contentstack JavaScript SDK](https://www.contentstack.com/docs/developers/sdks/content-delivery-sdk/javascript-browser)

