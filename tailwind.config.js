/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}' // Asegúrate de ajustar la ruta según tu estructura de carpetas
  ],
  theme: {
    extend: {
      colors: {
        // === COLORES PRINCIPALES DEL SISTEMA ===
        // Colores primarios alineados con el sistema de botones
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Color principal de botones primary
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },

        // === COLORES DE ESTADO ===
        // Mantener coherencia con variants de botones
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a', // Color de botones success
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },

        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626', // Color de botones danger
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        },

        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706', // Color de botones warning
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },

        info: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2', // Color de botones info
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344'
        },

        // === COLORES COMPLEMENTARIOS ===
        accent: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5', // Color de botones accent
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b'
        },

        // === COLORES DE SUPERFICIE Y NEUTROS ===
        surface: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712'
        },

        // === COLORES LEGACY (compatibilidad) ===
        // Mantener para no romper componentes existentes
        muted: '#CBF5EF',
        base: '#F9FCFB',
        pink: '#FFCFD2',
        actions: '#2563EB' // Redirigido a primary-600
      },

      // === ESPACIADO Y LAYOUT ===
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem'
      },

      // === TIPOGRAFÍA ===
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ]
      },

      // === ANIMACIONES Y TRANSICIONES ===
      transitionDuration: {
        250: '250ms',
        300: '300ms'
      },

      // === BORDES Y SOMBRAS ===
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      },

      boxShadow: {
        soft: '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
        medium: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
        strong: '0 8px 32px 0 rgba(0, 0, 0, 0.12)'
      }
    }
  },
  plugins: [
    // Puedes agregar plugins como @tailwindcss/typography si necesitas estilos tipográficos avanzados.
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms')
  ]
}
