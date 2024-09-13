// src/services/auth.ts

import { apiService, setToken } from './apiService';

const API_URL = 'http://localhost:8000/api';

console.log('Auth Service: Initializing with base URL:', API_URL);

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const login = async (credentials: { username: string; password: string }) => {
  try {
    const response = await apiService.post<LoginResponse>(
      '/auth/login', 
      new URLSearchParams({
        username: credentials.username,
        password: credentials.password
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );


    if (response.access_token) {
      setToken(response.access_token);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  const authenticated = !!token;
  return authenticated;
};