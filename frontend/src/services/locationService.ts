import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface Location {
  id: number;
  name: string;
  country: string;
  description: string | null;
}

export const locationService = {
  getLocations: async (): Promise<Location[]> => {
    const response = await axios.get(`${API_URL}/locations/`);
    return response.data;
  },

  createLocation: async (locationData: Omit<Location, 'id'>): Promise<Location> => {
    const response = await axios.post(`${API_URL}/locations/`, locationData);
    return response.data;
  },

  updateLocation: async (id: number, locationData: Partial<Omit<Location, 'id'>>): Promise<Location> => {
    const response = await axios.put(`${API_URL}/locations/${id}/`, locationData);
    return response.data;
  },

  deleteLocation: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/locations/${id}/`);
  },
};