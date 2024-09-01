import axios from 'axios';

// const API_URL = '/api/status'; // Adjust this if your API base URL is different
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

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
    try {
      const response = await axios.get(`${API_URL}/status/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching statuses:', error);
      throw error;
    }
  },

  getStatus: async (id: number): Promise<Status> => {
    try {
      const response = await axios.get(`${API_URL}/status/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching status with id ${id}:`, error);
      throw error;
    }
  },

  createStatus: async (status: StatusCreate): Promise<Status> => {
    try {
      const response = await axios.post(`${API_URL}/status/`, status);
      return response.data;
    } catch (error) {
      console.error('Error creating status:', error);
      throw error;
    }
  },

  updateStatus: async (id: number, status: StatusUpdate): Promise<Status> => {
    try {
      const response = await axios.put(`${API_URL}/status/${id}`, status);
      return response.data;
    } catch (error) {
      console.error(`Error updating status with id ${id}:`, error);
      throw error;
    }
  },

  deleteStatus: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/status/${id}`);
    } catch (error) {
      console.error(`Error deleting status with id ${id}:`, error);
      throw error;
    }
  }
};