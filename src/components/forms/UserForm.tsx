import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userService } from '../../services/api';
import { User, UpdateUserRequest } from '../../types';
import { AlertCircle, Save, X } from 'lucide-react';
import { useState } from 'react';

const userSchema = z.object({
  username: z.string().min(1, 'Nom d\'utilisateur requis'),
  email: z.string().email('Email invalide'),
  fullname: z.string().optional(),
  is_active: z.boolean().default(true),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user: User;
  onSave?: (user: User) => void;
  onCancel?: () => void;
}

export function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema) as Resolver<UserFormData>,
    defaultValues: {
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      is_active: user.is_active,
    },
  });

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updateData: UpdateUserRequest = {
        username: data.username,
        email: data.email,
        fullname: data.fullname,
        is_active: data.is_active,
      };
      const updated = await userService.updateUser(user.id, updateData);
      onSave?.(updated);
    } catch (err) {
      setError((err as { message?: string })?.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold">
        Modifier l\'utilisateur
      </h3>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom d'utilisateur</label>
          <input
            {...register('username')}
            type="text"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Nom complet</label>
          <input
            {...register('fullname')}
            type="text"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.fullname && <p className="text-sm text-red-600 mt-1">{errors.fullname.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="flex items-center gap-2">
            <input {...register('is_active')} type="checkbox" className="w-4 h-4" />
            <span className="text-sm font-medium">Actif</span>
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
