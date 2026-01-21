import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Primary (Blue)
        primary: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
          light: "#dbeafe",
        },
        // Secondary (WhatsApp Green)
        secondary: {
          DEFAULT: "#25d366",
          hover: "#1fb855",
          light: "#dcfce7",
        },
        // Surface
        surface: {
          DEFAULT: "#f8fafc",
          elevated: "#ffffff",
        },
        // Feedback
        success: "#22c55e",
        warning: "#f59e0b",
        error: {
          DEFAULT: "#ef4444",
          light: "#fef2f2",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        xs: "0.7rem",
        sm: "0.8rem",
        base: "0.9375rem",
        lg: "1.05rem",
        xl: "1.15rem",
        "2xl": "1.35rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      spacing: {
        "1": "0.15rem",
        "2": "0.35rem",
        "3": "0.6rem",
        "4": "0.85rem",
        "5": "1rem",
        "6": "1.25rem",
        "8": "1.75rem",
        "10": "2.25rem",
        "12": "2.75rem",
        "16": "3.5rem",
        "20": "4.5rem",
      },
      borderRadius: {
        sm: "0.2rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
        slow: "300ms",
      },
      maxWidth: {
        container: "1100px",
      },
      minHeight: {
        touch: "44px",
      },
    },
  },
  plugins: [],
} satisfies Config;
