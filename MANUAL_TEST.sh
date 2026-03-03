#!/bin/bash
# Test automatisé du flux d'inscription en mode DEV

echo "🚀 Démarrage des tests en mode DEV..."
echo ""

# Vérify VITE_DEV_LOGIN est activé
if grep -q "VITE_DEV_LOGIN=true" .env.local; then
    echo "✅ VITE_DEV_LOGIN=true activé"
else
    echo "❌ VITE_DEV_LOGIN n'est pas activé!"
    exit 1
fi

echo ""
echo "📋 Test 1: Vérifier que le formulaire de signup est accessible"
echo "   URL: http://localhost:5175/signup"
echo "   État: À tester manuellement dans le navigateur"
echo ""

echo "📋 Test 2: Vérifier la redirection après login"
echo "   - Les ADMIN doivent être redirigés vers /admin/dashboard"
echo "   - Les CASHIER doivent être redirigés vers /cashier/dashboard"
echo "   État: À vérifier manuellement"
echo ""

echo "📋 Pour lancer le serveur de développement:"
echo "   npm run dev"
echo ""
echo "   Puis testez manuellement:"
echo "   1. Accédez à http://localhost:5175/signup"
echo "   2. Remplissez le formulaire avec:"
echo "      - Username: test_cashier_$(date +%s)"
echo "      - Email: test$(date +%s)@test.com"
echo "      - Password: Test1234"
echo "      - Role: CASHIER"
echo "   3. Cliquez sur 'S'inscrire'"
echo "   4. Vérifiez la redirection à /login"
echo "   5. Connectez-vous avec les identifiants créés"
echo "   6. Vérifiez la redirection à /cashier/dashboard"
echo ""
