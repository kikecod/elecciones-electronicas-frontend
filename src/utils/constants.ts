// Application Constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

// File Upload Limits
export const FILE_LIMITS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_PDF_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
};

// Election States
export const ELECTION_STATES = {
  PROGRAMADA: 'Programada',
  ACTIVA: 'Activa',
  FINALIZADA: 'Finalizada',
  CANCELADA: 'Cancelada',
} as const;

// Voter States
export const VOTER_STATES = {
  HABILITADO: 'Habilitado',
  PENDIENTE: 'Pendiente',
  INHABILITADO: 'Inhabilitado',
} as const;

// Party States
export const PARTY_STATES = {
  PENDIENTE: 'Pendiente',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
} as const;

// Device States
export const DEVICE_STATES = {
  OPERATIVO: 'Operativo',
  EN_MANTENIMIENTO: 'En mantenimiento',
  INOPERATIVO: 'Inoperativo',
} as const;

// Precinct States
export const PRECINCT_STATES = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
} as const;

// Person Types
export const PERSON_TYPES = {
  ESTUDIANTE: 'Estudiante',
  DOCENTE: 'Docente',
} as const;

// Gender Options
export const GENDER_OPTIONS = {
  MASCULINO: 'Masculino',
  FEMENINO: 'Femenino',
  OTRO: 'Otro',
} as const;

// Device Types
export const DEVICE_TYPES = {
  TABLET: 'Tablet',
  LAPTOP: 'Laptop',
  DESKTOP: 'Desktop',
  SMARTPHONE: 'Smartphone',
} as const;

// Election Types
export const ELECTION_TYPES = {
  ESTUDIANTIL: 'Estudiantil',
  DOCENTE: 'Docente',
  ADMINISTRATIVA: 'Administrativa',
  MIXTA: 'Mixta',
} as const;

// Election Levels
export const ELECTION_LEVELS = {
  UNIVERSIDAD: 'Universidad',
  FACULTAD: 'Facultad',
  CARRERA: 'Carrera',
} as const;

// Candidate Positions
export const CANDIDATE_POSITIONS = {
  PRESIDENTE: 'Presidente',
  VICEPRESIDENTE: 'Vicepresidente',
  SECRETARIO: 'Secretario',
  TESORERO: 'Tesorero',
  VOCAL: 'Vocal',
} as const;

// Export Formats
export const EXPORT_FORMATS = {
  CSV: 'csv',
  PDF: 'pdf',
  EXCEL: 'excel',
} as const;

// Export Types
export const EXPORT_TYPES = {
  GENERAL: 'general',
  STUDENTS_BY_CAREER: 'students_by_career',
  TEACHERS_BY_FACULTY: 'teachers_by_faculty',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
} as const;

// Validation Rules
export const VALIDATION = {
  CI_MIN_LENGTH: 7,
  CI_MAX_LENGTH: 12,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[0-9\s\-\(\)]{7,15}$/,
  SERIAL_REGEX: /^[A-Z0-9\-]{5,20}$/,
} as const;

// Colors for Charts and UI
export const CHART_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#22C55E', // Green
  '#F97316', // Orange
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#6366F1', // Indigo
] as const;

// Status Colors
export const STATUS_COLORS = {
  SUCCESS: '#22C55E',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
  NEUTRAL: '#6B7280',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  CURRENT_ELECTION: 'current_election',
  THEME: 'theme',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifique su conexión a internet.',
  UNAUTHORIZED: 'No tiene permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  VALIDATION_ERROR: 'Los datos ingresados no son válidos.',
  SERVER_ERROR: 'Error interno del servidor. Intente nuevamente.',
  FILE_TOO_LARGE: 'El archivo es demasiado grande.',
  INVALID_FILE_TYPE: 'Tipo de archivo no permitido.',
  CAMERA_ACCESS_DENIED: 'No se pudo acceder a la cámara. Verifique los permisos.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Registro creado exitosamente.',
  UPDATED: 'Registro actualizado exitosamente.',
  DELETED: 'Registro eliminado exitosamente.',
  UPLOADED: 'Archivo subido exitosamente.',
  EXPORTED: 'Datos exportados exitosamente.',
  VOTE_CAST: 'Voto registrado exitosamente.',
} as const;

// Application Routes
export const ROUTES = {
  HOME: '/',
  ELECTION_MANAGEMENT: '/election-management',
  ELECTORAL_ROLL: '/electoral-roll',
  VOTER_REGISTRATION: '/voter-registration',
  PARTY_REGISTRATION: '/party-registration',
  PARTY_REGISTRATION_FORM: '/party-registration-form',
  PARTY_REVIEW: '/party-review',
  ACADEMIC_ADMIN: '/academic-admin',
  PRECINCT_ADMIN: '/precinct-admin',
  VOTING: '/voting',
  RESULTS: '/results',
} as const;

export default {
  API_CONFIG,
  FILE_LIMITS,
  ELECTION_STATES,
  VOTER_STATES,
  PARTY_STATES,
  DEVICE_STATES,
  PRECINCT_STATES,
  PERSON_TYPES,
  GENDER_OPTIONS,
  DEVICE_TYPES,
  ELECTION_TYPES,
  ELECTION_LEVELS,
  CANDIDATE_POSITIONS,
  EXPORT_FORMATS,
  EXPORT_TYPES,
  PAGINATION,
  DATE_FORMATS,
  VALIDATION,
  CHART_COLORS,
  STATUS_COLORS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
};