import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
<<<<<<< HEAD
  plugins: [
    require('daisyui'),  
  ],
  daisyui: {
    themes: false,
    darkTheme: false,
    base: true,
    styled: true,
    utils: true,
=======
  plugins: [daisyui],
  daisyui: {
    themes: ["corporate"],
>>>>>>> cart
  },
}