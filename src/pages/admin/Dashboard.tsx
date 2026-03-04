import { useState } from 'react';
import { TrendingUp, Package, Users, DollarSign, type LucideIcon } from 'lucide-react';

interface KPICard {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  color: string;
}

export function AdminDashboard() {
  const [_kpis] = useState<KPICard[]>([
    {
      title: 'Chiffre d\'affaires',
      value: '$45,231.89',
      change: 20.1,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Ventes',
      value: '1,234',
      change: 15.3,
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Produits',
      value: '356',
      change: -2.1,
      icon: Package,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Utilisateurs',
      value: '42',
      change: 5.2,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
  ]);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="text-gray-600 mt-2">Bienvenue sur votre interface d'administration</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {_kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${kpi.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-semibold ${kpi.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change > 0 ? '+' : ''}{kpi.change}%
                </span>
                <span className="text-gray-500 text-sm ml-2">vs mois dernier</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ventes des 7 derniers jours</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Graphique en développement</p>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top 5 Produits</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-900">Produit {i}</p>
                <p className="text-sm font-semibold text-gray-900">{50 - i * 5} ventes</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Dernières Ventes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Vente #</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Facturier</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Montant</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">#VE-{String(i).padStart(4, '0')}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Jean Dupont</td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">${i * 100}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Complétée
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">Aujourd'hui</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
