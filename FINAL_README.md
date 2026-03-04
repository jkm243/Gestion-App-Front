# 📊 Gestion-App-Front - Frontend d'Application de Gestion

## 🎯 Vue d'ensemble

Frontend React/TypeScript moderne pour l'application de gestion commerciale. Architecture complète avec authentification, gestion des rôles (Admin/Caissier), et intégration complète avec l'API OpenAPI.

**Stack:** React 18 + TypeScript + Vite + Redux Toolkit + React Router + Tailwind CSS

---

## ✨ Fonctionnalités principales

### 🔐 Authentification & Sécurité
- ✅ Login/Signup avec JWT (access + refresh tokens)
- ✅ Gestion des rôles (Admin, Caissier)
- ✅ Protection des routes avec guards
- ✅ Refresh token automatique (interceptor)
- ✅ Mode développement (VITE_DEV_LOGIN=true pour simuler login)

### 👨‍💼 Module Admin
- **Tableau de bord** : Statistiques et métriques
- **Utilisateurs** : Création, modification, suppression avec validation
- **Produits** : CRUD complet avec prix (string) et catégories
- **Fournisseurs** : Gestion des fournisseurs (lié aux produits)
- **Clients** : Gestion des clients avec toggle actif/inactif
- **Lieux** : Gestion des lieux de stockage
- **Stocks** : Vue des stocks produits par lieu
- **Ventes** : Historique des ventes avec pagination
- **Analytiques** : Graphiques de ventes par date
- **Paramètres** : Configuration système

### 🛒 Module Caissier
- **Dashboard** : Recherche produits + panier en temps réel
- **Panier** : Gestion complète (ajout, suppression, quantité)
- **Paiement** : Création de ventes avec items, complétude automatique
- **Historique** : Liste des ventes complétées
- **Stock** : Consultation des produits disponibles
- **Vente Rapide** : Recherche et ajout rapide au panier

---

## 🚀 Installation & Démarrage

### Prérequis
- Node.js 18+
- npm ou yarn

### Setup
```bash
# Cloner le repository
git clone https://github.com/jkm243/Gestion-App-Front.git
cd Gestion-App-Front/project

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec votre VITE_API_BASE_URL

# Démarrer le serveur de développement
npm run dev

# Le site sera accessible à http://localhost:5175
```

### Build & Déploiement
```bash
# Build pour production
npm run build

# Prévisualiser la build
npm run preview

# Vérifier les types TypeScript
npm run typecheck

# Lint le code
npm run lint
```

---

## 🔌 Endpoints API utilisés

### Authentification
- `POST /users/login/` → Token + User
- `POST /users/signup/` → Création utilisateur
- `GET /users/me/` → Données utilisateur connecté
- `POST /auth/refresh/` → Renouvellement token

### Produits
- `GET /products/all/` → Tous les produits
- `GET /products/all-pagination/` → Produits paginés (page, page_size, search, category, etc.)
- `GET /products/{id}/` → Détails produit
- `POST /products/create/` → Création produit
- `PUT /products/update/{id}/` → Modification produit
- `DELETE /products/delete/{id}/` → Suppression

### Ventes
- `POST /sales/` → Création vente avec items_data
- `GET /sales/list/` → Liste des ventes (pagination, filtres)
- `GET /sales/{id}/` → Détails vente
- `POST /sales/{id}/add-item/` → Ajout item à vente
- `POST /sales/{id}/complete/` → Marquer comme complétée
- `POST /sales/{id}/cancel/` → Annuler vente
- `POST /sales/{id}/refund/` → Rembourser
- `DELETE /sales/{id}/delete/` → Supprimer

### Autres ressources
- **Utilisateurs** : `GET /users/all/`, `POST /users/signup/`, `PUT /users/update/{id}/`, etc.
- **Fournisseurs** : `GET /suppliers/all/`, `POST /suppliers/create/`, `PUT /suppliers/update/{id}/`, etc.
- **Clients** : `GET /customers/all/`, `PATCH /customers/activate-deactivate/{id}/`, etc.
- **Lieux** : `GET /locations/all/`, `PATCH /locations/activate-deactivate/{id}/`, etc.

