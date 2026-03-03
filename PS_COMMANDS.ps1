# 🚀 PowerShell Commands - Flux d'Inscription & Connexion

# Windows PowerShell/PowerShell Core aliases pour tester rapidement

# =============================================================
# DÉMARRAGE RAPIDE
# =============================================================

# Alias: Lancer le serveur dev
function dev { npm run dev }

# Alias: Ouvrir Cypress
function test { npx cypress open }

# Alias: Lancer tests headless
function test-headless { npm run test:e2e:headless }

# =============================================================
# TESTS
# =============================================================

# Test du flux signup/login avec API
function test-api { npm run test:signup }

# Test du mode DEV
function test-dev { npm run test:dev-mode }

# Test d'authentification
function test-auth { npm run test:auth }

# =============================================================
# DOCUMENTATION
# =============================================================

# Lire le guide rapide
function docs-start { Write-Host "📖 Opening START_HERE.md..." ; Get-Content START_HERE.md | Out-Host -Paging }

# Lire le guide de test
function docs-test { Write-Host "📖 Opening TESTING_GUIDE.md..." ; Get-Content TESTING_GUIDE.md | Out-Host -Paging }

# Lire l'analyse technique
function docs-status { Write-Host "📖 Opening SIGNUP_STATUS.md..." ; Get-Content SIGNUP_STATUS.md | Out-Host -Paging }

# Lire le résumé
function docs-summary { Write-Host "📖 Opening COMPLETION_REPORT.md..." ; Get-Content COMPLETION_REPORT.md | Out-Host -Paging }

# Liste tous les docs
function docs-all {
    Write-Host "📚 Documentation disponible:" -ForegroundColor Green
    Write-Host ""
    Get-ChildItem -Filter "*.md" -File | Where-Object { $_.Name -like "*.md" } | ForEach-Object {
        Write-Host "   📄 $($_.Name)"
    }
}

# =============================================================
# CONFIGURATION & VÉRIFICATION
# =============================================================

# Vérifier le mode DEV
function check-dev-mode {
    Write-Host "🔍 Vérification mode DEV..." -ForegroundColor Cyan
    $content = Get-Content .env.local
    if ($content -like "*VITE_DEV_LOGIN=true*") {
        Write-Host "✅ Mode DEV activé" -ForegroundColor Green
    } else {
        Write-Host "❌ Mode DEV non activé" -ForegroundColor Red
        Write-Host "   Ajoutez à .env.local: VITE_DEV_LOGIN=true" -ForegroundColor Yellow
    }
}

# Activer le mode DEV
function enable-dev-mode {
    Write-Host "⚙️ Activation mode DEV..." -ForegroundColor Cyan
    $content = Get-Content .env.local
    if ($content -like "*VITE_DEV_LOGIN=*") {
        $content = $content -replace "VITE_DEV_LOGIN=.*", "VITE_DEV_LOGIN=true"
    } else {
        $content += "`nVITE_DEV_LOGIN=true"
    }
    Set-Content .env.local $content
    Write-Host "✅ Mode DEV activé!" -ForegroundColor Green
}

# Désactiver le mode DEV (production)
function disable-dev-mode {
    Write-Host "⚙️ Désactivation mode DEV (production)..." -ForegroundColor Cyan
    $content = Get-Content .env.local
    $content = $content -replace "VITE_DEV_LOGIN=.*", "VITE_DEV_LOGIN=false"
    Set-Content .env.local $content
    Write-Host "✅ Mode DEV désactivé (production mode)" -ForegroundColor Green
}

# Vérifier les dépendances
function check-deps {
    Write-Host "🔍 Vérification des dépendances..." -ForegroundColor Cyan
    if (Test-Path "node_modules") {
        Write-Host "✅ node_modules existe" -ForegroundColor Green
    } else {
        Write-Host "❌ node_modules manquant" -ForegroundColor Red
        Write-Host "   Lancez: npm install" -ForegroundColor Yellow
    }
}

# Installer les dépendances
function install-deps {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Cyan
    npm install
    Write-Host "✅ Dépendances installées!" -ForegroundColor Green
}

# =============================================================
# TESTS & DIAGNOSTICS
# =============================================================

# Vérifier l'accès au serveur local
function check-server {
    Write-Host "🔍 Vérification du serveur..." -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5175" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Serveur accessible sur http://localhost:5175" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ Serveur non accessible" -ForegroundColor Red
        Write-Host "   Lancez: npm run dev" -ForegroundColor Yellow
    }
}

