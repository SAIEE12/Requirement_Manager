// src/services/clientService.ts

import { apiService } from './apiService';

const API_URL = '/clients';  

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
    console.log('Client Service: Fetching clients');
    return apiService.get(`${API_URL}?include_inactive=${includeInactive}`);
  },

  getClient: async (id: number): Promise<Client> => {
    console.log(`Client Service: Fetching client with id ${id}`);
    return apiService.get(`${API_URL}/${id}`);
  },

  createClient: async (client: ClientCreate): Promise<Client> => {
    console.log('Client Service: Creating new client', client);
    return apiService.post(API_URL, client);
  },

  updateClient: async (id: number, client: ClientUpdate): Promise<Client> => {
    console.log(`Client Service: Updating client with id ${id}`, client);
    return apiService.put(`${API_URL}/${id}`, client);
  },

  deleteClient: async (id: number): Promise<void> => {
    console.log(`Client Service: Deleting client with id ${id}`);
    return apiService.delete(`${API_URL}/${id}`);
  },

  reactivateClient: async (id: number): Promise<Client> => {
    console.log(`Client Service: Reactivating client with id ${id}`);
    return apiService.post(`${API_URL}/${id}/reactivate`);
  }
};