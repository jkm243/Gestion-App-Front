# 🏢 Gestion - Frontend

**Système de Gestion des Affaires** - Interface web React/TypeScript/Tailwind

## 📋 Vue d'ensemble

Application web complète avec deux interfaces distinctes :
- **Admin Dashboard** : Back-office complet (NextAdmin style)
- **Cashier Interface** : Front-office simplifié pour ventes rapides

## ✨ Caractéristiques

### ✅ Déjà Implémenté
- ✅ Authentification JWT avec refresh automatique
- ✅ Système de routage avec protection de routes basée sur les rôles
- ✅ Layouts admin et facturier
- ✅ Pages de base (login, dashboards)
- ✅ Services API génériques
- ✅ Redux Toolkit pour state management
- ✅ Form validation avec Zod + React Hook Form
- ✅ Tailwind CSS + composants réutilisables

### 🚀 À Développer
- Modules CRUD complets (Users, Products, Sales)
- DataTable component avancé
- Recherche produit avec barcode
- Panier d'achat persistant
- Process de paiement
- Génération PDF de factures
- Graphiques (Recharts)
- Tests (Vitest, Cypress)

## 🛠️ Tech Stack

- **Framework** : React 18 + TypeScript
- **Bundler** : Vite 5
- **Routing** : React Router v6
- **State** : Redux Toolkit + RTK Query
- **Forms** : React Hook Form + Zod
- **Styling** : Tailwind CSS
- **HTTP** : Axios avec interceptors JWT
- **UI Icons** : Lucide React
- **Validation** : Zod
- **Charts** : Recharts (à intégrer)
- **Notifications** : Sonner (à intégrer)

## 🚀 Quick Start

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Build production
npm run build

# Preview du build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 📁 Structure du Projet

```
src/
├── components/
│   ├── RouteGuards.tsx          # Guards d'authentification
│   └── layouts/                 # Layouts principaux
├── pages/
│   ├── auth/                    # Pages d'authentification
│   ├── admin/                   # Pages admin
│   ├── cashier/                 # Pages facturier
│   └── ErrorPages.tsx           # Pages d'erreur
├── router/
│   └── AppRouter.tsx            # Configuration du routeur
├── services/
│   ├── api/                     # Requêtes API
│   ├── store/                   # Redux store
│   └── hooks/                   # Custom hooks
├── types/
│   └── index.ts                 # Types TypeScript
├── App.tsx
├── main.tsx
└── index.css
```

## 🔐 Authentification

### Login Flow
1. Utilisateur entre ses identifiants
2. API retourne `access_token` et `refresh_token`
3. Tokens stockés dans localStorage
4. Redirection basée sur le rôle (ADMIN/CASHIER)

### Refresh Token
- Automatique via interceptor Axios
- Triggered on 401 response
- Logout si le refresh échoue

### Protected Routes
```typescript
<Route element={<ProtectedRoute />}>
  <Route element={<AdminRoute />}>
    {/* Admin-only routes */}
  </Route>
  <Route element={<CashierRoute />}>
    {/* Cashier-only routes */}
  </Route>
</Route>
```

## 📡 API Integration

### Base URL
```
https://gestion-app-4ls9.onrender.com/api
```

### Endpoints Clés

#### Authentification
- `POST /users/login/` - Connexion
- `GET /users/me/` - Utilisateur courant
- `POST /users/change-password/` - Changer mot de passe

#### Utilisateurs
- `GET /users/all/` - Liste des utilisateurs
- `POST /users/signup/` - Créer utilisateur
- `PUT /users/update/` - Modifier utilisateur
- `PUT /users/deactivate-activate/{id}/` - Toggle statut

#### Produits
- `GET /products/` - Liste produits
- `POST /products/` - Créer produit
- `PUT /products/{id}/` - Modifier produit
- `DELETE /products/{id}/` - Supprimer produit

#### Ventes
- `POST /sales/` - Créer vente
- `GET /sales/` - Liste ventes
- `GET /sales/{id}/` - Détail vente
- `POST /invoices/` - Créer facture

## 🎨 Thème Couleurs

- **Primaire** : Blue (#0f3460)
- **Succès** : Green (#10b981)
- **Erreur** : Red (#ef4444)
- **Attention** : Yellow (#f59e0b)
- **Fond** : Gray (#f9fafb)

## 📱 Responsive Design

- **Mobile** : < 640px - Layout vertical
- **Tablet** : 640px - 1024px - Layout adapté
- **Desktop** : > 1024px - Layout complet

## 🧪 Testing (À Venir)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚢 Deployment

### Environment Variables
```env
VITE_API_BASE_URL=https://gestion-app-4ls9.onrender.com/api
```

### Build Production
```bash
npm run build
# Output → dist/
```

### Docker
```bash
docker build -t gestion-frontend .
docker run -p 80:80 gestion-frontend
```

## 📚 Documentation

Voir `CONFIG.md` pour la documentation détaillée de configuration.

## 🤝 Contribution

Pour contribuer :
1. Créer une branche feature
2. Implémenter les modifications
3. Tester avant de commiter
4. Créer un pull request

## 📝 Notes Importantes

1. **JWT Tokens** : Pas d'expiration configurée à la démo
2. **CORS** : API accepte les requêtes cross-origin
3. **localStorage** : Utilisé pour stocker les tokens
4. **TypeScript Strict** : Mode strict activé

## 🔗 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)

## 📞 Support

Pour les problèmes :
1. Vérifier les logs du navigateur (F12)
2. Inspecter l'onglet Network
3. Vérifier la configuration de l'API
4. Consulter la documentation OpenAPI

---

**Version** : 1.0.0  
**Statut** : 🟢 Prêt pour développement  
**Dernier Update** : 2 mars 2026
