Cypress.Commands.add('dataId', (value) => cy.get(`[data-testid=${value}]`));
