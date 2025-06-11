import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, UserCheck, Download, Filter, Eye, X, UserPlus } from 'lucide-react';
import * as electoralStore from '../services/ElectoralRollStore';
import { Faculty, Career } from '../types';
import * as academicService from '../services/AcademicAdminStore';

const ElectoralRollPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingVoter, setEditingVoter] = useState<any>(null);
  const [voterToDelete, setVoterToDelete] = useState<any>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [voters, setVoters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const selectedFacultyObj = editingVoter
    ? faculties.find(f => f.nombre === editingVoter.faculty)
    : null;
  const availableCareers = selectedFacultyObj ? selectedFacultyObj.carreras : [];

  useEffect(() => {
    // Reemplaza por tu servicio real
    academicService.getFaculties()
      .then(setFaculties)
      .catch(() => setFaculties([]));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const students = await electoralStore.getStudents();
        const teachers = await electoralStore.getTeachers();

        // Unifica el formato para la tabla
        const formattedStudents = students.map((s: any) => ({
          id: s.id,
          ci: s.ci,
          name: `${s.nombre} ${s.apellido_paterno} ${s.apellido_materno}`,
          studentId: s.matricula,
          faculty: s.nombreFacultad,
          career: s.nombreCarrera,
          type: 'Estudiante',
          status: s.estado,
          email: s.email,
          phone: s.telefono,
          gender: s.genero,
          direccion: s.direccion,
          birthDate: s.fechaNacimiento,
          matricula: s.matricula,
          fecha_ingreso: s.fechaIngreso,
          semestre_actual: s.semestreActual
        }));

        const formattedTeachers = teachers.map((t: any) => ({
          id: t.id,
          ci: t.ci,
          name: `${t.nombre} ${t.apellido_paterno} ${t.apellido_materno}`,
          studentId: t.codigoDocente,
          faculty: t.nombreFacultad,
          career: t.nombreCarrera,
          type: 'Docente',
          status: t.activo,
          email: t.email,
          phone: t.telefono,
          direccion: t.direccion,
          gender: t.genero,
          birthDate: t.fechaNacimiento,
          categoria_docente: t.categoriaDocente,
          grado_academico: t.gradoAcademico,
          fecha_ingreso: t.fechaIngreso
        }));

        setVoters([...formattedStudents, ...formattedTeachers]);
      } catch {
        setVoters([]);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Export modal state
  const [exportType, setExportType] = useState('general');
  const [exportFormat, setExportFormat] = useState('csv');
  const [selectedCareer, setSelectedCareer] = useState('');
  const [selectedFacultyExport, setSelectedFacultyExport] = useState('');

  // Filter voters based on search term and filters
  const filteredVoters = voters.filter(voter => {
    const matchesSearch =
      (voter.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (voter.ci?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (voter.studentId?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());

    const matchesFaculty = selectedFaculty === '' || voter.faculty === selectedFaculty;
    const matchesType = selectedType === '' || voter.type === selectedType;
    const matchesStatus = selectedStatus === '' || voter.status === selectedStatus;

    return matchesSearch && matchesFaculty && matchesType && matchesStatus;
  });

  // Handle edit voter
  const handleEditVoter = (voter: any) => {
    setEditingVoter(voter);
    setShowEditModal(true);
  };

  // Handle delete voter
  const handleDeleteVoter = (voter: any) => {
    setVoterToDelete(voter);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      if (voterToDelete.type === 'Estudiante') {
        await electoralStore.deleteStudent(voterToDelete.id);
      } else if (voterToDelete.type === 'Docente') {
        await electoralStore.deleteTeacher(voterToDelete.id);
      }
      // Recarga la lista
      const students = await electoralStore.getStudents();
      const teachers = await electoralStore.getTeachers();

      const formattedStudents = students.map((s: any) => ({
        id: s.id,
        ci: s.ci,
        name: `${s.nombre} ${s.apellido_paterno} ${s.apellido_materno}`,
        studentId: s.matricula,
        faculty: s.nombreFacultad,
        career: s.nombreCarrera,
        type: 'Estudiante',
        status: s.estado,
        email: s.email,
        phone: s.telefono,
        gender: s.genero,
        birthDate: s.fechaNacimiento,
        matricula: s.matricula,
        fecha_ingreso: s.fechaIngreso,
        semestre_actual: s.semestreActual
      }));

      const formattedTeachers = teachers.map((t: any) => ({
        id: t.id,
        ci: t.ci,
        name: `${t.nombre} ${t.apellido_paterno} ${t.apellido_materno}`,
        studentId: t.codigoDocente,
        faculty: t.nombreFacultad,
        career: t.nombreCarrera,
        type: 'Docente',
        status: t.estado,
        email: t.email,
        phone: t.telefono,
        gender: t.genero,
        birthDate: t.fechaNacimiento,
        categoria_docente: t.categoriaDocente,
        grado_academico: t.gradoAcademico,
        fecha_ingreso: t.fechaIngreso
      }));

      setVoters([...formattedStudents, ...formattedTeachers]);
      setShowDeleteModal(false);
      setVoterToDelete(null);
    } catch {
      alert('Error al eliminar el votante');
    }
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    try {
      if (editingVoter.type === 'Estudiante') {
        // Divide el nombre completo en partes (ajusta si tu formato es diferente)
        const [nombre = '', apellido_paterno = '', apellido_materno = ''] = (editingVoter.name || '').split(' ');

        // Busca el idCarrera según el nombre de la carrera seleccionada
        const selectedCareerObj = availableCareers.find(c => c.nombre === editingVoter.career);


        const payload = {
          ci: editingVoter.ci,
          nombre,
          apellido_paterno,
          apellido_materno,
          fechaNacimiento: editingVoter.birthDate,
          email: editingVoter.email,
          telefono: editingVoter.phone,
          direccion: editingVoter.direccion || '',
          genero: editingVoter.gender || '',
          fechaAlta: editingVoter.fecha_alta || new Date().toISOString().split('T')[0],
          matricula: editingVoter.matricula,
          fechaIngreso: editingVoter.fecha_ingreso,
          semestreActual: Number(editingVoter.semestre_actual),
          estado: editingVoter.status,
          idCarrera: selectedCareerObj ? selectedCareerObj.id : null
        };

        console.log('Payload a enviar:', payload);
        console.dir(payload);
        console.log(JSON.stringify(payload, null, 2));

        await electoralStore.updateStudent(editingVoter.id, payload);
      } else if (editingVoter.type === 'Docente') {
        // Divide el nombre completo en partes (ajusta si tu formato es diferente)
        const [nombre = '', apellido_paterno = '', apellido_materno = ''] = (editingVoter.name || '').split(' ');

        // Busca el idCarrera según el nombre de la carrera seleccionada
        const selectedCareerObj = availableCareers.find(c => c.nombre === editingVoter.career);

        const payload = {
          ci: editingVoter.ci,
          nombre,
          apellido_paterno,
          apellido_materno,
          fechaNacimiento: editingVoter.birthDate,
          email: editingVoter.email,
          telefono: editingVoter.phone,
          direccion: editingVoter.direccion || '',
          genero: editingVoter.gender || '',
          fechaAlta: editingVoter.fecha_alta || new Date().toISOString().split('T')[0],
          categoriaDocente: editingVoter.categoria_docente || '',
          gradoAcademico: editingVoter.grado_academico || '',
          fechaIngreso: editingVoter.fecha_ingreso,
          activo: editingVoter.status, // O ajusta según tu lógica de estado
          idCarrera: selectedCareerObj ? selectedCareerObj.id : null
        };

        console.log('Payload a enviar:', payload);
        console.dir(payload);
        console.log(JSON.stringify(payload, null, 2));

        await electoralStore.updateTeacher(editingVoter.id, payload);
      }

      // Recarga la lista (igual que antes)
      const students = await electoralStore.getStudents();
      const teachers = await electoralStore.getTeachers();

      const formattedStudents = students.map((s: any) => ({
        id: s.id,
        ci: s.ci,
        name: `${s.nombre} ${s.apellido_paterno} ${s.apellido_materno}`,
        studentId: s.matricula,
        faculty: s.nombreFacultad,
        career: s.nombreCarrera,
        type: 'Estudiante',
        status: s.estado,
        email: s.email,
        phone: s.telefono,
        gender: s.genero,
        birthDate: s.fechaNacimiento,
        matricula: s.matricula,
        fecha_ingreso: s.fechaIngreso,
        semestre_actual: s.semestreActual
      }));

      const formattedTeachers = teachers.map((t: any) => ({
        id: t.id,
        ci: t.ci,
        name: `${t.nombre} ${t.apellido_paterno} ${t.apellido_materno}`,
        studentId: t.codigoDocente,
        faculty: t.nombreFacultad,
        career: t.nombreCarrera,
        type: 'Docente',
        status: t.activo, // O ajusta según tu backend
        email: t.email,
        phone: t.telefono,
        gender: t.genero,
        birthDate: t.fechaNacimiento,
        categoria_docente: t.categoriaDocente,
        grado_academico: t.gradoAcademico,
        fecha_ingreso: t.fechaIngreso
      }));

      setVoters([...formattedStudents, ...formattedTeachers]);
      setShowEditModal(false);
      setEditingVoter(null);
    } catch {
      alert('Error al actualizar el votante');
    }
  };

  // Handle export
  const handleExport = () => {
    let exportData = '';
    let filename = '';

    // Filter data based on export type
    let dataToExport = voters;

    if (exportType === 'students_by_career') {
      dataToExport = voters.filter(v => v.type === 'Estudiante' && v.career === selectedCareer);
      filename = `Estudiantes_${selectedCareer}_${new Date().toISOString().split('T')[0]}`;
    } else if (exportType === 'teachers_by_faculty') {
      dataToExport = voters.filter(v => v.type === 'Docente' && v.faculty === selectedFacultyExport);
      filename = `Docentes_${selectedFacultyExport}_${new Date().toISOString().split('T')[0]}`;
    } else {
      filename = `Padron_Electoral_${new Date().toISOString().split('T')[0]}`;
    }

    if (exportFormat === 'csv') {
      // Generate CSV
      const headers = ['CI', 'Nombre', 'ID/Código', 'Facultad', 'Carrera', 'Tipo', 'Estado', 'Email', 'Teléfono'];
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(voter => [
          voter.ci,
          `"${voter.name}"`,
          voter.studentId,
          voter.faculty,
          voter.career,
          voter.type,
          voter.status,
          voter.email,
          voter.phone
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } else {
      // Generate PDF (simulated)
      const pdfContent = `
PADRÓN ELECTORAL
===============

Fecha de generación: ${new Date().toLocaleDateString()}
Tipo de exportación: ${exportType === 'general' ? 'General' : exportType === 'students_by_career' ? `Estudiantes - ${selectedCareer}` : `Docentes - ${selectedFacultyExport}`}

Total de registros: ${dataToExport.length}

DETALLE:
${dataToExport.map((voter, index) => `
${index + 1}. ${voter.name}
   CI: ${voter.ci}
   ID: ${voter.studentId}
   Facultad: ${voter.faculty}
   Carrera: ${voter.career}
   Tipo: ${voter.type}
   Estado: ${voter.status}
   Email: ${voter.email}
   Teléfono: ${voter.phone}
`).join('')}

Documento generado automáticamente por el Sistema Electoral Universitario.
      `;

      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.txt`;
      link.click();
      window.URL.revokeObjectURL(url);
    }

    setShowExportModal(false);
  };

  return (
    <div className="fade-in py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Padrón Electoral</h1>
            <p className="text-gray-600">
              Gestión de estudiantes y docentes habilitados para el proceso electoral.
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/voter-registration')}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Registrar Persona
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/voter-registration')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Votante
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setShowExportModal(true)}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Votantes</p>
                <p className="text-2xl font-bold text-gray-900">{voters.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Habilitados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {voters.filter(v => v.status === 'Habilitado').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {voters.filter(v => v.status === 'Pendiente').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Docentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {voters.filter(v => v.type === 'Docente').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre, CI o ID..."
                  className="form-input pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <select
                className="form-input"
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
              >
                <option value="">Todas las Facultades</option>
                {faculties.map(faculty => (
                  <option key={faculty.id} value={faculty.nombre}>
                    {faculty.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="form-input"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Docente">Docente</option>
              </select>
            </div>
            <div>
              <select
                className="form-input"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="Habilitado">Habilitado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Inhabilitado">Inhabilitado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Voters table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre Completo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID/Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facultad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrera
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVoters.map((voter) => (
                  <tr key={voter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {voter.ci}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {voter.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {voter.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {voter.faculty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {voter.career}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${voter.type === 'Docente'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                        }`}>
                        {voter.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${voter.status === 'Habilitado'
                        ? 'bg-green-100 text-green-800'
                        : voter.status === 'Pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {voter.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Ver detalles"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleEditVoter(voter)}
                          title="Editar"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteVoter(voter)}
                          title="Eliminar"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVoters.length === 0 && (
            <div className="text-center py-12">
              <UserCheck className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">No se encontraron votantes con los filtros seleccionados.</p>
            </div>
          )}
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Exportar Padrón Electoral</h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Exportación
                  </label>
                  <select
                    className="form-input"
                    value={exportType}
                    onChange={(e) => setExportType(e.target.value)}
                  >
                    <option value="general">Todo en General</option>
                    <option value="students_by_career">Estudiantes por Carrera</option>
                    <option value="teachers_by_faculty">Docentes por Facultad</option>
                  </select>
                </div>

                {exportType === 'students_by_career' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seleccionar Carrera
                    </label>
                    <select
                      className="form-input"
                      value={selectedCareer}
                      onChange={(e) => setSelectedCareer(e.target.value)}
                    >
                      <option value="">Seleccionar carrera</option>
                      <option value="Sistemas">Sistemas</option>
                      <option value="Administración">Administración</option>
                      <option value="Medicina General">Medicina General</option>
                      <option value="Psicología">Psicología</option>
                    </select>
                  </div>
                )}

                {exportType === 'teachers_by_faculty' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seleccionar Facultad
                    </label>
                    <select
                      className="form-input"
                      value={selectedFacultyExport}
                      onChange={(e) => setSelectedFacultyExport(e.target.value)}
                    >
                      <option value="">Seleccionar facultad</option>
                      <option value="Ingeniería">Ingeniería</option>
                      <option value="Ciencias Económicas">Ciencias Económicas</option>
                      <option value="Medicina">Medicina</option>
                      <option value="Humanidades">Humanidades</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formato de Archivo
                  </label>
                  <select
                    className="form-input"
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                  >
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowExportModal(false)}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleExport}
                  className="btn btn-primary"
                  disabled={
                    (exportType === 'students_by_career' && !selectedCareer) ||
                    (exportType === 'teachers_by_faculty' && !selectedFacultyExport)
                  }
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingVoter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Editar Votante</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CI
                  </label>
                  <input
                    type="text"
                    className="form-input bg-gray-50"
                    value={editingVoter.ci}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingVoter.name}
                    onChange={(e) => setEditingVoter({ ...editingVoter, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={editingVoter.email}
                    onChange={(e) => setEditingVoter({ ...editingVoter, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    value={editingVoter.phone}
                    onChange={(e) => setEditingVoter({ ...editingVoter, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Género
                  </label>
                  <select
                    className="form-input"
                    value={editingVoter.gender || ''}
                    onChange={(e) => setEditingVoter({ ...editingVoter, gender: e.target.value })}
                  >
                    <option value="">Seleccionar género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingVoter.direccion || ''}
                    onChange={(e) => setEditingVoter({ ...editingVoter, direccion: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facultad
                  </label>
                  <select
                    className="form-input"
                    value={editingVoter.faculty || ""}
                    onChange={(e) =>
                      setEditingVoter({
                        ...editingVoter,
                        faculty: e.target.value,
                        career: "" // Limpia la carrera al cambiar de facultad
                      })
                    }
                  >
                    <option value="">Seleccionar facultad</option>
                    {faculties.map(faculty => (
                      <option key={faculty.id} value={faculty.nombre}>
                        {faculty.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carrera
                  </label>
                  <select
                    className="form-input"
                    value={editingVoter.career || ""}
                    onChange={(e) => setEditingVoter({ ...editingVoter, career: e.target.value })}
                  >
                    <option value="">Seleccionar carrera</option>
                    {availableCareers.map(career => (
                      <option key={career.id} value={career.nombre}>
                        {career.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    className="form-input"
                    value={editingVoter.type}
                    onChange={(e) => setEditingVoter({ ...editingVoter, type: e.target.value })}
                  >
                    <option value="Estudiante">Estudiante</option>
                    <option value="Docente">Docente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    className="form-input"
                    value={editingVoter.status}
                    onChange={(e) => setEditingVoter({ ...editingVoter, status: e.target.value })}
                  >
                    <option value="Habilitado">Habilitado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Inhabilitado">Inhabilitado</option>
                  </select>
                </div>

                {/* Student specific fields */}
                {editingVoter.type === 'Estudiante' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Matrícula
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={editingVoter.matricula || ''}
                        onChange={(e) => setEditingVoter({ ...editingVoter, matricula: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Ingreso
                      </label>
                      <input
                        type="date"
                        className="form-input"
                        value={editingVoter.fecha_ingreso || ''}
                        onChange={(e) => setEditingVoter({ ...editingVoter, fecha_ingreso: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Semestre Actual
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        value={editingVoter.semestre_actual || ''}
                        onChange={(e) => setEditingVoter({ ...editingVoter, semestre_actual: parseInt(e.target.value) })}
                        min="1"
                        max="20"
                      />
                    </div>
                  </>
                )}

                {/* Teacher specific fields */}
                {editingVoter.type === 'Docente' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría Docente
                      </label>
                      <select
                        className="form-input"
                        value={editingVoter.categoria_docente || ''}
                        onChange={(e) => setEditingVoter({ ...editingVoter, categoria_docente: e.target.value })}
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="Titular">Titular</option>
                        <option value="Asociado">Asociado</option>
                        <option value="Auxiliar">Auxiliar</option>
                        <option value="Invitado">Invitado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grado Académico
                      </label>
                      <select
                        className="form-input"
                        value={editingVoter.grado_academico || ''}
                        onChange={(e) => setEditingVoter({ ...editingVoter, grado_academico: e.target.value })}
                      >
                        <option value="">Seleccionar grado</option>
                        <option value="Licenciatura">Licenciatura</option>
                        <option value="Maestría">Maestría</option>
                        <option value="PhD">PhD</option>
                        <option value="Doctorado">Doctorado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Ingreso
                      </label>
                      <input
                        type="date"
                        className="form-input"
                        value={editingVoter.fecha_ingreso || ''}
                        onChange={(e) => setEditingVoter({ ...editingVoter, fecha_ingreso: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="btn btn-primary"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && voterToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-red-600">Confirmar Eliminación</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  ¿Está seguro de que desea eliminar este votante del padrón electoral?
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{voterToDelete.name}</p>
                  <p className="text-sm text-gray-600">CI: {voterToDelete.ci}</p>
                  <p className="text-sm text-gray-600">Tipo: {voterToDelete.type}</p>
                </div>
                <p className="text-red-600 text-sm mt-4">
                  Esta acción no se puede deshacer.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="btn bg-red-600 text-white hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectoralRollPage;