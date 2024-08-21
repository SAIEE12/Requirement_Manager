import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const login = async (credentials: { username: string; password: string }) => {
  const response = await axiosInstance.post('/auth/login', new URLSearchParams({
    username: credentials.username,
    password: credentials.password
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};