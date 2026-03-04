import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productService } from '../../services/api/products';
import { Product } from '../../types';
import { AlertCircle, Save, X } from 'lucide-react';
import { useState } from 'react';

const productSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  description: z.string(),
  price: z.number().min(0),
  quantity_in_stock: z.number().min(0),
  category: z.string().nullable().optional(),
  barcode: z.string(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSave?: (product: Product) => void;
  onCancel?: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          ...product,
          category: product.category ?? null,
        }
      : undefined,
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        ...data,
        category: data.category ?? null,
      };

      if (product) {
        const updated = await productService.updateProduct(product.id, payload);
        onSave?.(updated);
      } else {
        const created = await productService.createProduct(payload);
        onSave?.(created);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold">
        {product ? 'Modifier le produit' : 'Ajouter un produit'}
      </h3>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            {...register('name')}
            type="text"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Catégorie</label>
          <input
            {...register('category')}
            type="text"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prix (€)</label>
          <input
            {...register('price', { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            {...register('quantity_in_stock', { valueAsNumber: true })}
            type="number"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Code-barres</label>
          <input
            {...register('barcode')}
            type="text"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register('description')}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-50 transition flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
