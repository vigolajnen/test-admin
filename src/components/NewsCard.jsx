import { useState } from 'react';

function NewsCard({ news, onEdit, onDelete, onToggleStatus }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <h3 className={`text-xl font-bold text-gray-800 transition-colors duration-300 ${isHovered ? 'text-blue-600' : ''}`}>
                {news.title}
              </h3>
              <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                news.status === 'published' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {news.status === 'published' ? '✅ Опубликовано' : '📝 Черновик'}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4 leading-relaxed">
              {news.content.substring(0, 150)}...
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                📅 {new Date(news.createdAt).toLocaleDateString('ru-RU')}
              </span>
              <span className="flex items-center gap-1">
                👁️ {news.views} просмотров
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onEdit(news)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                ✏️ Редактировать
              </button>
              
              <button
                onClick={() => onToggleStatus(news.id, news.status)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105 active:scale-95 ${
                  news.status === 'draft'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-purple-500/25'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-orange-500/25'
                }`}
              >
                {news.status === 'draft' ? '📢 Опубликовать' : '🔒 Снять'}
              </button>
              
              <button
                onClick={() => onDelete(news)}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                🗑️ Удалить
              </button>
            </div>
          </div>
          
          {news.imageUrl && (
            <div className="md:w-48 h-48 flex-shrink-0 overflow-hidden rounded-xl">
              <img 
                src={news.imageUrl} 
                alt={news.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsCard;