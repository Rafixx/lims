//src/features/resultado/interfaces/tipoResultado.interface.tsx
export interface TipoResultado {
  id: string
  nombre: string
  tipo: TipoResultadoEnum
  unidad: string | null
  decimales: number | null
  min: number | null
  max: number | null
}

export enum TipoResultadoEnum {
  NUMERO = 'NUMERICO',
  TEXTO = 'TEXTO',
  BOOLEANO = 'BOOLEANO'
}
