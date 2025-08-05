import axios from 'axios';
import Cookies from 'js-cookie';

const EXPRESS_URL = process.env.EXPRESS_PUBLIC_URL;

export const Axios = axios.create({
  baseURL: `${EXPRESS_URL}/api`, 
});

Axios.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
