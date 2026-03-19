import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthLoader } from './AuthLoader';
import { logAuthEvent } from './authLogger';
import { getDefaultRouteForUser, getUserRoleName } from './authUtils';
import { useAuth } from './useAuth';

export function AppEntryRoute() {
  const { authResolved, isAuthenticated, user } = useAuth();

  if (!authResolved) {
    return <AuthLoader />;
  }

  return (
    <Navigate
      to={isAuthenticated ? getDefaultRouteForUser(user) : '/login'}
      replace
    />
  );
}

export function ProtectedRoute() {
  const location = useLocation();
  const { authResolved, isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    logAuthEvent('[PROTECTED_ROUTE_CHECK]', {
      pathname: location.pathname,
      isAuthenticated,
      isLoading,
      authResolved,
    });
  }, [authResolved, isAuthenticated, isLoading, location.pathname]);

  if (!authResolved) {
    return <AuthLoader />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function AdminRoute() {
  const { authResolved, user } = useAuth();

  if (!authResolved) {
    return <AuthLoader />;
  }

  if (getUserRoleName(user) !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export function CashierRoute() {
  const { authResolved, user } = useAuth();

  if (!authResolved) {
    return <AuthLoader />;
  }

  if (getUserRoleName(user) !== 'CASHIER') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const { authResolved, isAuthenticated, user } = useAuth();

  if (!authResolved) {
    return <AuthLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={getDefaultRouteForUser(user)} replace />;
  }

  return <Outlet />;
}
