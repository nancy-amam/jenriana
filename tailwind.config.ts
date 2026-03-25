import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        /** Deep black — featured / luxury sections */
        'luxury-black': '#000000',
        'luxury-surface': '#0a0a0a',
        /** Mustard gold — accents, links, metadata */
        'luxury-gold': '#c9a227',
        'luxury-gold-hover': '#ddb83a',
        'luxury-muted': '#a3a3a3',
        /** Explore by Location + Featured Listings (same palette) */
        'explore-bg': '#121212',
        'explore-accent': '#a69175',
        'explore-accent-hover': '#b8a488',
      },
    },
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Standard Next.js src directory
    './lib/**/*.{js,ts,jsx,tsx,mdx}', // Crucial for scanning dummy-data.ts for dynamic classes
  ]
}