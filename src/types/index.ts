// Common Types
export interface BaseEntity {
  id: number;
  created_at?: string;
  updated_at?: string;
}

// Election Types
export interface Election extends BaseEntity {
  nombre: string;
  tipo: string;
  nivel: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'Programada' | 'Activa' | 'Finalizada' | 'Cancelada';
  descripcion: string;
  version: string;
}

// Person Types
export interface Person extends BaseEntity {
  ci: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_nacimiento: string;
  email: string;
  telefono: string;
  direccion: string;
  genero: 'Masculino' | 'Femenino' | 'Otro';
  tipo: 'Estudiante' | 'Docente';
}

// Voter Types
export interface Voter extends BaseEntity {
  person_id: number;
  person?: Person;
  rostro_imagen: string;
  qr_code: string;
  estado: 'Habilitado' | 'Pendiente' | 'Inhabilitado';
  faculty?: string;
  career?: string;
  student_id?: string;
}

// Party Types
export interface Party extends BaseEntity {
  nombre: string;
  sigla: string;
  fecha_fundacion: string;
  color: string;
  logo?: string;
  representante_id: string;
  representante_name: string;
  descripcion: string;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
  faculty?: string;
}

export interface Candidate extends BaseEntity {
  party_id: number;
  candidate_id: string;
  candidate_name: string;
  cargo: string;
  numero_lista: number;
  es_cabeza: boolean;
  lema: string;
  plan_propuesta?: string;
}

// Academic Types
export interface Faculty extends BaseEntity {
  nombre: string;
  codigo: string;
  fechaCreacion: string;
  idDecano: number;
  estado: boolean;
  nombreDecano: string;
  ciDecano: string;
  carreras?: Career[] | 0;
}

export interface Career extends BaseEntity {
  idFacultad: number;
  nombre: string;
  codigo: string;
  duracionSemestres: number;
  estado: boolean;
  numeroEstudiantes?: number;
}

// Precinct Types
export interface Precinct extends BaseEntity {
  name: string;
  campus: string;
  building: string;
  classroom: string;
  capacity: number;
  responsible_person: string;
  status: 'Activo' | 'Inactivo';
}

export interface Device extends BaseEntity {
  type: string;
  serial: string;
  model: string;
  precinct_id: number;
  public_key: string;
  last_revision: string;
  status: 'Operativo' | 'En mantenimiento' | 'Inoperativo';
}

// Voting Types
export interface Vote extends BaseEntity {
  voter_id: number;
  party_id: number;
  election_id: number;
  device_id: number;
  timestamp: string;
  encrypted_vote: string;
}

// Results Types
export interface ElectionResults {
  election_id: number;
  total_votes: number;
  participation_rate: number;
  parties: PartyResult[];
  faculties: FacultyResult[];
  voter_types: VoterTypeResult[];
}

export interface PartyResult {
  party_id: number;
  party_name: string;
  party_acronym: string;
  votes: number;
  percentage: number;
  color: string;
}

export interface FacultyResult {
  faculty: string;
  registered_voters: number;
  votes_cast: number;
  participation_rate: number;
}

export interface VoterTypeResult {
  type: 'Estudiante' | 'Docente';
  registered: number;
  voted: number;
  participation_rate: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Form Types
export interface VoterRegistrationForm {
  person: Omit<Person, 'id' | 'created_at' | 'updated_at'>;
  face_image: File | null;
}

export interface PartyRegistrationForm {
  party: Omit<Party, 'id' | 'created_at' | 'updated_at' | 'estado'>;
  logo: File | null;
  candidates: Omit<Candidate, 'id' | 'party_id' | 'created_at' | 'updated_at'>[];
}

export interface FacultyForm {
  name: string;
  code: string;
  creation_date: string;
  dean_ci: string;
  dean_name: string;
}

export interface CareerForm {
  faculty_id: number;
  name: string;
  code: string;
  duration_semesters: number;
}

export interface PrecinctForm {
  name: string;
  campus: string;
  building: string;
  classroom: string;
  capacity: number;
  responsible_person: string;
  status: 'Activo' | 'Inactivo';
}

export interface DeviceForm {
  type: string;
  serial: string;
  model: string;
  precinct_id: number;
  public_key: string;
  last_revision: string;
  status: 'Operativo' | 'En mantenimiento' | 'Inoperativo';
}

// Export Types
export interface ExportOptions {
  type: 'general' | 'students_by_career' | 'teachers_by_faculty';
  format: 'csv' | 'pdf';
  career?: string;
  faculty?: string;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}