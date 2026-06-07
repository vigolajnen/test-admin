import { useState, useEffect, useCallback } from 'react';
import { newsService } from '../services/newsService';

export function useNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsService.getAll();
      setNews(data);
    } catch (err) {
      setError(err.message);
      showToast('Ошибка загрузки новостей', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const createNews = useCallback(async (newsData) => {
    try {
      const newNews = await newsService.create(newsData);
      setNews(prev => [newNews, ...prev]);
      showToast('Новость успешно создана');
      return true;
    } catch (err) {
      console.error('Create error:', err);
      showToast('Ошибка при создании новости', 'error');
      return false;
    }
  }, [showToast]);

  const updateNews = useCallback(async (id, newsData) => {
    try {
      const updated = await newsService.update(id, newsData);
      setNews(prev => prev.map(item => item.id === id ? updated : item));
      showToast('Новость успешно обновлена');
      return true;
    } catch (err) {
      console.error('Update error:', err);
      showToast('Ошибка при обновлении новости', 'error');
      return false;
    }
  }, [showToast]);

  const deleteNews = useCallback(async (id) => {
    try {
      await newsService.delete(id);
      setNews(prev => prev.filter(item => item.id !== id));
      showToast('Новость удалена');
      return true;
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Ошибка при удалении новости', 'error');
      return false;
    }
  }, [showToast]);

  const toggleStatus = useCallback(async (id, currentStatus) => {
    try {
      const updated = await newsService.toggleStatus(id, currentStatus);
      setNews(prev => prev.map(item => item.id === id ? updated : item));
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      showToast(newStatus === 'published' ? 'Новость опубликована' : 'Новость снята с публикации');
      return true;
    } catch (err) {
      console.error('Toggle status error:', err);
      showToast('Ошибка при изменении статуса', 'error');
      return false;
    }
  }, [showToast]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  return {
    news,
    loading,
    error,
    toast,
    loadNews,
    createNews,
    updateNews,
    deleteNews,
    toggleStatus,
  };
}