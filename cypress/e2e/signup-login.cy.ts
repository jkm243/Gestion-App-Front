/**
 * Test E2E pour le flux d'inscription
 * Vérifie: signup -> login -> redirection vers le dashboard correct
 *
 * Pour lancer:
 *   npx cypress open
 *   ou
 *   npx cypress run
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/// <reference types="cypress" />

describe('Signup et Login Flow', () => {
  const timestamp = Date.now();
  const testUserCashier = {
    username: `cashier_test_${timestamp}`,
    email: `cashier_test_${timestamp}@test.com`,
    password: 'TestPassword123',
    role: 'CASHIER',
  };

  const testUserAdmin = {
    username: `admin_test_${timestamp}`,
    email: `admin_test_${timestamp}@test.com`,
    password: 'TestPassword456',
    role: 'ADMIN',
  };

  beforeEach(() => {
    // Réinitialiser l'état avant chaque test
    cy.clearLocalStorage();
    cy.visit('http://localhost:5175');
  });

  it('Devrait rediriger vers /login automatiquement', () => {
    cy.url().should('include', '/login');
  });

  it('Devrait afficher le lien vers la page de signup', () => {
    cy.visit('http://localhost:5175/login');
    cy.contains('Créer un compte').should('exist');
    cy.contains('Créer un compte').click();
    cy.url().should('include', '/signup');
  });

  describe('Signup Cashier', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5175/signup');
    });

    it('Devrait afficher le formulaire de signup', () => {
      cy.contains('Créer un compte').should('exist');
      cy.get('input[name="username"]').should('exist');
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="fullname"]').should('not.exist'); // Optional field
      cy.get('input[name="password"]').should('exist');
      cy.get('input[name="password_confirm"]').should('exist');
      cy.get('select[name="role_id"]').should('exist');
    });

    it('Devrait créer un compte Cashier avec succès', () => {
      // Remplir le formulaire
      cy.get('input[name="username"]').type(testUserCashier.username);
      cy.get('input[name="email"]').type(testUserCashier.email);
      cy.get('input[name="fullname"]').type('Test Cashier User');
      cy.get('input[name="password"]').type(testUserCashier.password);
      cy.get('input[name="password_confirm"]').type(testUserCashier.password);
      cy.get('select[name="role_id"]').select('CASHIER');

      // Soumettre le formulaire
      cy.get('button[type="submit"]').click();

      // Vérifier la redirection vers /login
      cy.url().should('include', '/login');
      cy.contains('Connexion').should('exist');
    });

    it('Devrait logger le Cashier créé et rediriger vers le dashboard', () => {
      // Login avec les credentials créés
      cy.get('input[name="username"]').type(testUserCashier.username);
      cy.get('input[name="password"]').type(testUserCashier.password);
      cy.get('button[type="submit"]').click();

      // Vérifier la redirection vers le dashboard Cashier
      // Note: le chemin exact dépend de la logique de redirection
      cy.url().should('include', '/cashier');
      cy.contains('Tableau de bord').should('exist');
    });
  });

  describe('Signup Admin', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5175/signup');
    });

    it('Devrait créer un compte Admin avec succès', () => {
      // Remplir le formulaire
      cy.get('input[name="username"]').type(testUserAdmin.username);
      cy.get('input[name="email"]').type(testUserAdmin.email);
      cy.get('input[name="fullname"]').type('Test Admin User');
      cy.get('input[name="password"]').type(testUserAdmin.password);
      cy.get('input[name="password_confirm"]').type(testUserAdmin.password);
      cy.get('select[name="role_id"]').select('ADMIN');

      // Soumettre le formulaire
      cy.get('button[type="submit"]').click();

      // Vérifier la redirection vers /login
      cy.url().should('include', '/login');
    });

    it('Devrait logger l\'Admin créé et rediriger vers le dashboard admin', () => {
      // First create the admin account
      cy.visit('http://localhost:5175/signup');
      cy.get('input[name="username"]').type(testUserAdmin.username);
      cy.get('input[name="email"]').type(testUserAdmin.email);
      cy.get('input[name="fullname"]').type('Test Admin User');
      cy.get('input[name="password"]').type(testUserAdmin.password);
      cy.get('input[name="password_confirm"]').type(testUserAdmin.password);
      cy.get('select[name="role_id"]').select('ADMIN');
      cy.get('button[type="submit"]').click();

      // Then login
      cy.url().should('include', '/login');
      cy.get('input[name="username"]').type(testUserAdmin.username);
      cy.get('input[name="password"]').type(testUserAdmin.password);
      cy.get('button[type="submit"]').click();

      // Vérifier la redirection vers le dashboard Admin
      cy.url().should('include', '/admin');
      cy.contains('Tableau de bord').should('exist');
    });
  });

  describe('Validation du formulaire', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5175/signup');
    });

    it('Devrait afficher une erreur pour email invalide', () => {
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('TestPassword123');
      cy.get('input[name="password_confirm"]').type('TestPassword123');
      cy.get('button[type="submit"]').click();

      // Vérifier l'erreur
      cy.contains('Email invalide').should('exist');
    });

    it('Devrait afficher une erreur pour password trop court', () => {
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="email"]').type('test@test.com');
      cy.get('input[name="password"]').type('123');
      cy.get('input[name="password_confirm"]').type('123');
      cy.get('button[type="submit"]').click();

      // Vérifier l'erreur
      cy.contains('au moins 6 caractères').should('exist');
    });

    it('Devrait afficher une erreur pour passwords différents', () => {
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="email"]').type('test@test.com');
      cy.get('input[name="password"]').type('TestPassword123');
      cy.get('input[name="password_confirm"]').type('DifferentPassword');
      cy.get('button[type="submit"]').click();

      // Vérifier l'erreur
      cy.contains('Les mots de passe ne correspondent pas').should('exist');
    });
  });
});
