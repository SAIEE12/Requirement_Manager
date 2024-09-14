// src/services/requirementService.ts

import { apiService } from './apiService';
import { Client, Location } from '../types/types';

interface Status {
  id: number;
  name: string;
}

export interface RequirementComment {
  id: number;
  content: string;
  requirement_id: number;
  user_id: number;
  username: string;
  created_at: string;
}

export interface Requirement {
  id: number;
  description: string;
  client_id: number;
  client: Client;
  experience_min: number;
  experience_max: number;
  location_id: number;
  location: Location;
  notes?: string;
  status: Status;
  comments?: RequirementComment[];
  created_at: string; 
  days_open: number; 
}

export interface RequirementCreate {
  description: string;
  client_id: number;
  experience_min: number;
  experience_max: number;
  location_id: number;
  notes?: string;
}

export interface RequirementUpdate {
  description?: string;
  client_id?: number;
  experience_min?: number;
  experience_max?: number;
  location_id?: number;
  notes?: string;
}

export const requirementService = {
  getRequirements: async (): Promise<Requirement[]> => {
    return apiService.get<Requirement[]>('/requirements');
  },

  getRequirement: async (id: number): Promise<Requirement> => {
    return apiService.get<Requirement>(`/requirements/${id}`);
  },

  createRequirement: async (requirement: RequirementCreate): Promise<Requirement> => {
    return apiService.post<Requirement>('/requirements', requirement);
  },

  updateRequirement: async (id: number, requirement: RequirementUpdate): Promise<Requirement> => {
    return apiService.put<Requirement>(`/requirements/${id}`, requirement);
  },

  deleteRequirement: async (id: number): Promise<void> => {
    return apiService.delete<void>(`/requirements/${id}`);
  },

  getClients: async (): Promise<Client[]> => {
    return apiService.get<Client[]>('/clients');
  },

  getLocations: async (): Promise<Location[]> => {
    return apiService.get<Location[]>('/locations');
  },

  getComments: async (requirementId: number): Promise<RequirementComment[]> => {
    console.log(`Fetching comments`);
    return apiService.get<RequirementComment[]>(`/requirements/${requirementId}/comments`);
  },

  addComment: async (requirementId: number, content: string): Promise<RequirementComment> => {
    console.log(`requirementService: Adding comment for requirement ${requirementId}`);
    try {
      const response = await apiService.post<RequirementComment>(
        `/requirements/${requirementId}/comments`, 
        { content }
      );
      console.log('requirementService: Comment added successfully', response);
      return response;
    } catch (error) {
      console.error('requirementService: Error adding comment:', error);
      throw error;
    }
  },
};