// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // adjust based on your project
  ],
  theme: {
    extend: {
      fontFamily: {
        jetbrains: ['"JetBrains Mono"', 'monospace'],
        chewy: ['"Chewy"', 'cursive'],
        merriweather: ['"Merriweather"', 'serif'],
      },
    },
  },
  plugins: [],
};
