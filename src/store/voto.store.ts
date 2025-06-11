// voto.store.ts
import create from 'zustand';
import { VotingState, VotingStep } from './types';
import { verificarVotante } from './voto.service';

interface VotingStore extends VotingState {
  setStudentId: (id: string) => void;
  setCurrentStep: (step: VotingStep) => void;
  setSelectedParty: (partyId: number | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  handleVerification: () => Promise<void>;
}

export const useVotingStore = create<VotingStore>((set, get) => ({
  studentId: '',
  loading: false,
  error: '',
  currentStep: 'verification',
  selectedParty: null,
  
  setStudentId: (id) => set({ studentId: id }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setSelectedParty: (partyId) => set({ selectedParty: partyId }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Verifica la existencia del votante llamando a la API
  handleVerification: async () => {
    const { studentId, setLoading, setError, setCurrentStep } = get();
    
    if (!studentId) {
      setError('Por favor ingrese su código de estudiante');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const votante = await verificarVotante(studentId); // Verifica el votante usando la API

      if (!votante) {
        setError('No existe el votante');
      } else if (!votante.habilitado) {
        setError('Votante no habilitado');
      } else {
        setCurrentStep('voting');
      }
    } catch (error) {
      setError('Ocurrió un error al verificar el votante');
    } finally {
      setLoading(false); // Siempre desactiva el loading al final
    }
  },
}));