import React, { useState } from 'react';
import { Plus, Edit, Trash2, Building, GraduationCap, BookOpen, Search, X, Save } from 'lucide-react';

// Types
interface Career {
  id: number;
  name: string;
  code: string;
  duration_semesters: number;
  studentsCount: number;
}

interface Faculty {
  id: number;
  name: string;
  code: string;
  creation_date: string;
  dean_ci: string;
  dean_name: string;
  careers: Career[];
}

// Mock data
const mockFaculties: Faculty[] = [
  { 
    id: 1,
    name: 'Ingeniería',
    code: 'ING',
    creation_date: '1985-03-15',
    dean_ci: '12345678',
    dean_name: 'Dr. Carlos Mendoza',
    careers: [
      { id: 1, name: 'Ingeniería de Sistemas', code: 'SIS', duration_semesters: 10, studentsCount: 450 },
      { id: 2, name: 'Ingeniería Civil', code: 'CIV', duration_semesters: 10, studentsCount: 380 },
      { id: 3, name: 'Ingeniería Electrónica', code: 'ELE', duration_semesters: 10, studentsCount: 320 },
    ]
  },
  { 
    id: 2,
    name: 'Ciencias Económicas',
    code: 'ECO',
    creation_date: '1980-08-20',
    dean_ci: '87654321',
    dean_name: 'Lic. María González',
    careers: [
      { id: 4, name: 'Administración de Empresas', code: 'ADM', duration_semesters: 8, studentsCount: 410 },
      { id: 5, name: 'Contaduría Pública', code: 'CON', duration_semesters: 8, studentsCount: 350 },
      { id: 6, name: 'Economía', code: 'ECO', duration_semesters: 8, studentsCount: 280 },
    ]
  },
  { 
    id: 3,
    name: 'Medicina',
    code: 'MED',
    creation_date: '1975-01-10',
    dean_ci: '11223344',
    dean_name: 'Dr. Roberto Silva',
    careers: [
      { id: 7, name: 'Medicina General', code: 'MED', duration_semesters: 12, studentsCount: 520 },
      { id: 8, name: 'Enfermería', code: 'ENF', duration_semesters: 8, studentsCount: 380 },
    ]
  },
];

