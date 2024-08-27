// src/services/roleService.ts

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface Role {
  id: number;
  name: string;
  description: string;
}

export const roleService = {
  getRoles: async (): Promise<Role[]> => {
    const response = await axios.get(`${API_URL}/roles/`);
    return response.data;
  },

  createRole: async (roleData: Omit<Role, 'id'>): Promise<Role> => {
    const response = await axios.post(`${API_URL}/roles/`, roleData);
    return response.data;
  },

  updateRole: async (id: number, roleData: Partial<Omit<Role, 'id'>>): Promise<Role> => {
    const response = await axios.put(`${API_URL}/roles/${id}/`, roleData);
    return response.data;
  },

  deleteRole: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/roles/${id}/`);
  },
};