const API_BASE = 'http://localhost:8082/api';

export const getPersonByCI = async (ci: string) => {
  const res = await fetch(`${API_BASE}/personas/buscar-por-ci/${ci}`);
  if (!res.ok) throw new Error('Persona no encontrada');
  return await res.json();
};

//ESTUDIANTES

export const getStudents = async () => {
  const res = await fetch(`${API_BASE}/estudiantes`);
  if (!res.ok) throw new Error('Error al obtener estudiantes');
  return await res.json();
};

export const getStudentByCI = async (ci: string) => {
  const res = await fetch(`${API_BASE}/estudiantes/ci/${ci}`);
  if (!res.ok) throw new Error('Estudiante no encontrado');
  return await res.json();
};

export const createStudent = async (payload: any) => {
  const res = await fetch(`${API_BASE}/estudiantes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al crear estudiante');
  return await res.json();
};

export const updateStudent = async (id: number, payload: any) => {
  const res = await fetch(`${API_BASE}/estudiantes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al actualizar estudiante');
  return await res.json();
};

export const deleteStudent = async (id: number) => {
  const res = await fetch(`${API_BASE}/estudiantes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar estudiante');
  return true;
};

// DOCENTES

export const getTeachers = async () => {
  const res = await fetch(`${API_BASE}/docentes`);
  if (!res.ok) throw new Error('Error al obtener docentes');
  return await res.json();
};

export const getTeacherByCI = async (ci: string) => {
  const res = await fetch(`${API_BASE}/docentes/ci/${ci}`);
  if (!res.ok) throw new Error('Docente no encontrado');
  return await res.json();
};

export const createTeacher = async (payload: any) => {
  const res = await fetch(`${API_BASE}/docentes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al crear docente');
  return await res.json();
};

export const updateTeacher = async (id: number, payload: any) => {
  const res = await fetch(`${API_BASE}/docentes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al actualizar docente');
  return await res.json();
};

export const deleteTeacher = async (id: number) => {
  const res = await fetch(`${API_BASE}/docentes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar docente');
  return true;
};