import { useNavigate, Outlet } from 'react-router-dom';
import { LogOut, ShoppingCart, Clock, Package } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../services/hooks';
import { logout } from '../../services/store/slices/authSlice';

export function CashierLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const quickActions = [
    { label: 'Vente Rapide', icon: ShoppingCart, href: '/cashier' },
    { label: 'Historique', icon: Clock, href: '/cashier/history' },
    { label: 'Stock', icon: Package, href: '/cashier/stock' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              G
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion</h1>
              <p className="text-xs text-gray-500">Interface Facturier</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Session Info */}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.fullname}</p>
              <p className="text-xs text-gray-500">Facturier connecté</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-100 px-4 py-3 flex gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.href}
                onClick={() => navigate(action.href)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition"
              >
                <Icon className="w-4 h-4" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
