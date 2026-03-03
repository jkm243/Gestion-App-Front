# 🧪 Guide de Test du Flux d'Inscription et Connexion

## État Actuel

✅ **Formulaire de Signup** - Fonctionnel en mode DEV
✅ **Formulaire de Login** - Fonctionnel en mode DEV
✅ **Redirections de Rôles** - Implémentées et testables
⚠️ **API Backend** - Fermée aux signups non-authentifiés

---

## 🚀 Démarrage Rapide

### 1. Lancer le Serveur DEV
```bash
npm run dev
```

L'application devrait être accessible à: **http://localhost:5175**

### 2. Accéder à la Page de Signup
Allez à: **http://localhost:5175/signup**

### 3. Créer un Compte
Remplissez le formulaire:
- **Username:** `test_cashier` (ou n'importe quel nom unique)
- **Email:** `test@example.com`
- **Full Name:** `Test User`
- **Password:** `TestPassword123`
- **Confirm Password:** `TestPassword123`
- **Role:** `CASHIER` ou `ADMIN`

### 4. Cliquez sur "S'inscrire"
Le formulaire est validé et vous serez redirigé vers `/login`

### 5. Se Connecter
- **Username:** Celui que vous avez créé
- **Password:** Celui que vous avez entré

Vous serez redirigé vers:
- `/cashier/dashboard` si vous avez choisi CASHIER
- `/admin/dashboard` si vous avez choisi ADMIN

---

## 🧪 Tests Automatisés

### Option A: Tests E2E avec Cypress

#### Installation (une fois)
```bash
npm install --save-dev cypress @cypress/webpack-dev-server
```

#### Lancer Cypress
```bash
npx cypress open
```

Cypress ouvrira une fenêtre. Choisissez `E2E Testing` puis sélectionnez `signup-login.cy.ts`

#### Tests Inclus
- ✅ Redirection automatique vers `/login`
- ✅ Affichage du formulaire de signup
- ✅ Création de compte Cashier
- ✅ Création de compte Admin
- ✅ Login et redirection correcte
- ✅ Validation des champs (email, password, etc.)

### Option B: Tests en Mode Headless (CI/CD)
```bash
npx cypress run --spec "cypress/e2e/signup-login.cy.ts"
```

---

## 🔍 Tester Manuellement

### Test 1: Signup Form Validation
1. Ouvrez http://localhost:5175/signup
2. Essayez de soumettre sans remplir les champs
   - **Résultat attendu:** Erreurs de validation affichées
3. Entrez un email invalide
   - **Résultat attendu:** "Email invalide"
4. Entrez un password < 6 caractères
   - **Résultat attendu:** "Le mot de passe doit contenir au moins 6 caractères"
5. Entrez des passwords différents
   - **Résultat attendu:** "Les mots de passe ne correspondent pas"

### Test 2: Signup Success - Cashier
1. Ouvrez http://localhost:5175/signup
2. Remplissez:
   - Username: `cashier_test_12345`
   - Email: `cashier_test_12345@test.com`
   - Full Name: `Test Cashier`
   - Password: `TestPass123`
   - Confirm: `TestPass123`
   - Role: `CASHIER`
3. Cliquez "S'inscrire"
4. **Résultat attendu:**
   - Redirection vers `/login`
   - Message de succès (ou formulaire vide)

### Test 3: Login - Cashier
1. Vous êtes sur `/login` (après signup)
2. Remplissez:
   - Username: `cashier_test_12345`
   - Password: `TestPass123`
3. Cliquez "Se connecter"
4. **Résultat attendu:**
   - Redirection vers `/cashier/dashboard`
   - Navbar affiche "Cashier Dashboard"
   - Logo/navigation Cashier visible

### Test 4: Signup Success - Admin
1. Ouvrez http://localhost:5175/signup (nouveau test)
2. Remplissez:
   - Username: `admin_test_12345`
   - Email: `admin_test_12345@test.com`
   - Full Name: `Test Admin`
   - Password: `TestPass123`
   - Confirm: `TestPass123`
   - Role: `ADMIN`
3. Cliquez "S'inscrire"
4. **Résultat attendu:**
   - Redirection vers `/login`

### Test 5: Login - Admin
1. Vous êtes sur `/login`
2. Remplissez:
   - Username: `admin_test_12345`
   - Password: `TestPass123`
3. Cliquez "Se connecter"
4. **Résultat attendu:**
   - Redirection vers `/admin/dashboard`
   - Navbar affiche "Admin Dashboard"
   - Navigation Admin visible (Users, Products, Sales, etc.)

### Test 6: Logout & Redirect
1. Étant logué (Admin ou Cashier)
2. Cliquez sur "Logout" dans la navbar
3. **Résultat attendu:**
   - Retour à `/login`
   - localStorage vidé
   - État du formulaire réinitialisé

---

## 📊 Checklist de Test Complet

### Formulaire de Signup
- [ ] Champs visibles (username, email, fullname, password, password_confirm, role)
- [ ] Validation d'email requise
- [ ] Validation de password (min 6 chars)
- [ ] Passwords doivent correspondre
- [ ] Message d'erreur affiché si validation échoue
- [ ] Sélecteur de rôle fonctionne
- [ ] Rôles affichés: ADMIN, CASHIER

### Soumission Signup
- [ ] Bouton "S'inscrire" activé quand formulaire valide
- [ ] Bouton désactivé pendant la soumission (loading)
- [ ] Redirection vers `/login` après succès
- [ ] Message d'erreur affiché si signup échoue
- [ ] Lien "Déjà un compte? Connexion" présent

### Formulaire de Login
- [ ] Username et password requis
- [ ] Validation de champs
- [ ] Bouton "Se connecter" activé quand valide
- [ ] Lien "Créer un compte" mène à `/signup`

### Soumission Login
- [ ] Redirection correcte basée sur le rôle:
  - [ ] ADMIN → `/admin/dashboard`
  - [ ] CASHIER → `/cashier/dashboard`
- [ ] Tokens stockés dans localStorage
- [ ] Logout efface les tokens
- [ ] Refresh du token fonctionnel

### Navigation Protégée
- [ ] Non-authentifié: redirection vers `/login`
- [ ] ADMIN accès aux routes `/admin/*`
- [ ] CASHIER accès aux routes `/cashier/*`
- [ ] ADMIN accès à Users, Products, Sales, Analytics
- [ ] CASHIER accès à QuickSale, Cart, Payment, History, Stock

---

## 🐛 Troubleshooting

### "Chargement des rôles..." ne disparaît pas
- L'API échoue mais le fallback devrait s'afficher
- Vérifiez la console (F12) pour les erreurs
- Les rôles par défaut (ADMIN, CASHIER) s'affichent après 2-3 secondes

### Signup échoue avec "Erreur lors de l'inscription"
- **Si API 401:** C'est normal en production (API fermée)
- **En mode DEV:** Vérifiez que `VITE_DEV_LOGIN=true` dans `.env.local`

### Login échoue / ne redirige nulle part
- Vérifiez que le username/password correspondent à ce que vous avez créé
- En mode DEV: N'importe quel username/password fonctionne
- Vérifiez les erreurs réseau (F12 → Network)

### "Vous n'êtes pas autorisé" après login
- Vérifiez le rôle assigné lors du signup
- ADMIN devrait accéder à `/admin/*`
- CASHIER devrait accéder à `/cashier/*`

### Logout ne marche pas
- Bouton logout non visible?
- Vérifiez que vous êtes authentifié (navbar devrait afficher votre role)
- Regardez dans NetworkTab (F12) si le logout POST est envoyé

---

## 📝 Notes Important

### Mode DEV
- Activé: `VITE_DEV_LOGIN=true` dans `.env.local`
- **Comportement:** N'importe quel username/password login
- **BUT:** Tester le formulaire et les redirections sans API réelle
- **ATTENTION:** Désactiver avant production!

### API Backend Actuelle
- Nécessite authentification pour tous les endpoints
- `/users/signup/` retourne **401** si non-authentifié
- `/role/all/` retourne **401** si non-authentifié
- Fallback: SignupPage affiche les rôles par défaut (ADMIN, CASHIER)

### Tests en Production
- Supprimer `VITE_DEV_LOGIN=true` du `.env.local`
- Attendre un endpoint public pour signup
- OU obtenir un token admin pour créer les users

---

## 🎯 Résultat Attendu

Après l'implémentation complète et tous les tests réussis:

✅ Utilisateurs peuvent créer un compte  
✅ Utilisateurs peuvent se connecter  
✅ Utilisateurs sont redirigés vers leur dashboard (basé sur le rôle)  
✅ Navigation protégée fonctionne  
✅ Logout efface la session  
✅ Formulaires validés  
✅ Erreurs gérées gracieusement  

---

## 📞 Support

Pour toute question:
1. Vérifiez `SIGNUP_STATUS.md` pour le contexte complet
2. Regardez les erreurs dans la console (F12)
3. Vérifiez les Network requests (F12 → Network)
4. Exécutez les tests Cypress: `npx cypress open`

