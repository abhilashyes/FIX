import type { Config } from 'tailwindcss';

/**
 * Brand theme tokens — changeable per deployment.
 * White-dominant UI with a single red accent. Warm rounded display (Baloo 2) for
 * headings/wordmark, humanist sans (Inter) for body, Noto Sans fallback for Indic scripts.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#D7263D',
          hover: '#B71C30',
          deep: '#A41126',
          tint: '#FDF0F0',
        },
        ink: {
          DEFAULT: '#1C1B1A',
          muted: '#6B7280',
        },
        line: '#EAE7E4',
        // Semantic status colours (red stays the only brand accent).
        status: {
          reported: '#6B7280',
          verified: '#2563EB',
          prioritized: '#D97706',
          progress: '#7C3AED',
          resolved: '#16A34A',
          closed: '#4B5563',
        },
        severity: {
          low: '#16A34A',
          medium: '#D97706',
          high: '#EA580C',
          critical: '#DC2626',
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', '"Noto Sans"', 'system-ui', 'sans-serif'],
        sans: ['Inter', '"Noto Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(28, 27, 26, 0.04), 0 1px 3px rgba(28, 27, 26, 0.06)',
        sheet: '0 -4px 24px rgba(28, 27, 26, 0.12)',
      },
      maxWidth: {
        app: '1180px',
      },
    },
  },
  plugins: [],
} satisfies Config;
