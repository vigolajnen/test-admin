import { sanitizeText, sanitizeUrl } from '../utils/sanitize';

export default function NewsPreview({ news }) {
  const safeImageUrl = sanitizeUrl(news.imageUrl);
  
  return (
    <div className="border rounded-xl p-6 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <span>👁️</span> Предпросмотр новости
      </h3>
      <div className="bg-white rounded-xl border overflow-hidden">
        {safeImageUrl && (
          <img 
            src={safeImageUrl} 
            alt={sanitizeText(news.title)}
            className="w-full h-48 object-cover"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {sanitizeText(news.title)}
          </h2>
          <div className="flex gap-4 text-sm text-gray-500 mb-4">
            <span>📅 {new Date(news.createdAt).toLocaleDateString()}</span>
            <span>👁️ {news.views} просмотров</span>
          </div>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {sanitizeText(news.content)}
          </div>
        </div>
      </div>
    </div>
  );
}