import { useEffect } from 'react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' 
  ? 'bg-[#2d60ff]' 
  : 'bg-[#fe5c73]';
  
  return (
    <div className={`fixed top-20 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slideInRight`}>
      {type === 'success' ? '✅' : '❌'}
      <span>{message}</span>
    </div>
  );
}