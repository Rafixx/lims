/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}' // Asegúrate de ajustar la ruta según tu estructura de carpetas
  ],
  theme: {
    extend: {
      colors: {
        // Define tus colores personalizados
        primary: '#1D4ED8', // Ejemplo: azul primario
        secondary: '#64748B', // Ejemplo: gris azulado
        accent: '#F59E0B' // Ejemplo: naranja/acento
        // Puedes agregar más colores o paletas personalizadas aquí
      },
      fontFamily: {
        // Define tus familias tipográficas globales
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'ui-serif', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace']
      }
      // Otras personalizaciones: spacing, borderRadius, etc.
    }
  },
  plugins: [
    // Puedes agregar plugins como @tailwindcss/typography si necesitas estilos tipográficos avanzados.
    // require('@tailwindcss/typography')
  ]
}
