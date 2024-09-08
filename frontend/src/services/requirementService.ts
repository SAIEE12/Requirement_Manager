import axios from 'axios';
import { Client, Location } from '../types/types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface Comment {
  id: number;
  content: string;
  requirement_id: number;
  user_id: number;
  created_at: string;
}

export interface RequirementComment {
  id: number;
  content: string;
  requirement_id: number;
  user_id: number;
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
  comments?: RequirementComment[];
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
    const response = await axios.get(`${API_URL}/requirements`);
    return response.data;
  },

  getRequirement: async (id: number): Promise<Requirement> => {
    const response = await axios.get(`${API_URL}/requirements/${id}`);
    return response.data;
  },

  createRequirement: async (requirement: RequirementCreate): Promise<Requirement> => {
    const response = await axios.post(`${API_URL}/requirements`, requirement);
    return response.data;
  },

  updateRequirement: async (id: number, requirement: RequirementUpdate): Promise<Requirement> => {
    const response = await axios.put(`${API_URL}/requirements/${id}`, requirement);
    return response.data;
  },

  deleteRequirement: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/requirements/${id}`);
  },

  getClients: async (): Promise<Client[]> => {
    const response = await axios.get(`${API_URL}/clients`);
    return response.data;
  },

  getLocations: async (): Promise<Location[]> => {
    const response = await axios.get(`${API_URL}/locations`);
    return response.data;
  },

  getComments: async (requirementId: number): Promise<RequirementComment[]> => {
    const response = await axios.get(`${API_URL}/requirements/${requirementId}/comments`);
    return response.data;
  },

  addComment: async (requirementId: number, content: string): Promise<RequirementComment> => {
    const response = await axios.post(`${API_URL}/requirements/${requirementId}/comments`, { content });
    return response.data;
  },
};