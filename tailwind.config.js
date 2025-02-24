/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}' // Asegúrate de ajustar la ruta según tu estructura de carpetas
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2C3E50', // Azul oscuro elegante
          light: '#34495E', // Variante más clara
          dark: '#22313F' // Variante más intensa
        },
        secondary: {
          DEFAULT: '#7F8C8D', // Gris azulado neutro
          light: '#95A5A6',
          dark: '#606F73'
        },
        accent: {
          DEFAULT: '#E67E22' // Naranja apagado, con carácter sin ser estridente
        },
        estados: {
          default: {
            200: '#BFC9CA',
            800: '#95A5A6'
          },
          pendiente: {
            200: '#F8C471',
            800: '#F39C12'
          },
          en_proceso: {
            200: '#7FB3D5',
            800: '#2980B9'
          },
          actualizado: {
            200: '#7DCEA0',
            800: '#27AE60'
          },
          completado: {
            200: '#BB8FCE',
            800: '#8E44AD'
          }
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
