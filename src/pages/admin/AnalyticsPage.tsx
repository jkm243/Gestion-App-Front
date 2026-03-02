import { useEffect, useState } from 'react';
import { saleService } from '../../services/api/sales';
import { Sale } from '../../types';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function AnalyticsPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    saleService
      .getAllSales(1, 100)
      .then((res) => {
        setSales(res.results || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Aggregate data by date
  const salesByDate = sales.reduce(
    (acc, sale) => {
      const date = new Date(sale.sale_date).toLocaleDateString('fr-FR');
      const existing = acc.find((d) => d.date === date);
      if (existing) {
        existing.total += sale.total_amount;
        existing.count += 1;
      } else {
        acc.push({ date, total: sale.total_amount, count: 1 });
      }
      return acc;
    },
    [] as Array<{ date: string; total: number; count: number }>
  );

  // Sales by payment method
  const paymentMethods = sales.reduce(
    (acc, sale) => {
      const existing = acc.find((p) => p.name === sale.payment_method);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: sale.payment_method, value: 1 });
      }
      return acc;
    },
    [] as Array<{ name: string; value: number }>
  );

  // Total stats
  const totalRevenue = sales.reduce((sum, s) => sum + s.total_amount, 0);
  const averageOrder = sales.length > 0 ? totalRevenue / sales.length : 0;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Analytics</h2>

      {loading ? (
        <p>Chargement des données...</p>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded border">
              <p className="text-gray-600 text-sm">Total des ventes</p>
              <p className="text-3xl font-bold text-blue-600">{sales.length}</p>
            </div>
            <div className="bg-white p-6 rounded border">
              <p className="text-gray-600 text-sm">Chiffre d'affaires</p>
              <p className="text-3xl font-bold text-green-600">{totalRevenue.toFixed(2)} €</p>
            </div>
            <div className="bg-white p-6 rounded border">
              <p className="text-gray-600 text-sm">Panier moyen</p>
              <p className="text-3xl font-bold text-purple-600">{averageOrder.toFixed(2)} €</p>
            </div>
            <div className="bg-white p-6 rounded border">
              <p className="text-gray-600 text-sm">Dernière vente</p>
              <p className="text-3xl font-bold text-orange-600">
                {sales.length > 0 ? new Date(sales[0].sale_date).toLocaleDateString('fr-FR') : '-'}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <div className="bg-white p-6 rounded border">
              <h3 className="text-lg font-semibold mb-4">Tendance du chiffre d'affaires</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toFixed(2)} €`} />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" name="Montant (€)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sales Count */}
            <div className="bg-white p-6 rounded border">
              <h3 className="text-lg font-semibold mb-4">Nombre de transactions</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#10b981" name="Transactions" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-6 rounded border col-span-2">
              <h3 className="text-lg font-semibold mb-4">Répartition par mode de paiement</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} (${value})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethods.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
