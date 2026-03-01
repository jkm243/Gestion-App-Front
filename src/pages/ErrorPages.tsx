import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <AlertCircle className="w-20 h-20 text-blue-600 mx-auto" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-2xl font-semibold text-gray-800 mb-4">Page non trouvée</p>
        <p className="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
      </div>
    </div>
  );
}

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <AlertCircle className="w-20 h-20 text-red-600 mx-auto" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-2">403</h1>
        <p className="text-2xl font-semibold text-gray-800 mb-4">Accès refusé</p>
        <p className="text-gray-600 mb-8">
          Vous n'avez pas les permissions pour accéder à cette page.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