const AcademicAdminPage: React.FC = () => {
  const [faculties, setFaculties] = useState<Faculty[]>(mockFaculties);
  const [expandedFaculty, setExpandedFaculty] = useState<number | null>(null);
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{type: 'faculty' | 'career', item: Faculty | Career} | null>(null);
  
  // Faculty form data
  const [facultyFormData, setFacultyFormData] = useState({
    name: '',
    code: '',
    creation_date: '',
    dean_ci: '',
    dean_name: ''
  });

  // Career form data
  const [careerFormData, setCareerFormData] = useState({
    faculty_id: 0,
    name: '',
    code: '',
    duration_semesters: 8
  });

  const [searchingDean, setSearchingDean] = useState(false);
  
  const toggleFaculty = (facultyId: number) => {
    if (expandedFaculty === facultyId) {
      setExpandedFaculty(null);
    } else {
      setExpandedFaculty(facultyId);
    }
  };

  // Handle search dean
  const handleSearchDean = () => {
    if (!facultyFormData.dean_ci) return;
    
    setSearchingDean(true);
    // Simulate API call
    setTimeout(() => {
      const mockDeans = [
        { ci: '12345678', name: 'Dr. Carlos Mendoza' },
        { ci: '87654321', name: 'Lic. María González' },
        { ci: '11223344', name: 'Dr. Roberto Silva' },
        { ci: '55667788', name: 'Dr. Ana Torres' }
      ];
      
      const found = mockDeans.find(dean => dean.ci === facultyFormData.dean_ci);
      if (found) {
        setFacultyFormData({ ...facultyFormData, dean_name: found.name });
      } else {
        setFacultyFormData({ ...facultyFormData, dean_name: '' });
        alert('Docente no encontrado');
      }
      setSearchingDean(false);
    }, 1000);
  };

  // Handle faculty form submission
  const handleFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingFaculty) {
      // Update existing faculty
      setFaculties(faculties.map(faculty => 
        faculty.id === editingFaculty.id 
          ? { ...faculty, ...facultyFormData, careers: faculty.careers }
          : faculty
      ));
    } else {
      // Create new faculty
      const newFaculty: Faculty = {
        id: Math.max(...faculties.map(f => f.id)) + 1,
        ...facultyFormData,
        careers: []
      };
      setFaculties([...faculties, newFaculty]);
    }
    
    resetFacultyForm();
  };

  // Handle career form submission
  const handleCareerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCareer) {
      // Update existing career
      setFaculties(faculties.map(faculty => ({
        ...faculty,
        careers: faculty.careers.map(career =>
          career.id === editingCareer.id
            ? { ...career, ...careerFormData, studentsCount: career.studentsCount }
            : career
        )
      })));
    } else {
      // Create new career
      const newCareer: Career = {
        id: Math.max(...faculties.flatMap(f => f.careers.map(c => c.id))) + 1,
        ...careerFormData,
        studentsCount: 0
      };
      
      setFaculties(faculties.map(faculty =>
        faculty.id === careerFormData.faculty_id
          ? { ...faculty, careers: [...faculty.careers, newCareer] }
          : faculty
      ));
    }
    
    resetCareerForm();
  };

  // Reset forms
  const resetFacultyForm = () => {
    setFacultyFormData({
      name: '',
      code: '',
      creation_date: '',
      dean_ci: '',
      dean_name: ''
    });
    setEditingFaculty(null);
    setShowFacultyModal(false);
  };

  const resetCareerForm = () => {
    setCareerFormData({
      faculty_id: 0,
      name: '',
      code: '',
      duration_semesters: 8
    });
    setEditingCareer(null);
    setShowCareerModal(false);
  };

  // Handle edit faculty
  const handleEditFaculty = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setFacultyFormData({
      name: faculty.name,
      code: faculty.code,
      creation_date: faculty.creation_date,
      dean_ci: faculty.dean_ci,
      dean_name: faculty.dean_name
    });
    setShowFacultyModal(true);
  };

  // Handle edit career
  const handleEditCareer = (career: Career) => {
    setEditingCareer(career);
    const faculty = faculties.find(f => f.careers.some(c => c.id === career.id));
    setCareerFormData({
      faculty_id: faculty?.id || 0,
      name: career.name,
      code: career.code,
      duration_semesters: career.duration_semesters
    });
    setShowCareerModal(true);
  };

  // Handle delete
  const handleDelete = (type: 'faculty' | 'career', item: Faculty | Career) => {
    setDeleteTarget({ type, item });
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'faculty') {
      setFaculties(faculties.filter(f => f.id !== deleteTarget.item.id));
    } else {
      setFaculties(faculties.map(faculty => ({
        ...faculty,
        careers: faculty.careers.filter(c => c.id !== deleteTarget.item.id)
      })));
    }

    setShowDeleteModal(false);
    setDeleteTarget(null);
  };
  
  return (
    <div className="fade-in py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Administración Académica</h1>
            <p className="text-gray-600">
              Gestión de facultades, carreras y estructura académica de la universidad.
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button 
              className="btn btn-primary"
              onClick={() => setShowFacultyModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Facultad
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => setShowCareerModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Carrera
            </button>
          </div>
        </div>
        
        {/* Faculties and Careers */}
        <div className="space-y-6">
          {faculties.map((faculty) => (
            <div key={faculty.id} className="card overflow-hidden">
              {/* Faculty header */}
              <div 
                className={`flex justify-between items-center p-4 cursor-pointer transition-colors ${
                  expandedFaculty === faculty.id ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => toggleFaculty(faculty.id)}
              >
                <div className="flex items-center">
                  <Building className={`h-6 w-6 mr-3 ${
                    expandedFaculty === faculty.id ? 'text-primary' : 'text-gray-500'
                  }`} />
                  <div>
                    <h3 className="text-lg font-semibold">{faculty.name}</h3>
                    <p className="text-sm text-gray-500">
                      Código: {faculty.code} | {faculty.careers.length} Carreras | {faculty.careers.reduce((acc, career) => acc + career.studentsCount, 0)} Estudiantes
                    </p>
                    <p className="text-xs text-gray-400">
                      Decano: {faculty.dean_name} | Creada: {new Date(faculty.creation_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditFaculty(faculty);
                    }}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button 
                    className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete('faculty', faculty);
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <svg 
                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                      expandedFaculty === faculty.id ? 'transform rotate-180' : ''
                    }`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Careers table */}
              {expandedFaculty === faculty.id && (
                <div className="border-t border-gray-200">
                  <div className="p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-700 flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                      Carreras en {faculty.name}
                    </h4>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Código
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duración
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estudiantes
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {faculty.careers.map((career) => (
                          <tr key={career.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {career.code}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                              <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                              {career.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {career.duration_semesters} semestres
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {career.studentsCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => handleEditCareer(career)}
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleDelete('career', career)}
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
                  
                  {/* Add career button */}
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <button 
                      className="text-primary hover:text-primary-dark font-medium flex items-center text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCareerFormData({ ...careerFormData, faculty_id: faculty.id });
                        setShowCareerModal(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar carrera a {faculty.name}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Faculty Modal */}
        {showFacultyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {editingFaculty ? 'Editar Facultad' : 'Nueva Facultad'}
                </h2>
                <button
                  onClick={resetFacultyForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleFacultySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={facultyFormData.name}
                      onChange={(e) => setFacultyFormData({...facultyFormData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={facultyFormData.code}
                      onChange={(e) => setFacultyFormData({...facultyFormData, code: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Creación *
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={facultyFormData.creation_date}
                      onChange={(e) => setFacultyFormData({...facultyFormData, creation_date: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CI del Decano *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="form-input flex-1"
                        value={facultyFormData.dean_ci}
                        onChange={(e) => setFacultyFormData({...facultyFormData, dean_ci: e.target.value})}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleSearchDean}
                        disabled={!facultyFormData.dean_ci || searchingDean}
                      >
                        {searchingDean ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Decano
                    </label>
                    <input
                      type="text"
                      className="form-input bg-gray-50"
                      value={facultyFormData.dean_name}
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={resetFacultyForm}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Save className="h-4 w-4 mr-2" />
                    {editingFaculty ? 'Actualizar' : 'Crear'} Facultad
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Career Modal */}
        {showCareerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {editingCareer ? 'Editar Carrera' : 'Nueva Carrera'}
                </h2>
                <button
                  onClick={resetCareerForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleCareerSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Facultad *
                    </label>
                    <select
                      className="form-input"
                      value={careerFormData.faculty_id}
                      onChange={(e) => setCareerFormData({...careerFormData, faculty_id: parseInt(e.target.value)})}
                      required
                    >
                      <option value={0}>Seleccionar facultad</option>
                      {faculties.map(faculty => (
                        <option key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={careerFormData.code}
                      onChange={(e) => setCareerFormData({...careerFormData, code: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={careerFormData.name}
                      onChange={(e) => setCareerFormData({...careerFormData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración en Semestres *
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={careerFormData.duration_semesters}
                      onChange={(e) => setCareerFormData({...careerFormData, duration_semesters: parseInt(e.target.value)})}
                      min="1"
                      max="20"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={resetCareerForm}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Save className="h-4 w-4 mr-2" />
                    {editingCareer ? 'Actualizar' : 'Crear'} Carrera
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deleteTarget && (
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
                  ¿Está seguro de que desea eliminar {deleteTarget.type === 'faculty' ? 'esta facultad' : 'esta carrera'}?
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{deleteTarget.item.name}</p>
                  <p className="text-sm text-gray-600">Código: {deleteTarget.item.code}</p>
                  {deleteTarget.type === 'faculty' && (
                    <p className="text-sm text-gray-600">
                      Carreras: {(deleteTarget.item as Faculty).careers.length}
                    </p>
                  )}
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

export default AcademicAdminPage;