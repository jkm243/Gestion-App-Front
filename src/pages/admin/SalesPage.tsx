import { useEffect, useState } from 'react';
import { saleService } from '../../services/api/sales';
import { Sale } from '../../types';

export function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    saleService
      .getAllSales()
      .then((res) => {
        setSales(res.results || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Impossible de charger les ventes.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Ventes</h2>
      {loading && <p>Chargement…</p>}
      {error && <p className="text-red-600">{error}</p>}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">N° de vente</th>
            <th className="py-2 px-4 border">Caissier</th>
            <th className="py-2 px-4 border">Date</th>
            <th className="py-2 px-4 border">Montant</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id} className="text-center">
              <td className="py-2 px-4 border">{s.id}</td>
              <td className="py-2 px-4 border">{s.sale_number}</td>
              <td className="py-2 px-4 border">{s.user_id}</td>
              <td className="py-2 px-4 border">{new Date(s.sale_date).toLocaleString()}</td>
              <td className="py-2 px-4 border">{s.total_amount} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
