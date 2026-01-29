# High Altitude Trekkers - React UI

A beautiful, modern React.js website inspired by [Indiahikes.com](https://indiahikes.com/). This project showcases a trekking organization's website with stunning visuals, smooth animations, and a great user experience.

## Features

- 🏔️ **Hero Section** - Full-screen carousel with beautiful mountain imagery
- 💬 **Testimonials** - Horizontal scrolling testimonial cards
- ✨ **Features Section** - 5 reasons why choose us with animated cards
- 🗺️ **Trek Categories** - Browse treks by month, difficulty, duration, or region
- 📋 **Trek Detail Pages** - Comprehensive trek pages with itinerary, pricing, reviews, and booking
- ❓ **FAQ Section** - Accordion-style frequently asked questions
- 📧 **Newsletter** - Email subscription form
- 🤖 **AI Assistant** - Floating chat widget for user queries (available on all pages)
- 📱 **Fully Responsive** - Works on all device sizes
- 🔗 **React Router** - Client-side routing for seamless navigation

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Vite** - Lightning-fast build tool
- **Contentstack CMS** - Headless CMS for content management
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library
- **CSS Custom Properties** - Themeable design system

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## CMS Integration (Contentstack)

This project is integrated with **Contentstack CMS**. All content can be managed from the Contentstack dashboard.

### Quick Setup

1. Create a `.env` file in the project root:

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

# AI Assistant Configuration (Optional)
VITE_ASSISTANT_API_URL=https://your-api-endpoint.com/chat
VITE_ASSISTANT_AUTH_HEADER_KEY=Authorization
VITE_ASSISTANT_AUTH_HEADER_VALUE=Bearer your_api_token_here
```

2. Run the automated setup script to create all content types and entries:

```bash
npm run setup:cms
```

3. See `CONTENTSTACK_SETUP.md` for detailed instructions.

### Fallback Behavior

The website includes fallback data for all content. If Contentstack is not configured:
- The website displays default hardcoded content
- A warning appears in the browser console
- The website remains fully functional

This ensures the site works during development without CMS configuration.

## AI Assistant Widget

The website includes a floating AI Assistant widget that appears on all pages. Users can click the chat icon to open a conversational interface for queries about treks.

### Configuration

Add these environment variables to your `.env` file:

```env
VITE_ASSISTANT_API_URL=https://your-api-endpoint.com/chat
VITE_ASSISTANT_AUTH_HEADER_KEY=Authorization
VITE_ASSISTANT_AUTH_HEADER_VALUE=Bearer your_api_token_here
```

### API Request Format

The assistant sends POST requests with this format:

```json
{
  "query": "User's question here",
  "conversation_id": "session_timestamp"
}
```

### API Response Format

The assistant expects responses in one of these formats:

```json
{
  "response": "<p>HTML content here</p>"
}
// OR
{
  "answer": "<p>HTML content here</p>"
}
// OR
{
  "message": "<p>HTML content here</p>"
}
```

The response content should be HTML-formatted as it will be rendered directly in the chat UI.

### Features

- 💬 Floating chat button with animation
- 🎨 Beautiful conversational UI
- 📱 Fully responsive (mobile-friendly)
- ⌨️ Quick question suggestions
- 📝 HTML response rendering (tables, lists, code, etc.)
- 🔄 Loading states with typing indicator
- ❌ Error handling with fallback contact info
- 🎯 Minimizable chat window

## Project Structure

```
src/
├── components/
│   ├── Header.jsx & Header.css       # Navigation bar
│   ├── Hero.jsx & Hero.css           # Hero carousel
│   ├── Testimonials.jsx & .css       # Testimonial section
│   ├── Features.jsx & Features.css   # Why choose us
│   ├── TrekCategories.jsx & .css     # Trek browsing
│   ├── FAQ.jsx & FAQ.css             # FAQs
│   ├── Footer.jsx & Footer.css       # Footer
│   └── AIAssistant.jsx & .css        # AI Chat Widget
├── pages/
│   ├── HomePage.jsx                  # Home page
│   ├── TreksPage.jsx & .css          # All treks listing
│   └── TrekDetail.jsx & .css         # Individual trek details
├── hooks/
│   └── useContentstack.js            # CMS data fetching hooks
├── lib/
│   └── contentstack.js               # Contentstack SDK configuration
├── App.jsx                           # Main app component with routing
├── App.css                           # App styles
├── main.jsx                          # Entry point
└── index.css                         # Global styles & CSS variables
```

## Design Features

- **Typography**: Playfair Display for headings, Outfit for body text
- **Color Palette**: Deep forest greens (#1a5f4a) with warm orange accents (#e85d04)
- **Animations**: Scroll-triggered animations, hover effects, smooth transitions
- **Layout**: CSS Grid and Flexbox for responsive layouts

## Customization

The design system uses CSS custom properties defined in `src/index.css`. You can easily customize:

- Colors (`--color-primary`, `--color-accent`, etc.)
- Typography (`--font-display`, `--font-body`)
- Spacing (`--space-sm`, `--space-md`, etc.)
- Border radius (`--radius-sm`, `--radius-md`, etc.)
- Shadows (`--shadow-sm`, `--shadow-md`, etc.)

## License

This project is for educational purposes. All trek and testimonial data is fictional.

---

Made with ❤️ for mountain lovers

