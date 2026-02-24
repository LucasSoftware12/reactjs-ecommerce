import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProfilePage from '../pages/profile/ProfilePage';
import CreateProductPage from '../pages/products/CreateProductPage';
import ProductDetailPage from '../pages/products/ProductDetailPage';
import ProductListPage from '../pages/products/ProductListPage';
import AssignRolePage from '../pages/roles/AssignRolePage';
import { useAuth } from '../hooks/useAuth';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/register" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </>
        )}

        <Route element={<MainLayout />}>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[2, 3]} />}>
          <Route element={<MainLayout />}>
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/create" element={<CreateProductPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[3]} />}>
          <Route element={<MainLayout />}>
            <Route path="/roles/assign" element={<AssignRolePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
