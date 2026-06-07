import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const success = login(email, password);
    if (!success) {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 w-96 border-t-4 border-[#F05A28]">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🏋️</div>
          <h2 className="text-2xl font-bold text-gray-800">Fitness House</h2>
          <p className="text-gray-500">Панель администратора</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-[#F05A28] focus:border-transparent"
          required
        />
        
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#F05A28] focus:border-transparent"
          required
        />
        
        <button
          type="submit"
          className="w-full bg-[#F05A28] hover:bg-[#D94A1A] text-white py-2 rounded-lg font-semibold transition"
        >
          Войти
        </button>
        
        <div className="mt-4 text-sm text-center text-gray-500 bg-gray-50 p-3 rounded-lg">
          💡 Тестовые доступы:
          <div className="mt-1">
            <div><strong>admin@admin.com</strong> / 123 — Администратор</div>
            <div><strong>editor@editor.com</strong> / 123 — Редактор</div>
          </div>
        </div>
      </form>
    </div>
  );
}