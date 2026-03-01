curl -X POST https://gestion-app-4ls9.onrender.com/api/users/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "username":"admin",
    "email":"admin@example.com",
    "fullname":"Administrateur",
    "password1":"MotDePasse123!",
    "password2":"MotDePasse123!",
    "role":"<UUID_ROLE_ADMIN>"
  }'# Gestion - Frontend Configuration

Voici les informations de configuration du projet frontend :

## ✅ Installation Complète

### Structure du Projet
```
src/
├── components/
│   ├── RouteGuards.tsx       # Guards d'authentification
│   └── layouts/
│       ├── AdminLayout.tsx   # Layout administrateur
│       └── CashierLayout.tsx # Layout facturier
├── pages/
│   ├── auth/
│   │   └── LoginPage.tsx     # Page de connexion
│   ├── admin/
│   │   └── Dashboard.tsx     # Dashboard admin
│   ├── cashier/
│   │   └── Dashboard.tsx     # Interface facturier
│   └── ErrorPages.tsx        # 404 et 403
├── router/
│   └── AppRouter.tsx         # Configuration du routeur
├── services/
│   ├── api/
│   │   ├── client.ts         # Client Axios avec interceptors
│   │   ├── auth.ts           # Endpoints d'auth
│   │   ├── users.ts          # Endpoints utilisateurs
│   │   ├── products.ts       # Endpoints produits
│   │   ├── sales.ts          # Endpoints ventes
│   │   └── index.ts
│   ├── store/
│   │   ├── slices/
│   │   │   └── authSlice.ts  # Redux auth slice
│   │   └── store.ts          # Configuration store
│   └── hooks/
│       ├── useRedux.ts       # Typed Redux hooks
│       └── index.ts
├── types/
│   └── index.ts              # Types TypeScript
├── App.tsx                   # Root component
└── main.tsx                  # Entry point
```

## 🔑 Points Clés d'Intégration

### 1. **Authentification**
- **Login automatique** : Tokens stockés dans localStorage
- **Refresh token automatique** : Interceptor Axios gère le renouvellement
- **Protection de routes** : Guards basés sur les rôles (ADMIN/CASHIER)
- **Redirection intelligente** : Basée sur le rôle de l'utilisateur

### 2. **API Integration**
- **Base URL** : https://gestion-app-4ls9.onrender.com/api
- **Endpoints supportés** :
  - POST `/users/login/` → Connexion
  - GET `/users/me/` → Utilisateur courant
  - GET `/users/all/` → Liste utilisateurs
  - GET `/products/` → Produits
  - POST `/sales/` → Créer vente
  - Et autres selon spec OpenAPI

### 3. **State Management (Redux)**
```typescript
// Accès à l'état d'auth
const { user, isAuthenticated, isLoading, error } = useAppSelector(state => state.auth);

// Dispatch actions
dispatch(loginAsync(credentials));
dispatch(logout());
```

### 4. **Routing Structure**
```
/ → Auto-redirect basé sur l'état d'auth
/login → Page d'authentification
/admin/dashboard → Dashboard admin (ADMIN seulement)
/cashier → Interface facturier (CASHIER seulement)
/unauthorized → 403
/* → 404
```

## 📋 Prochaines Étapes

### Phase 2 : Modules CRUD
- [ ] Module Utilisateurs (liste, création, édition)
- [ ] Module Produits (liste, création, édition)
- [ ] Module Ventes (liste, détails)
- [ ] DataTable component réutilisable

### Phase 3 : Fonctionnalités
- [ ] Panier d'achat persistant
- [ ] Process de paiement
- [ ] Génération PDF de factures
- [ ] Recherche produit avancée
- [ ] Filtres et tri

### Phase 4 : Optimisations
- [ ] Recharts pour les graphiques
- [ ] Lazy loading des composants lourds
- [ ] Caching des données
- [ ] Tests unitaires

## 🚀 Commands Utiles

```bash
# Démarrage
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Type check
npm run typecheck

# Linting
npm run lint
```

## 🔐 Variables d'Environnement

Fichier `.env.local` :
```
VITE_API_BASE_URL=https://gestion-app-4ls9.onrender.com/api
```

## 📝 Notes Importantes

1. **Tokens JWT** : 
   - Access token en header Authorization
   - Refresh token dans localStorage
   - Auto-refresh sur 401

2. **CORS** : 
   - L'API est sur render.com
   - S'assurer que les headers CORS sont configurés

3. **TypeScript Strict** :
   - Mode strict activé
   - Types complets pour toutes les entités

4. **Responsive Design** :
   - Admin : Optimisé pour desktop (lg+)
   - Facturier : Optimisé pour tablet (md-lg)

## 🎨 Palette Couleurs

- Primaire : Blue (#1e40af / #0f3460)
- Succès : Green (#10b981)
- Erreur : Red (#ef4444)
- Warning : Yellow (#f59e0b)
- Gris : Gray (gamme complète Tailwind)

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs du terminal
2. Inspecter l'onglet Network du navigateur
3. Vérifier la variable d'env VITE_API_BASE_URL
4. S'assurer que l'API est accessible

---
**Prêt pour développement !** 🎉
