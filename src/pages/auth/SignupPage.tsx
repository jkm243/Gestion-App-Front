import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { roleService } from '../../services/api/roles';
import { userService } from '../../services/api/users';
import { SignupFormData } from '../../types';

const signupSchema = z.object({
  username: z.string().min(1, "Nom d'utilisateur requis"),
  email: z.string().email('Email invalide'),
  fullname: z.string().optional(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  password_confirm: z.string().min(6),
  role_id: z.string().optional(), // validation handled separately
}).refine((data) => data.password === data.password_confirm, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['password_confirm'],
});

// require role if provided list has more than one entry; handled in form UI

export function SignupPage() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<any[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema as any),
    defaultValues: { role_id: '' } as any,
  });

  useEffect(() => {
    setLoadingRoles(true);
    roleService.getAllRoles()
      .then((r) => setRoles(r))
      .catch((e) => {
        console.error('role load failed', e);
        // fallback silently
        setRoles([
          { id: '1', name: 'ADMIN' },
          { id: '2', name: 'CASHIER' },
        ]);
      })
      .finally(() => setLoadingRoles(false));
  }, []);

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    if (roles.length > 0 && (!data.role_id || data.role_id === '')) {
      setError('Veuillez sélectionner un rôle');
      return;
    }
    try {
      const payload: any = {
        username: data.username,
        email: data.email,
        fullname: data.fullname,
        password1: data.password,
        password2: data.password_confirm,
      };
      if (data.role_id) {
        payload.role = data.role_id;
      }
      await userService.createUser(payload);
      // redirect to login
      navigate('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Créer un compte</h2>

          {error && <div className="mb-4 text-red-600">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
              <input {...register('username')} className="w-full px-3 py-2 border rounded" />
              {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input {...register('email')} className="w-full px-3 py-2 border rounded" />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input {...register('fullname')} className="w-full px-3 py-2 border rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input type="password" {...register('password')} className="w-full px-3 py-2 border rounded" />
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <input type="password" {...register('password_confirm')} className="w-full px-3 py-2 border rounded" />
              {errors.password_confirm && <p className="text-sm text-red-600">{errors.password_confirm.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
                {loadingRoles && <span className="text-gray-500 text-xs ml-2">(Chargement...)</span>}
              </label>
              <select {...register('role_id' as any)} className="w-full px-3 py-2 border rounded" disabled={loadingRoles}>
                <option value="">Sélectionnez un rôle</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              {roles.length === 0 && !loadingRoles && (
                <p className="text-sm text-gray-500 mt-1">Rôles par défaut chargés (API indisponible)</p>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-blue-600 text-white py-2 rounded">
              {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-500 text-center">
            <button onClick={() => navigate('/login')} className="text-blue-600 underline">Déjà un compte ? Connexion</button>
          </div>
        </div>
      </div>
    </div>
  );
}
