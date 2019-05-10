import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import Dropdown from './Dropdown';

describe('Dropdown component', () => {
    const getContent = (container) => container.firstChild.querySelector('.dropDown-content');

    it('should animate children when clicking on button', async () => {
        const { container, getByText } = render(
            <div>
                <Dropdown button={<button>clickOnMe</button>}>Boo</Dropdown>
            </div>
        );
        const buttonNode = getByText('clickOnMe');

        expect(getContent(container)).toContainHTML('<div class="dropDown-content" hidden="">Boo</div>');
        fireEvent.click(buttonNode);
        expect(getContent(container)).toContainHTML('<div class="dropDown-content">Boo</div>');
    });
});
