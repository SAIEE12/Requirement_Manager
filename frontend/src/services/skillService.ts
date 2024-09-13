// src/services/skillService.ts

import { apiService } from './apiService';

const API_URL = '/skills'; 

export interface Skill {
  id: number;
  name: string;
  domain_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkillCreate {
  name: string;
  domain_id: number;
}

export interface SkillUpdate {
  name?: string;
  domain_id?: number;
  is_active?: boolean;
}

export const skillService = {
  getSkills: async (includeInactive: boolean = false): Promise<Skill[]> => {
    console.log('Skill Service: Fetching skills');
    return apiService.get(`${API_URL}?include_inactive=${includeInactive}`);
  },

  getSkill: async (id: number): Promise<Skill> => {
    console.log(`Skill Service: Fetching skill with id ${id}`);
    return apiService.get(`${API_URL}/${id}`);
  },

  getSkillsByDomain: async (domainId: number, includeInactive: boolean = false): Promise<Skill[]> => {
    console.log(`Skill Service: Fetching skills for domain ${domainId}`);
    return apiService.get(`${API_URL}/domain/${domainId}?include_inactive=${includeInactive}`);
  },

  createSkill: async (skill: SkillCreate): Promise<Skill> => {
    console.log('Skill Service: Creating new skill', skill);
    try {
      return await apiService.post(API_URL, skill);
    } catch (error: any) {
      console.error('Skill Service: Error creating skill', error);
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to create skill');
    }
  },

  updateSkill: async (id: number, skill: SkillUpdate): Promise<Skill> => {
    console.log(`Skill Service: Updating skill with id ${id}`, skill);
    return apiService.put(`${API_URL}/${id}`, skill);
  },

  deleteSkill: async (id: number): Promise<void> => {
    console.log(`Skill Service: Deleting skill with id ${id}`);
    return apiService.delete(`${API_URL}/${id}`);
  },

  reactivateSkill: async (id: number): Promise<Skill> => {
    console.log(`Skill Service: Reactivating skill with id ${id}`);
    return apiService.post(`${API_URL}/${id}/reactivate`);
  }
};