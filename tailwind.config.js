/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
        hana: ['font-serif tracking-wide text-lg transition-all '],
      },
       },
    },
    plugins: [],
  }