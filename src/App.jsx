import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import NewsPage from './pages/NewsPage';
import UsersPage from './pages/UsersPage';
import PublicNewsPage from './pages/PublicNewsPage';
import LoginPage from './pages/LoginPage';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#F05A28] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter basename="/test-admin">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<NewsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="public-news" element={<PublicNewsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;