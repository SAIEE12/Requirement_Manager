// src/services/domainService.ts

import { apiService } from './apiService';

const API_URL = '/domains';  
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
    console.log('Domain Service: Fetching domains');
    return apiService.get(`${API_URL}?include_inactive=${includeInactive}`);
  },

  getDomain: async (id: number): Promise<Domain> => {
    console.log(`Domain Service: Fetching domain with id ${id}`);
    return apiService.get(`${API_URL}/${id}`);
  },

  createDomain: async (domain: DomainCreate): Promise<Domain> => {
    console.log('Domain Service: Creating new domain', domain);
    try {
      return await apiService.post(API_URL, domain);
    } catch (error: any) {
      console.error('Domain Service: Error creating domain', error);
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to create domain');
    }
  },

  updateDomain: async (id: number, domain: DomainUpdate): Promise<Domain> => {
    console.log(`Domain Service: Updating domain with id ${id}`, domain);
    return apiService.put(`${API_URL}/${id}`, domain);
  },

  deleteDomain: async (id: number): Promise<void> => {
    console.log(`Domain Service: Deleting domain with id ${id}`);
    return apiService.delete(`${API_URL}/${id}`);
  },

  reactivateDomain: async (id: number): Promise<Domain> => {
    console.log(`Domain Service: Reactivating domain with id ${id}`);
    return apiService.post(`${API_URL}/${id}/reactivate`);
  }
};