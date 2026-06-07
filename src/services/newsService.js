import api from './api';

export const newsService = {
  async getAll() {
    const response = await api.get('/news');
    return response.data;
  },
  
  async getPublished() {
    const response = await api.get('/news');
    return response.data.filter(news => news.status === 'published');
  },
  
  async getById(id) {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },
  
  async create(newsData) {
    const data = {
      title: newsData.title,
      content: newsData.content,
      imageUrl: newsData.imageUrl || null,
      status: newsData.status || 'draft',
      createdAt: new Date().toISOString(),
      views: 0,
      authorId: '1',
    };
    const response = await api.post('/news', data);
    return response.data;
  },
  
  async update(id, newsData) {
    const data = {
      title: newsData.title,
      content: newsData.content,
      imageUrl: newsData.imageUrl || null,
      status: newsData.status,
    };
    const response = await api.put(`/news/${id}`, data);
    return response.data;
  },
  
  async delete(id) {
    await api.delete(`/news/${id}`);
    return true;
  },
  
  async toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const response = await api.patch(`/news/${id}`, { status: newStatus });
    return response.data;
  },
};