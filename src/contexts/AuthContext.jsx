import { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // В реальном приложении - запрос к API
    // Сейчас имитируем
    if (email === 'admin@admin.com' && password === '123') {
      const userData = {
        id: '1',
        email: 'admin@admin.com',
        name: 'Администратор',
        role: 'admin',
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } else if (email === 'editor@editor.com' && password === '123') {
      const userData = {
        id: '2',
        email: 'editor@editor.com',
        name: 'Редактор',
        role: 'editor',
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasPermission = (action) => {
    if (!user) return false;
    return userService.hasPermission(user.role, action);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}