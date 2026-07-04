import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
          },
                colors: {
        brand: {
          50: "#eef4ff",
                      100: "#dce8ff",
                      200: "#bad4ff",
                      300: "#8fb7ff",
                      400: "#5c92ff",
                      500: "#2f6bff",
                      600: "#1a4dee",
                      700: "#153bc2",
                      800: "#153399",
                      900: "#152f78",
            },
                },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(15, 23, 42, 0.08)",
          },
                keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
                      "100%": { opacity: "1", transform: "translateY(0)" },
                },
        },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
          },
                },
},
  plugins: [],
    };

export default config;
