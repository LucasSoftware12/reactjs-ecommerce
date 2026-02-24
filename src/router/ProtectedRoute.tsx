import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: number[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasAllowedRole = () => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (!user) return false;
    
    if (!user.roles && !(user as any).roleId) return false;
    
    if ((user as any).roleId && allowedRoles.includes((user as any).roleId)) return true;
    
    if (user.roles) {
      return user.roles.some((r) => allowedRoles.includes(r.id));
    }
    return false;
  };

  if (allowedRoles && !hasAllowedRole()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
