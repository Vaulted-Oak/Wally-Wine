/* eslint perfectionist/sort-objects: 0 */
import type {Config} from 'tailwindcss';

import typographyPlugin from '@tailwindcss/typography';
import tailwindAnimatePlugin from 'tailwindcss-animate';
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          md: '1.5rem',
          xl: '20px',
          '2xl': '20px',
        },
        screens: {
          sm: '1280px',
          md: '1280px',
          lg: '1280px',
          xl: '1280px',
          '2xl': '1280px',
        },
      },
      fontFamily: {
        heading: 'var(--heading-font-family)',
        body: 'var(--heading-body-family)',
        extra: 'var(--heading-extra-family)',
      },
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },
        primaryGreen: '#00461C',
        primaryBlack: '#212121',
        lightGreen: '#E6EDE8',
        primaryRed: '#AB2C2C'
      },
      fontSize: {
        sm: '12px',
        base: '14px',
        lg: '18px',
        xl: ['24px', '32px'],
        xxl: ['45px', '45px']
      },
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'},
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      dropShadow: {
        '3xl': '0px 0px 4px rgba(0, 0, 0, 0.25)'
      },
      boxShadow: {
        menuShadow: '0px 0px 24.4px 0px #0000002E',
        cardShadow: '0px 0px 6px 0px #00000040',
      },
    },
  },
  plugins: [
    typographyPlugin,
    tailwindAnimatePlugin,
    plugin(({addComponents, addVariant}) => {
      addComponents({
        '.section-padding': {
          paddingBottom: 'calc(var(--paddingBottom) * .75)',
          paddingTop: 'calc(var(--paddingTop) * .75)',
          '@screen sm': {
            paddingBottom: 'var(--paddingBottom)',
            paddingTop: 'var(--paddingTop)',
          },
        },
      });
      // Target touch and non-touch devices
      addVariant('touch', '@media (pointer: coarse)');
      addVariant('notouch', '@media (hover: hover)');
    }),
  ],
} satisfies Config;
