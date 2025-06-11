import React, { useEffect, useState } from 'react';
import { CheckCircle2, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { VotantesService } from '../services/voto.service';
import type { Partido } from '../types/partido';
import type { Votante } from '../types';
import { PartidosService } from '../services/partidos.service';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';




type VotingStep = 'verification' | 'voting' | 'confirmation' | 'success' | 'carnet';

const VotingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<VotingStep>('verification');
  const [selectedParty, setSelectedParty] = useState<number | null>(null);
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [votante, setVotante] = useState<Votante | null>(null);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loadingPartidos, setLoadingPartidos] = useState(false);
  const navigate = useNavigate();
  const [votoRegistrado, setVotoRegistrado] = useState(false);

  
  
  const handleVerification = async () => {
    if (!studentId.trim()) {
      setError('Por favor ingrese su código de estudiante');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const votanteEncontrado = await VotantesService.buscarPorCI(studentId);
      
      if (!votanteEncontrado) {
        setError('No se encontró un votante con este CI');
        return;
      }

      if (!votanteEncontrado.habilitado) {
        setError('Este votante no está habilitado para votar');
        return;
      }

      // Aquí podrías verificar también si ya votó
      // (depende de tu implementación backend)

      setVotante(votanteEncontrado);
      setCurrentStep('voting');
    } catch (error) {
      console.error('Error al verificar votante:', error);
      setError('No se encuentra registrado como votante');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectParty = (partyId: number) => {
    setSelectedParty(partyId);
  };
  
  
  
  const handleStartOver = () => {
    setCurrentStep('verification');
    setSelectedParty(null);
    setStudentId('');
    setError('');
  };
  useEffect(() => {
    if (currentStep === 'voting') {
      const fetchPartidos = async () => {
        setLoadingPartidos(true);
        try {
          const idEleccion = localStorage.getItem('selectedElectionId');
          if (!idEleccion) throw new Error('No se ha seleccionado elección');
          
          const data = await PartidosService.getPartidosByEleccion(Number(idEleccion));
          setPartidos(data);
        } catch (error) {
          console.error('Error al cargar partidos:', error);
          setError('Error al cargar los partidos');
        } finally {
          setLoadingPartidos(false);
        }
      };

      fetchPartidos();
    }
  }, [currentStep]);

  // Render modificado para el paso de votación
  const renderVotingStep = () => {
    if (loadingPartidos) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (partidos.length === 0) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-4 text-lg text-gray-600">No hay partidos disponibles para esta elección</p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-2 text-center">Seleccione su Opción de Voto</h2>
        <p className="text-gray-600 text-center mb-8">
          Elija el partido político al cual desea dar su voto.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {partidos.map((partido) => (
            <div 
              key={partido.idPartido}
              className={`card p-6 cursor-pointer transition-all ${
                selectedParty === partido.idPartido 
                  ? 'ring-2 ring-primary ring-offset-2' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => handleSelectParty(partido.idPartido)}
            >
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="w-16 h-16 rounded-md" 
                  style={{ backgroundColor: partido.colorHex }}
                ></div>
                {selectedParty === partido.idPartido && (
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                )}
              </div>
              
              <h3 className="text-xl font-semibold mb-1">{partido.nombre}</h3>
              <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded mb-4">
                {partido.sigla}
              </span>
              
              <div className="flex items-center mb-4">
                {partido.logoUrl && (
                  <img 
                    src={partido.logoUrl} 
                    alt={partido.nombre} 
                    className="w-20 h-20 object-cover rounded-full"
                  />
                )}
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Representante:</p>
                  <p className="font-medium">
                    {partido.representante.nombre} {partido.representante.apellido_paterno}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Descripción:</p>
                  <p className="font-medium text-sm">{partido.descripcion}</p>
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
  };
  const handleConfirmVote = async () => {
  if (!votante || !selectedParty) return;

  setLoading(true);
  setError('');
  
  try {
    const idEleccion = localStorage.getItem('selectedElectionId');
    if (!idEleccion) throw new Error('Elección no seleccionada');

    const response = await VotantesService.registrarVoto({
      idVotante: votante.idVotante,
      idEleccion: Number(idEleccion),
      idPartido: selectedParty
    });

    console.log("Voto registrado:", response);

    // Opcional: Enviar email en segundo plano
    try {
      await VotantesService.enviarCarnetPorEmail(votante.idVotante);
    } catch (emailError) {
      console.warn("Error enviando email:", emailError);
    }

    setCurrentStep('carnet');
  } catch (error) {
    console.error("Error completo:", error);
    
    if (axios.isAxiosError(error)) {
      setError(error.response?.data?.message || 
              'Error al registrar voto (detalles en consola)');
    } else {
      setError('Error inesperado al registrar voto');
    }
  } finally {
    setLoading(false);
  }
};

  const renderCarnetStep = () => {
    if (!votante) return null;

    return (
      <div className="card max-w-md mx-auto p-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">¡Voto Registrado Exitosamente!</h2>
        
        <p className="text-gray-600 mb-6">
          Su carnet de sufragio ha sido enviado a su correo electrónico.
        </p>

        <div className="mb-6">
          <a
            href={`http://localhost:9090/carnet-sufragio/${votante.idVotante}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full mb-4"
          >
            Ver Carnet de Sufragio
          </a>
          
          <p className="text-sm text-gray-500">
            También puede descargarlo más tarde desde su correo electrónico.
          </p>
        </div>

        <button 
          className="btn btn-outline w-full"
          onClick={() => navigate('/')}
        >
          Volver al Inicio
        </button>
      </div>
    );
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
        return renderVotingStep();
        
      case 'confirmation':
          const partidoSeleccionado = partidos.find(p => p.idPartido === selectedParty);
          
          return (
            <div className="card max-w-md mx-auto p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">Confirmar Voto</h2>
              
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-gray-500 text-sm mb-2">Usted ha seleccionado:</p>
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-md mr-3" 
                    style={{ backgroundColor: partidoSeleccionado?.colorHex }}
                  ></div>
                  <div>
                    <h3 className="font-semibold">{partidoSeleccionado?.nombre}</h3>
                    <p className="text-sm text-gray-600">{partidoSeleccionado?.sigla}</p>
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
      case 'carnet':
        return renderCarnetStep();
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