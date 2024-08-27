import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface User {
  id: number;
  username: string;
  email: string;
  role_id: number;
  first_name?: string;
  last_name?: string;
}

export interface Role {
  id: number;
  name: string;
}

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await axios.get(`${API_URL}/users/`);
    return response.data;
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await axios.put(`${API_URL}/users/${id}/`, userData);
    return response.data;
  },

  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    const response = await axios.post(`${API_URL}/users/`, userData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/users/${id}/`);
  },
};