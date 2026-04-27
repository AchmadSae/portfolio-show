/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#ededed",
        muted: "#1a1a1a",
        "muted-foreground": "#a1a1aa",
        primary: "#ffffff",
        card: "#121212",
        "card-foreground": "#ffffff",
        border: "#27272a",
        secondary: "#1f1f1f",
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
