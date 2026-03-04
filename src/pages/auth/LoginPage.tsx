import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, LogIn } from 'lucide-react';
import { useAppDispatch } from '../../services/hooks';
import { loginAsync } from '../../services/store/slices/authSlice';
import { LoginFormData } from '../../types';

const loginSchema = z.object({
  username: z.string().min(1, 'Nom d\'utilisateur requis'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await dispatch(loginAsync(data)).unwrap();
      
      // Redirect based on role (case‑insensitive)
      const roleName = result.user.role.name.toUpperCase();
      if (roleName === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (roleName === 'CASHIER') {
        navigate('/cashier');
      }
    } catch (err: any) {
      setError(err || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  // debug display for dev login
  console.log('env VITE_DEV_LOGIN=', import.meta.env.VITE_DEV_LOGIN);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center px-4">
      {import.meta.env.VITE_DEV_LOGIN === 'true' && (
        <div className="absolute top-0 left-0 w-full bg-yellow-200 text-yellow-900 p-2 text-center z-10">
          <strong>Mode développement :</strong> authentification simulée active
        </div>
      )}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <LogIn className="w-8 h-8 text-blue-900" />
          </div>
          <h1 className="text-4xl font-bold text-white">Gestion</h1>
          <p className="text-blue-100 text-sm mt-2">Système de Gestion des Affaires</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Connexion</h2>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nom d'utilisateur
              </label>
              <input
                {...register('username')}
                id="username"
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Démonstration • Version 1.0</p>
            <p className="mt-2">
              <a href="/signup" className="text-sm text-blue-600 underline">Créer un compte</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
