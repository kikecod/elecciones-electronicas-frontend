import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye, UserCheck, Flag, Users, Clock, CheckCircle, XCircle, X } from 'lucide-react';

// Mock data for parties
const mockParties = [
  { 
    id: 1, 
    name: 'Movimiento Universitario Renovación', 
    acronym: 'MUR', 
    faculty: 'Ingeniería', 
    candidates: 3,
    status: 'Aprobado',
    color: '#3B82F6',
    registrationDate: '2024-01-10'
  },
  { 
    id: 2, 
    name: 'Unión Estudiantil Progresista', 
    acronym: 'UEP', 
    faculty: 'Ciencias Económicas', 
    candidates: 2,
    status: 'Pendiente',
    color: '#EF4444',
    registrationDate: '2024-01-15'
  },
  { 
    id: 3, 
    name: 'Alianza Democrática Estudiantil', 
    acronym: 'ADE', 
    faculty: 'Medicina', 
    candidates: 4,
    status: 'Aprobado',
    color: '#22C55E',
    registrationDate: '2024-01-08'
  },
  { 
    id: 4, 
    name: 'Frente Universitario Independiente', 
    acronym: 'FUI', 
    faculty: 'Humanidades', 
    candidates: 3,
    status: 'Aprobado',
    color: '#F97316',
    registrationDate: '2024-01-12'
  },
  { 
    id: 5, 
    name: 'Movimiento Académico Transformador', 
    acronym: 'MAT', 
    faculty: 'Ciencias', 
    candidates: 2,
    status: 'Rechazado',
    color: '#8B5CF6',
    registrationDate: '2024-01-18'
  },
];

const PartyRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [parties, setParties] = useState(mockParties);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [partyToDelete, setPartyToDelete] = useState<any>(null);
  
  // Filter parties based on search term and filters
  const filteredParties = parties.filter(party => {
    const matchesSearch = 
      party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      party.acronym.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFaculty = selectedFaculty === '' || party.faculty === selectedFaculty;
    const matchesStatus = selectedStatus === '' || party.status === selectedStatus;
    
    return matchesSearch && matchesFaculty && matchesStatus;
  });

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aprobado': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Pendiente': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Rechazado': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // Handle delete party
  const handleDeleteParty = (party: any) => {
    setPartyToDelete(party);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (partyToDelete) {
      setParties(parties.filter(p => p.id !== partyToDelete.id));
      setShowDeleteModal(false);
      setPartyToDelete(null);
    }
  };

  // Count parties by status
  const pendingCount = parties.filter(p => p.status === 'Pendiente').length;
  
  return (
    <div className="fade-in py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Partidos Políticos</h1>
            <p className="text-gray-600">
              Administre partidos políticos, candidatos y procesos de revisión.
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/party-review')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Revisar Partidos ({pendingCount})
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/party-registration-form')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Partido
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Partidos</p>
                <p className="text-2xl font-bold text-gray-900">{parties.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aprobados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {parties.filter(p => p.status === 'Aprobado').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rechazados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {parties.filter(p => p.status === 'Rechazado').length}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre o sigla..."
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
                <option value="Ingeniería">Ingeniería</option>
                <option value="Ciencias Económicas">Ciencias Económicas</option>
                <option value="Medicina">Medicina</option>
                <option value="Humanidades">Humanidades</option>
                <option value="Ciencias">Ciencias</option>
              </select>
            </div>
            <div>
              <select 
                className="form-input"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Parties cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParties.map((party) => (
            <div key={party.id} className="card overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="h-2" style={{ backgroundColor: party.color }}></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{party.name}</h3>
                    <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      {party.acronym}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(party.status)}
                    <span className={`ml-1 px-2 py-1 text-xs font-semibold rounded-full ${
                      party.status === 'Aprobado'
                        ? 'bg-green-100 text-green-800'
                        : party.status === 'Pendiente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {party.status}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600 flex items-center mb-2">
                    <Flag className="h-4 w-4 mr-2 text-gray-400" />
                    Facultad: <span className="font-medium ml-1">{party.faculty}</span>
                  </p>
                  <p className="text-gray-600 flex items-center mb-2">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    Candidatos: <span className="font-medium ml-1">{party.candidates}</span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    Registrado: {new Date(party.registrationDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <button className="text-gray-600 hover:text-primary transition-colors">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="text-gray-600 hover:text-blue-600 transition-colors">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="text-gray-600 hover:text-green-600 transition-colors">
                    <UserCheck className="h-5 w-5" />
                  </button>
                  <button 
                    className="text-gray-600 hover:text-red-600 transition-colors"
                    onClick={() => handleDeleteParty(party)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredParties.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">No se encontraron partidos con los filtros seleccionados.</p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && partyToDelete && (
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
                  ¿Está seguro de que desea eliminar este partido político?
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div 
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: partyToDelete.color }}
                    ></div>
                    <p className="font-medium">{partyToDelete.name}</p>
                  </div>
                  <p className="text-sm text-gray-600">Sigla: {partyToDelete.acronym}</p>
                  <p className="text-sm text-gray-600">Facultad: {partyToDelete.faculty}</p>
                  <p className="text-sm text-gray-600">Candidatos: {partyToDelete.candidates}</p>
                </div>
                <p className="text-red-600 text-sm mt-4">
                  Esta acción eliminará el partido y todos sus candidatos. No se puede deshacer.
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
                  Eliminar Partido
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartyRegistrationPage;