/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand Colors
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        tertiary: 'var(--tertiary)',

        // Layout & Content Colors
        background: 'var(--background)',
        foreground: 'var(--foreground)', // Maps to text-primary
        muted: 'var(--text-secondary)',  // Maps to text-secondary
        border: 'var(--border-primary)', // Maps to border-primary
        button: 'var(--foreground)',
      },
    },
  },
  plugins: [],
}
