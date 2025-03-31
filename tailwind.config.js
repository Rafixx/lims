/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}' // Asegúrate de ajustar la ruta según tu estructura de carpetas
  ],
  theme: {
    extend: {
      colors: {
        menuText: {
          light: 'gray-600',
          dark: 'gray-100'
        },
        primary: {
          DEFAULT: '#CC533D', // Naranja oscuro
          light: '#E67E22', // Naranja claro
          dark: '#A04000' // Naranja oscuro
        },
        secondary: {
          DEFAULT: '#67BDC3', // Azul verdoso
          light: '#7FB3D5', // Azul claro
          dark: '#2980B9', // Azul oscuro
          byNumber: {
            100: '#E0F7FA'
          }
        },
        accent: {
          DEFAULT: '#F2AD4A', // Amarillo
          light: '#F8C471', // Amarillo claro
          dark: '#F39C12', // Amarillo oscuro
          byNumber: {
            100: '#FFF3E0'
          }
        },
        white: {
          DEFAULT: '#F9FCFB'
        },
        estados: {
          default: {
            200: '#BFC9CA',
            800: '#95A5A6'
          },
          Pendiente: {
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
          },
          Finalizada: {
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
