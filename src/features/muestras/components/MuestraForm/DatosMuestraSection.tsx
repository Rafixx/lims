/**
 * @deprecated Este componente ha sido refactorizado y movido.
 *
 * La funcionalidad del Timeline ahora se encuentra en:
 * - TimelineEventsSection.tsx (componente reutilizable)
 * - Integrado en DatosGeneralesSection.tsx
 *
 * Este archivo se mantiene temporalmente para referencia y será eliminado
 * una vez confirmada la migración completa.
 */

export const DatosMuestraSection = () => {
  return (
    <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
      <p className="text-warning-800 text-sm">
        ⚠️ Este componente ha sido deprecado. La cronología de la muestra ahora se encuentra
        integrada en la sección de Datos Generales.
      </p>
    </div>
  )
}
