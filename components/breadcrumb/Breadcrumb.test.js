import React from 'react';
import { render } from 'react-testing-library';

import Breadcrumb from './Breadcrumb';

describe('Breadcrumb component', () => {
    const steps = ['todo', 'doing', 'done'];
    const mockOnClick = jest.fn();
    const currentStep = 1;
    const { container } = render(<Breadcrumb list={steps} current={currentStep} onClick={mockOnClick} />);
    const buttons = [].slice.call(container.querySelectorAll('button'));

    it('should render all steps', () => {
        expect(buttons.length).toBe(steps.length);
    });

    it('should mark the second step as active', () => {
        expect(buttons[currentStep].getAttribute('aria-current')).toBe('step');
        expect(buttons[currentStep]).toHaveAttribute('disabled');
    });
});
