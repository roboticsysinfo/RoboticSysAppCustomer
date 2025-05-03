import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from './navigationService'; // Custom navigation ref (we'll set this up below)
import { REACT_APP_API_BASE_URL } from "@env"

console.log("REACT_APP_API_BASE_URL", REACT_APP_API_BASE_URL)

const api = axios.create({
  baseURL: REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch 401 errors
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('token');

      // Optional: also clear other persisted user info
      await AsyncStorage.removeItem('user');

      // Navigate to Login screen
      navigate('Login');

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
