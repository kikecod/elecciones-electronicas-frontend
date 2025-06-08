import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Eye, Check, X, User, Users, Award, FileText, 
  Calendar, Palette, Download, MessageSquare
} from 'lucide-react';

// Types
interface Candidate {
  id: string;
  candidateId: string;
  candidateName: string;
  cargo: string;
  numero_lista: number;
  es_cabeza: boolean;
  lema: string;
  plan_propuesta: string;
}

interface PartyForReview {
  id: number;
  nombre: string;
  sigla: string;
  fecha_fundacion: string;
  color: string;
  logo: string;
  representante_id: string;
  representante_name: string;
  descripcion: string;
  candidates: Candidate[];
  fecha_registro: string;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
}

// Mock data
const mockPartiesForReview: PartyForReview[] = [
  {
    id: 1,
    nombre: 'Movimiento Estudiantil Renovador',
    sigla: 'MER',
    fecha_fundacion: '2020-03-15',
    color: '#3B82F6',
    logo: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    representante_id: 'REP001',
    representante_name: 'Dr. Carlos Mendoza',
    descripcion: 'Movimiento estudiantil enfocado en la renovación y modernización de la educación universitaria.',
    candidates: [
      {
        id: '1',
        candidateId: 'CAND001',
        candidateName: 'Ana Rodríguez',
        cargo: 'Presidente',
        numero_lista: 1,
        es_cabeza: true,
        lema: 'Renovación para el futuro',
        plan_propuesta: 'plan_ana_rodriguez.pdf'
      },
      {
        id: '2',
        candidateId: 'CAND002',
        candidateName: 'Luis Pérez',
        cargo: 'Vicepresidente',
        numero_lista: 2,
        es_cabeza: false,
        lema: 'Juntos por el cambio',
        plan_propuesta: 'plan_luis_perez.pdf'
      }
    ],
    fecha_registro: '2024-01-15',
    estado: 'Pendiente'
  },
  {
    id: 2,
    nombre: 'Alianza Universitaria Progresista',
    sigla: 'AUP',
    fecha_fundacion: '2019-08-20',
    color: '#22C55E',
    logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    representante_id: 'REP002',
    representante_name: 'Lic. María González',
    descripcion: 'Alianza comprometida con el progreso académico y social de la universidad.',
    candidates: [
      {
        id: '3',
        candidateId: 'CAND003',
        candidateName: 'Carmen Torres',
        cargo: 'Presidente',
        numero_lista: 1,
        es_cabeza: true,
        lema: 'Progreso con responsabilidad',
        plan_propuesta: 'plan_carmen_torres.pdf'
      }
    ],
    fecha_registro: '2024-01-18',
    estado: 'Pendiente'
  }
];

const PartyReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [parties, setParties] = useState<PartyForReview[]>(mockPartiesForReview);
  const [selectedParty, setSelectedParty] = useState<PartyForReview | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  // Handle party selection
  const handleSelectParty = (party: PartyForReview) => {
    setSelectedParty(party);
    setReviewComment('');
  };

  // Handle approval
  const handleApprove = () => {
    if (!selectedParty) return;
    
    setParties(parties.map(party => 
      party.id === selectedParty.id 
        ? { ...party, estado: 'Aprobado' }
        : party
    ));
    
    alert('Partido aprobado exitosamente');
    setSelectedParty(null);
  };

  // Handle rejection
  const handleReject = () => {
    if (!selectedParty || !reviewComment.trim()) {
      alert('Por favor ingrese un comentario explicando el motivo del rechazo');
      return;
    }
    
    setParties(parties.map(party => 
      party.id === selectedParty.id 
        ? { ...party, estado: 'Rechazado' }
        : party
    ));
    
    alert('Partido rechazado. Se ha enviado la notificación con los comentarios.');
    setSelectedParty(null);
    setReviewComment('');
  };

  const pendingParties = parties.filter(party => party.estado === 'Pendiente');

  return (
    <div className="fade-in py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/party-registration')}
            className="btn btn-outline mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </button>
          <div>
            <h1 className="text-3xl font-bold">Revisión de Partidos</h1>
            <p className="text-gray-600">Revise y apruebe las solicitudes de registro de partidos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Parties List */}
          <div className="lg:col-span-1">
            <div className="card p-4">
              <h2 className="text-lg font-semibold mb-4">
                Partidos Pendientes ({pendingParties.length})
              </h2>
              
              {pendingParties.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay partidos pendientes de revisión</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingParties.map((party) => (
                    <div
                      key={party.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedParty?.id === party.id
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleSelectParty(party)}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded-full mr-3"
                          style={{ backgroundColor: party.color }}
                        ></div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{party.sigla}</h3>
                          <p className="text-xs text-gray-500">{party.nombre}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Registrado: {new Date(party.fecha_registro).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Party Details */}
          <div className="lg:col-span-2">
            {selectedParty ? (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-primary" />
                    Información del Partido
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedParty.nombre}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Sigla</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedParty.sigla}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de Fundación</label>
                        <p className="mt-1 text-sm text-gray-900 flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(selectedParty.fecha_fundacion).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Color</label>
                        <div className="mt-1 flex items-center">
                          <div 
                            className="w-6 h-6 rounded-full mr-2 border border-gray-300"
                            style={{ backgroundColor: selectedParty.color }}
                          ></div>
                          <span className="text-sm text-gray-900">{selectedParty.color}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Logo</label>
                        <div className="mt-1">
                          <img
                            src={selectedParty.logo}
                            alt="Logo del partido"
                            className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Representante</label>
                        <p className="mt-1 text-sm text-gray-900 flex items-center">
                          <User className="h-4 w-4 mr-1 text-gray-400" />
                          {selectedParty.representante_name}
                        </p>
                        <p className="text-xs text-gray-500">ID: {selectedParty.representante_id}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedParty.descripcion}</p>
                  </div>
                </div>

                {/* Candidates */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    Candidatos ({selectedParty.candidates.length})
                  </h2>
                  
                  <div className="space-y-4">
                    {selectedParty.candidates.map((candidate) => (
                      <div key={candidate.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium flex items-center">
                              #{candidate.numero_lista} - {candidate.candidateName}
                              {candidate.es_cabeza && (
                                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  Cabeza de Lista
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-500">ID: {candidate.candidateId}</p>
                          </div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {candidate.cargo}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700">Lema</label>
                            <p className="text-sm text-gray-900">{candidate.lema}</p>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700">Plan de Propuesta</label>
                            <div className="flex items-center mt-1">
                              <FileText className="h-4 w-4 mr-1 text-gray-400" />
                              <span className="text-sm text-gray-900">{candidate.plan_propuesta}</span>
                              <button className="ml-2 text-blue-600 hover:text-blue-800">
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Actions */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                    Revisión
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentarios (opcional para aprobación, requerido para rechazo)
                      </label>
                      <textarea
                        className="form-input"
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Ingrese comentarios sobre la revisión del partido..."
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={handleReject}
                        className="btn bg-red-600 text-white hover:bg-red-700"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Rechazar
                      </button>
                      <button
                        onClick={handleApprove}
                        className="btn bg-green-600 text-white hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Aprobar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <Eye className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Seleccione un partido para revisar
                </h3>
                <p className="text-gray-500">
                  Elija un partido de la lista para ver sus detalles y proceder con la revisión
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyReviewPage;