import React from 'react';
import { render } from '@testing-library/react';
import FocusTrap from './FocusTrap';

describe('FocusTrap', () => {
    let initialFocus: HTMLElement;

    beforeEach(() => {
        initialFocus = document.createElement('button');
        initialFocus.tabIndex = 0;
        document.body.appendChild(initialFocus);
        initialFocus.focus();
    });

    afterEach(() => {
        document.body.removeChild(initialFocus);
    });

    it('should focus the wrapper root', () => {
        const { container } = render(
            <FocusTrap>
                <input data-testid="auto-focus" />
            </FocusTrap>
        );
        expect(container.querySelector('[data-test=sentinelRoot]')).toHaveFocus();
    });

    it('should respect autoFocus in children', () => {
        const { container, getByTestId } = render(
            <FocusTrap>
                <input autoFocus data-testid="auto-focus" />
            </FocusTrap>
        );
        expect(getByTestId('auto-focus')).toHaveFocus();
        initialFocus.focus();
        expect(container.querySelector('[data-test=sentinelRoot]')).toHaveFocus();
    });

    it('should restore focus', () => {
        const Test = () => {
            const [open, setOpen] = React.useState(false);
            return (
                <div>
                    <button data-testid="button" onClick={() => setOpen(true)} />
                    {open && (
                        <FocusTrap>
                            <input autoFocus data-testid="input" />
                            <button data-testid="close" onClick={() => setOpen(false)} />
                        </FocusTrap>
                    )}
                </div>
            );
        };
        const { getByTestId } = render(<Test />);
        const initialButton = getByTestId('button');
        initialButton.focus();
        initialButton.click();
        expect(getByTestId('input')).toHaveFocus();
        getByTestId('close').click();
        expect(initialButton).toHaveFocus();
    });
});
