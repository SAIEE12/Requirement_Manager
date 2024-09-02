import axios from 'axios';

export interface Location {
  id: number;
  name: string;
  country: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocationCreate {
  name: string;
  country: string;
  description?: string;
  is_active: boolean;
}

export interface LocationUpdate {
  name?: string;
  country?: string;
  description?: string;
  is_active?: boolean;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/locations';
// const API_URL = '/api/locations';

export const locationService = {
  getLocations: async (includeInactive: boolean = false): Promise<Location[]> => {
    const response = await axios.get(`${API_URL}?include_inactive=${includeInactive}`);
    return response.data;
  },

  getLocation: async (id: number): Promise<Location> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createLocation: async (location: LocationCreate): Promise<Location> => {
    const response = await axios.post(API_URL, location);
    return response.data;
  },

  updateLocation: async (id: number, location: LocationUpdate): Promise<Location> => {
    const response = await axios.put(`${API_URL}/${id}`, {
      ...location,
      is_active: location.is_active  
    });
    return response.data;
  },

  deleteLocation: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },

  reactivateLocation: async (id: number): Promise<Location> => {
    const response = await axios.post(`${API_URL}/${id}/reactivate`);
    return response.data;
  }
};