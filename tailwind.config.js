// ─────────────────────────────────────────────────────
// File:    tailwind.config.js
// Agent:   @Frontend_Engineer
// Sprint:  1
// ─────────────────────────────────────────────────────

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Jun 3D Studio brand palette
        brand: {
          50:  '#fdf8f3',
          100: '#faefd9',
          200: '#f4ddb0',
          300: '#ecc57f',
          400: '#e3a84d',
          500: '#d9892a',  // primary brand orange
          600: '#c26e1f',
          700: '#a1551a',
          800: '#83441c',
          900: '#6b381b',
        },
        stone: {
          850: '#1c1917',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      aspectRatio: {
        'product': '4 / 5',
      },
    },
  },
  plugins: [],
};
