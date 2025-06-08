import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, MapPin, Laptop, User, FileText, Download, X, Save } from 'lucide-react';

// Types
interface Device {
  id: number;
  type: string;
  serial: string;
  model: string;
  precinctId: number;
  publicKey: string;
  lastRevision: string;
  status: 'Operativo' | 'En mantenimiento' | 'Inoperativo';
}

interface Precinct {
  id: number;
  name: string;
  campus: string;
  building: string;
  classroom: string;
  capacity: number;
  responsiblePerson: string;
  status: 'Activo' | 'Inactivo';
}

// Mock data for precincts
const mockPrecincts: Precinct[] = [
  { 
    id: 1, 
    name: 'Edificio Central', 
    campus: 'Campus Principal',
    building: 'Edificio A',
    classroom: 'Aula 101',
    capacity: 50,
    responsiblePerson: 'Carlos Méndez',
    status: 'Activo'
  },
  { 
    id: 2, 
    name: 'Facultad de Ingeniería', 
    campus: 'Campus Principal',
    building: 'Edificio B',
    classroom: 'Aula 205',
    capacity: 40,
    responsiblePerson: 'María Rodríguez',
    status: 'Activo'
  },
  { 
    id: 3, 
    name: 'Biblioteca Central', 
    campus: 'Campus Principal',
    building: 'Biblioteca',
    classroom: 'Sala 1',
    capacity: 30,
    responsiblePerson: 'Juan Pérez',
    status: 'Inactivo'
  },
];

// Mock data for devices
const mockDevices: Device[] = [
  { 
    id: 1, 
    type: 'Tablet', 
    serial: 'TB-2021-001', 
    model: 'Samsung Galaxy Tab A7',
    precinctId: 1, 
    publicKey: 'RSA-2048-ABC123',
    lastRevision: '2024-01-15',
    status: 'Operativo' 
  },
  { 
    id: 2, 
    type: 'Laptop', 
    serial: 'LP-2021-002', 
    model: 'Dell Latitude 5520',
    precinctId: 1, 
    publicKey: 'RSA-2048-DEF456',
    lastRevision: '2024-01-10',
    status: 'Operativo' 
  },
  { 
    id: 3, 
    type: 'Tablet', 
    serial: 'TB-2021-003', 
    model: 'iPad Air',
    precinctId: 2, 
    publicKey: 'RSA-2048-GHI789',
    lastRevision: '2024-01-08',
    status: 'En mantenimiento' 
  },
];

