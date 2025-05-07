/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}' // Asegúrate de ajustar la ruta según tu estructura de carpetas
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F4953',
        accent: '#F98E6E',
        info: '#67BDC3',
        muted: '#CBF5EF',
        base: '#F9FCFB',
        danger: '#CC533D',
        warning: '#F2AD4A',
        pink: '#FFCFD2'
      }
    }
  },
  plugins: [
    // Puedes agregar plugins como @tailwindcss/typography si necesitas estilos tipográficos avanzados.
    // require('@tailwindcss/typography')
  ]
}
