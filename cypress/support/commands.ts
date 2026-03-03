// cypress/support/commands.ts
// Add custom commands here
// Example custom commands:
// Cypress.Commands.add('login', (email, password) => { ... })

// Clear local storage before each test
beforeEach(() => {
  cy.clearLocalStorage();
});

// Add local storage assertion helper
Cypress.Commands.add('checkLocalStorageToken', (tokenKey: string) => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem(tokenKey);
    expect(token).to.exist;
  });
});

// Declare the custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      checkLocalStorageToken(tokenKey: string): Chainable<void>;
    }
  }
}

export {};
