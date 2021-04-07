export const loginElements = {
    fieldUsername: () => cy.dataId('field-username'),
    fieldPassword: () => cy.dataId('field-password'),
    buttonLogin: () => cy.dataId('button-login'),
    buttonPasswordReveal: () => cy.dataId('button-reveal-password'),
};

class LoginFormContainer {
    login(username: string, password: string) {
        loginElements.fieldUsername().type(username);
        loginElements.fieldPassword().type(password);
        loginElements.buttonLogin().click();
        return this;
    }
}

export default LoginFormContainer;
