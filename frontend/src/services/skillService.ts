import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/skills';

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
    const response = await axios.get(`${API_URL}?include_inactive=${includeInactive}`);
    return response.data;
  },

  getSkill: async (id: number): Promise<Skill> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  getSkillsByDomain: async (domainId: number, includeInactive: boolean = false): Promise<Skill[]> => {
    const response = await axios.get(`${API_URL}/domain/${domainId}?include_inactive=${includeInactive}`);
    return response.data;
  },

  createSkill: async (skill: SkillCreate): Promise<Skill> => {
    try {
      const response = await axios.post(API_URL, skill);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to create skill');
    }
  },

  updateSkill: async (id: number, skill: SkillUpdate): Promise<Skill> => {
    const response = await axios.put(`${API_URL}/${id}`, skill);
    return response.data;
  },

  deleteSkill: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },

  reactivateSkill: async (id: number): Promise<Skill> => {
    const response = await axios.post(`${API_URL}/${id}/reactivate`);
    return response.data;
  }
};