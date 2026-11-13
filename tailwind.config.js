/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // رنگ‌های تم از متغیرهای CSS خوانده می‌شوند (src/config/accents.ts)
        primary: {
          DEFAULT: 'rgb(var(--c-primary) / <alpha-value>)',
          50: 'rgb(var(--c-primary-50) / <alpha-value>)',
          100: 'rgb(var(--c-primary-100) / <alpha-value>)',
          600: 'rgb(var(--c-primary-600) / <alpha-value>)',
          700: 'rgb(var(--c-primary-700) / <alpha-value>)',
        },
        secondary: { DEFAULT: 'rgb(var(--c-secondary) / <alpha-value>)' },
        surface: { DEFAULT: '#F7F8FC', dark: '#0F1220' },
        ink: { DEFAULT: '#1B1E2E', soft: '#5B6076' },
      },
      fontFamily: { sans: ['Vazirmatn Variable', 'Vazirmatn', 'system-ui', 'sans-serif'] },
      borderRadius: { xl2: '1.25rem' },
      boxShadow: { card: '0 1px 2px rgba(27,30,46,.04), 0 4px 16px rgba(27,30,46,.06)' },
    },
  },
  plugins: [],
};
