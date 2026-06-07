import { useState } from 'react';
import NewsModal from '../components/NewsModal';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import { useNews } from '../hooks/useNews';
import { useAuth } from '../contexts/AuthContext';
import { sanitizeText } from '../utils/sanitize';

export default function NewsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [deletingNews, setDeletingNews] = useState(null);
  
  const { user, hasPermission } = useAuth();
  const {
    news,
    loading,
    toast,
    createNews,
    updateNews,
    deleteNews,
    toggleStatus,
  } = useNews();

  const canDelete = hasPermission('delete');
  const canEdit = hasPermission('edit');
  const canCreate = hasPermission('create');
  const canPublish = hasPermission('publish');

  const handleSave = async (newsData) => {
    let success = false;
    
    if (newsData.id) {
      if (canEdit) {
        success = await updateNews(newsData.id, newsData);
      }
    } else {
      if (canCreate) {
        success = await createNews(newsData);
      }
    }
    
    if (success) {
      setModalOpen(false);
      setEditingNews(null);
    }
  };

  const handleDelete = async () => {
    if (deletingNews && canDelete) {
      const success = await deleteNews(deletingNews.id);
      if (success) {
        setDeletingNews(null);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    if (canPublish) {
      await toggleStatus(id, currentStatus);
    }
  };

  // Статистика для карточек
  const stats = {
    total: news.length,
    published: news.filter(n => n.status === 'published').length,
    draft: news.filter(n => n.status === 'draft').length,
    views: news.reduce((sum, n) => sum + n.views, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#2d60ff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Карточки статистики */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#718ebf] text-sm">Всего новостей</p>
              <p className="text-2xl font-bold text-[#1a1f36] mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#2d60ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#718ebf] text-sm">Опубликовано</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.published}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#718ebf] text-sm">Черновики</p>
              <p className="text-2xl font-bold text-[#feaa09] mt-1">{stats.draft}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#feaa09]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#718ebf] text-sm">Всего просмотров</p>
              <p className="text-2xl font-bold text-[#fe5c73] mt-1">{stats.views}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#fe5c73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Заголовок и кнопка */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#1a1f36]">Список новостей</h2>
          <p className="text-sm text-[#718ebf] mt-1">Управляйте всеми материалами</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#2d60ff] hover:bg-[#1e4fd9] text-white px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Добавить новость
          </button>
        )}
      </div>

      {/* Список новостей */}
      <div className="grid gap-4">
        {news.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#718ebf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-[#718ebf]">Нет новостей. Создайте первую!</p>
          </div>
        ) : (
          news.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📰</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="text-lg font-bold text-[#1a1f36]">{sanitizeText(item.title)}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.status === 'published' 
                          ? 'bg-green-50 text-green-600' 
                          : 'bg-yellow-50 text-yellow-600'
                      }`}>
                        {item.status === 'published' ? 'Опубликовано' : 'Черновик'}
                      </span>
                    </div>
                    <p className="text-[#718ebf] text-sm line-clamp-2 mb-3">{sanitizeText(item.content)}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-[#718ebf]">
                      <span className="flex items-center gap-1">📅 {new Date(item.createdAt).toLocaleDateString()}</span>
                      {item.scheduledAt && <span className="flex items-center gap-1">⏰ {new Date(item.scheduledAt).toLocaleDateString()}</span>}
                      <span className="flex items-center gap-1">👁 {item.views}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {canEdit && (
                    <button onClick={() => { setEditingNews(item); setModalOpen(true); }} className="p-2 text-[#718ebf] hover:text-[#2d60ff] transition-colors rounded-lg hover:bg-blue-50">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                  {canPublish && (
                    <button onClick={() => handleToggleStatus(item.id, item.status)} className="p-2 text-[#718ebf] hover:text-[#feaa09] transition-colors rounded-lg hover:bg-yellow-50">
                      {item.status === 'draft' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      )}
                    </button>
                  )}
                  {canDelete && (
                    <button onClick={() => setDeletingNews(item)} className="p-2 text-[#718ebf] hover:text-[#fe5c73] transition-colors rounded-lg hover:bg-red-50">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <NewsModal 
        isOpen={modalOpen} 
        onClose={() => { setModalOpen(false); setEditingNews(null); }} 
        onSave={handleSave} 
        news={editingNews} 
      />
      <ConfirmModal 
        isOpen={!!deletingNews} 
        onClose={() => setDeletingNews(null)} 
        onConfirm={handleDelete} 
        title="Удаление новости" 
        message={`Удалить "${deletingNews?.title}"? Это действие нельзя отменить.`} 
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}