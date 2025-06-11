// types/partido.d.ts
export interface Representante {
  idPersona: number;
  ci: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  // ... otros campos
}

export interface Partido {
  idPartido: number;
  nombre: string;
  sigla: string;
  colorHex: string;
  logoUrl: string;
  representante: Representante;
  descripcion: string;
  // ... otros campos
}