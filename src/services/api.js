import axios from 'axios';

// В режиме разработки используем MSW, который перехватывает запросы
// В продакшене нужно будет настроить реальный API
const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });
    
    const customError = {
      message: error.response?.data?.message || 'Произошла ошибка при выполнении запроса',
      status: error.response?.status,
      original: error,
    };
    
    return Promise.reject(customError);
  }
);

export default api;