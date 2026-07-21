import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

const AuthLoading = () => <div role="status">로그인 정보를 확인하고 있습니다...</div>;

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <AuthLoading />;
  if (!user) return <Navigate to="/" replace state={{ from: location.pathname }} />;
  return <Outlet />;
};

export const GuestRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <AuthLoading />;
  if (user) return <Navigate to="/main" replace />;
  return <Outlet />;
};
