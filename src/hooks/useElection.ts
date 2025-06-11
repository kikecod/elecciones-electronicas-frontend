// hooks/useElection.ts
import { useState, useEffect } from 'react';
import { EleccionesService } from '../services/elecciones.service';
import type { Eleccion } from '../types/eleccion';

export const useElection = () => {
  const [elections, setElections] = useState<Eleccion[]>([]);
  const [selectedElection, setSelectedElection] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar elecciones al montar el componente
  useEffect(() => {
    const loadElections = async () => {
      try {
        const data = await EleccionesService.getEleccionesActivas();
        setElections(data);
        
        // Cargar elección guardada si existe
        const savedElectionId = localStorage.getItem('selectedElectionId');
        if (savedElectionId && data.some(e => e.id === Number(savedElectionId))) {
          setSelectedElection(Number(savedElectionId));
        } else if (data.length > 0) {
          setSelectedElection(data[0].id); // Seleccionar primera por defecto
        }
      } catch (err) {
        setError('Error al cargar elecciones');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadElections();
  }, []);

  // Guardar en localStorage cuando cambia la selección
  useEffect(() => {
    if (selectedElection !== null) {
      localStorage.setItem('selectedElectionId', selectedElection.toString());
      console.log(`Elección seleccionada: ${selectedElection}`);
    }
  }, [selectedElection]);

  const currentElection = elections.find(e => e.id === selectedElection) || null;

  return {
    elections,
    selectedElection,
    currentElection,
    loading,
    error,
    setSelectedElection
  };
};