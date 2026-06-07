import api from './api';

export const userService = {
  // Получить всех пользователей
  async getAll() {
    const response = await api.get('/users');
    return response.data;
  },
  
  // Получить пользователя по ID
  async getById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  // Создать пользователя
  async create(userData) {
    const data = {
      ...userData,
      createdAt: new Date().toISOString(),
    };
    const response = await api.post('/users', data);
    return response.data;
  },
  
  // Обновить пользователя
  async update(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  
  // Удалить пользователя
  async delete(id) {
    await api.delete(`/users/${id}`);
    return true;
  },
  
  // Проверить права доступа
  hasPermission(userRole, action) {
    const permissions = {
      admin: ['view', 'create', 'edit', 'delete', 'publish', 'manage_users'],
      editor: ['view', 'create', 'edit', 'publish'],
    };
    
    return permissions[userRole]?.includes(action) || false;
  },
};