import React from 'react';
import { mount } from '@cypress/react';
import Alert from '../../components/alert/Alert';

export const alertElement = () => cy.dataId('alert');

describe('Alert component', () => {
    const text = 'Alert Text';
    const learnMoreText = 'Learn more';
    const learnMoreLink = 'https://protonmail.com/';

    const CLASSES = {
        // import from ./Alert ?
        info: 'mb1 alert-block',
        warning: 'mb1 alert-block--warning',
        error: 'mb1 alert-block--danger',
        success: 'mb1 alert-block--success',
    } as const;

    it('Has default class', () => {
        mount(<Alert learnMore={learnMoreLink}>{text}</Alert>);
        alertElement().should('have.class', 'mb1 alert-block');
    });

    it('Learn more link and text correct', () => {
        mount(<Alert learnMore={learnMoreLink}>{text}</Alert>);
        alertElement()
            .should('contain', text)
            .children('div')
            .contains(learnMoreText)
            .should('have.attr', 'href', learnMoreLink);
    });

    Object.entries(CLASSES).forEach(([t, classes]): any => {
        it(`Has classes for type ${t}`, () => {
            mount(<Alert type={t}>{text}</Alert>);
            alertElement().should('have.class', classes);
        });
    });
});
