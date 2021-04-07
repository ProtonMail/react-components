import { mount } from '@cypress/react';
import React from 'react';
import SelectTwo from '../../components/selectTwo/SelectTwo';
import Option from '../../components/option/Option';

describe('Basic Select', () => {
    beforeEach(() => {
        mount(
            <SelectTwo data-testid="dropdown-button">
                <Option title="one" value="one" />
                <Option title="two" value="two" />
                <Option title="three" value="three" />
            </SelectTwo>
        );
    });

    it('should open on click', () => {
        cy.dataId('dropdown-button').click();
        cy.dataId('select-list').should('exist');
    });

    it(`should open on " " (Space) keydown`, () => {
        cy.dataId('dropdown-button').type(' ');
        cy.contains('one');
        cy.contains('two');
        cy.contains('three');
    });

    it('should focus the first element when opened and no option is selected', () => {
        cy.dataId('dropdown-button').click();
        cy.contains('one').should('be.focused');
    });

    it('should close on "Escape" keydown and give focus back to anchor', () => {
        cy.dataId('dropdown-button').click().type('{esc}');
        cy.contains('one');
        cy.contains('two');
        cy.contains('three');
        cy.dataId('dropdown-button').should('be.focused');
    });

    it(`should focus the next option on {downarrow} keydown`, () => {
        cy.dataId('dropdown-button').click();
        cy.contains('one').click().type('{downarrow}');
        cy.get('.block').contains('two').should('be.focused').type('{downarrow}');
        cy.get('.block').contains('three').should('be.focused');
    });

    it('should focus the element most closely matching typed keyboard input', () => {
        cy.dataId('dropdown-button').click();
        cy.contains('one').click().type('th');
        cy.get('.block').contains('three').should('be.focused');
    });

    it('continues the typed input from the last keystroke if the delay is small enough', () => {
        cy.dataId('dropdown-button').click();
        cy.contains('one').click().type('t');
        cy.get('.block').contains('two').should('be.focused');
        cy.wait(250);
        cy.contains('one').type('h');
        cy.get('.block').contains('three').should('be.focused');
    });
});

describe('Select component attributes', () => {
    let spyOnChange: any;

    beforeEach(() => {
        type V = { label: string; amount: number };

        const getSearchableValue = ({ label }: V) => label;
        spyOnChange = cy.spy();
        mount(
            <SelectTwo
                data-testid="dropdown-button"
                onChange={spyOnChange('spy')}
                placeholder="Placeholder"
                clearSearchAfter={800}
                getSearchableValue={getSearchableValue}
            >
                <Option title="one" value="one" />
                <Option title="two" value="two" />
                <Option title="three" value="three" />
            </SelectTwo>
        );
    });

    it('should select a value on click', () => {
        cy.dataId('dropdown-button').click();
        cy.contains('one')
            .click()
            .then(() => {
                expect(spyOnChange).to.have.been.calledOnceWithExactly('spy');
            });
    });

    it('should render a placeholer if no value is selected', () => {
        cy.get('span').contains('Placeholder').should('be.visible');
    });

    it('should clear the current typed input after a given amount of ms and match the new input after the delay', async () => {
        cy.dataId('dropdown-button').click();
        cy.contains('one').click().type('t');
        cy.get('.block').contains('two').should('be.focused');
        cy.wait(1000);
        cy.contains('one').type('o');
        cy.get('.block').contains('one').should('be.focused');
    });

    it('supports the search feature even with complex values given that "getSearchableValue" is supplied', () => {
        cy.dataId('dropdown-button').click();
        cy.contains('one').click().type('tw');
        cy.get('.block').contains('two').should('be.focused');
    });
});

describe('Selection with selected option', () => {
    beforeEach(() => {
        mount(
            <SelectTwo data-testid="dropdown-button" value="two">
                <Option title="one" value="one" />
                <Option title="two" value="two" />
                <Option title="three" value="three" />
            </SelectTwo>
        );
    });

    it('should focus the selected element when opened and an option is selected', () => {
        cy.dataId('dropdown-button').click();
        cy.get('.block').contains('two').should('be.focused');
    });

    it(`should focus the previous option on "uparrow" keydown`, () => {
        cy.dataId('dropdown-button').click();
        cy.get('.block').contains('two').should('be.focused').type('{uparrow}');
        cy.get('.block').contains('one').should('be.focused');
    });
});
