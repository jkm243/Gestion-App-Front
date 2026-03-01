import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { CashierDashboard } from '../pages/cashier/Dashboard';
import { NotFoundPage, UnauthorizedPage } from '../pages/ErrorPages';
import { AdminLayout } from "../components/layouts/AdminLayout";
import { CashierLayout } from "../components/layouts/CashierLayout";
import {
  ProtectedRoute,
  AdminRoute,
  CashierRoute,
  PublicRoute,
} from "../components/RouteGuards";

export function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* Additional admin routes will go here */}
            </Route>
          </Route>

          {/* Cashier Routes */}
          <Route element={<CashierRoute />}>
            <Route element={<CashierLayout />}>
              <Route path="/cashier" element={<CashierDashboard />} />
              {/* Additional cashier routes will go here */}
            </Route>
          </Route>
        </Route>

        {/* Error Routes */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
