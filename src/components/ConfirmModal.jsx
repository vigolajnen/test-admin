import { useEffect } from 'react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
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

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fadeSlide" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full animate-slideRight">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              {title}
            </h3>
            
            <p className="text-gray-600 text-center mb-6">
              {message}
            </p>
            
            <div className="flex gap-3">
              <button onClick={onConfirm} className="flex-1 bg-[#fe5c73] hover:bg-[#e8455b] text-white py-2.5 rounded-xl font-semibold transition">
                Да, удалить
              </button>
              <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition">
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}