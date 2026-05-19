/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#292524",
        "primary-active": "#0c0a09",
        ink: "#0c0a09",
        body: "#4e4e4e",
        "body-strong": "#292524",
        muted: "#777169",
        "muted-soft": "#a8a29e",
        hairline: "#e7e5e4",
        "hairline-soft": "#f0efed",
        "hairline-strong": "#d6d3d1",
        canvas: "#f5f5f5",
        "canvas-soft": "#fafafa",
        "canvas-deep": "#0c0a09",
        "surface-card": "#ffffff",
        "surface-strong": "#f0efed",
        "gradient-mint": "#a7e5d3",
        "gradient-peach": "#f4c5a8",
        "gradient-lavender": "#c8b8e0",
        "gradient-sky": "#a8c8e8",
        "gradient-rose": "#e8b8c4",
        "on-primary": "#ffffff",
        "on-dark": "#ffffff",
        "on-dark-soft": "#a8a29e",
        "semantic-error": "#dc2626",
        "semantic-success": "#16a34a",
      },
      fontFamily: {
        display: ['"EB Garamond"', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        "display-sm": ["24px", { lineHeight: "1.2", fontWeight: "300" }],
        "title-md": ["20px", { lineHeight: "1.35", fontWeight: "500" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400", letterSpacing: "0.16px" }],
        "body-sm": ["15px", { lineHeight: "1.47", fontWeight: "400", letterSpacing: "0.15px" }],
        caption: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "caption-uppercase": ["12px", { lineHeight: "1.4", fontWeight: "600", letterSpacing: "0.96px" }],
      },
      borderRadius: {
        pill: "9999px",
      },
      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        base: "16px",
        md: "20px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
        section: "96px",
      },
      boxShadow: {
        card: "0 4px 16px rgba(0, 0, 0, 0.04)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-28px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        "page-turn": {
          "0%": { transform: "rotateY(0deg)", opacity: "1" },
          "50%": { transform: "rotateY(180deg)", opacity: "0.6" },
          "100%": { transform: "rotateY(360deg)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "page-turn": "page-turn 3s ease-in-out infinite",
        "fade-in": "fade-in 0.4s ease-out",
      },
    },
  },
  plugins: [],
}
