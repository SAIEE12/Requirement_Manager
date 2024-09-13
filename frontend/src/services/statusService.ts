// src/services/statusService.ts

import { apiService } from './apiService';

const API_URL = '/status';  

export interface Status {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

export interface StatusCreate {
  name: string;
  description: string;
  is_active: boolean;
}

export interface StatusUpdate {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export const statusService = {
  getStatuses: async (): Promise<Status[]> => {
    console.log('Status Service: Fetching statuses');
    try {
      return await apiService.get(`${API_URL}/`);
    } catch (error) {
      console.error('Status Service: Error fetching statuses:', error);
      throw error;
    }
  },

  getStatus: async (id: number): Promise<Status> => {
    console.log(`Status Service: Fetching status with id ${id}`);
    try {
      return await apiService.get(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Status Service: Error fetching status with id ${id}:`, error);
      throw error;
    }
  },

  createStatus: async (status: StatusCreate): Promise<Status> => {
    console.log('Status Service: Creating new status', status);
    try {
      return await apiService.post(`${API_URL}/`, status);
    } catch (error) {
      console.error('Status Service: Error creating status:', error);
      throw error;
    }
  },

  updateStatus: async (id: number, status: StatusUpdate): Promise<Status> => {
    console.log(`Status Service: Updating status with id ${id}`, status);
    try {
      return await apiService.put(`${API_URL}/${id}`, status);
    } catch (error) {
      console.error(`Status Service: Error updating status with id ${id}:`, error);
      throw error;
    }
  },

  deleteStatus: async (id: number): Promise<void> => {
    console.log(`Status Service: Deleting status with id ${id}`);
    try {
      await apiService.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Status Service: Error deleting status with id ${id}:`, error);
      throw error;
    }
  }
};