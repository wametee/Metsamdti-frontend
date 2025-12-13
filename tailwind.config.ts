// tailwind.config.ts
import type { Config } from 'tailwindcss';
/* Suppress missing type declarations for the Tailwind typography plugin */
// @ts-ignore: no types for '@tailwindcss/typography'
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        mulberry: {
          50: '#FDF4FF',
          100: '#FAE8FF',
          200: '#F5D0FE',
          300: '#E879F9',
          400: '#D946EF',
          500: '#C026D3',
          600: '#A21CAF',
          700: '#86198F',
          800: '#701A75',
          900: '#4C1D95',
          950: '#2E1065',
        },

        // Raw palettes (exact from your Figma)
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0F0F0F',
        },

        rose: {
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
        },

        red: {
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },

        green: {
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },

        cream: {
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },

        // SEMANTIC TOKENS — USE THESE IN YOUR CODE
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#FAFAFA',
          lighter: '#F5F5F5',
          darker: '#F0F0F0',
          elevated: '#FAFAFA',
          sunken: '#F5F5F5',
        },

        border: {
          DEFAULT: '#E5E5E5',
          subtle: '#F0F0F0',
          lighter: '#F5F5F5',
          darker: '#D4D4D4',
          disabled: '#E0E0E0',
        },

        text: {
          title: '#171717',
          body: '#262626',
          subtle: '#525252',
          caption: '#737373',
          disabled: '#A3A3A3',
          inverse: '#FFFFFF',
        },

        icon: {
          DEFAULT: '#262626',
          subtle: '#525252',
          disabled: '#D4D4D4',
        },

        // State colors
        primary: {
          DEFAULT: '#C026D3',
          container: '#FAE8FF',
          'on-container': '#701A75',
          'on': '#FFFFFF',
        },

        success: {
          DEFAULT: '#22C55E',
          container: '#F0FDF4',
          'on-container': '#15803D',
          'on': '#FFFFFF',
        },

        error: {
          DEFAULT: '#EF4444',
          container: '#FEF2F2',
          'on-container': '#7F1D1D',
          'on': '#FFFFFF',
        },

        warning: {
          DEFAULT: '#F97316',
          container: '#FFFCF5',
          'on-container': '#7C2D12',
          'on': '#FFFFFF',
        },

        info: {
          DEFAULT: '#F43F5E',
          container: '#FFF1F2',
          'on-container': '#881337',
          'on': '#FFFFFF',
        },

        // Dark mode overrides
        'dark-surface': '#171717',
        'dark-border': '#404040',
        'dark-text': '#E5E5E5',
      },

      fontFamily: {
        // Use the Quicksand variable injected by next/font/google (app/layout.tsx)
        // This keeps Tailwind utilities like `font-sans` pointing to Quicksand.
        sans: ['var(--font-quicksand)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.006em' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],

        // Fluid responsive headings (mobile → desktop)
        'display-1': ['clamp(3.75rem, 8vw + 1rem, 6rem)', { lineHeight: '1.1', letterSpacing: '-0.06em' }],
        'display-2': ['clamp(3rem, 6.5vw + 0.8rem, 5rem)', { lineHeight: '1.15', letterSpacing: '-0.05em' }],
        'heading-1': ['clamp(2.5rem, 5.5vw + 0.6rem, 4.5rem)', { lineHeight: '1.2', letterSpacing: '-0.04em' }],
        'heading-2': ['clamp(2rem, 4.5vw + 0.5rem, 3.75rem)', { lineHeight: '1.25', letterSpacing: '-0.03em' }],
        'heading-3': ['clamp(1.75rem, 4vw + 0.4rem, 3rem)', { lineHeight: '1.3', letterSpacing: '-0.025em' }],
        'heading-4': ['clamp(1.5rem, 3.5vw + 0.3rem, 2.5rem)', { lineHeight: '1.35', letterSpacing: '-0.02em' }],
      },

      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
      },

      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 0, 0.08)',
        elevated: '0 10px 30px rgba(0, 0, 0, 0.12)',
      },

      screens: {
        xs: '475px',
      },
    },
  },

  plugins: [
    typography,
    function ({ addUtilities }: { addUtilities: (...args: any[]) => any }) {
      addUtilities({
        '.text-balance': { textWrap: 'balance' },
        '.bg-gradient-primary': {
          background: 'linear-gradient(135deg, #C026D3 0%, #A21CAF 100%)',
        },
      });
    },
  ],
};

export default config;