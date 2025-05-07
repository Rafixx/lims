import { Tecnica } from '@/features/solicitudes/interfaces/solicitud.interface'

interface Props {
  tecnica: Tecnica
}

export const TecnicaItem = ({ tecnica }: Props) => {
  return (
    <div className="flex justify-between items-center bg-muted rounded-md px-3 py-2 text-sm">
      <span className="font-medium text-primary">
        {tecnica.tecnica_proc?.tecnica_proc || `Técnica ${tecnica.id_tecnica}`}
      </span>
      <span className="text-xs text-gray-600 uppercase tracking-wide">{tecnica.estado}</span>
    </div>
  )
}
