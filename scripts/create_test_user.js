const https = require('https');

// Configuration
const API_BASE = process.env.VITE_API_BASE_URL || 'https://gestion-app-4ls9.onrender.com/api';
const ROLE_SLUG_ADMIN = 'admin'; // adjust if necessary

async function fetchRoles() {
  return new Promise((resolve, reject) => {
    const url = new URL('/role/all/', API_BASE);
    const opts = {
      method: 'GET',
    };
    const req = https.request(url, opts, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function createUser(payload) {
  return new Promise((resolve, reject) => {
    const url = new URL('/users/signup/', API_BASE);
    const body = JSON.stringify(payload);
    const opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(url, opts, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json });
        } catch (err) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  try {
    console.log('Fetching roles...');
    const roles = await fetchRoles();
    let adminRole = null;
    if (Array.isArray(roles)) {
      adminRole = roles.find(r => r.slug === ROLE_SLUG_ADMIN || r.name?.toLowerCase() === ROLE_SLUG_ADMIN || r?.role === ROLE_SLUG_ADMIN);
    }
    if (!adminRole) {
      console.warn('Admin role not found automatically. Using first role as fallback. Roles returned:', roles);
      adminRole = Array.isArray(roles) && roles.length ? roles[0] : null;
    }

    const payload = {
      username: 'testadmin',
      email: 'testadmin+dev@example.com',
      fullname: 'Test Admin',
      password1: 'TestPass123!',
      password2: 'TestPass123!',
      role: adminRole ? adminRole.id || adminRole.pk || adminRole.uuid || adminRole._id : undefined
    };

    console.log('Creating test user with payload:', payload);
    const result = await createUser(payload);
    console.log('Result status:', result.status);
    console.log('Result body:', JSON.stringify(result.body, null, 2));
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
