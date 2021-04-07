import { mount } from '@cypress/react';
import { LoginForm } from '../../containers/login/MinimalLoginContainer';
import React from 'react';
import { EMAIL_PLACEHOLDER } from 'proton-shared/lib/constants';
import LoginFormContainer, { loginElements } from '../containers/LoginFormContainer';

describe('Login form', () => {
    let loginSpy: any;

    beforeEach(() => {
        loginSpy = cy.spy();
        mount(<LoginForm needHelp={<div>Need help</div>} onSubmit={loginSpy()}></LoginForm>);
    });

    it('"This field is required" displayed', () => {
        loginElements.fieldUsername().type('a').clear();
        loginElements.fieldPassword().type('a').clear();
        cy.get('#input-0').should('contain', 'This field is required');
        cy.get('#input-1').should('contain', 'This field is required');
    });

    it('Password revealed', () => {
        loginElements.fieldPassword().type('test-password');
        loginElements.buttonPasswordReveal().click();
        loginElements.fieldPassword().invoke('val').should('contain', 'test-password');
    });

    it("Email placeholder and 'Need help' displayed", () => {
        loginElements.fieldUsername().invoke('attr', 'placeholder').should('contain', EMAIL_PLACEHOLDER);
        cy.contains(EMAIL_PLACEHOLDER);
        cy.contains('Need help');
    });

    it('Test interface', () => {
        cy.on('uncaught:exception', () => false);
        const form = new LoginFormContainer();
        form.login('test', 'test');
    });
});
