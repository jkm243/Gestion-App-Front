import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Menu, X, LogOut, User, Settings, Bell, Search } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../services/hooks';
import { logout } from '../../services/store/slices/authSlice';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { label: 'Tableau de Bord', icon: '📊', href: '/admin/dashboard' },
    { label: 'Utilisateurs', icon: '👥', href: '/admin/users' },
    { label: 'Produits', icon: '📦', href: '/admin/products' },
    { label: 'Ventes', icon: '💰', href: '/admin/sales' },
    { label: 'Analytiques', icon: '📈', href: '/admin/analytics' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
            G
          </div>
          {sidebarOpen && <span className="font-bold text-xl">Gestion</span>}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className="w-full px-6 py-3 hover:bg-gray-800 transition flex items-center gap-3 text-left"
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Settings */}
        <div className="border-t border-gray-800 p-4 space-y-2">
          <button
            onClick={() => navigate('/admin/settings')}
            className="w-full px-4 py-2 hover:bg-gray-800 transition flex items-center gap-3"
          >
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Paramètres</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 hover:bg-red-900 transition flex items-center gap-3 text-red-200"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.fullname}</p>
                <p className="text-xs text-gray-500">{user?.role.name}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                {user?.fullname?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
