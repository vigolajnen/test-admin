import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <div className="md:ml-64">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
          <div className="flex items-center justify-between p-2 md:px-4 xl:px-8">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-[#718ebf] hover:text-[#2d60ff] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mr-auto">
                <div className="w-10 h-10 rounded-full bg-[#2d60ff] flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || 'А'}
                </div>
                <div className="hidden md:block flex-1">
                  <p className="text-sm font-medium text-[#1a1f36]">{user?.name || 'Администратор'}</p>
                  <p className="text-xs text-[#718ebf]">{user?.role === 'admin' ? 'Управляйте новостями и пользователями' : 'Управляйте новостями'}</p>
                </div>
              </div>
            
            <div className="flex items-center gap-4">
              {/* Кнопка уведомлений */}
              <button className="p-2 rounded-lg bg-gray-50 text-[#718ebf] hover:text-[#2d60ff] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              {/* Кнопка выхода */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium"
              >
                Выйти
              </button>
            </div>
          </div>
        </header>
        
        <main className="p-4 md:p-6 animate-fadeSlide">
          <Outlet />
        </main>
      </div>
    </div>
  );
}