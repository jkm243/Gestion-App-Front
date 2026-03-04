import { useEffect, useState } from 'react';
import { productService } from '../../services/api/products';
import { Product, PaginatedResponse } from '../../types';
import { DataTable } from '../../components/common/DataTable';

export function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response: PaginatedResponse<Product> = await productService.getProductsPaginated({
          page: currentPage,
          page_size: 20,
        });
        setProducts(response.results || []);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [currentPage]);

  const columns = [
    { key: 'name', header: 'Nom', render: (product: Product) => product.name },
    { key: 'category', header: 'Catégorie', render: (product: Product) => product.category },
    { key: 'unit_price', header: 'Prix', render: (product: Product) => `${product.unit_price} €` },
    { key: 'is_active', header: 'Actif', render: (product: Product) => product.is_active ? '✓' : '✗' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Stock Produits</h2>
      <DataTable
        data={products}
        columns={columns}
        loading={loading}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
}
