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
    <div className="min-h-screen bg-white flex">
      {/* Левая часть с формой */}
      <div className="w-full lg:w-1/2 flex md:items-center justify-center p-4 lg:p-12">
        <div className="w-full max-w-md">
          {/* Логотип */}
          <div className="mb-4 lg:mb-8 text-center">
            <div className="flex items-center gap-2 justify-center ">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d60ff] to-[#343c6a] flex items-center justify-center">
                <span className="text-white text-xl">FH</span>
              </div>
              <h1 className="text-2xl font-bold text-[#1a1f36]">Fitness House</h1>
            </div>
          </div>

          {/* Заголовок формы */}
          <div className="mb-2 lg:mb-8 text-center">
            <h2 className="text-2xl font-semibold text-[#1a1f36]">Добро пожаловать!</h2>
            <p className="text-[#718ebf] text-sm mt-1">
              Введите свои учётные данные для входа
            </p>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="mt-4 lg:mt-0 space-y-4 md:space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1a1f36] mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#718ebf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="admin@admin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2d60ff] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1f36] mb-2">
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#718ebf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2d60ff] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#2d60ff] focus:ring-[#2d60ff]" />
                <span className="text-sm text-[#718ebf]">Запомнить меня</span>
              </label>
              <a href="#" className="text-sm text-[#2d60ff] hover:underline">
                Забыли пароль?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2d60ff] hover:bg-[#1e4fd9] text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-95"
            >
              Войти
            </button>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-center text-[#718ebf]">
                Тестовые доступы:
              </p>
              <div className="mt-2 flex flex-col gap-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#1a1f36]">Администратор:</span>
                  <span className="text-[#718ebf]">admin@admin.com / 123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1a1f36]">Редактор:</span>
                  <span className="text-[#718ebf]">editor@editor.com / 123</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Правая часть с картинкой (скрыто на мобилках) */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-[#2d60ff] to-[#343c6a] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white text-center">
            {/* Иконка */}
            <div className="w-32 h-32 mx-auto mb-8 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M6 14h12M5 18h14M7 6h10" />
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth={1.5} fill="none" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Управление новостями</h3>
            
          </div>
        </div>
        
        {/* Декоративные элементы */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}