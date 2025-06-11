// components/ElectionSelector.tsx
import { Calendar } from 'lucide-react';
import { useElection } from '../hooks/useElection';
import Skeleton from '@mui/material/Skeleton';

export const ElectionSelector = () => {
  const {
    elections,
    selectedElection,
    currentElection,
    loading,
    error,
    setSelectedElection
  } = useElection();

  if (loading) {
    return (
      <div className="card p-6 mb-6">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 mb-6 bg-red-50 text-red-700">
        {error}
      </div>
    );
  }

  if (elections.length === 0) {
    return (
      <div className="card p-6 mb-6 bg-yellow-50 text-yellow-700">
        No hay elecciones activas disponibles
      </div>
    );
  }

  return (
    <div className="card p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Elección Actual</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Elección Activa
          </label>
          <select
            className="form-input"
            value={selectedElection || ''}
            onChange={(e) => setSelectedElection(Number(e.target.value))}
          >
            {elections.map((election) => (
              <option key={election.id} value={election.id}>
                {election.nombre} ({election.tipo})
              </option>
            ))}
          </select>
        </div>
        {currentElection && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900">{currentElection.nombre}</h4>
            <p className="text-sm text-blue-700 mt-1">{currentElection.descripcion}</p>
            <div className="flex items-center mt-2">
              <Calendar className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-sm text-blue-700">
                {new Date(currentElection.fechaInicio).toLocaleDateString()} - {' '}
                {new Date(currentElection.fechaFin).toLocaleDateString()}
              </span>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              ID: {currentElection.id} | Versión: {currentElection.version}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};