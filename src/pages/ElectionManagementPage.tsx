import React, { useState } from 'react';
import {
  Search, Plus, Edit, Trash2, Eye, Calendar, MapPin, Users,
  Settings, CheckCircle, Clock, XCircle, Filter, Download,
  UserCheck, Building, X // 👈 este es el que falta
} from 'lucide-react';
import { ElectionSelector } from '../components/ElectionSelector';

// Types
interface Election {
  id: number;
  nombre: string;
  tipo: string;
  nivel: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'Programada' | 'Activa' | 'Finalizada' | 'Cancelada';
  descripcion: string;
  version: string;
}

// Mock data for elections
const mockElections: Election[] = [
  {
    id: 1,
    nombre: 'Elecciones Estudiantiles 2024',
    tipo: 'Estudiantil',
    nivel: 'Universidad',
    fecha_inicio: '2024-03-15',
    fecha_fin: '2024-03-17',
    estado: 'Activa',
    descripcion: 'Elecciones para representantes estudiantiles de todas las facultades',
    version: '1.0'
  },
  {
    id: 2,
    nombre: 'Elecciones Docentes 2024',
    tipo: 'Docente',
    nivel: 'Facultad',
    fecha_inicio: '2024-04-10',
    fecha_fin: '2024-04-12',
    estado: 'Programada',
    descripcion: 'Elecciones para representantes docentes por facultad',
    version: '1.0'
  },
  {
    id: 3,
    nombre: 'Elecciones Rectorado 2023',
    tipo: 'Administrativa',
    nivel: 'Universidad',
    fecha_inicio: '2023-11-20',
    fecha_fin: '2023-11-22',
    estado: 'Finalizada',
    descripcion: 'Elecciones para cargos administrativos del rectorado',
    version: '2.1'
  }
];

