/**
 * Test pour vérifier le flux d'inscription (frontend + API)
 * Lance le serveur dev et teste manuellement le signup
 */

import axios from 'axios';

const API_BASE_URL = 'https://gestion-app-4ls9.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

/**
 * Test 1: Try signup WITHOUT authentication
 * Expected: May fail if API requires auth
 */
async function testSignupWithoutAuth(): Promise<TestResult> {
  console.log('\n📋 Test 1: Signup SANS authentification');
  try {
    const testUsername = `public_user_${Date.now()}`;
    const response = await apiClient.post('/users/signup/', {
      username: testUsername,
      email: `${testUsername}@test.com`,
      fullname: 'Public Test User',
      password1: 'TestPassword123',
      password2: 'TestPassword123',
      role: '2', // CASHIER
    });
    return {
      success: true,
      message: `✅ Signup public RÉUSSI pour ${testUsername}`,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `❌ Signup public ÉCHOUÉ`,
      error: {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      },
    };
  }
}

/**
 * Test 2: Get all roles WITHOUT authentication
 */
async function testGetRolesWithoutAuth(): Promise<TestResult> {
  console.log('\n📋 Test 2: Fetch roles SANS authentification');
  try {
    const response = await apiClient.get('/role/all/');
    return {
      success: true,
      message: `✅ Roles récupérés (${response.data?.length || 0} rôles)`,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `❌ Impossible de récupérer les rôles`,
      error: {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      },
    };
  }
}

/**
 * Test 3: Login with test credentials
 */
async function testLogin(username: string, password: string): Promise<TestResult> {
  console.log(`\n📋 Test 3: Login pour ${username}`);
  try {
    const response = await apiClient.post('/users/login/', {
      username,
      password,
    });
      // support token wrapped under `token` object
      const access = response.data.token?.access || response.data.access;
      const refresh = response.data.token?.refresh || response.data.refresh;
      return {
        success: true,
        message: `✅ Login RÉUSSI pour ${username}`,
        data: { ...response.data, access, refresh },
      };
  } catch (error: any) {
    return {
      success: false,
      message: `❌ Login ÉCHOUÉ pour ${username}`,
      error: {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      },
    };
  }
}

/**
 * Test 4: Check what endpoints are truly public
 * Try common public endpoints
 */
async function testPublicEndpoints(): Promise<TestResult> {
  console.log('\n📋 Test 4: Vérifier les endpoints publics');
  const endpoints = [
    '/health/',
    '/status/',
    '/api-docs/',
    '/swagger/',
  ];

  const results: Record<string, any> = {};
  for (const endpoint of endpoints) {
    try {
      const response = await apiClient.get(endpoint);
      results[endpoint] = { status: response.status, accessible: true };
    } catch (error: any) {
      results[endpoint] = { status: error.response?.status, accessible: false };
    }
  }

  return {
    success: true,
    message: `Endpoints testés`,
    data: results,
  };
}

async function runTests() {
  console.log('🚀 Début des tests de flux d\'inscription...\n');
  console.log('========================================');

  // Test endpoints
  const test1 = await testGetRolesWithoutAuth();
  console.log(test1.message);
  if (test1.error) {
    console.log(`   Status: ${test1.error.status}`);
    console.log(`   Erreur: ${test1.error.message}`);
  } else if (test1.data) {
    console.log(`   Rôles:`, test1.data);
  }

  const test2 = await testSignupWithoutAuth();
  console.log(test2.message);
  if (test2.error) {
    console.log(`   Status: ${test2.error.status}`);
    console.log(`   Erreur: ${test2.error.message}`);
  }

  // Try to login with a known admin account (if exists)
  const test3 = await testLogin('admin', 'admin123');
  console.log(test3.message);
  if (test3.error) {
    console.log(`   Status: ${test3.error.status}`);
    console.log(`   Erreur: ${test3.error.message}`);
  } else if (test3.data) {
    console.log(`   User:`, test3.data.user);
    console.log(`   Access Token: ${test3.data.access_token}`);
      // verify admin token works against protected endpoint
      if (test3.data.access) {
        try {
          const adminClient = axios.create({
            baseURL: API_BASE_URL,
            headers: { Authorization: `Bearer ${test3.data.access}` },
          });
          const res = await adminClient.get('/users/all/?limit=1');
          console.log('   🔑 admin token valide, /users/all/ status', res.status);
        } catch (e: any) {
          console.error('   ❌ échec test admin endpoint', e.message);
        }
      }
  }

  const test4 = await testPublicEndpoints();
  console.log(test4.message);
  if (test4.data) {
    console.log(`   Résultats:`, test4.data);
  }

  console.log('\n========================================');
  console.log('✅ Tests terminés\n');
  console.log('📌 RÉSUMÉ:');
  console.log('   - Si /role/all/ retourne 401: L\'API est fermée pour les non-authentifiés');
  console.log('   - Si /users/signup/ retourne 401: Les signups nécessitent un token d\'administrateur');
  console.log('   - Solution: Utiliser le mode DEV du frontend (VITE_DEV_LOGIN=true)');
  console.log('   - OU: Utiliser un endpoint /register/ qui est public');
}

runTests().catch(console.error);
