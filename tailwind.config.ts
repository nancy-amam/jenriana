import type { Config } from 'tailwindcss'

const config: Config = {
  
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Standard Next.js src directory
    './lib/**/*.{js,ts,jsx,tsx,mdx}', // Crucial for scanning dummy-data.ts for dynamic classes
  ]
}