# Tester l'API signup (diagnostic)
function check-api {
    Write-Host "🔍 Vérification API..." -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest `
            -Uri "https://gestion-app-4ls9.onrender.com/api/role/all/" `
            -TimeoutSec 5 `
            -ErrorAction SilentlyContinue
        Write-Host "✅ API accessible" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ API inaccessible ou sécurisée (401)" -ForegroundColor Yellow
        Write-Host "   C'est normal! Utilisez mode DEV (VITE_DEV_LOGIN=true)" -ForegroundColor Gray
    }
}

# =============================================================
# NETTOYAGE
# =============================================================

# Nettoyer les fichiers de cache Cypress
function clean-cypress-cache {
    Write-Host "🧹 Nettoyage cache Cypress..." -ForegroundColor Cyan
    Remove-Item -Path "cypress/screenshots" -Recurse -ErrorAction SilentlyContinue
    Remove-Item -Path "cypress/videos" -Recurse -ErrorAction SilentlyContinue
    Write-Host "✅ Cache nettoyé!" -ForegroundColor Green
}

# Réinstaller les dépendances (clean)
function clean-install {
    Write-Host "🧹 Nettoyage complet..." -ForegroundColor Cyan
    Remove-Item -Path "node_modules" -Recurse -ErrorAction SilentlyContinue
    Remove-Item -Path ".next" -Recurse -ErrorAction SilentlyContinue
    Remove-Item -Path "dist" -Recurse -ErrorAction SilentlyContinue
    Write-Host "✅ Nettoyé! Lancez: npm install" -ForegroundColor Green
}

# =============================================================
# MENU INTERACTIF
# =============================================================

function menu {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  🚀 Menu - Flux d'Inscription & Connexion                 ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "DÉMARRAGE:" -ForegroundColor Green
    Write-Host "  1. dev               - Lancer npm run dev"
    Write-Host "  2. test              - Lancer Cypress (interactif)"
    Write-Host "  3. test-headless     - Lancer tests E2E (headless)"
    Write-Host ""
    Write-Host "TESTS:" -ForegroundColor Green
    Write-Host "  4. test-api          - Tester API signup/login"
    Write-Host "  5. test-dev          - Vérifier mode DEV"
    Write-Host "  6. check-api         - Diagnostiquer l'API"
    Write-Host ""
    Write-Host "DOCUMENTATION:" -ForegroundColor Green
    Write-Host "  7. docs-start        - Lire START_HERE.md"
    Write-Host "  8. docs-test         - Lire TESTING_GUIDE.md"
    Write-Host "  9. docs-all          - Lister tous les docs"
    Write-Host ""
    Write-Host "CONFIGURATION:" -ForegroundColor Green
    Write-Host "  10. check-dev-mode   - Vérifier mode DEV"
    Write-Host "  11. enable-dev-mode  - Activer mode DEV"
    Write-Host "  12. disable-dev-mode - Désactiver mode DEV"
    Write-Host ""
    Write-Host "NETTOYAGE:" -ForegroundColor Green
    Write-Host "  13. clean-cypress-cache - Nettoyer cache Cypress"
    Write-Host "  14. clean-install    - Réinstaller dépendances"
    Write-Host ""
    Write-Host "  0. Quitter" -ForegroundColor Red
    Write-Host ""
}

# =============================================================
# PROFIL POWERSHELL
# =============================================================

# Pour ajouter à votre profile PowerShell:
# 
# 1. Créer/ouvrir le profile:
#    code $PROFILE
#
# 2. Copier le contenu de ce fichier
#
# 3. Sauvegarder et relancer PowerShell
#
# Ensuite: tapez "dev" ou "test" pour lancer les commandes!

# =============================================================
# AIDE RAPIDE
# =============================================================

function help-signup {
    Write-Host ""
    Write-Host "🆘 AIDE - Flux d'Inscription" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Pour démarrer:"
    Write-Host "  1️⃣  dev                  - Lance le serveur"
    Write-Host "  2️⃣  Open http://localhost:5175/signup dans le navigateur"
    Write-Host "  3️⃣  Testez le formulaire"
    Write-Host ""
    Write-Host "Pour les tests:"
    Write-Host "  test                   - Lance Cypress"
    Write-Host "  test-headless          - Tests E2E automatisés"
    Write-Host ""
    Write-Host "Pour la documentation:"
    Write-Host "  docs-start             - Lire le guide rapide"
    Write-Host "  docs-test              - Lire le guide de test"
    Write-Host "  docs-all               - Lister tous les docs"
    Write-Host ""
    Write-Host "Pour la configuration:"
    Write-Host "  check-dev-mode         - Vérifier le mode DEV"
    Write-Host "  enable-dev-mode        - Activer le mode DEV"
    Write-Host ""
    Write-Host "Plus d'info: Consultez START_HERE.md" -ForegroundColor Green
    Write-Host ""
}

# Afficher l'aide au démarrage
Write-Host ""
Write-Host "✅ Flux d'Inscription - PowerShell Functions Chargées!" -ForegroundColor Green
Write-Host ""
Write-Host "Tapez 'menu' pour voir les options disponibles" -ForegroundColor Yellow
Write-Host "Tapez 'help-signup' pour l'aide rapide" -ForegroundColor Yellow
Write-Host ""

# =============================================================
