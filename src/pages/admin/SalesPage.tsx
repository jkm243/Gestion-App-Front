import { useEffect, useState } from 'react';
import { saleService } from '../../services/api/sales';
import { Sale } from '../../types';
import { DataTable } from '../../components/tables/DataTable';

export function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    saleService
      .getAllSales(currentPage, 100)
      .then((res) => {
        setSales(res.results || []);
        setTotalPages(Math.ceil((res.count || 0) / 100));
      })
      .catch((err) => {
        console.error(err);
        setError('Impossible de charger les ventes.');
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Ventes</h2>
      {loading && <p>Chargement…</p>}
      {error && <p className="text-red-600">{error}</p>}
      <DataTable<Sale>
        data={sales}
        columns={[
          { key: 'sale_number', label: 'N° de vente', sortable: true },
          {
            key: 'sale_date',
            label: 'Date',
            sortable: true,
            render: (s) => new Date(s.sale_date).toLocaleString('fr-FR'),
          },
          {
            key: 'total_amount',
            label: 'Montant',
            sortable: true,
            render: (s) => `${s.total_amount.toFixed(2)} €`,
          },
          {
            key: 'status',
            label: 'Statut',
            render: (s) => (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  s.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-800'
                    : s.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {s.status}
              </span>
            ),
          },
          { key: 'payment_method', label: 'Méthode', sortable: true },
        ]}
        searchFields={['sale_number', 'payment_method']}
      />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-500">
          Page {currentPage} sur {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
