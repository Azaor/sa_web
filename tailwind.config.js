/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      maxWidth: {
        'custom': '1600px', // Largeur maximale personnalisée
      },
    },
  },
  plugins: [],
}

