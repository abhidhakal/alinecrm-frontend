/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
        },
        background: 'var(--background)',
        surface: 'var(--surface)',
        accent: 'var(--accent)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        foreground: 'var(--foreground)',
        text: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
          inverted: 'var(--text-inverted)',
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'premium': '0 20px 40px -10px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(14, 165, 233, 0.15)',
      }
    },
  },
  plugins: [],
}
