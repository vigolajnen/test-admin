import { useState, useEffect } from 'react';
import { newsService } from '../services/newsService';
import { sanitizeText, sanitizeUrl } from '../utils/sanitize';

export default function PublicNewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const published = await newsService.getPublished();
      setNews(published);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#72a7d0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Новости</h1>
        <p className="text-gray-500 mt-1">Актуальные новости и события</p>
      </div>
      
      {news.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">Пока нет опубликованных новостей</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {news.map((item) => {
            const safeImageUrl = sanitizeUrl(item.imageUrl);
            return (
              <article key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                {safeImageUrl && (
                  <img 
                    src={safeImageUrl} 
                    alt={sanitizeText(item.title)}
                    className="w-full h-48 md:h-64 object-cover"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                <div className="p-5 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                    {sanitizeText(item.title)}
                  </h2>
                  <div className="flex gap-4 text-sm text-gray-500 mb-4">
                    <span>📅 {new Date(item.createdAt).toLocaleDateString()}</span>
                    <span>👁️ {item.views} просмотров</span>
                  </div>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {sanitizeText(item.content)}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}