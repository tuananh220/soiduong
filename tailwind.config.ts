import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: "#8B0000",
          deep: "#5E0000",
          light: "#A8232A",
        },
        cream: {
          DEFAULT: "#FDFBF7",
          dim: "#F4EFE4",
        },
        gold: {
          DEFAULT: "#D4AF37",
          soft: "#E7CD7A",
        },
        charcoal: {
          DEFAULT: "#1C1A17",
          soft: "#2B2723",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wideish: "0.04em",
      },
      boxShadow: {
        gold: "0 0 40px -10px rgba(212, 175, 55, 0.45)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at 50% 30%, rgba(212,175,55,0.16), transparent 60%)",
      },
    },
  },
  plugins: [],
};
export default config;
