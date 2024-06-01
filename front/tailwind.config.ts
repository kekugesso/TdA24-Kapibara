import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        black: "#000000",
        white: "#ffffff",
        jet: "#333333",
        dark_blue: "#00384D",
        blue: "#74C7D3",
        yellow: "#FECB2E",
      }
    },
  },
  plugins: [
    require('tailwindcss-animated')
  ],
};
export default config;
