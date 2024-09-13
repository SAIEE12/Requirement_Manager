// src/services/roleService.ts

import { apiService } from './apiService';

const API_URL = '/roles';  // Note: We remove the full URL as it's handled in apiService

export interface Role {
  id: number;
  name: string;
  description: string;
}

export const roleService = {
  getRoles: async (): Promise<Role[]> => {
    console.log('Role Service: Fetching roles');
    return apiService.get(`${API_URL}/`);
  },

  createRole: async (roleData: Omit<Role, 'id'>): Promise<Role> => {
    console.log('Role Service: Creating new role', roleData);
    return apiService.post(`${API_URL}/`, roleData);
  },

  updateRole: async (id: number, roleData: Partial<Omit<Role, 'id'>>): Promise<Role> => {
    console.log(`Role Service: Updating role with id ${id}`, roleData);
    return apiService.put(`${API_URL}/${id}/`, roleData);
  },

  deleteRole: async (id: number): Promise<void> => {
    console.log(`Role Service: Deleting role with id ${id}`);
    return apiService.delete(`${API_URL}/${id}/`);
  },
};