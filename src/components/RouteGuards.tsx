import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../services/hooks';
import { initializeAuthAsync } from '../services/store/slices/authSlice';

export function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      dispatch(initializeAuthAsync());
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AdminRoute() {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role.name.toUpperCase() !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export function CashierRoute() {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role.name.toUpperCase() !== 'CASHIER') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    const role = user?.role.name.toUpperCase();
    if (role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === 'CASHIER') {
      return <Navigate to="/cashier" replace />;
    }
  }

  return <Outlet />;
}
