import React from 'react';
import { render } from 'react-testing-library';

import FileInput from './FileInput';

describe('PasswordInput component', () => {
    const value = 'panda';

    it('should render a file input and wrap children', () => {
        const { container } = render(<FileInput>{value}</FileInput>);
        const inputNode = container.querySelector('input');

        expect(inputNode).not.toBe(null);
        expect(inputNode.getAttribute('type')).toBe('file');
        expect(container.textContent).toBe(value);
    });
});
