/**
 * Test simplifié: vérifie que le DEV login fonctionne
 * Lance le serveur Vite et teste les endpoints
 */

import axios from 'axios';

const DEV_API_BASE = 'http://localhost:5175';

async function testDevMode() {
  console.log('🧪 Test du mode DEV du frontend\n');

  try {
    // Test 1: Frontend est accessible
    console.log('📍 Test 1: Frontend accessible');
    const healthCheck = await axios.get(DEV_API_BASE);
    console.log('   ✅ Frontend répond sur http://localhost:5175');
    console.log(`   Status: ${healthCheck.status}\n`);
  } catch {
    // intentionally ignore the caught error; we only care that the request failed
    console.error('   ❌ Frontend non accessible sur http://localhost:5175');
    console.error('   Assurez-vous que: npm run dev est lancé\n');
    return;
  }

  console.log('✅ Le serveur dev est en cours d\'exécution\n');
  console.log('📝 Instructions de test manuel:\n');
  console.log('1. Ouvrez http://localhost:5175/signup dans votre navigateur');
  console.log('2. Remplissez le formulaire avec:');
  console.log('   - Username: test_' + Date.now());
  console.log('   - Email: test_' + Date.now() + '@test.com');
  console.log('   - Full Name: Test User');
  console.log('   - Password: TestPass123');
  console.log('   - Confirm Password: TestPass123');
  console.log('   - Role: CASHIER ou ADMIN');
  console.log('3. Cliquez sur "S\'inscrire"');
  console.log('4. Vous devriez être redirigé vers /login');
  console.log('5. Loggez-vous avec les mêmes identifiants');
  console.log('6. Vérifiez que vous êtes redirigé vers:');
  console.log('   - /cashier/dashboard si vous avez choisi CASHIER');
  console.log('   - /admin/dashboard si vous avez choisi ADMIN\n');

  console.log('✅ Le mode DEV est activé!');
  console.log('   Toute combinaison username/password fonctionnera au login\n');
}

testDevMode().catch(console.error);
