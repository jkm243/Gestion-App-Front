import { useEffect, useState } from 'react';
import { saleService } from '../../services/api/sales';
import { Sale, PaginatedResponse } from '../../types';
import { DataTable } from '../../components/common/DataTable';

export function HistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadSales = async () => {
      setLoading(true);
      try {
        const response: PaginatedResponse<Sale> = await saleService.getAllSales({
          page: currentPage,
          page_size: 20,
          status: 'completed',
        });
        setSales(response.results || []);
      } catch (error) {
        console.error('Failed to load sales:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSales();
  }, [currentPage]);

  const columns = [
    { key: 'id', header: 'ID', render: (sale: Sale) => sale.id.slice(0, 8) + '...' },
    { key: 'sale_date', header: 'Date', render: (sale: Sale) => new Date(sale.sale_date).toLocaleDateString('fr-FR') },
    { key: 'total_amount', header: 'Total', render: (sale: Sale) => `${sale.total_amount} €` },
    { key: 'status', header: 'Statut', render: (sale: Sale) => sale.status },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Historique des ventes</h2>
      <DataTable
        data={sales}
        columns={columns}
        loading={loading}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
}
