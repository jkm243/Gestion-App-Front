# Auth Test Scenarios

## 1. Login success

1. Ouvrir `/login`
2. Saisir des identifiants valides
3. Vérifier que :
   - l'utilisateur est redirigé vers sa zone (`/admin/dashboard` ou `/cashier`)
   - le store `auth` contient `user`, `isAuthenticated = true`, `authResolved = true`
   - aucun token n'est stocké dans `localStorage`
   - un cookie d'auth front existe si le backend renvoie encore les JWT dans le body

## 2. Refresh after login

1. Se connecter avec un compte valide
2. Recharger la page sur une route protégée
3. Vérifier que :
   - l'utilisateur reste sur la route protégée
   - le loader d'auth s'affiche brièvement pendant le bootstrap
   - les logs affichent `[AUTH_BOOTSTRAP_START]` puis `[AUTH_SESSION_RESTORE_SUCCESS]`

## 3. Expired session

1. Supprimer ou expirer manuellement les cookies d'auth
2. Recharger une route protégée
3. Vérifier que :
   - le bootstrap échoue proprement
   - `isAuthenticated = false`
   - redirection vers `/login`
   - les logs affichent `[AUTH_SESSION_RESTORE_FAILED]`

## 4. Logout

1. Se connecter avec un compte valide
2. Cliquer sur `Déconnexion`
3. Vérifier que :
   - le store `auth` est vidé
   - les cookies fallback front sont supprimés
   - l'utilisateur est redirigé vers `/login`
   - les logs affichent `[AUTH_LOGOUT]`

## 5. Protected routes

1. Accéder à une route admin avec un compte cashier
2. Vérifier la redirection vers `/unauthorized`
3. Accéder à une route protégée sans session
4. Vérifier qu'il n'y a pas de redirection prématurée avant la fin du bootstrap

## 6. Backend cookie mode

Pré-requis backend :
- cookie expirant à 7 jours
- `HttpOnly` si possible
- `SameSite` cohérent avec le domaine frontend/backend
- `Secure` en production
- CORS avec `credentials: true`

Validation :
1. Se connecter
2. Vérifier que le backend émet bien le cookie
3. Recharger la page
4. Confirmer que `GET /users/me/` fonctionne avec `withCredentials: true`
