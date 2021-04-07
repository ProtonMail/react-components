import React from 'react';
import { mount } from '@cypress/react';
import Searchbox from '../../containers/search/Searchbox';

export const searchElements = {
    searchBox: () => cy.dataId('searchbox'),
    buttonSearchboxSubmit: () => cy.dataId('button-submit-searchbox'),
    buttonSearchboxClear: () => cy.dataId('button-clear-searchbox'),
    fieldSearch: () => cy.dataId('field-searchbox'),
};

describe('Searchbox attributes', () => {
    const placeholderText = 'text';
    const searchboxValue = 'value';
    const delay = 1;

    function callback(name: string): any {
        console.log(`${name} callback`);
    }

    beforeEach(() => {
        mount(
            <Searchbox
                onSearch={callback('search')}
                onChange={callback('change')}
                value={searchboxValue}
                placeholder={placeholderText}
                advanced
                delay={delay}
            ></Searchbox>
        );
    });

    it('Buttons text is set', () => {
        searchElements.buttonSearchboxClear().should('be.visible').should('contain', 'Clear');
        searchElements.buttonSearchboxSubmit().should('be.visible').should('contain', 'Search');
    });

    it('Placeholder visible', () => {
        searchElements.searchBox().contains(`${placeholderText}${placeholderText}`);
    });

    it('Value visible', () => {
        searchElements.fieldSearch().should('be.visible').invoke('val').should('contain', searchboxValue);
    });

    it('Advanced class is set', () => {
        searchElements.searchBox().should('have.class', 'searchbox-container--reset-advanced');
    });
});
