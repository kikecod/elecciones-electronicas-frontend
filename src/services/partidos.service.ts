// services/partidos.service.ts
import axios from 'axios';
import type { Partido } from '../types/partido';

const API_BASE_URL = 'http://localhost:9090/api';

export const PartidosService = {
  async getPartidosByEleccion(idEleccion: number): Promise<Partido[]> {
    const response = await axios.get(`${API_BASE_URL}/partidos/eleccion/${idEleccion}`);
    return response.data;
  }
};