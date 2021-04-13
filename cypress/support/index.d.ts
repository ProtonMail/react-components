declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to select DOM element by data-testid attribute.
         * @example cy.dataId('alert') will search for an element with attribute data-testid=alert
         */
        dataId(value: string): Chainable<Element>;
    }
}
