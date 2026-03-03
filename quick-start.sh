#!/usr/bin/env bash
# 🚀 Quick Start - Flux d'Inscription et Connexion

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 Guide Rapide: Signup + Login avec Rôles               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "📋 STEP 1: Vérifier l'environnement"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local manquant!"
    exit 1
fi

if grep -q "VITE_DEV_LOGIN=true" .env.local; then
    echo "✅ Mode DEV activé (VITE_DEV_LOGIN=true)"
else
    echo "⚠️  Mode DEV non activé. Veuillez ajouter:"
    echo "   VITE_DEV_LOGIN=true"
    echo ""
    read -p "Voulez-vous l'activer maintenant? (y/n): " -n 1 -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if grep -q "VITE_DEV_LOGIN=" .env.local; then
            sed -i 's/VITE_DEV_LOGIN=.*/VITE_DEV_LOGIN=true/' .env.local
        else
            echo "VITE_DEV_LOGIN=true" >> .env.local
        fi
        echo "✅ Mode DEV activé!"
    fi
fi
echo ""

echo "📋 STEP 2: Installer les dépendances (si nécessaire)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo "✅ Dépendances installées!"
else
    echo "✅ node_modules existe déjà"
fi
echo ""

echo "📋 STEP 3: Options de Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Choisissez une option:"
echo ""
echo "  1️⃣  Démarrer le serveur DEV (npm run dev)"
echo "  2️⃣  Tests E2E interactifs (npx cypress open)"
echo "  3️⃣  Tests E2E headless (npm run test:e2e:headless)"
echo "  4️⃣  Diagnostic API (npm run test:signup)"
echo "  5️⃣  Afficher la documentation complète"
echo "  0️⃣  Quitter"
echo ""

read -p "Votre choix (0-5): " choice

case $choice in
  1)
    echo ""
    echo "🚀 Démarrage du serveur DEV..."
    echo "   URL: http://localhost:5175"
    echo "   Signup: http://localhost:5175/signup"
    echo "   Login: http://localhost:5175/login"
    echo ""
    npm run dev
    ;;
  2)
    echo ""
    echo "🧪 Lancement de Cypress (E2E interactive)..."
    npx cypress open
    ;;
  3)
    echo ""
    echo "🧪 Lancement des tests E2E (headless)..."
    npm run test:e2e:headless
    ;;
  4)
    echo ""
    echo "🔍 Diagnostic API..."
    npm run test:signup
    ;;
  5)
    echo ""
    echo "📚 Fichiers de documentation disponibles:"
    echo ""
    echo "  1. COMPLETION_REPORT.md   - Résumé complet"
    echo "  2. SIGNUP_STATUS.md       - Analyse détaillée"
    echo "  3. TESTING_GUIDE.md       - Guide de test complet"
    echo "  4. MANUAL_TEST.sh         - Instructions manuelles"
    echo ""
    read -p "Quel fichier voulez-vous lire? (1-4): " doc_choice
    case $doc_choice in
      1) cat COMPLETION_REPORT.md | head -100 ;;
      2) cat SIGNUP_STATUS.md | head -100 ;;
      3) cat TESTING_GUIDE.md | head -100 ;;
      4) cat MANUAL_TEST.sh ;;
      *) echo "Choix invalide" ;;
    esac
    ;;
  0)
    echo "👋 Au revoir!"
    exit 0
    ;;
  *)
    echo "❌ Choix invalide"
    exit 1
    ;;
esac

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Besoin d'aide? Consultez TESTING_GUIDE.md                ║"
echo "╚════════════════════════════════════════════════════════════╝"
