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
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          900: "#0c4a6e",
        },
        // ── "Calm Flight" design system (additive) ─────────────
        ink: {
          DEFAULT: "#0B1220",
          800: "#131C2E",
          700: "#1E293B",
          600: "#334155",
          500: "#475569",
          400: "#64748B",
          300: "#94A3B8",
          200: "#E2E8F0",
        },
        canvas: "#F5F8FC",
        line: "#E4E9F1",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11,18,32,.04), 0 4px 16px rgba(11,18,32,.05)",
        lift: "0 2px 4px rgba(11,18,32,.04), 0 12px 32px rgba(11,18,32,.10)",
        glow: "0 0 0 1px rgba(14,165,233,.25), 0 12px 40px rgba(14,165,233,.28)",
        float: "0 24px 64px -12px rgba(11,18,32,.28)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        pop: {
          "0%": { opacity: "0", transform: "translateY(8px) scale(.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        aurora: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(3%,-4%,0) scale(1.08)" },
        },
        ping2: {
          "0%": { transform: "scale(1)", opacity: ".6" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        shimmer: "shimmer 1.4s infinite",
        pop: "pop .45s cubic-bezier(.2,.8,.2,1) both",
        marquee: "marquee 38s linear infinite",
        aurora: "aurora 14s ease-in-out infinite",
        ping2: "ping2 1.8s cubic-bezier(0,0,.2,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
