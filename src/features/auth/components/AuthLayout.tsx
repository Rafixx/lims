import { FlaskConical, Microscope, TestTubes, Dna } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const iconUrl = `${import.meta.env.BASE_URL}icons/icon.svg`

  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-950 relative overflow-hidden flex-col justify-between p-12">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-12 left-16">
            <FlaskConical className="w-24 h-24 text-white" strokeWidth={1} />
          </div>
          <div className="absolute top-1/4 right-20">
            <Microscope className="w-32 h-32 text-white" strokeWidth={1} />
          </div>
          <div className="absolute bottom-1/3 left-1/4">
            <TestTubes className="w-28 h-28 text-white" strokeWidth={1} />
          </div>
          <div className="absolute bottom-16 right-16">
            <Dna className="w-20 h-20 text-white" strokeWidth={1} />
          </div>
        </div>

        {/* Línea decorativa vertical */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400 via-accent-500 to-primary-700" />

        {/* Logo y marca */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            {/* <img src={iconUrl} alt="LIMS" className="h-10 w-10" /> */}
            {/* <span className="text-2xl font-bold text-white tracking-tight">LIMS</span> */}
          </div>
        </div>

        {/* Mensaje central */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Sistema de Gestión de Laboratorio Epigenético
          </h2>
          <p className="text-primary-300 text-lg leading-relaxed">
            Gestiona muestras, flujos de trabajo y resultados con trazabilidad completa.
          </p>

          {/* Indicadores */}
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success-400" />
              <span className="text-primary-200 text-sm">Trazabilidad completa de muestras</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success-400" />
              <span className="text-primary-200 text-sm">Worklists y flujos automatizados</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success-400" />
              <span className="text-primary-200 text-sm">
                Resultados y validaciones en tiempo real
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-white text-xl">Epidisease</p>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center bg-surface-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <img src={iconUrl} alt="LIMS" className="h-9 w-9" />
            <span className="text-xl font-bold text-surface-900 tracking-tight">LIMS</span>
          </div>

          {/* Encabezado */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-surface-900">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-surface-500">{subtitle}</p>}
          </div>

          {/* Contenido del formulario */}
          {children}
        </div>
      </div>
    </div>
  )
}
