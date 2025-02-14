/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}' // Asegúrate de ajustar la ruta según tu estructura de carpetas
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A',
          light: '#3B82F6',
          dark: '#1D4ED8'
        },
        secondary: {
          DEFAULT: '#047857',
          light: '#10B981',
          dark: '#065F46'
        },
        accent: {
          DEFAULT: '#0EA5E9'
        }
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
