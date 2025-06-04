import { useAuthStore } from '@/stores/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Create an Axios instance
const httpService = axios.create({
  baseURL: process.env.NEXT_API_URL,
  timeout: 10000, // Set a timeout for requests
});

// Add a request interceptor
httpService.interceptors.request.use(
  (config) => {
    // Retrieve the token from local storage
    const token = AsyncStorage.getItem('token');
    if (token) {
      // Set the Authorization header with the token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor
httpService.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is due to an unauthorized request (status code 401)
    if (error.response && error.response.status === 401) {
      // Get the logout function from the auth store
      // We need to use this approach since we can't use hooks directly in this file
      const logout = useAuthStore.getState().logout;
      
      // Log the user out
      logout();
      
      // You can also show a notification to the user
      console.log('Your session has expired. Please sign in again.');
    }
    
    // Return the error for further handling
    return Promise.reject(error);
  }
);

export default httpService;
