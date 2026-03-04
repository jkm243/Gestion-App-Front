import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  loading = false,
  onPageChange,
  currentPage = 1,
  totalPages,
}: DataTableProps<T>) {
  const handlePreviousPage = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (!totalPages || currentPage < totalPages) {
      if (onPageChange) {
        onPageChange(currentPage + 1);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-gray-500">Aucune donnée</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto bg-white border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={item.id || idx} className="border-b hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={`${item.id || idx}-${col.key}`} className="px-6 py-3 text-sm">
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {(onPageChange || totalPages) && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {currentPage} {totalPages ? `de ${totalPages}` : ''}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={totalPages !== undefined && currentPage >= totalPages}
              className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
