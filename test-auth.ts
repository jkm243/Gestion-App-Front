/**
 * Test script pour valider inscription et connexion
 * Cashier et Administrateur
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
}

async function signup(
  username: string,
  email: string,
  password: string,
  roleId: string
): Promise<TestResult> {
  try {
    const response = await apiClient.post('/users/signup/', {
      username,
      email,
      fullname: `Test ${username}`,
      password1: password,
      password2: password,
      role: roleId,
    });
    return {
      success: true,
      message: `✅ Inscription ${username} réussie`,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `❌ Inscription ${username} échouée: ${error.response?.data?.message || error.message}`,
      data: error.response?.data,
    };
  }
}

async function login(username: string, password: string): Promise<TestResult> {
  try {
    const response = await apiClient.post('/users/login/', {
      username,
      password,
    });
    return {
      success: true,
      message: `✅ Connexion ${username} réussie`,
      data: {
        user: response.data.user,
        access: response.data.access,
        refresh: response.data.refresh,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: `❌ Connexion ${username} échouée: ${error.response?.data?.message || error.message}`,
    };
  }
}

async function runTests() {
  console.log('🚀 Début des tests d\'authentification...\n');

  // Hardcoded role IDs (standard setup)
  const CASHIER_ROLE_ID = '2';
  const ADMIN_ROLE_ID = '1';

  // 1. Test Cashier
  console.log('👤 Étape 1: Test Cashier (Role ID: ' + CASHIER_ROLE_ID + ')');
  const cashierUsername = `cashier_test_${Date.now()}`;
  const cashierEmail = `${cashierUsername}@test.com`;
  const cashierPassword = 'Test1234!';

  const cashierSignup = await signup(
    cashierUsername,
    cashierEmail,
    cashierPassword,
    CASHIER_ROLE_ID
  );
  console.log(cashierSignup.message);
  if (cashierSignup.success) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const cashierLogin = await login(cashierUsername, cashierPassword);
    console.log(cashierLogin.message);
    if (cashierLogin.success) {
      console.log(`   ✅ Rôle: ${cashierLogin.data?.user?.role?.name}`);
      console.log(`   ✅ JWT Access Token: ${cashierLogin.data?.access?.substring(0, 20)}...`);
    }
  }
  console.log();

  // 2. Test Admin
  console.log('👨‍💼 Étape 2: Test Administrateur (Role ID: ' + ADMIN_ROLE_ID + ')');
  const adminUsername = `admin_test_${Date.now()}`;
  const adminEmail = `${adminUsername}@test.com`;
  const adminPassword = 'Test1234!';

  const adminSignup = await signup(
    adminUsername,
    adminEmail,
    adminPassword,
    ADMIN_ROLE_ID
  );
  console.log(adminSignup.message);
  if (adminSignup.success) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const adminLogin = await login(adminUsername, adminPassword);
    console.log(adminLogin.message);
    if (adminLogin.success) {
      console.log(`   ✅ Rôle: ${adminLogin.data?.user?.role?.name}`);
      console.log(`   ✅ JWT Access Token: ${adminLogin.data?.access?.substring(0, 20)}...`);
    }
  }
  console.log();
  console.log('✅ Tests terminés');
}

runTests().catch(console.error);
