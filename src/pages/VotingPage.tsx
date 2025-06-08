import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

// Mock data for parties
const mockParties = [
  { 
    id: 1, 
    name: 'Movimiento Universitario Renovación', 
    acronym: 'MUR', 
    color: '#3B82F6',
    president: 'Carlos Gutiérrez',
    vicePresident: 'María Torres',
    image: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  { 
    id: 2, 
    name: 'Unión Estudiantil Progresista', 
    acronym: 'UEP', 
    color: '#EF4444',
    president: 'Andrea López',
    vicePresident: 'Ricardo Fernández',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  { 
    id: 3, 
    name: 'Alianza Democrática Estudiantil', 
    acronym: 'ADE', 
    color: '#22C55E',
    president: 'Javier Morales',
    vicePresident: 'Lucía Ramírez',
    image: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  { 
    id: 4, 
    name: 'Frente Universitario Independiente', 
    acronym: 'FUI', 
    color: '#F97316',
    president: 'Roberto Vargas',
    vicePresident: 'Silvia Méndez',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
];

type VotingStep = 'verification' | 'voting' | 'confirmation' | 'success';

const VotingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<VotingStep>('verification');
  const [selectedParty, setSelectedParty] = useState<number | null>(null);
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleVerification = () => {
    if (!studentId) {
      setError('Por favor ingrese su código de estudiante');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (studentId === '12345') {
        setError('Este código ya ha emitido su voto');
      } else {
        setCurrentStep('voting');
      }
    }, 1500);
  };
  
  const handleSelectParty = (partyId: number) => {
    setSelectedParty(partyId);
  };
  
  const handleConfirmVote = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setCurrentStep('success');
    }, 2000);
  };
  
  const handleStartOver = () => {
    setCurrentStep('verification');
    setSelectedParty(null);
    setStudentId('');
    setError('');
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 'verification':
        return (
          <div className="card max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Verificación de Votante</h2>
            
            <div className="mb-4">
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                Código de Estudiante
              </label>
              <input
                type="text"
                id="studentId"
                className="form-input"
                placeholder="Ingrese su código de estudiante"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            )}
            
            <button 
              className="btn btn-primary w-full mt-4"
              onClick={handleVerification}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  Verificar
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        );
        
      case 'voting':
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-center">Seleccione su Opción de Voto</h2>
            <p className="text-gray-600 text-center mb-8">
              Elija el partido político al cual desea dar su voto.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {mockParties.map((party) => (
                <div 
                  key={party.id}
                  className={`card p-6 cursor-pointer transition-all ${
                    selectedParty === party.id 
                      ? 'ring-2 ring-primary ring-offset-2' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleSelectParty(party.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-16 h-16 rounded-md" style={{ backgroundColor: party.color }}></div>
                    {selectedParty === party.id && (
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-1">{party.name}</h3>
                  <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded mb-4">
                    {party.acronym}
                  </span>
                  
                  <div className="flex items-center mb-4">
                    <img 
                      src={party.image} 
                      alt={party.name} 
                      className="w-20 h-20 object-cover rounded-full"
                    />
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Presidente:</p>
                      <p className="font-medium">{party.president}</p>
                      <p className="text-sm text-gray-500 mt-1">Vicepresidente:</p>
                      <p className="font-medium">{party.vicePresident}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <button 
                className="btn btn-outline"
                onClick={handleStartOver}
              >
                Volver
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setCurrentStep('confirmation')}
                disabled={selectedParty === null}
              >
                Continuar
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        );
        
      case 'confirmation':
        const party = mockParties.find(p => p.id === selectedParty);
        
        return (
          <div className="card max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Confirmar Voto</h2>
            
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-gray-500 text-sm mb-2">Usted ha seleccionado:</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-md mr-3" style={{ backgroundColor: party?.color }}></div>
                <div>
                  <h3 className="font-semibold">{party?.name}</h3>
                  <p className="text-sm text-gray-600">{party?.acronym}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md mb-6">
              <p className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Esta acción no se puede deshacer. Asegúrese de que su selección es correcta.</span>
              </p>
            </div>
            
            <div className="flex justify-between">
              <button 
                className="btn btn-outline"
                onClick={() => setCurrentStep('voting')}
              >
                Volver
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleConfirmVote}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'Confirmar Voto'
                )}
              </button>
            </div>
          </div>
        );
        
      case 'success':
        return (
          <div className="card max-w-md mx-auto p-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">¡Voto Registrado!</h2>
            <p className="text-gray-600 mb-6">
              Su voto ha sido registrado con éxito. Gracias por participar en el proceso electoral.
            </p>
            
            <button 
              className="btn btn-primary w-full"
              onClick={handleStartOver}
            >
              Finalizar
            </button>
          </div>
        );
    }
  };
  
  return (
    <div className="fade-in py-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Sistema de Votación</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Bienvenido al sistema de votación electrónica universitaria. Por favor, siga los pasos para emitir su voto.
          </p>
        </div>
        
        {/* Progress steps */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 'verification' 
                  ? 'bg-primary text-white'
                  : currentStep === 'voting' || currentStep === 'confirmation' || currentStep === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="text-sm mt-2">Verificación</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-200 mx-4">
              <div className={`h-full ${
                currentStep === 'voting' || currentStep === 'confirmation' || currentStep === 'success'
                  ? 'bg-primary'
                  : ''
              }`}></div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 'voting' 
                  ? 'bg-primary text-white'
                  : currentStep === 'confirmation' || currentStep === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="text-sm mt-2">Votación</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-200 mx-4">
              <div className={`h-full ${
                currentStep === 'confirmation' || currentStep === 'success'
                  ? 'bg-primary'
                  : ''
              }`}></div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 'confirmation' 
                  ? 'bg-primary text-white'
                  : currentStep === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className="text-sm mt-2">Confirmación</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-200 mx-4">
              <div className={`h-full ${
                currentStep === 'success'
                  ? 'bg-primary'
                  : ''
              }`}></div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                4
              </div>
              <span className="text-sm mt-2">Finalizado</span>
            </div>
          </div>
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
};

export default VotingPage;