---

## 📂 Structure du projet

```
src/
├── components/
│   ├── common/          # DataTable générique, LoadingSpinner
│   ├── forms/           # ProductForm, UserForm, etc.
│   ├── layouts/         # AdminLayout, CashierLayout
│   └── RouteGuards.tsx  # Protections routes (ProtectedRoute, AdminRoute, etc.)
├── pages/
│   ├── admin/           # Pages admin (Dashboard, UsersPage, ProductsPage, etc.)
│   ├── cashier/         # Pages caissier (Dashboard, CartPage, PaymentPage, etc.)
│   ├── auth/            # LoginPage, SignupPage
│   └── ErrorPages.tsx   # 404, 401, etc.
├── services/
│   ├── api/             # Services API (auth, products, sales, suppliers, etc.)
│   ├── store/           # Redux (authSlice, cartSlice)
│   └── utils/           # Utilitaires (encryption, hooks)
├── types/
│   └── index.ts         # Tous les types TypeScript (User, Product, Sale, etc.)
├── router/
│   └── AppRouter.tsx    # Définition des routes avec guards
├── App.tsx              # Component root avec Redux Provider
└── main.tsx             # Point d'entrée Vite
```

---

## 🛠️ Configuration importante

### Variables d'environnement (.env.local)
```
VITE_API_BASE_URL=https://votre-api.com/api
VITE_DEV_LOGIN=false  # true pour mode développement (login simulé)
```

### Types de données critiques
- **Prices** : Chaînes décimales (strings) : "10.50", "99.99"
- **IDs** : UUIDs (strings)
- **Tokens** : Imbriqués dans `token.access` et `token.refresh`
- **Rôles** : "admin" ou "cashier" (case-insensitive dans le code)

---

## 🧪 Tests

### Scripts disponibles
```bash
# Tests unitaires (non configuré - à ajouter)
npm run test

# Tests E2E (Cypress)
npm run test:e2e              # Mode interactif
npm run test:e2e:headless     # Mode headless

# Tests scripts manuels
npm run test:auth             # Test authentification
npm run test:signup           # Test flux d'inscription
npm run test:dev-mode         # Vérifier serveur dev
```

---

## 🐛 Dépannage courant

### La connexion est lente
→ Vérifiez `VITE_API_BASE_URL` dans `.env.local`. Un timeout de 10s est appliqué.

### Les prix ne s'enregistrent pas
→ Les prix doivent être des **strings décimales** ("10.50", pas 10.50 en nombre).

### Le panier ne persiste pas
→ Les données sont chiffrées dans localStorage. Vérifiez les paramètres d'encryption.

### Erreur "target must be an object"
→ Vérifiez que `getAllSales()` reçoit un objet `{ page, page_size }`, pas des paramètres séparés.

---

## 📚 Documentation supplémentaire

- `README.md` - Guide utilisateur et installation
- `REFACTORING_SUMMARY.md` - Détails des changements architecturaux
- `ARCHITECTURE_DIAGRAMS.md` - Diagrammes et flux de données

---

## 👥 Équipe & Contribution

Projet développé pour l'application de gestion commerciale. Pour signaler des bugs ou proposer des améliorations, créez une issue sur le repository GitHub.

---

## 📄 License

Propriétaire - Gestion-App-Front © 2026

---

## ✅ Checklist Pré-Déploiement

- [ ] API_BASE_URL configurée en production
- [ ] Variables d'env définiesdans `.env.local`
- [ ] `npm run build` réussit sans erreurs
- [ ] `npm run typecheck` passe (0 erreurs)
- [ ] Tests E2E validé (`npm run test:e2e:headless`)
- [ ] Tous les endpoints API accessibles
- [ ] Login/Signup fonctionnels
- [ ] Rôles admin et caissier testés
- [ ] CORS configuré côté API

---

**🚀 Prêt à déployer !**
