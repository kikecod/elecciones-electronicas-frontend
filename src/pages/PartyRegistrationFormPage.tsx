import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Upload, Search, Plus, Trash2, User, FileText, 
  Palette, Image, Users, Award, Target, Save
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
  plan_propuesta: File | null;
}

interface PartyFormData {
  nombre: string;
  sigla: string;
  fecha_fundacion: string;
  color: string;
  logo: File | null;
  representante_id: string;
  representante_name: string;
  descripcion: string;
  candidates: Candidate[];
}

const PartyRegistrationFormPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<PartyFormData>({
    nombre: '',
    sigla: '',
    fecha_fundacion: '',
    color: '#3B82F6',
    logo: null,
    representante_id: '',
    representante_name: '',
    descripcion: '',
    candidates: []
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [searchingRepresentative, setSearchingRepresentative] = useState(false);
  const [searchingCandidate, setSearchingCandidate] = useState('');
  const [candidateSearch, setCandidateSearch] = useState('');

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Search representative
  const handleSearchRepresentative = () => {
    setSearchingRepresentative(true);
    // Simulate API call
    setTimeout(() => {
      // Mock data
      const mockRepresentatives = [
        { id: 'REP001', name: 'Dr. Carlos Mendoza' },
        { id: 'REP002', name: 'Lic. María González' },
        { id: 'REP003', name: 'Ing. Roberto Silva' }
      ];
      
      const found = mockRepresentatives.find(rep => rep.id === formData.representante_id);
      if (found) {
        setFormData({ ...formData, representante_name: found.name });
      } else {
        alert('Representante no encontrado');
      }
      setSearchingRepresentative(false);
    }, 1000);
  };

  // Search candidate
  const handleSearchCandidate = () => {
    // Simulate API call
    const mockCandidates = [
      { id: 'CAND001', name: 'Ana Rodríguez' },
      { id: 'CAND002', name: 'Luis Pérez' },
      { id: 'CAND003', name: 'Carmen Torres' },
      { id: 'CAND004', name: 'Diego Morales' }
    ];
    
    const found = mockCandidates.find(cand => cand.id === candidateSearch);
    return found ? found.name : null;
  };

  // Add candidate
  const addCandidate = () => {
    const candidateName = handleSearchCandidate();
    if (!candidateName) {
      alert('Candidato no encontrado');
      return;
    }

    const newCandidate: Candidate = {
      id: Date.now().toString(),
      candidateId: candidateSearch,
      candidateName,
      cargo: '',
      numero_lista: formData.candidates.length + 1,
      es_cabeza: false,
      lema: '',
      plan_propuesta: null
    };

    setFormData({
      ...formData,
      candidates: [...formData.candidates, newCandidate]
    });
    setCandidateSearch('');
  };

  // Update candidate
  const updateCandidate = (id: string, field: keyof Candidate, value: any) => {
    setFormData({
      ...formData,
      candidates: formData.candidates.map(candidate =>
        candidate.id === id ? { ...candidate, [field]: value } : candidate
      )
    });
  };

  // Remove candidate
  const removeCandidate = (id: string) => {
    setFormData({
      ...formData,
      candidates: formData.candidates.filter(candidate => candidate.id !== id)
    });
  };

  // Handle candidate file upload
  const handleCandidateFileUpload = (candidateId: string, file: File) => {
    updateCandidate(candidateId, 'plan_propuesta', file);
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.nombre || !formData.sigla || !formData.representante_id) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    if (formData.candidates.length === 0) {
      alert('Debe agregar al menos un candidato');
      return;
    }

    // Check if at least one candidate is "cabeza"
    const hasCabeza = formData.candidates.some(c => c.es_cabeza);
    if (!hasCabeza) {
      alert('Debe designar al menos un candidato como cabeza de lista');
      return;
    }

    // Simulate form submission
    console.log('Submitting party registration:', formData);
    alert('Partido registrado exitosamente. Pasando a revisión...');
    navigate('/party-registration');
  };

  return (
    <div className="fade-in py-8">
      <div className="container-custom max-w-4xl">
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
            <h1 className="text-3xl font-bold">Registro de Partido Político</h1>
            <p className="text-gray-600">Complete la información del partido y sus candidatos</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Información Básica del Partido
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Partido *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sigla *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.sigla}
                  onChange={(e) => setFormData({ ...formData, sigla: e.target.value })}
                  maxLength={10}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fundación *
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.fecha_fundacion}
                  onChange={(e) => setFormData({ ...formData, fecha_fundacion: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color del Partido
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                  <span className="text-sm text-gray-600">{formData.color}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo del Partido
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="form-input"
                  />
                </div>
                {logoPreview && (
                  <div className="w-16 h-16 border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Partido *
              </label>
              <textarea
                className="form-input"
                rows={4}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Representative */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Representante del Partido
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID del Representante *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.representante_id}
                  onChange={(e) => setFormData({ ...formData, representante_id: e.target.value })}
                  placeholder="Ej: REP001"
                  required
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  className="btn btn-primary w-full"
                  onClick={handleSearchRepresentative}
                  disabled={!formData.representante_id || searchingRepresentative}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {searchingRepresentative ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Representante
                </label>
                <input
                  type="text"
                  className="form-input bg-gray-50"
                  value={formData.representante_name}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Candidates */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Candidatos del Partido
            </h2>

            {/* Add Candidate */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-4">Agregar Candidato</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="ID del candidato (Ej: CAND001)"
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    className="btn btn-primary w-full"
                    onClick={addCandidate}
                    disabled={!candidateSearch}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Buscar y Agregar Candidato
                  </button>
                </div>
              </div>
            </div>

            {/* Candidates List */}
            {formData.candidates.length > 0 && (
              <div className="space-y-4">
                {formData.candidates.map((candidate, index) => (
                  <div key={candidate.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">
                        Candidato #{candidate.numero_lista} - {candidate.candidateName}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeCandidate(candidate.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cargo que Postula *
                        </label>
                        <select
                          className="form-input"
                          value={candidate.cargo}
                          onChange={(e) => updateCandidate(candidate.id, 'cargo', e.target.value)}
                          required
                        >
                          <option value="">Seleccionar cargo</option>
                          <option value="Presidente">Presidente</option>
                          <option value="Vicepresidente">Vicepresidente</option>
                          <option value="Secretario">Secretario</option>
                          <option value="Tesorero">Tesorero</option>
                          <option value="Vocal">Vocal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número de Lista
                        </label>
                        <input
                          type="number"
                          className="form-input"
                          value={candidate.numero_lista}
                          onChange={(e) => updateCandidate(candidate.id, 'numero_lista', parseInt(e.target.value))}
                          min="1"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`cabeza-${candidate.id}`}
                          checked={candidate.es_cabeza}
                          onChange={(e) => updateCandidate(candidate.id, 'es_cabeza', e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor={`cabeza-${candidate.id}`} className="text-sm font-medium text-gray-700">
                          Es Cabeza de Lista
                        </label>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lema de Campaña
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={candidate.lema}
                          onChange={(e) => updateCandidate(candidate.id, 'lema', e.target.value)}
                          placeholder="Lema o frase de campaña"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Plan de Propuesta (PDF)
                        </label>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleCandidateFileUpload(candidate.id, file);
                            }
                          }}
                          className="form-input"
                        />
                        {candidate.plan_propuesta && (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ {candidate.plan_propuesta.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.candidates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay candidatos agregados aún</p>
                <p className="text-sm">Use el formulario de arriba para buscar y agregar candidatos</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/party-registration')}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Save className="h-4 w-4 mr-2" />
              Registrar Partido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartyRegistrationFormPage;