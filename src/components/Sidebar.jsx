import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/', name: 'Новости', icon: '📰', permission: null },
  { path: '/users', name: 'Пользователи', icon: '👥', permission: 'manage_users' },
  { path: '/public-news', name: 'Публичная страница', icon: '🌐', permission: null },
];

export default function Sidebar({ isMobileMenuOpen, onClose }) {
  const { hasPermission, user } = useAuth();
  
  const filteredNavItems = navItems.filter(
    item => !item.permission || hasPermission(item.permission)
  );

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d60ff] to-[#343c6a] flex items-center justify-center">
            <span className="text-white text-xl">🏦</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1a1f36]">BankDash</h1>
            <p className="text-xs text-[#718ebf]">Админ-панель</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#2d60ff] text-white shadow-md'
                  : 'text-[#718ebf] hover:bg-gray-50 hover:text-[#1a1f36]'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
          <div className="w-10 h-10 rounded-full bg-[#2d60ff] flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'А'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#1a1f36]">{user?.name || 'Администратор'}</p>
            <p className="text-xs text-[#718ebf] capitalize">{user?.role === 'admin' ? 'Администратор' : 'Редактор'}</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Десктопный сайдбар */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-20 hidden md:block">
        <SidebarContent />
      </aside>

      {/* Мобильный сайдбар */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden animate-fadeSlide" onClick={onClose} />
          <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-40 md:hidden animate-slideLeft">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2d60ff] to-[#343c6a] flex items-center justify-center">
                  <span className="text-white text-sm">🏦</span>
                </div>
                <span className="font-bold text-[#1a1f36]">BankDash</span>
              </div>
              <button onClick={onClose} className="text-[#718ebf] hover:text-[#1a1f36]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {filteredNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-[#2d60ff] text-white'
                        : 'text-[#718ebf] hover:bg-gray-50 hover:text-[#1a1f36]'
                    }`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}