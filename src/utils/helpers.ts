import { VALIDATION, DATE_FORMATS, FILE_LIMITS } from './constants';

// Date Utilities
export const formatDate = (date: string | Date, format: string = DATE_FORMATS.DISPLAY): string => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Fecha inválida';
  }
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  switch (format) {
    case DATE_FORMATS.DISPLAY:
      return `${day}/${month}/${year}`;
    case DATE_FORMATS.API:
      return `${year}-${month}-${day}`;
    case DATE_FORMATS.DATETIME:
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case DATE_FORMATS.TIME:
      return `${hours}:${minutes}`;
    default:
      return d.toLocaleDateString();
  }
};

export const isDateInRange = (date: string | Date, startDate: string | Date, endDate: string | Date): boolean => {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return d >= start && d <= end;
};

export const addDays = (date: string | Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Validation Utilities
export const validateCI = (ci: string): boolean => {
  if (!ci || ci.length < VALIDATION.CI_MIN_LENGTH || ci.length > VALIDATION.CI_MAX_LENGTH) {
    return false;
  }
  return /^\d+$/.test(ci);
};

export const validateEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return VALIDATION.PHONE_REGEX.test(phone);
};

export const validateSerial = (serial: string): boolean => {
  return VALIDATION.SERIAL_REGEX.test(serial);
};

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateLength = (value: string, min: number, max: number): boolean => {
  return value.length >= min && value.length <= max;
};

// File Utilities
export const validateFileSize = (file: File, maxSize: number = FILE_LIMITS.MAX_IMAGE_SIZE): boolean => {
  return file.size <= maxSize;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!validateFileType(file, FILE_LIMITS.ALLOWED_IMAGE_TYPES)) {
    return { valid: false, error: 'Tipo de archivo no permitido. Use JPG, PNG o WebP.' };
  }
  
  if (!validateFileSize(file, FILE_LIMITS.MAX_IMAGE_SIZE)) {
    return { valid: false, error: 'El archivo es demasiado grande. Máximo 5MB.' };
  }
  
  return { valid: true };
};

export const validatePDFFile = (file: File): { valid: boolean; error?: string } => {
  if (!validateFileType(file, FILE_LIMITS.ALLOWED_DOCUMENT_TYPES)) {
    return { valid: false, error: 'Solo se permiten archivos PDF.' };
  }
  
  if (!validateFileSize(file, FILE_LIMITS.MAX_PDF_SIZE)) {
    return { valid: false, error: 'El archivo es demasiado grande. Máximo 10MB.' };
  }
  
  return { valid: true };
};

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// String Utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  return str.split(' ').map(word => capitalize(word)).join(' ');
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

// Number Utilities
export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toLocaleString('es-ES', { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals 
  });
};

export const formatPercentage = (num: number, decimals: number = 1): string => {
  return `${formatNumber(num, decimals)}%`;
};

export const formatCurrency = (amount: number, currency: string = 'BOB'): string => {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Array Utilities
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Object Utilities
export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const isEmpty = (obj: any): boolean => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// Color Utilities
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const getContrastColor = (hexColor: string): string => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#000000';
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

// Local Storage Utilities
export const setLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// URL Utilities
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

export const parseQueryString = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

// Debounce Utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle Utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Random Utilities
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const randomColor = (): string => {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
};

// Export all utilities
export default {
  // Date
  formatDate,
  isDateInRange,
  addDays,
  
  // Validation
  validateCI,
  validateEmail,
  validatePhone,
  validateSerial,
  validateRequired,
  validateLength,
  
  // File
  validateFileSize,
  validateFileType,
  validateImageFile,
  validatePDFFile,
  getFileExtension,
  formatFileSize,
  
  // String
  capitalize,
  capitalizeWords,
  slugify,
  truncate,
  
  // Number
  formatNumber,
  formatPercentage,
  formatCurrency,
  
  // Array
  groupBy,
  sortBy,
  unique,
  chunk,
  
  // Object
  omit,
  pick,
  isEmpty,
  
  // Color
  hexToRgb,
  rgbToHex,
  getContrastColor,
  
  // Storage
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  
  // URL
  buildQueryString,
  parseQueryString,
  
  // Utilities
  debounce,
  throttle,
  generateId,
  generateUUID,
  randomColor,
};