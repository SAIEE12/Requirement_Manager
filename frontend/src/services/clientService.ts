import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/clients';

export interface Client {
  id: number;
  name: string;
  industry: string;
  contact_person: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientCreate {
  name: string;
  industry: string;
  contact_person: string;
  email: string;
  phone: string;
  is_active: boolean;
}

export interface ClientUpdate {
  name?: string;
  industry?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
}

export const clientService = {
  getClients: async (includeInactive: boolean = false): Promise<Client[]> => {
    const response = await axios.get(`${API_URL}?include_inactive=${includeInactive}`);
    return response.data;
  },

  getClient: async (id: number): Promise<Client> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createClient: async (client: ClientCreate): Promise<Client> => {
    const response = await axios.post(API_URL, client);
    return response.data;
  },

  updateClient: async (id: number, client: ClientUpdate): Promise<Client> => {
    const response = await axios.put(`${API_URL}/${id}`, client);
    return response.data;
  },

  deleteClient: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },

  reactivateClient: async (id: number): Promise<Client> => {
    const response = await axios.post(`${API_URL}/${id}/reactivate`);
    return response.data;
  }
};