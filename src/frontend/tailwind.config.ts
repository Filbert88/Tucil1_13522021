import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        basic: "#D0ED57",
        bgblack: "#0e1111",
      },
      fontFamily: {
        rajdhaniBold: ["Rajdhani-Bold", "sans-serif"],
        rajdhaniLight: ["Rajdhani-Light", "sans-serif"],
        rajdhaniMedium: ["Rajdhani-Medium", "sans-serif"],
        rajdhaniRegular: ["Rajdhani-Regular", "sans-serif"],
        rajdhaniSemiBold: ["Rajdhani-Semibold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
