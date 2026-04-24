import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        navy: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        indigo: {
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
        },
        emerald: { 500: "#10B981", 600: "#059669" },
        amber: { 500: "#F59E0B", 600: "#D97706" },
        rose: { 500: "#EF4444", 600: "#DC2626" },
        sky: { 500: "#3B82F6" },
        // urgency tokens
        urgency: {
          urgent: "#EF4444",
          high: "#F97316",
          medium: "#EAB308",
          low: "#22C55E",
          fyi: "#3B82F6",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)",
        lift: "0 10px 30px -10px rgb(15 23 42 / 0.15)",
      },
      borderRadius: {
        card: "12px",
        modal: "16px",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.25s ease-out",
        shimmer: "shimmer 1.4s infinite linear",
      },
    },
  },
  plugins: [],
};

export default config;
