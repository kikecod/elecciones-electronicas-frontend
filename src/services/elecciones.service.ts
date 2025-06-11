// services/elecciones.service.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api';

export const EleccionesService = {
  async getEleccionesActivas(): Promise<Eleccion[]> {
    const response = await axios.get(`${API_BASE_URL}/elecciones`);
    return response.data.filter((e: Eleccion) => e.estado);
  }
};