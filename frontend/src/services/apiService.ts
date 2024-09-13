// src/services/apiService.ts

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

console.log('API Service: Initializing with base URL:', API_URL);

const getAuthHeader = (): { Authorization?: string } => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiService = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    console.log(`API Service: GET request to ${url}`);
    try {
      const response: AxiosResponse<T> = await axios.get(`${API_URL}${url}`, {
        ...config,
        headers: {
          ...config?.headers,
          ...getAuthHeader(),
        },
      });
      console.log(`API Service: GET request to ${url} successful`, response.data);
      return response.data;
    } catch (error) {
      console.error(`API Service: GET request to ${url} failed`, error);
      throw error;
    }
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    console.log(`API Service: POST request to ${url}`, data);
    try {
      const response: AxiosResponse<T> = await axios.post(`${API_URL}${url}`, data, {
        ...config,
        headers: {
          ...config?.headers,
          ...getAuthHeader(),
        },
      });
      console.log(`API Service: POST request to ${url} successful`, response.data);
      return response.data;
    } catch (error) {
      console.error(`API Service: POST request to ${url} failed`, error);
      throw error;
    }
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    console.log(`API Service: PUT request to ${url}`, data);
    try {
      const response: AxiosResponse<T> = await axios.put(`${API_URL}${url}`, data, {
        ...config,
        headers: {
          ...config?.headers,
          ...getAuthHeader(),
        },
      });
      console.log(`API Service: PUT request to ${url} successful`, response.data);
      return response.data;
    } catch (error) {
      console.error(`API Service: PUT request to ${url} failed`, error);
      throw error;
    }
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    console.log(`API Service: DELETE request to ${url}`);
    try {
      const response: AxiosResponse<T> = await axios.delete(`${API_URL}${url}`, {
        ...config,
        headers: {
          ...config?.headers,
          ...getAuthHeader(),
        },
      });
      console.log(`API Service: DELETE request to ${url} successful`, response.data);
      return response.data;
    } catch (error) {
      console.error(`API Service: DELETE request to ${url} failed`, error);
      throw error;
    }
  },
};

export const setToken = (token: string): void => {
  console.log('API Service: Setting new token');
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  console.log('API Service: Removing token');
  localStorage.removeItem('token');
};