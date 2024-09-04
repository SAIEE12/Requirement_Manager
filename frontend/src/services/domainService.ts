import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/domains';

export interface Domain {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DomainCreate {
  name: string;
}

export interface DomainUpdate {
  name?: string;
  is_active?: boolean;
}

export const domainService = {
  getDomains: async (includeInactive: boolean = false): Promise<Domain[]> => {
    const response = await axios.get(`${API_URL}?include_inactive=${includeInactive}`);
    return response.data;
  },

  getDomain: async (id: number): Promise<Domain> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createDomain: async (domain: DomainCreate): Promise<Domain> => {
    try {
      const response = await axios.post(API_URL, domain);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to create domain');
    }
  },

  updateDomain: async (id: number, domain: DomainUpdate): Promise<Domain> => {
    const response = await axios.put(`${API_URL}/${id}`, domain);
    return response.data;
  },

  deleteDomain: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },

  reactivateDomain: async (id: number): Promise<Domain> => {
    const response = await axios.post(`${API_URL}/${id}/reactivate`);
    return response.data;
  }
};