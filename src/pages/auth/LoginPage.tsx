import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { z } from 'zod';
import {
  AlertCircle,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { LoginShowcase } from '../../components/auth/LoginShowcase';
import { LoaderButton } from '../../components/common/LoaderButton';
import { useAppDispatch } from '../../services/hooks';
import { clearError, loginAsync } from '../../services/store/slices/authSlice';
import { getDefaultRouteForUser } from '../../features/auth/authUtils';
import { useAuth } from '../../features/auth/useAuth';
import { LoginFormData } from '../../types';

const loginSchema = z.object({
  username: z.string().min(1, "Nom d'utilisateur requis"),
  password: z.string().min(1, 'Mot de passe requis'),
});

const LOGIN_SUBMIT_MIN_DELAY_MS = 500;

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { error, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    const minDelay = new Promise((resolve) =>
      window.setTimeout(resolve, LOGIN_SUBMIT_MIN_DELAY_MS)
    );

    try {
      const result = await dispatch(loginAsync(data)).unwrap();
      await minDelay;
      const displayName =
        result.user.fullname?.trim() ||
        result.user.username ||
        result.user.email;

      enqueueSnackbar(`Connexion reussie. Bienvenue ${displayName}.`, {
        variant: 'success',
      });
      navigate(getDefaultRouteForUser(result.user));
    } catch (submitError) {
      await minDelay;
      const message =
        typeof submitError === 'string'
          ? submitError
          : 'Echec de la connexion. Verifiez vos identifiants.';

      enqueueSnackbar(message, {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#9ca3b1] px-4 py-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,248,220,0.92),_rgba(255,255,255,0.24)_34%,_rgba(148,163,184,0.95)_72%)]" />
      <div className="absolute -left-12 top-16 h-60 w-60 rounded-full bg-white/25 blur-3xl" />
      <div className="absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-amber-100/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl items-center">
        <div className="grid w-full overflow-hidden rounded-[38px] border border-white/40 bg-[#f6f1e8]/90 p-3 shadow-[0_42px_120px_rgba(15,23,42,0.2)] backdrop-blur md:p-4 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] gap-4">
          <section className="flex flex-col rounded-[30px] bg-[linear-gradient(180deg,_rgba(255,255,255,0.82),_rgba(247,241,225,0.94))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] sm:p-7 lg:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white/70 px-3 py-1.5 text-[10px] font-medium text-slate-700 shadow-sm backdrop-blur">
                <Building2 className="h-3 w-3 text-amber-500" />
                Gestion
              </div>
              <div className="hidden rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500 sm:inline-flex">
                Espace securise
              </div>
            </div>

            {import.meta.env.VITE_DEV_LOGIN === 'true' && (
              <div className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50/90 px-4 py-4 text-sm text-amber-900 shadow-sm">
                <strong>Mode developpement :</strong> authentification simulee active
              </div>
            )}

            <div className="mt-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.24em] text-amber-700">
                <ShieldCheck className="h-3 w-3" />
                Connexion professionnelle
              </div>

              <h1 className="mt-5 max-w-lg text-3xl font-semibold tracking-tight text-slate-900 sm:text-[1.8rem] sm:leading-[1.02]">
                Connectez-vous a votre espace de pilotage.
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                Accedez a vos ventes, a vos stocks, a vos equipes et a vos indicateurs depuis
                une interface plus claire, plus fiable et plus elegante.
              </p>
            </div>

            <div className="mt-6 rounded-[28px] border border-white/70 bg-white/65 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6">
              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-[20px] border border-rose-200 bg-rose-50/90 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" />
                  <p className="text-sm leading-6 text-rose-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="rounded-[24px] border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm transition focus-within:border-amber-300 focus-within:ring-4 focus-within:ring-amber-100">
                  <label
                    htmlFor="username"
                    className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400"
                  >
                    Nom d'utilisateur
                  </label>
                  <div className="mt-3 flex items-center gap-3">
                    <UserRound className="h-5 w-5 text-slate-400" />
                    <input
                      {...register('username')}
                      id="username"
                      type="text"
                      placeholder="Entrez votre identifiant"
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
                {errors.username && (
                  <p className="px-1 text-sm text-rose-600">{errors.username.message}</p>
                )}

                <div className="rounded-[24px] border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm transition focus-within:border-amber-300 focus-within:ring-4 focus-within:ring-amber-100">
                  <label
                    htmlFor="password"
                    className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400"
                  >
                    Mot de passe
                  </label>
                  <div className="mt-3 flex items-center gap-3">
                    <LockKeyhole className="h-5 w-5 text-slate-400" />
                    <input
                      {...register('password')}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Entrez votre mot de passe"
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((currentValue) => !currentValue)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={
                        showPassword
                          ? 'Masquer le mot de passe'
                          : 'Afficher le mot de passe'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="px-1 text-sm text-rose-600">{errors.password.message}</p>
                )}

                <div className="pt-2">
                  <LoaderButton
                    type="submit"
                    isLoading={isSubmitting || isLoading}
                    disabled={isSubmitting || isLoading}
                    loadingText="Connexion en cours..."
                    className="w-full bg-[#f6c85a] text-slate-900 shadow-[0_18px_45px_rgba(246,200,90,0.38)] hover:bg-[#f0bf49] focus:ring-amber-200"
                  >
                    <>
                      <LogIn className="h-4 w-4" />
                      Se connecter
                    </>
                  </LoaderButton>
                </div>
              </form>

              
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-slate-200/70 pt-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Pas encore de compte ?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-slate-900 underline decoration-amber-300 underline-offset-4"
                >
                  Creer un compte
                </Link>
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                Systeme de gestion des affaires
              </p>
            </div>
          </section>

          <LoginShowcase />
        </div>
      </div>
    </div>
  );
}
