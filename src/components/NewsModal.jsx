import { useState, useEffect } from 'react';
import NewsPreview from './NewsPreview';
import { sanitizeText, sanitizeContent, sanitizeUrl, validateInput } from '../utils/sanitize';

export default function NewsModal({ isOpen, onClose, onSave, news }) {
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    imageUrl: '', 
    status: 'draft',
  });
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || '',
        content: news.content || '',
        imageUrl: news.imageUrl || '',
        status: news.status || 'draft',
      });
    } else {
      setFormData({ 
        title: '', 
        content: '', 
        imageUrl: '', 
        status: 'draft',
      });
    }
    setErrors({});
    setShowPreview(false);
  }, [news, isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.classList.add('no-scroll');
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    
    const titleValidation = validateInput(formData.title, 200);
    if (!titleValidation.valid) {
      newErrors.title = titleValidation.message;
    }
    
    const contentValidation = validateInput(formData.content, 50000);
    if (!contentValidation.valid) {
      newErrors.content = contentValidation.message;
    }
    
    if (formData.imageUrl && !sanitizeUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Неверный формат URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const sanitizedData = {
      title: sanitizeText(formData.title),
      content: sanitizeContent(formData.content),
      imageUrl: sanitizeUrl(formData.imageUrl),
      status: formData.status,
    };
    
    // Если редактируем - сохраняем id
    if (news?.id) {
      sanitizedData.id = news.id;
    }
    
    onSave(sanitizedData);
  };

  const previewData = {
    title: sanitizeText(formData.title) || 'Заголовок новости',
    content: sanitizeContent(formData.content) || 'Содержание новости...',
    imageUrl: sanitizeUrl(formData.imageUrl),
    createdAt: new Date(),
    views: 0,
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fadeSlide" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[100vh] overflow-y-auto animate-slideRight">
          <div className="sticky top-0 bg-white z-10 px-4 md:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className=" text-sm md:text-xl font-bold text-gray-900">
              {formData.id ? ' Редактировать новость' : ' Создать новость'}
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 text-xs md:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                {showPreview ? ' Редактировать' : ' Предпросмотр'}
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {showPreview ? (
            <div className="p-6">
              <NewsPreview news={previewData} />
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Вернуться к редактированию
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-2 md:space-y-4">
              <div>
                <label className="hidden md:block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value.slice(0, 200) })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d60ff] focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength="200"
                  required
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                <p className="text-gray-400 text-xs mt-1">{formData.title?.length || 0}/200 символов</p>
              </div>
              
              <div>
                <label className="hidden md:block text-sm font-medium text-gray-700 mb-1">Содержание</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows="8"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d60ff] focus:border-transparent resize-none ${
                    errors.content ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Введите текст новости..."
                  required
                />
                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
              </div>
              
              <div>
                <label className="hidden md:block text-sm font-medium text-gray-700 mb-1">URL изображения</label>
                <input
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d60ff] focus:border-transparent ${
                    errors.imageUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
              </div>
              
              <div>
                <label className="hidden md:block text-sm font-medium text-gray-700 mb-1">Статус</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d60ff] focus:border-transparent"
                >
                  <option value="draft"> Черновик</option>
                  <option value="published"> Опубликовать</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-[#2d60ff] hover:bg-[#1e4fd9] text-white py-2.5 rounded-lg font-semibold transition">
                  {formData.id ? ' Сохранить' : ' Создать'}
                </button>
                <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition">
                  Отмена
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}