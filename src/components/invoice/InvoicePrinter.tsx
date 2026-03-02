import { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Invoice } from '../../types';
import { Printer, Download } from 'lucide-react';

interface InvoicePrinterProps {
  invoice: Invoice;
  saleData?: any;
}

export function InvoicePrinter({ invoice, saleData }: InvoicePrinterProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };

  const handleDownloadPDF = () => {
    if (printRef.current) {
      const element = printRef.current;
      const opt = {
        margin: 10,
        filename: `facture-${invoice.invoice_number}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <Printer className="w-4 h-4" />
          Imprimer
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          <Download className="w-4 h-4" />
          Télécharger PDF
        </button>
      </div>

      <div
        ref={printRef}
        className="bg-white p-8 border print:border-0"
        style={{ pageBreakAfter: 'avoid' }}
      >
        {/* Header */}
        <div className="mb-8 pb-4 border-b-2">
          <h1 className="text-3xl font-bold text-blue-900">FACTURE</h1>
          <p className="text-gray-600">{invoice.invoice_number}</p>
        </div>

        {/* Company Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="font-semibold mb-2">Gestion App</h2>
            <p className="text-sm text-gray-600">123 Rue de la Paix</p>
            <p className="text-sm text-gray-600">75000 Paris, France</p>
            <p className="text-sm text-gray-600">contact@gestionapp.com</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Facture #{invoice.invoice_number}</p>
            <p className="text-sm text-gray-600">
              Émise le {new Date(invoice.issue_date).toLocaleDateString('fr-FR')}
            </p>
            {invoice.due_date && (
              <p className="text-sm text-gray-600">
                Échéance : {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        </div>

        {/* Invoice Details */}
        {saleData && (
          <div className="mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Désignation</th>
                  <th className="p-2 text-right">Quantité</th>
                  <th className="p-2 text-right">P.U.</th>
                  <th className="p-2 text-right">Montant</th>
                </tr>
              </thead>
              <tbody>
                {saleData.items?.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{item.product?.name || `Article ${idx + 1}`}</td>
                    <td className="p-2 text-right">{item.quantity}</td>
                    <td className="p-2 text-right">{item.unit_price?.toFixed(2) || '0.00'} €</td>
                    <td className="p-2 text-right font-semibold">
                      {((item.quantity || 0) * (item.unit_price || 0)).toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2 border-t-2 border-b-2 font-semibold">
              <span>Total TTC:</span>
              <span className="text-xl">{invoice.amount.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-8">
          <p className="text-sm">
            <span className="font-semibold">Statut:</span>{' '}
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                invoice.status === 'PAID'
                  ? 'bg-green-100 text-green-800'
                  : invoice.status === 'UNPAID'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {invoice.status}
            </span>
          </p>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 text-xs text-gray-600 text-center">
          <p>Merci pour votre achat !</p>
          <p>Document généré automatiquement - Aucune signature requise</p>
        </div>
      </div>
    </div>
  );
}
