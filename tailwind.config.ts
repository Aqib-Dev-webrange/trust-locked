import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        package: ["var(--font-geist-sans)"],
        poppins: ["Poppins", "sans-serif"],
        mono: ["var(--font-geist-mono)"],
        
      }
    },
  },
  plugins: [],
} satisfies Config;
