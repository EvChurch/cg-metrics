/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'proxima': ['Proxima Nova', 'sans-serif'],
      },
      fontWeight: {
        'thin': '100',
        'regular': '400',
        'bold': '700',
        'black': '900',
      },
      colors: {
        brand: {
          // Primary Reds
          "rich-red": '#E22A30',
          "mid-red": "#f3706d",
          "light-red": "#fda091",
          "pale-red": "#f8bdbd",
          'deep-red': '#91120D',
          'dark-brown': '#381611',

          // Neutrals
          black: '#0F0004',
          'dark-grey': '#333333',
          'mid-grey': '#716D6E',
          'warm-grey': '#DCDAD2',
          'cool-grey': '#E5E5E5',
          'warm-white': '#FEFAF4',
          white: '#FFFFFF',

          // Accent Colours (Use sparingly)
          blue: '#0096C3',       // Kids program
          orange: '#F25101',     // Fusion program
          purple: '#870394',     // Youth program
          gold: '#EEB753',       // Gold accent
        },
      },
    },
  },
  plugins: [],
} 