import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          bg: "#000000",
          text: "#ffffff",
          border: "#ffffff",
          accent: "#e5e5e5",
          muted: "#999999",
          dark: "#1a1a1a",
        },
      },
      fontFamily: {
        mono: ["'VT323'", "'Share Tech Mono'", "'Courier New'", "monospace"],
      },
      animation: {
        "typing": "typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite",
        "blink": "blink 1s infinite",
      },
      keyframes: {
        typing: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        "blink-caret": {
          "0%, 100%": { "border-color": "transparent" },
          "50%": { "border-color": "#ffffff" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

