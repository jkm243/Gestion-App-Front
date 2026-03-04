import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { InvoicePrinter } from '../../components/invoice/InvoicePrinter';
import { Invoice } from '../../types';

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  // pagination placeholder until API supports it
  const totalPages = Math.max(1, Math.ceil(invoices.length / 10));

  useEffect(() => {
    setLoading(true);
    // TODO: Connect to actual invoice endpoint when available
    setInvoices([]);
    setError(null);
    setLoading(false);
  }, [currentPage]);


  if (selectedInvoice) {
    return (
      <div className="p-6">
        <button
          onClick={() => setSelectedInvoice(null)}
          className="flex items-center gap-2 mb-4 px-4 py-2 border rounded hover:bg-gray-50"
        >
          <X className="w-4 h-4" />
          Retour
        </button>
        <InvoicePrinter invoice={selectedInvoice} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Factures</h2>
      {loading && <p>Chargement…</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 border text-left">N° facture</th>
              <th className="py-2 px-4 border text-right">Montant</th>
              <th className="py-2 px-4 border text-center">Statut</th>
              <th className="py-2 px-4 border text-left">Date</th>
              <th className="py-2 px-4 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((f) => (
              <tr key={f.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 font-medium">{f.invoice_number}</td>
                <td className="py-2 px-4 text-right">{f.amount?.toFixed(2)} €</td>
                <td className="py-2 px-4 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      f.status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : f.status === 'UNPAID'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {f.status}
                  </span>
                </td>
                <td className="py-2 px-4">{f.issue_date ? new Date(f.issue_date).toLocaleDateString('fr-FR') : ''}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => setSelectedInvoice(f)}
                    className="p-1 hover:bg-green-100 rounded transition mr-2"
                    title="Voir et imprimer"
                  >
                    <Download className="w-4 h-4 text-green-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