const PrecinctAdminPage: React.FC = () => {
  const [precincts, setPrecincts] = useState<Precinct[]>(mockPrecincts);
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'precincts' | 'devices'>('precincts');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Modal states
  const [showPrecinctModal, setShowPrecinctModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPrecinct, setEditingPrecinct] = useState<Precinct | null>(null);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{type: 'precinct' | 'device', item: Precinct | Device} | null>(null);

  // Form data
  const [precinctFormData, setPrecinctFormData] = useState({
    name: '',
    campus: '',
    building: '',
    classroom: '',
    capacity: 30,
    responsiblePerson: '',
    status: 'Activo' as 'Activo' | 'Inactivo'
  });

  const [deviceFormData, setDeviceFormData] = useState({
    type: '',
    serial: '',
    model: '',
    precinctId: 0,
    publicKey: '',
    lastRevision: '',
    status: 'Operativo' as 'Operativo' | 'En mantenimiento' | 'Inoperativo'
  });
  
  // Filter precincts based on search term and status
  const filteredPrecincts = precincts.filter(precinct => {
    const matchesSearch = 
      precinct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      precinct.campus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      precinct.building.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === '' || precinct.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Filter devices based on search term and status
  const filteredDevices = devices.filter(device => {
    const matchesSearch = 
      device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === '' || device.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handle precinct form submission
  const handlePrecinctSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPrecinct) {
      setPrecincts(precincts.map(precinct => 
        precinct.id === editingPrecinct.id 
          ? { ...precinct, ...precinctFormData }
          : precinct
      ));
    } else {
      const newPrecinct: Precinct = {
        id: Math.max(...precincts.map(p => p.id)) + 1,
        ...precinctFormData
      };
      setPrecincts([...precincts, newPrecinct]);
    }
    
    resetPrecinctForm();
  };

  // Handle device form submission
  const handleDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDevice) {
      setDevices(devices.map(device => 
        device.id === editingDevice.id 
          ? { ...device, ...deviceFormData }
          : device
      ));
    } else {
      const newDevice: Device = {
        id: Math.max(...devices.map(d => d.id)) + 1,
        ...deviceFormData
      };
      setDevices([...devices, newDevice]);
    }
    
    resetDeviceForm();
  };

  // Reset forms
  const resetPrecinctForm = () => {
    setPrecinctFormData({
      name: '',
      campus: '',
      building: '',
      classroom: '',
      capacity: 30,
      responsiblePerson: '',
      status: 'Activo'
    });
    setEditingPrecinct(null);
    setShowPrecinctModal(false);
  };

  const resetDeviceForm = () => {
    setDeviceFormData({
      type: '',
      serial: '',
      model: '',
      precinctId: 0,
      publicKey: '',
      lastRevision: '',
      status: 'Operativo'
    });
    setEditingDevice(null);
    setShowDeviceModal(false);
  };

  // Handle edit
  const handleEditPrecinct = (precinct: Precinct) => {
    setEditingPrecinct(precinct);
    setPrecinctFormData(precinct);
    setShowPrecinctModal(true);
  };

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device);
    setDeviceFormData(device);
    setShowDeviceModal(true);
  };

  // Handle delete
  const handleDelete = (type: 'precinct' | 'device', item: Precinct | Device) => {
    setDeleteTarget({ type, item });
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'precinct') {
      setPrecincts(precincts.filter(p => p.id !== deleteTarget.item.id));
      // Also remove devices from this precinct
      setDevices(devices.filter(d => d.precinctId !== deleteTarget.item.id));
    } else {
      setDevices(devices.filter(d => d.id !== deleteTarget.item.id));
    }

    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Handle generate precinct report
  const handleGeneratePrecinctReport = () => {
    const reportData = `
ACTA DE RECINTOS ELECTORALES
============================

Fecha de generación: ${new Date().toLocaleDateString()}
Hora: ${new Date().toLocaleTimeString()}

RESUMEN DE RECINTOS:
- Total de recintos: ${precincts.length}
- Recintos activos: ${precincts.filter(p => p.status === 'Activo').length}
- Recintos inactivos: ${precincts.filter(p => p.status === 'Inactivo').length}
- Total de dispositivos: ${devices.length}

DETALLE POR RECINTO:
${precincts.map(precinct => `
${precinct.name}
- Campus: ${precinct.campus}
- Edificio: ${precinct.building}
- Aula: ${precinct.classroom}
- Capacidad: ${precinct.capacity} personas
- Responsable: ${precinct.responsiblePerson}
- Estado: ${precinct.status}
`).join('')}

DISPOSITIVOS POR RECINTO:
${precincts.map(precinct => {
  const precinctDevices = devices.filter(d => d.precinctId === precinct.id);
  return `
${precinct.name}:
${precinctDevices.map(device => `  - ${device.type} ${device.model} (${device.serial}) - ${device.status}`).join('\n')}
`;
}).join('')}

Documento generado automáticamente por el Sistema Electoral Universitario.
    `;
    
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Acta_Recintos_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };
  
  return (
    <div className="fade-in py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Administración de Recintos</h1>
            <p className="text-gray-600">
              Gestión de lugares de votación, dispositivos habilitados y responsables.
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button 
              className="btn btn-secondary"
              onClick={handleGeneratePrecinctReport}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generar Acta de Recintos
            </button>
            {selectedTab === 'precincts' ? (
              <button 
                className="btn btn-primary"
                onClick={() => setShowPrecinctModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Recinto
              </button>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={() => setShowDeviceModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Dispositivo
              </button>
            )}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 border-b-2 font-medium text-sm ${
              selectedTab === 'precincts'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setSelectedTab('precincts')}
          >
            Recintos
          </button>
          <button
            className={`py-3 px-6 border-b-2 font-medium text-sm ${
              selectedTab === 'devices'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setSelectedTab('devices')}
          >
            Dispositivos
          </button>
        </div>
        
        {/* Search and filters */}
        <div className="card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Buscar ${selectedTab === 'precincts' ? 'recintos' : 'dispositivos'}...`}
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
                {selectedTab === 'precincts' ? (
                  <>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </>
                ) : (
                  <>
                    <option value="Operativo">Operativo</option>
                    <option value="En mantenimiento">En mantenimiento</option>
                    <option value="Inoperativo">Inoperativo</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>
        
        {/* Precincts tab content */}
        {selectedTab === 'precincts' && (
          <div className="overflow-hidden card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsable
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
                  {filteredPrecincts.map((precinct) => (
                    <tr key={precinct.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {precinct.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <p>{precinct.campus}</p>
                          <p className="text-xs text-gray-400">{precinct.building} - {precinct.classroom}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {precinct.capacity} personas
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {precinct.responsiblePerson}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          precinct.status === 'Activo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {precinct.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleEditPrecinct(precinct)}
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete('precinct', precinct)}
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
          </div>
        )}
        
        {/* Devices tab content */}
        {selectedTab === 'devices' && (
          <div className="overflow-hidden card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo/Modelo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recinto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Revisión
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
                  {filteredDevices.map((device) => {
                    const precinct = precincts.find(p => p.id === device.precinctId);
                    
                    return (
                      <tr key={device.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                          <Laptop className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <p>{device.type}</p>
                            <p className="text-xs text-gray-500">{device.model}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {device.serial}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            {precinct?.name || 'No asignado'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(device.lastRevision).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            device.status === 'Operativo'
                              ? 'bg-green-100 text-green-800'
                              : device.status === 'En mantenimiento'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {device.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => handleEditDevice(device)}
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDelete('device', device)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Precinct Modal */}
        {showPrecinctModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {editingPrecinct ? 'Editar Recinto' : 'Nuevo Recinto'}
                </h2>
                <button
                  onClick={resetPrecinctForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handlePrecinctSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={precinctFormData.name}
                      onChange={(e) => setPrecinctFormData({...precinctFormData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campus *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={precinctFormData.campus}
                      onChange={(e) => setPrecinctFormData({...precinctFormData, campus: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Edificio *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={precinctFormData.building}
                      onChange={(e) => setPrecinctFormData({...precinctFormData, building: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aula *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={precinctFormData.classroom}
                      onChange={(e) => setPrecinctFormData({...precinctFormData, classroom: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacidad *
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={precinctFormData.capacity}
                      onChange={(e) => setPrecinctFormData({...precinctFormData, capacity: parseInt(e.target.value)})}
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <select
                      className="form-input"
                      value={precinctFormData.status}
                      onChange={(e) => setPrecinctFormData({...precinctFormData, status: e.target.value as 'Activo' | 'Inactivo'})}
                      required
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsable *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={precinctFormData.responsiblePerson}
                      onChange={(e) => setPrecinctFormData({...precinctFormData, responsiblePerson: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={resetPrecinctForm}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Save className="h-4 w-4 mr-2" />
                    {editingPrecinct ? 'Actualizar' : 'Crear'} Recinto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Device Modal */}
        {showDeviceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {editingDevice ? 'Editar Dispositivo' : 'Nuevo Dispositivo'}
                </h2>
                <button
                  onClick={resetDeviceForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleDeviceSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo *
                    </label>
                    <select
                      className="form-input"
                      value={deviceFormData.type}
                      onChange={(e) => setDeviceFormData({...deviceFormData, type: e.target.value})}
                      required
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Desktop">Desktop</option>
                      <option value="Smartphone">Smartphone</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modelo *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={deviceFormData.model}
                      onChange={(e) => setDeviceFormData({...deviceFormData, model: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Serie *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={deviceFormData.serial}
                      onChange={(e) => setDeviceFormData({...deviceFormData, serial: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recinto *
                    </label>
                    <select
                      className="form-input"
                      value={deviceFormData.precinctId}
                      onChange={(e) => setDeviceFormData({...deviceFormData, precinctId: parseInt(e.target.value)})}
                      required
                    >
                      <option value={0}>Seleccionar recinto</option>
                      {precincts.map(precinct => (
                        <option key={precinct.id} value={precinct.id}>
                          {precinct.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clave Pública *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={deviceFormData.publicKey}
                      onChange={(e) => setDeviceFormData({...deviceFormData, publicKey: e.target.value})}
                      placeholder="RSA-2048-..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Última Revisión *
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={deviceFormData.lastRevision}
                      onChange={(e) => setDeviceFormData({...deviceFormData, lastRevision: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <select
                      className="form-input"
                      value={deviceFormData.status}
                      onChange={(e) => setDeviceFormData({...deviceFormData, status: e.target.value as 'Operativo' | 'En mantenimiento' | 'Inoperativo'})}
                      required
                    >
                      <option value="Operativo">Operativo</option>
                      <option value="En mantenimiento">En mantenimiento</option>
                      <option value="Inoperativo">Inoperativo</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={resetDeviceForm}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Save className="h-4 w-4 mr-2" />
                    {editingDevice ? 'Actualizar' : 'Crear'} Dispositivo
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
                  ¿Está seguro de que desea eliminar {deleteTarget.type === 'precinct' ? 'este recinto' : 'este dispositivo'}?
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{deleteTarget.item.name || (deleteTarget.item as Device).type}</p>
                  {deleteTarget.type === 'precinct' ? (
                    <div className="text-sm text-gray-600">
                      <p>Campus: {(deleteTarget.item as Precinct).campus}</p>
                      <p>Capacidad: {(deleteTarget.item as Precinct).capacity} personas</p>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      <p>Serie: {(deleteTarget.item as Device).serial}</p>
                      <p>Modelo: {(deleteTarget.item as Device).model}</p>
                    </div>
                  )}
                </div>
                <p className="text-red-600 text-sm mt-4">
                  Esta acción no se puede deshacer.
                  {deleteTarget.type === 'precinct' && ' También se eliminarán todos los dispositivos asignados a este recinto.'}
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

export default PrecinctAdminPage;