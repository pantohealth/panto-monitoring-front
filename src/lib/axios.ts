import axios from 'axios';
import Cookies from 'js-cookie';

let apiBaseUrl = import.meta.env.VITE_API_DEV_BASE_URL;

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Update baseURL dynamically
export const setApiBaseUrl = (newBaseUrl:string) => {
  apiBaseUrl = newBaseUrl;
  api.defaults.baseURL = apiBaseUrl;
};

// request interceptor for authentication
api.interceptors.request.use((request) => {
  const token = Cookies.get('token');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

// response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

