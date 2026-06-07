import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';

export default function UsersPage() {
  const { user: currentUser, hasPermission } = useAuth();
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      showToast('Ошибка загрузки', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (userData) => {
    try {
      if (userData.id) {
        await userService.update(userData.id, userData);
        showToast('Пользователь обновлён');
      } else {
        await userService.create(userData);
        showToast('Пользователь создан');
      }
      setModalOpen(false);
      loadUsers();
    } catch {
      showToast('Ошибка сохранения', 'error');
    }
  };

  const handleDelete = async () => {
    if (deletingUser && deletingUser.id !== currentUser?.id) {
      try {
        await userService.delete(deletingUser.id);
        showToast('Пользователь удалён');
        setDeletingUser(null);
        loadUsers();
      } catch {
        showToast('Ошибка удаления', 'error');
      }
    } else if (deletingUser?.id === currentUser?.id) {
      showToast('Нельзя удалить самого себя', 'error');
      setDeletingUser(null);
    }
  };

  if (!hasPermission('manage_users')) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">У вас нет доступа к этой странице</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#F05A28] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            👥 Управление пользователями
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Добавляйте и редактируйте пользователей, назначайте роли
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto bg-[#F05A28] hover:bg-[#D94A1A] text-white px-5 py-2.5 rounded-lg font-semibold transition flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="text-xl">+</span> Добавить пользователя
        </button>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="p-5">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'admin' ? '👑 Администратор' : '✏️ Редактор'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    Создан: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditingUser(user); setModalOpen(true); }}
                    className="p-2 text-gray-500 hover:text-[#F05A28] transition-colors"
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  {user.id !== currentUser?.id && (
                    <button
                      onClick={() => setDeletingUser(user)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Модалка для создания/редактирования пользователя */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingUser(null); }}
        onSave={handleSave}
        user={editingUser}
      />

      <ConfirmModal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDelete}
        title="Удаление пользователя"
        message={`Удалить пользователя "${deletingUser?.name}"? Это действие нельзя отменить.`}
      />
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// Компонент модалки для пользователя
function UserModal({ isOpen, onClose, onSave, user }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'editor',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: '',
        name: user.name,
        role: user.role,
      });
    } else {
      setFormData({
        email: '',
        password: '',
        name: '',
        role: 'editor',
      });
    }
    setErrors({});
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Имя обязательно';
    if (!formData.email) newErrors.email = 'Email обязателен';
    if (!user?.id && !formData.password) newErrors.password = 'Пароль обязателен';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const saveData = { ...formData };
    if (!saveData.password) delete saveData.password;
    
    if (user?.id) {
      onSave({ ...saveData, id: user.id });
    } else {
      onSave(saveData);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fadeSlide" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full animate-slideRight">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">
              {user?.id ? ' Редактировать пользователя' : ' Создать пользователя'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {user?.id ? 'Новый пароль (оставьте пустым, чтобы не менять)' : 'Пароль'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="editor"> Редактор</option>
                <option value="admin"> Администратор</option>
              </select>
              <p className="text-gray-400 text-xs mt-1">
                Редактор: может создавать, редактировать, публиковать. Администратор: полный доступ
              </p>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button type="submit" className="flex-1 bg-[#2d60ff] text-white py-2.5 rounded-lg font-semibold transition">
                {user?.id ? ' Сохранить' : ' Создать'}
              </button>
              <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition">
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}