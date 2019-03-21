import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import Dropdown from './Dropdown';

describe('Dropdown component', () => {
    const getContent = (container) => container.firstChild.querySelector('.dropDown-content');

    it('should display children when clicking on button', async () => {
        const { container, getByText } = render(<Dropdown content="clickOnMe">Boo</Dropdown>);

        expect(getContent(container)).toBe(null);
        fireEvent.click(getByText('clickOnMe'));
        expect(getContent(container)).toContainHTML('<div class="dropDown-content">Boo</div>');
    });
});
