/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F05A28',
          'orange-light': '#FF7A4D',
          'orange-dark': '#C84A1E',
          navy: '#1E2B6F',
          'navy-light': '#2E3E8F',
          purple: '#6B5ECD',
          'bg-light': '#F4F5FF',
          'bg-card': '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '24px',
      },
      boxShadow: {
        card: '0 2px 20px rgba(30,43,111,0.08)',
        'card-hover': '0 8px 30px rgba(30,43,111,0.14)',
      }
    }
  },
  plugins: []
}
