import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ArrowLeft, Camera, User, Save, UserPlus, 
  CheckCircle, AlertCircle, Download, QrCode, X
} from 'lucide-react';

// Types
interface Person {
  ci: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_nacimiento: string;
  email: string;
  telefono: string;
  direccion: string;
  genero: 'Masculino' | 'Femenino' | 'Otro';
  tipo: 'Estudiante' | 'Docente';
}

interface VoterData {
  person: Person;
  rostro_imagen: string | null;
  qr_code: string | null;
}

const VoterRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [searchCI, setSearchCI] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [foundPerson, setFoundPerson] = useState<Person | null>(null);
  const [personNotFound, setPersonNotFound] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [registrationStep, setRegistrationStep] = useState<'search' | 'capture' | 'verify' | 'success'>('search');
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  
  // Form data for new person registration
  const [newPersonData, setNewPersonData] = useState<Partial<Person>>({
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
    email: '',
    telefono: '',
    direccion: '',
    genero: 'Masculino',
    tipo: 'Estudiante'
  });

  // Error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleShowErrorModal = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  // Search person by CI
  const handleSearchPerson = async () => {
    if (!searchCI.trim()) return;
    
    setSearchLoading(true);
    setPersonNotFound(false);
    setFoundPerson(null);
    
    // Simulate API call
    setTimeout(() => {
      // Mock data - simulate found person
      const mockPersons: Person[] = [
        {
          ci: '12345678',
          nombres: 'Juan Carlos',
          apellido_paterno: 'Pérez',
          apellido_materno: 'González',
          fecha_nacimiento: '1995-03-15',
          email: 'juan.perez@universidad.edu',
          telefono: '+591 70123456',
          direccion: 'Av. América #123, La Paz',
          genero: 'Masculino',
          tipo: 'Estudiante'
        },
        {
          ci: '87654321',
          nombres: 'María Elena',
          apellido_paterno: 'Rodríguez',
          apellido_materno: 'Mamani',
          fecha_nacimiento: '1980-07-22',
          email: 'maria.rodriguez@universidad.edu',
          telefono: '+591 71234567',
          direccion: 'Calle Murillo #456, La Paz',
          genero: 'Femenino',
          tipo: 'Docente'
        }
      ];
      
      const found = mockPersons.find(person => person.ci === searchCI);
      
      if (found) {
        setFoundPerson(found);
        setRegistrationStep('capture');
      } else {
        setPersonNotFound(true);
        setShowNotFoundModal(true);
      }
      
      setSearchLoading(false);
    }, 1500);
  };

  // Start camera for face capture
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      handleShowErrorModal('No se pudo acceder a la cámara. Verifique los permisos.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Capture photo from video
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        
        stopCamera();
        setRegistrationStep('verify');
      }
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    setRegistrationStep('capture');
    startCamera();
  };

  // Save voter registration
  const saveVoterRegistration = async () => {
    if (!foundPerson || !capturedImage) return;
    
    // Simulate API call to save voter
    setTimeout(() => {
      // Generate mock QR code
      const qrData = `VOTER:${foundPerson.ci}:${Date.now()}`;
      setGeneratedQR(`data:image/svg+xml;base64,${btoa(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white"/>
          <rect x="20" y="20" width="160" height="160" fill="black"/>
          <rect x="40" y="40" width="120" height="120" fill="white"/>
          <text x="100" y="105" text-anchor="middle" font-family="Arial" font-size="12" fill="black">QR: ${foundPerson.ci}</text>
        </svg>
      `)}`);
      
      setRegistrationStep('success');
      setShowSuccessModal(true);
    }, 2000);
  };

  // Handle new person registration
  const handleRegisterNewPerson = () => {
    // Validate required fields
    const required = ['nombres', 'apellido_paterno', 'apellido_materno', 'fecha_nacimiento', 'email'];
    const missing = required.filter(field => !newPersonData[field as keyof Person]);
    
    if (missing.length > 0) {
      handleShowErrorModal('Por favor complete todos los campos obligatorios');
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      const newPerson: Person = {
        ci: searchCI,
        ...newPersonData as Person
      };
      
      setFoundPerson(newPerson);
      setShowRegisterForm(false);
      setPersonNotFound(false);
      setShowNotFoundModal(false);
      setRegistrationStep('capture');
      setShowSuccessModal(true);
    }, 1000);
  };

  // Download QR code
  const downloadQR = () => {
    if (generatedQR) {
      const link = document.createElement('a');
      link.href = generatedQR;
      link.download = `QR_Votante_${foundPerson?.ci}.svg`;
      link.click();
    }
  };

  return (
    <div className="fade-in py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/electoral-roll')}
            className="btn btn-outline mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Padrón
          </button>
          <div>
            <h1 className="text-3xl font-bold">Registro de Nuevo Votante</h1>
            <p className="text-gray-600">Complete el proceso de registro de votante</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${registrationStep === 'search' ? 'text-primary' : registrationStep !== 'search' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${registrationStep === 'search' ? 'bg-primary text-white' : registrationStep !== 'search' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Búsqueda</span>
            </div>
            
            <div className="w-16 h-1 bg-gray-200">
              <div className={`h-full ${registrationStep === 'capture' || registrationStep === 'verify' || registrationStep === 'success' ? 'bg-primary' : ''}`}></div>
            </div>
            
            <div className={`flex items-center ${registrationStep === 'capture' ? 'text-primary' : registrationStep === 'verify' || registrationStep === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${registrationStep === 'capture' ? 'bg-primary text-white' : registrationStep === 'verify' || registrationStep === 'success' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Captura</span>
            </div>
            
            <div className="w-16 h-1 bg-gray-200">
              <div className={`h-full ${registrationStep === 'verify' || registrationStep === 'success' ? 'bg-primary' : ''}`}></div>
            </div>
            
            <div className={`flex items-center ${registrationStep === 'verify' ? 'text-primary' : registrationStep === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${registrationStep === 'verify' ? 'bg-primary text-white' : registrationStep === 'success' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Verificación</span>
            </div>
            
            <div className="w-16 h-1 bg-gray-200">
              <div className={`h-full ${registrationStep === 'success' ? 'bg-primary' : ''}`}></div>
            </div>
            
            <div className={`flex items-center ${registrationStep === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${registrationStep === 'success' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                4
              </div>
              <span className="ml-2 text-sm font-medium">Finalizado</span>
            </div>
          </div>
        </div>

        {/* Step 1: Search Person */}
        {registrationStep === 'search' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Search className="h-5 w-5 mr-2 text-primary" />
                Búsqueda por Cédula de Identidad
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ingrese número de CI"
                    value={searchCI}
                    onChange={(e) => setSearchCI(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSearchPerson}
                  className="btn btn-primary"
                  disabled={searchLoading || !searchCI.trim()}
                >
                  {searchLoading ? (
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

              {/* Found person */}
              {foundPerson && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Persona encontrada</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nombres completos:</p>
                      <p className="font-medium">{foundPerson.nombres} {foundPerson.apellido_paterno} {foundPerson.apellido_materno}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tipo:</p>
                      <p className="font-medium">{foundPerson.tipo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email:</p>
                      <p className="font-medium">{foundPerson.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Teléfono:</p>
                      <p className="font-medium">{foundPerson.telefono}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setRegistrationStep('capture')}
                    className="btn btn-primary mt-4"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Continuar con Registro Facial
                  </button>
                </div>
              )}
            </div>

            {/* Register new person form */}
            {showRegisterForm && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <UserPlus className="h-5 w-5 mr-2 text-primary" />
                  Registrar Nueva Persona
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CI *
                    </label>
                    <input
                      type="text"
                      className="form-input bg-gray-50"
                      value={searchCI}
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo *
                    </label>
                    <select
                      className="form-input"
                      value={newPersonData.tipo}
                      onChange={(e) => setNewPersonData({...newPersonData, tipo: e.target.value as 'Estudiante' | 'Docente'})}
                    >
                      <option value="Estudiante">Estudiante</option>
                      <option value="Docente">Docente</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombres *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={newPersonData.nombres}
                      onChange={(e) => setNewPersonData({...newPersonData, nombres: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido Paterno *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={newPersonData.apellido_paterno}
                      onChange={(e) => setNewPersonData({...newPersonData, apellido_paterno: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido Materno *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={newPersonData.apellido_materno}
                      onChange={(e) => setNewPersonData({...newPersonData, apellido_materno: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Nacimiento *
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={newPersonData.fecha_nacimiento}
                      onChange={(e) => setNewPersonData({...newPersonData, fecha_nacimiento: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      value={newPersonData.email}
                      onChange={(e) => setNewPersonData({...newPersonData, email: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      value={newPersonData.telefono}
                      onChange={(e) => setNewPersonData({...newPersonData, telefono: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Género *
                    </label>
                    <select
                      className="form-input"
                      value={newPersonData.genero}
                      onChange={(e) => setNewPersonData({...newPersonData, genero: e.target.value as 'Masculino' | 'Femenino' | 'Otro'})}
                    >
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={newPersonData.direccion}
                      onChange={(e) => setNewPersonData({...newPersonData, direccion: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowRegisterForm(false)}
                    className="btn btn-outline"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleRegisterNewPerson}
                    className="btn btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Persona
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Face Capture */}
        {registrationStep === 'capture' && foundPerson && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Camera className="h-5 w-5 mr-2 text-primary" />
              Registro Facial
            </h2>
            
            <div className="text-center">
              {!cameraActive && !capturedImage && (
                <div className="space-y-4">
                  <div className="w-64 h-48 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                    <Camera className="h-16 w-16 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    Para completar el registro, necesitamos capturar su rostro
                  </p>
                  <button
                    onClick={startCamera}
                    className="btn btn-primary"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Activar Cámara
                  </button>
                </div>
              )}
              
              {cameraActive && (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-64 h-48 bg-black rounded-lg border-2 border-primary"
                    />
                    <div className="absolute inset-0 border-2 border-dashed border-white rounded-lg m-4 opacity-50"></div>
                  </div>
                  <p className="text-gray-600">
                    Posicione su rostro en el centro y presione capturar
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={stopCamera}
                      className="btn btn-outline"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={capturePhoto}
                      className="btn btn-primary"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Capturar Foto
                    </button>
                  </div>
                </div>
              )}
              
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          </div>
        )}

        {/* Step 3: Verification */}
        {registrationStep === 'verify' && foundPerson && capturedImage && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-primary" />
              Verificación de Datos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-4">Datos Personales</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">CI:</span>
                    <span className="ml-2 font-medium">{foundPerson.ci}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Nombres:</span>
                    <span className="ml-2 font-medium">{foundPerson.nombres} {foundPerson.apellido_paterno} {foundPerson.apellido_materno}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Tipo:</span>
                    <span className="ml-2 font-medium">{foundPerson.tipo}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{foundPerson.email}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Foto Capturada</h3>
                <img
                  src={capturedImage}
                  alt="Rostro capturado"
                  className="w-48 h-36 object-cover rounded-lg border border-gray-300"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={retakePhoto}
                className="btn btn-outline"
              >
                <Camera className="h-4 w-4 mr-2" />
                Tomar Nueva Foto
              </button>
              <button
                onClick={saveVoterRegistration}
                className="btn btn-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Votante
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {registrationStep === 'success' && foundPerson && generatedQR && (
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">¡Registro Exitoso!</h2>
            <p className="text-gray-600 mb-6">
              El votante ha sido registrado correctamente en el sistema
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-medium mb-4 flex items-center justify-center">
                <QrCode className="h-5 w-5 mr-2" />
                Código QR del Votante
              </h3>
              <img
                src={generatedQR}
                alt="QR Code"
                className="w-48 h-48 mx-auto border border-gray-300 rounded-lg"
              />
              <p className="text-sm text-gray-600 mt-2">
                CI: {foundPerson.ci} | {foundPerson.nombres} {foundPerson.apellido_paterno}
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={downloadQR}
                className="btn btn-outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar QR
              </button>
              <button
                onClick={() => navigate('/electoral-roll')}
                className="btn btn-primary"
              >
                Volver al Padrón
              </button>
            </div>
          </div>
        )}

        {/* Person Not Found Modal */}
        {showNotFoundModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-red-600">Persona no encontrada</h2>
                <button
                  onClick={() => setShowNotFoundModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800 font-medium">No se encontró ninguna persona</span>
                </div>
                <p className="text-gray-700 mb-4">
                  No se encontró ninguna persona con CI: <strong>{searchCI}</strong>
                </p>
                <p className="text-gray-600 text-sm">
                  ¿Desea registrar una nueva persona con este CI?
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowNotFoundModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    setShowNotFoundModal(false);
                    setShowRegisterForm(true);
                  }}
                  className="btn btn-primary"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Registrar Nueva Persona
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-green-600">¡Éxito!</h2>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-gray-700">
                  {registrationStep === 'success' 
                    ? 'Votante registrado exitosamente'
                    : 'Persona registrada exitosamente. Ahora proceda con el registro facial.'
                  }
                </p>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="btn btn-primary"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-red-600">Error</h2>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800 font-medium">Ha ocurrido un error</span>
                </div>
                <p className="text-gray-700">
                  {errorMessage}
                </p>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={() => setShowErrorModal(false)}
                  className="btn btn-primary"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoterRegistrationPage;