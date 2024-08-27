import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface Client {
  id: number;
  name: string;
  industry: string;
  contact_person: string;
  email: string;
  phone: string;
}

export const clientService = {
  getClients: async (): Promise<Client[]> => {
    const response = await axios.get(`${API_URL}/clients/`);
    return response.data;
  },

  createClient: async (clientData: Omit<Client, 'id'>): Promise<Client> => {
    const response = await axios.post(`${API_URL}/clients/`, clientData);
    return response.data;
  },

  updateClient: async (id: number, clientData: Partial<Omit<Client, 'id'>>): Promise<Client> => {
    const response = await axios.put(`${API_URL}/clients/${id}/`, clientData);
    return response.data;
  },

  deleteClient: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/clients/${id}/`);
  },
};