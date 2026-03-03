import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SignupPage';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { UsersPage } from '../pages/admin/UsersPage';
import { ProductsPage } from '../pages/admin/ProductsPage';
import { SalesPage } from '../pages/admin/SalesPage';
import { AnalyticsPage } from '../pages/admin/AnalyticsPage';
import { SettingsPage } from '../pages/admin/SettingsPage';
import { InvoicesPage } from '../pages/admin/InvoicesPage';
import { CashierDashboard } from '../pages/cashier/Dashboard';
import { QuickSalePage } from '../pages/cashier/QuickSalePage';
import { CartPage } from '../pages/cashier/CartPage';
import { PaymentPage } from '../pages/cashier/PaymentPage';
import { HistoryPage } from '../pages/cashier/HistoryPage';
import { StockPage } from '../pages/cashier/StockPage';
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
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/products" element={<ProductsPage />} />
                <Route path="/admin/sales" element={<SalesPage />} />
                <Route path="/admin/analytics" element={<AnalyticsPage />} />
                <Route path="/admin/invoices" element={<InvoicesPage />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
              {/* Additional admin routes will go here */}
            </Route>
          </Route>

          {/* Cashier Routes */}
          <Route element={<CashierRoute />}>
            <Route element={<CashierLayout />}>
              <Route path="/cashier" element={<CashierDashboard />} />
              <Route path="/cashier/quick" element={<QuickSalePage />} />
              <Route path="/cashier/cart" element={<CartPage />} />
              <Route path="/cashier/payment" element={<PaymentPage />} />
              <Route path="/cashier/history" element={<HistoryPage />} />
              <Route path="/cashier/stock" element={<StockPage />} />
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
