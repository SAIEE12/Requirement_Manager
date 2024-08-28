import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface Domain {
  id: number;
  name: string;
  description: string | null;
}

export const domainService = {
  getDomains: async (): Promise<Domain[]> => {
    const response = await axios.get(`${API_URL}/domains/`);
    return response.data;
  },

  createDomain: async (domainData: Omit<Domain, 'id'>): Promise<Domain> => {
    const response = await axios.post(`${API_URL}/domains/`, domainData);
    return response.data;
  },

  updateDomain: async (id: number, domainData: Partial<Omit<Domain, 'id'>>): Promise<Domain> => {
    const response = await axios.put(`${API_URL}/domains/${id}/`, domainData);
    return response.data;
  },

  deleteDomain: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/domains/${id}/`);
  },
};