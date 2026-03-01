import { useEffect, useState } from 'react';
import { invoiceService } from '../../services/api/sales';
import { Invoice } from '../../types';

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    invoiceService
      .getAllInvoices()
      .then((res) => {
        setInvoices(res.results || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Impossible de charger les factures.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Factures</h2>
      {loading && <p>Chargement…</p>}
      {error && <p className="text-red-600">{error}</p>}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">N° facture</th>
            <th className="py-2 px-4 border">Montant</th>
            <th className="py-2 px-4 border">Statut</th>
            <th className="py-2 px-4 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((f) => (
            <tr key={f.id} className="text-center">
              <td className="py-2 px-4 border">{f.id}</td>
              <td className="py-2 px-4 border">{f.invoice_number}</td>
              <td className="py-2 px-4 border">{f.amount} €</td>
              <td className="py-2 px-4 border">{f.status}</td>
              <td className="py-2 px-4 border">{new Date(f.issue_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
