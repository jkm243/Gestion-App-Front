/**
 * Test script pour valider inscription et connexion
 * Cashier et Administrateur
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_BASE_URL = 'https://gestion-app-4ls9.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

interface TestResult {
  success: boolean;
  message: string;
  data?: unknown;
}

// helper removed; tests use inline calls instead

async function login(username: string, password: string): Promise<TestResult> {
  try {
    const response = await apiClient.post('/users/login/', {
      username,
      password,
    });
    // support new API structure where tokens live in `token` object
    const { user } = response.data;
    const access = response.data.token?.access || response.data.access;
    const refresh = response.data.token?.refresh || response.data.refresh;
    return {
      success: true,
      message: `✅ Connexion ${username} réussie`,
      data: {
        user,
        access,
        refresh,
      },
    };
  } catch (error: unknown) {
    const err = error as any;
    return {
      success: false,
      message: `❌ Connexion ${username} échouée: ${err.response?.data?.message || err.message}`,
    };
  }
}

async function runTests() {
  console.log('🚀 Début des tests d\'authentification...\n');

  // Hardcoded role IDs (standard setup)
  const CASHIER_ROLE_ID = '2';
  const ADMIN_ROLE_ID = '1';

  // first obtain a valid admin token (super-user) so we can perform signups
  console.log('🔑 Obtention d\'un token super-admin');
  const superAdminCreds = { username: 'admin', password: 'Admin@2025' };
  const superAdminLogin = await login(superAdminCreds.username, superAdminCreds.password);
    if (!superAdminLogin.success || !(superAdminLogin.data as any)?.access) {
    console.error('❌ Impossible de récupérer le token super-admin, les tests suivants seront ignorés');
    return;
  }
  console.log('   ✅ Jeton super-admin récupéré');
    const adminToken = (superAdminLogin.data as any).access;
  const authClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
  });
  // 1. Création Cashier via jeton admin
  console.log('👤 Étape 1: Création d\'un Cashier via token admin');
  const cashierUsername = `cashier_test_${Date.now()}`;
  const cashierEmail = `${cashierUsername}@test.com`;
  const cashierPassword = 'Test1234!';
  try {
    const signResp = await authClient.post('/users/signup/', {
      username: cashierUsername,
      email: cashierEmail,
      fullname: `Test ${cashierUsername}`,
      password1: cashierPassword,
      password2: cashierPassword,
      role: CASHIER_ROLE_ID,
    });
    console.log(`✅ Inscription cashier réussie (status ${signResp.status})`);
  } catch (e: unknown) {
    const err = e as any;
    console.error('❌ Inscription cashier échouée', err.response?.data || err.message);
  }

  console.log();

  // 2. Création Admin via jeton admin
  console.log('👨‍💼 Étape 2: Création d\'un autre Admin via token admin');
  const adminUsername = `admin_test_${Date.now()}`;
  const adminEmail = `${adminUsername}@test.com`;
  const adminPassword = 'Test1234!';
  try {
    const signResp = await authClient.post('/users/signup/', {
      username: adminUsername,
      email: adminEmail,
      fullname: `Test ${adminUsername}`,
      password1: adminPassword,
      password2: adminPassword,
      role: ADMIN_ROLE_ID,
    });
    console.log(`✅ Inscription admin réussie (status ${signResp.status})`);
  } catch (e: unknown) {
    const err = e as any;
    console.error('❌ Inscription admin échouée', err.response?.data || err.message);
  }
  console.log();
  // 3. Vérifier un endpoint protégé avec le token admin
  try {
    const usersResp = await authClient.get('/users/all/?limit=1');
    console.log('   🔐 Admin test endpoint /users/all/ accessible', usersResp.status);
    // Essayer une opération en écriture
    const tempName = `temp_${Date.now()}`;
    const createResp = await authClient.post('/users/signup/', {
      username: tempName,
      email: `${tempName}@example.com`,
      fullname: 'Temp User',
      password1: 'TempPass123!',
      password2: 'TempPass123!',
      role: CASHIER_ROLE_ID,
    });
    console.log('   ➕ Création utilisateur via token OK', createResp.status);
    // nettoyage si possible
    if (createResp.data?.id) {
      await authClient.delete(`/users/${createResp.data.id}/`);
      console.log('   🗑️ Utilisateur temporaire supprimé');
    }
  } catch (e: unknown) {
    const err = e as any;
    console.error('   ❌ Impossible d\'accéder à /users/all/ avec le token admin', err.message);
  }
  console.log();
  console.log('✅ Tests terminés');
}

runTests().catch(console.error);
