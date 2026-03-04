import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productService } from '../../services/api/products';
import { supplierService } from '../../services/api/suppliers';
import { Product, CreateProductRequest, UpdateProductRequest, CategoryEnum, Supplier } from '../../types';
import { AlertCircle, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const productSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  description: z.string().optional(),
  unit_price: z.string().optional(),
  unit_cost: z.string().optional(),
  category: z.string().nullable().optional(),
  supplier: z.string().min(1, 'Fournisseur requis'),
  is_active: z.boolean().optional(),
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
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const suppliersData = await supplierService.getAllSuppliers();
        setSuppliers(suppliersData);
      } catch (err) {
        console.error('Failed to load suppliers:', err);
      }
    };
    loadSuppliers();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name || '',
          description: product.description || '',
          unit_price: String(product.unit_price || ''),
          unit_cost: String(product.unit_cost || ''),
          category: product.category ?? null,
          supplier: typeof product.supplier === 'string' ? product.supplier : product.supplier.id,
          is_active: product.is_active,
        }
      : undefined,
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    console.log('Submitting product data:', data);
    try {
      // no longer need intermediate payload variable

      if (product) {
        const updateData: UpdateProductRequest = {
          name: data.name,
          description: data.description,
          unit_price: data.unit_price,
          unit_cost: data.unit_cost,
          category: data.category ? (data.category as CategoryEnum) : null,
          supplier: data.supplier,
          is_active: data.is_active,
        };
        console.log('Update data:', updateData);
        const updated = await productService.updateProduct(product.id, updateData);
        console.log('Update response:', updated);
        onSave?.(updated);
      } else {
        const createData: CreateProductRequest = {
          name: data.name,
          description: data.description,
          unit_price: data.unit_price,
          unit_cost: data.unit_cost,
          category: data.category ? (data.category as CategoryEnum) : null,
          supplier: data.supplier,
          is_active: data.is_active,
        };
        console.log('Create data:', createData);
        const created = await productService.createProduct(createData);
        console.log('Create response:', created);
        onSave?.(created);
      }
    } catch (err: unknown) {
      console.error('Product save error:', err);
      setError((err as { message?: string })?.message || 'Une erreur est survenue');
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
          <select
            {...register('category')}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="electronics">Électronique</option>
            <option value="mode">Mode</option>
            <option value="alimentaire">Alimentaire</option>
            <option value="beaute">Beauté</option>
            <option value="maison">Maison</option>
            <option value="sport">Sport</option>
            <option value="jouets">Jouets</option>
            <option value="autres">Autres</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fournisseur</label>
          <select
            {...register('supplier')}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Sélectionner un fournisseur</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name || supplier.id}
              </option>
            ))}
          </select>
          {errors.supplier && <p className="text-sm text-red-600 mt-1">{errors.supplier.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prix de vente (string)</label>
          <input
            {...register('unit_price')}
            type="text"
            placeholder="Ex: 10.50"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => console.log('unit_price onChange:', e.target.value)}
          />
          {errors.unit_price && <p className="text-sm text-red-600 mt-1">{errors.unit_price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Coût unitaire (string)</label>
          <input
            {...register('unit_cost')}
            type="text"
            placeholder="Ex: 8.00"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => console.log('unit_cost onChange:', e.target.value)}
          />
          {errors.unit_cost && <p className="text-sm text-red-600 mt-1">{errors.unit_cost.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register('description')}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            rows={3}
          />
        </div>

        <div className="col-span-2">
          <label className="flex items-center gap-2">
            <input
              {...register('is_active')}
              type="checkbox"
              className="rounded"
            />
            <span className="text-sm font-medium">Produit actif</span>
          </label>
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
