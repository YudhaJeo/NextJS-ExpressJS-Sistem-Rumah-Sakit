// lib/Axios.ts
import axios from 'axios';

export const Axios = axios.create({
  baseURL: 'http://localhost:4000/api', // sesuaikan port backend-mu
});
