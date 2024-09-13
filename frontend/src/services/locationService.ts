// src/services/locationService.ts

import { apiService } from './apiService';

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

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/locations';
const API_URL = process.env.REACT_APP_API_URL || '/locations';
console.log('Location Service: Initializing with API_URL:', API_URL);

export const locationService = {
  getLocations: async (includeInactive: boolean = false): Promise<Location[]> => {
    console.log('Location Service: Attempting to fetch locations');
    try {
      const url = `${API_URL}?include_inactive=${includeInactive}`;
      console.log('Location Service: Calling apiService.get with URL:', url);
      const data = await apiService.get<Location[]>(url);
      console.log('Location Service: Locations fetched successfully', data);
      return data;
    } catch (error) {
      console.error('Location Service: Error fetching locations', error);
      throw error;
    }
  },

  getLocation: async (id: number): Promise<Location> => {
    console.log(`Location Service: Fetching location with id ${id}`);
    return apiService.get(`${API_URL}/${id}`);
  },

  createLocation: async (location: LocationCreate): Promise<Location> => {
    console.log('Location Service: Creating new location', location);
    return apiService.post(API_URL, location);
  },

  updateLocation: async (id: number, location: LocationUpdate): Promise<Location> => {
    console.log(`Location Service: Updating location with id ${id}`, location);
    return apiService.put(`${API_URL}/${id}`, {
      ...location,
      is_active: location.is_active
    });
  },

  deleteLocation: async (id: number): Promise<void> => {
    console.log(`Location Service: Deleting location with id ${id}`);
    return apiService.delete(`${API_URL}/${id}`);
  },

  reactivateLocation: async (id: number): Promise<Location> => {
    console.log(`Location Service: Reactivating location with id ${id}`);
    return apiService.post(`${API_URL}/${id}/reactivate`);
  }
};