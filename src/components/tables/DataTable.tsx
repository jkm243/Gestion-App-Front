import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T extends { id?: number }> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  isLoading?: boolean;
  searchableFields?: (keyof T)[];
}

export function DataTable<T extends { id?: number }>({
  columns,
  data,
  onEdit,
  onDelete,
  isLoading,
  searchableFields = [],
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm && searchableFields.length > 0) {
      filtered = data.filter((row) =>
        searchableFields.some((field) => {
          const value = row[field];
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (typeof aVal === 'string') {
          return sortOrder === 'asc'
            ? aVal.localeCompare(bVal as string)
            : (bVal as string).localeCompare(aVal);
        }

        if (typeof aVal === 'number') {
          return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
        }

        return 0;
      });
    }

    return filtered;
  }, [data, sortKey, sortOrder, searchTerm, searchableFields]);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4">
      {searchableFields.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`py-3 px-4 border text-left font-semibold ${
                    col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${col.width || ''}`}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.label}</span>
                    {col.sortable && sortKey === col.key && (
                      <>
                        {sortOrder === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && <th className="py-3 px-4 border text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="py-4 text-center">
                  Chargement...
                </td>
              </tr>
            ) : filteredAndSortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="py-4 text-center text-gray-500">
                  Aucun résultat
                </td>
              </tr>
            ) : (
              filteredAndSortedData.map((row, idx) => (
                <tr key={row.id || idx} className="border-b hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="py-3 px-4 border">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="py-3 px-4 border text-center flex items-center justify-center gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                        >
                          Modifier
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => window.confirm('Êtes-vous sûr ?') && onDelete(row)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                        >
                          Supprimer
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-500">
        {filteredAndSortedData.length} / {data.length} résultat(s)
      </p>
    </div>
  );
}
