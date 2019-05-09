import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import Dropdown from './Dropdown';

describe('Dropdown component', () => {
    const getContent = (container) => container.firstChild.querySelector('.dropDown-content');

    it('should display children when clicking on button', async () => {
        const { container, getByText } = render(
            <div>
                <Dropdown content="clickOnMe">Boo</Dropdown>
            </div>
        );
        const buttonNode = getByText('clickOnMe');

        expect(getContent(container)).toBe(null);
        fireEvent.click(buttonNode);
        expect(getContent(container)).toContainHTML('<div class="dropDown-content">Boo</div>');
    });

    it('should have appropriate default class', async () => {
        const { container, getByText } = render(<Dropdown content="clickOnMe">Boo</Dropdown>);
        const buttonNode = getByText('clickOnMe');

        expect(container.querySelector('div')).toHaveClass('dropDown inbl');
        fireEvent.click(buttonNode);
        expect(container.firstChild.querySelector('div')).toHaveClass('dropDown-content');
    });
});
