// services/votantes.service.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const VotantesService = {
  async buscarPorCI(ci: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/votantes/buscar`, {
        params: { ci }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // Votante no encontrado
      }
      throw error; // Re-lanzamos otros errores
    }
  },
  async registrarVoto(votoData: {
    idVotante: number;
    idEleccion: number;
    idPartido: number;
  }) {
    const response = await axios.post(`${API_BASE_URL}/api/votos`, votoData);
    return response.data;
  },

  async enviarCarnetPorEmail(idVotante: number) {
    await axios.post(`${API_BASE_URL}/carnet-sufragio/${idVotante}/enviar-email`);
  }
};

