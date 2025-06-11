// types/eleccion.d.ts
export interface Eleccion {
  id: number;
  nombre: string;
  tipo: string;
  nivel: string;
  fechaInicio: string;
  fechaFin: string;
  estado: boolean;
  descripcion: string;
  version: number;
}