const ElectionManagementPage: React.FC = () => {
  const [elections, setElections] = useState<Election[]>(mockElections);
  const [selectedElection, setSelectedElection] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingElection, setEditingElection] = useState<Election | null>(null);
  const [showVoterLocationModal, setShowVoterLocationModal] = useState(false);
  const [voterCI, setVoterCI] = useState('');
  const [voterLocation, setVoterLocation] = useState<any>(null);
  const [searchingLocation, setSearchingLocation] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Election>>({
    nombre: '',
    tipo: '',
    nivel: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'Programada',
    descripcion: '',
    version: '1.0'
  });

  // Filter elections
  const filteredElections = elections.filter(election => {
    const matchesSearch = 
      election.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === '' || election.estado === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get current election
  const currentElection = elections.find(e => e.id === selectedElection);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingElection) {
      // Update existing election
      setElections(elections.map(election => 
        election.id === editingElection.id 
          ? { ...election, ...formData } as Election
          : election
      ));
    } else {
      // Create new election
      const newElection: Election = {
        id: Math.max(...elections.map(e => e.id)) + 1,
        ...formData as Election
      };
      setElections([...elections, newElection]);
    }
    
    // Reset form
    setFormData({
      nombre: '',
      tipo: '',
      nivel: '',
      fecha_inicio: '',
      fecha_fin: '',
      estado: 'Programada',
      descripcion: '',
      version: '1.0'
    });
    setShowCreateModal(false);
    setEditingElection(null);
  };

  // Handle edit
  const handleEdit = (election: Election) => {
    setEditingElection(election);
    setFormData(election);
    setShowCreateModal(true);
  };

  // Handle delete
  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar esta elección?')) {
      setElections(elections.filter(e => e.id !== id));
      if (selectedElection === id) {
        setSelectedElection(elections.find(e => e.id !== id)?.id || 0);
      }
    }
  };

  // Handle voter location search
  const handleSearchVoterLocation = () => {
    if (!voterCI.trim()) return;
    
    setSearchingLocation(true);
    setVoterLocation(null);
    
    // Simulate API call
    setTimeout(() => {
      // Mock data
      const mockVoterLocations = [
        {
          ci: '12345678',
          name: 'Juan Carlos Pérez González',
          faculty: 'Ingeniería',
          career: 'Sistemas',
          precinct: 'Edificio Central - Aula 101',
          device: 'Tablet TB-2021-001',
          schedule: '08:00 - 18:00'
        },
        {
          ci: '87654321',
          name: 'María Elena Rodríguez Mamani',
          faculty: 'Ciencias Económicas',
          career: 'Administración',
          precinct: 'Facultad de Ingeniería - Aula 205',
          device: 'Laptop LP-2021-002',
          schedule: '08:00 - 18:00'
        }
      ];
      
      const found = mockVoterLocations.find(voter => voter.ci === voterCI);
      if (found) {
        setVoterLocation(found);
      } else {
        setVoterLocation({ notFound: true });
      }
      setSearchingLocation(false);
    }, 1500);
  };

  // Get status color
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'Activa': return 'bg-green-100 text-green-800';
      case 'Programada': return 'bg-blue-100 text-blue-800';
      case 'Finalizada': return 'bg-gray-100 text-gray-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'Activa': return <CheckCircle className="h-4 w-4" />;
      case 'Programada': return <Clock className="h-4 w-4" />;
      case 'Finalizada': return <CheckCircle className="h-4 w-4" />;
      case 'Cancelada': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="fade-in py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Elecciones</h1>
            <p className="text-gray-600">
              Administre las elecciones, recintos y asignaciones del sistema electoral.
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowVoterLocationModal(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar Lugar de Voto
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Elección
            </button>
          </div>
        </div>

         <ElectionSelector />

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button className="btn btn-outline flex items-center justify-center p-4">
            <MapPin className="h-5 w-5 mr-2" />
            Distribución de Recintos
          </button>
          <button className="btn btn-outline flex items-center justify-center p-4">
            <UserCheck className="h-5 w-5 mr-2" />
            Asignar Encargados
          </button>
          <button className="btn btn-outline flex items-center justify-center p-4">
            <Building className="h-5 w-5 mr-2" />
            Gestionar Dispositivos
          </button>
          <button className="btn btn-outline flex items-center justify-center p-4">
            <Download className="h-5 w-5 mr-2" />
            Exportar Datos
          </button>
        </div>

        {/* Search and Filters */}
        <div className="card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar elecciones por nombre o descripción..."
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
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="Programada">Programada</option>
                <option value="Activa">Activa</option>
                <option value="Finalizada">Finalizada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>
        </div>

        {/* Elections Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo/Nivel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Versión
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredElections.map((election) => (
                  <tr key={election.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {election.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {election.descripcion}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{election.tipo}</div>
                      <div className="text-sm text-gray-500">{election.nivel}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {election.fecha_inicio}
                      </div>
                      <div className="text-sm text-gray-500">
                        hasta {election.fecha_fin}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusColor(election.estado)}`}>
                        {getStatusIcon(election.estado)}
                        <span className="ml-1">{election.estado}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      v{election.version}
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
                          onClick={() => handleEdit(election)}
                          title="Editar"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(election.id)}
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

          {filteredElections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron elecciones con los filtros seleccionados.</p>
            </div>
          )}
        </div>

        {/* Voter Location Modal */}
        {showVoterLocationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Buscar Lugar de Votación</h2>
                <button
                  onClick={() => {
                    setShowVoterLocationModal(false);
                    setVoterCI('');
                    setVoterLocation(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cédula de Identidad del Votante
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      className="form-input flex-1"
                      placeholder="Ingrese CI del votante"
                      value={voterCI}
                      onChange={(e) => setVoterCI(e.target.value)}
                    />
                    <button
                      onClick={handleSearchVoterLocation}
                      className="btn btn-primary"
                      disabled={!voterCI.trim() || searchingLocation}
                    >
                      {searchingLocation ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Buscando...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Buscar
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                {voterLocation && (
                  <div className="mt-6">
                    {voterLocation.notFound ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <XCircle className="h-5 w-5 text-red-600 mr-2" />
                          <span className="text-red-800 font-medium">Votante no encontrado</span>
                        </div>
                        <p className="text-red-700 mt-2">
                          No se encontró ningún votante con CI: <strong>{voterCI}</strong>
                        </p>
                        <p className="text-red-600 text-sm mt-1">
                          Verifique que el CI esté correcto y que la persona esté registrada en el padrón electoral.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">Información de Votación</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Nombre:</p>
                            <p className="font-medium">{voterLocation.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">CI:</p>
                            <p className="font-medium">{voterLocation.ci}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Facultad:</p>
                            <p className="font-medium">{voterLocation.faculty}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Carrera:</p>
                            <p className="font-medium">{voterLocation.career}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600">Lugar de Votación:</p>
                            <p className="font-medium flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                              {voterLocation.precinct}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Dispositivo Asignado:</p>
                            <p className="font-medium">{voterLocation.device}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Horario de Votación:</p>
                            <p className="font-medium">{voterLocation.schedule}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowVoterLocationModal(false);
                    setVoterCI('');
                    setVoterLocation(null);
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {editingElection ? 'Editar Elección' : 'Nueva Elección'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo *
                    </label>
                    <select
                      className="form-input"
                      value={formData.tipo}
                      onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                      required
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="Estudiantil">Estudiantil</option>
                      <option value="Docente">Docente</option>
                      <option value="Administrativa">Administrativa</option>
                      <option value="Mixta">Mixta</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nivel *
                    </label>
                    <select
                      className="form-input"
                      value={formData.nivel}
                      onChange={(e) => setFormData({...formData, nivel: e.target.value})}
                      required
                    >
                      <option value="">Seleccionar nivel</option>
                      <option value="Universidad">Universidad</option>
                      <option value="Facultad">Facultad</option>
                      <option value="Carrera">Carrera</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <select
                      className="form-input"
                      value={formData.estado}
                      onChange={(e) => setFormData({...formData, estado: e.target.value as Election['estado']})}
                      required
                    >
                      <option value="Programada">Programada</option>
                      <option value="Activa">Activa</option>
                      <option value="Finalizada">Finalizada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.fecha_inicio}
                      onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Fin *
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.fecha_fin}
                      onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Versión *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.version}
                      onChange={(e) => setFormData({...formData, version: e.target.value})}
                      placeholder="1.0"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    required
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingElection(null);
                      setFormData({
                        nombre: '',
                        tipo: '',
                        nivel: '',
                        fecha_inicio: '',
                        fecha_fin: '',
                        estado: 'Programada',
                        descripcion: '',
                        version: '1.0'
                      });
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingElection ? 'Actualizar' : 'Crear'} Elección
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionManagementPage;