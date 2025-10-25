import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        protest: ['"Protest Strike"', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
      },
      colors: {
        primary: "#171717",
        "primary-dark": "#FFFFFF",
        "backdrop-dark":"#1C232B",
        secondaryGrey: "#848484",
        gold: "#D1B000",
        "gold-dark": "#FFD700",
        section: "#F6F7F9",
        "section-dark": "#323A45",
        lighterSecondaryGrey: "#B3B3B3",
        "alt-table-row": "#ECEEF1",
        "alt-table-row-dark": "#282E37"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        'scroll-x-slow': 'scrollX 55s linear infinite', // Desktop 
        'scroll-x-fast': 'scrollX 20s linear infinite', // Mobile 
        fadeIn: 'fadeIn 0.3s ease-in-out forwards',
      },
      keyframes: {
        scrollX: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(0.25rem)' },  // starts slightly below, invisible
          to:   { opacity: '1', transform: 'translateY(0)' },        // ends at full opacity, normal position
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
};
export default config;
