/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          lime: '#DFFCA1',
          forest: '#094020',
          forestLight: '#1A5336',
          dark: '#131313',
          darkSurface: '#17191C',
          card: '#1A1A1A',
          cardBorder: '#2A2A2A',
          paper: '#FAF9F5',
          paperCard: '#FFFFFF',
          textMuted: '#9A9A96',
          textDark: '#17191C'
        }
      },
      fontFamily: {
        sans: ['"PP Neue Montreal"', 'sans-serif'],
        display: ['"PP Neue Montreal"', 'sans-serif'],
        editorial: ['"PP Neue Montreal"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace', 'sans-serif']
      },
      fontSize: {
        '10xl': ['9rem', { lineHeight: '0.95', letterSpacing: '-0.05em' }],
        '9xl': ['8rem', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        '8xl': ['6rem', { lineHeight: '0.98', letterSpacing: '-0.04em' }],
        '7xl': ['4.75rem', { lineHeight: '1.0', letterSpacing: '-0.04em' }],
        '6xl': ['3.75rem', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        '5xl': ['3rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
      }
    },
  },
  plugins: [],
};
