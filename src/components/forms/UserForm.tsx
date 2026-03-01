import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userService } from '../../services/api/users';
import { User } from '../../types';
import { AlertCircle, Save, X } from 'lucide-react';
import { useState } from 'react';

const userSchema = z.object({
  username: z.string().min(1, 'Nom d\'utilisateur requis'),
  email: z.string().email('Email invalide'),
  fullname: z.string().min(1, 'Nom complet requis'),
  is_active: z.boolean().default(true),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
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
    resolver: zodResolver(userSchema),
    defaultValues: user,
  });

  const onSubmit: SubmitHandler<UserFormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      if (user) {
        const updated = await userService.updateUser(user.id, data);
        onSave?.(updated);
      } else {
        const created = await userService.createUser(data);
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
        {user ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
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
