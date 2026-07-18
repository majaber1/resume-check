import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca", 900: "#312e81" },
      },
      boxShadow: { soft: "0 20px 60px -24px rgba(15,23,42,.22)" },
    },
  },
  plugins: [],
};
export default config;
