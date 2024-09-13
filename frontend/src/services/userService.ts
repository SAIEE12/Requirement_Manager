// src/services/userService.ts

import { apiService } from './apiService';

const API_URL = '/users';  
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
    console.log('User Service: Fetching users');
    try {
      return await apiService.get(`${API_URL}/`);
    } catch (error) {
      console.error('User Service: Error fetching users:', error);
      throw error;
    }
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    console.log(`User Service: Updating user with id ${id}`, userData);
    try {
      return await apiService.put(`${API_URL}/${id}/`, userData);
    } catch (error) {
      console.error(`User Service: Error updating user with id ${id}:`, error);
      throw error;
    }
  },

  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    console.log('User Service: Creating new user', userData);
    try {
      return await apiService.post(`${API_URL}/`, userData);
    } catch (error) {
      console.error('User Service: Error creating user:', error);
      throw error;
    }
  },

  deleteUser: async (id: number): Promise<void> => {
    console.log(`User Service: Deleting user with id ${id}`);
    try {
      await apiService.delete(`${API_URL}/${id}/`);
    } catch (error) {
      console.error(`User Service: Error deleting user with id ${id}:`, error);
      throw error;
    }
  },
};