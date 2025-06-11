import { Faculty, Career } from '../types';

// Cambia la URL base según tu entorno
const API_BASE = 'http://localhost:9090/api';

export const getFaculties = async (): Promise<Faculty[]> => {
  const res = await fetch(`${API_BASE}/facultades`);
  if (!res.ok) throw new Error('Error al obtener facultades');
  return await res.json();
};

export const getPersonByCI = async (ci: string) => {
  const res = await fetch(`${API_BASE}/personas/buscar-por-ci/${ci}`);
  if (!res.ok) throw new Error('No encontrado');
  return await res.json();
};

export const createFaculty = async (payload: any) => {
  const res = await fetch(`${API_BASE}/facultades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al crear facultad');
  return await res.json();
};

export const updateFaculty = async (id: number, payload: any) => {
  const res = await fetch(`${API_BASE}/facultades/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al actualizar facultad');
  return await res.json();
};

export const deleteFaculty = async (id: number) => {
  const res = await fetch(`${API_BASE}/facultades/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar facultad');
  return true;
};

export const getCareers = async (): Promise<Career[]> => {
  const res = await fetch(`${API_BASE}/carreras`);
  if (!res.ok) throw new Error('Error al obtener carreras');
  return await res.json();
};

export const getCareerById = async (id: number): Promise<Career> => {
  const res = await fetch(`${API_BASE}/carreras/${id}`);
  if (!res.ok) throw new Error('Error al obtener carrera');
  return await res.json();
};

export const createCareer = async (payload: any) => {
  const res = await fetch(`${API_BASE}/carreras`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al crear carrera');
  return await res.json();
};

export const updateCareer = async (id: number, payload: any) => {
  const res = await fetch(`${API_BASE}/carreras/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al actualizar carrera');
  return await res.json();
};

export const deleteCareer = async (id: number) => {
  const res = await fetch(`${API_BASE}/carreras/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar carrera');
  return true;
};