#!/bin/bash
# 🚀 Quick Commands - Flux d'Inscription & Connexion

# =============================================================
# DÉMARRAGE
# =============================================================

# Lancer le serveur de développement
npm run dev
# → http://localhost:5175/signup

# =============================================================
# TESTS
# =============================================================

# Tests E2E interactif (UI Cypress)
npx cypress open

# Tests E2E headless (pour CI/CD)
npm run test:e2e:headless

# Diagnostic API
npm run test:signup

# Check mode DEV
npm run test:dev-mode

# Test authentification
npm run test:auth

# =============================================================
# DOCUMENTATION
# =============================================================

# Lire le guide rapide
cat SIGNUP_README.md

# Lire le guide de test complet
cat TESTING_GUIDE.md

# Lire l'analyse technique
cat SIGNUP_STATUS.md

# Lire le résumé de complétude
cat COMPLETION_REPORT.md

# Lire l'index de documentation
cat DOCUMENTATION_INDEX.md

# =============================================================
# CONFIGURATION
# =============================================================

# Vérifier le mode DEV
grep VITE_DEV_LOGIN .env.local

# Activer mode DEV
sed -i 's/VITE_DEV_LOGIN=.*/VITE_DEV_LOGIN=true/' .env.local

# Désactiver mode DEV (production)
sed -i 's/VITE_DEV_LOGIN=.*/VITE_DEV_LOGIN=false/' .env.local

# =============================================================
# MAINTENANCE
# =============================================================

# Nettoyer Cypress cache
rm -rf cypress/screenshots cypress/videos

# Réinstaller dépendances
rm -rf node_modules && npm install

# Rebuild Vite
npm run build

# =============================================================
# TROUBLESHOOTING
# =============================================================

# Vérifier que le serveur est accessible
curl -I http://localhost:5175

# Tester endpoint API (va retourner 401)
curl -X GET https://gestion-app-4ls9.onrender.com/api/role/all/

# Vérifier variables d'env
cat .env.local

# =============================================================
# SCRIPTS DISPONIBLES
# =============================================================

# Voir tous les scripts disponibles
cat package.json | grep -A 10 '"scripts"'

# =============================================================
# AIDE
# =============================================================

# Menu interactif
bash quick-start.sh

# Voir ce fichier
cat QUICK_COMMANDS.md

# =============================================================
# NOTES
# =============================================================

# Mode DEV = Signup fonctionne sans API réelle
# Parfait pour tester la logique du formulaire

# API réelle = Fermée (401) - en attente config backend
# Ne désactiver VITE_DEV_LOGIN que si API configurée

# Cypress = Tests automatisés E2E
# Valide formulaire, validation, redirections

# =============================================================
