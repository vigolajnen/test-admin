import axios from 'axios';

// Определяем базовый URL в зависимости от окружения
const getBaseURL = () => {
  // В продакшене (GitHub Pages) используем /test-admin
  if (import.meta.env.PROD) {
    return '/test-admin';
  }
  // В режиме разработки используем пустую строку (MSW перехватит)
  return '';
};

const api = axios.create({
  baseURL: getBaseURL(),
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