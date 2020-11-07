import React, {useRef} from 'react';
import { render } from '@testing-library/react';
import UseFocusTrap from './FocusTrap';
import useFocusTrap from './useFocusTrap';

describe('FocusTrap', () => {
    let initialFocus: HTMLElement;

    beforeEach(() => {
        initialFocus = document.createElement('button');
        document.body.appendChild(initialFocus);
        initialFocus.focus();
    });

    afterEach(() => {
        document.body.removeChild(initialFocus);
    });

    it('should focus the first focusable element', () => {
        const Component = () => {
            const rootRef = useRef<HTMLDivElement>(null);
            const props = useFocusTrap({ rootRef })
            return (
                <div ref={rootRef} {...props}>
                    <input data-testid="auto-focus" />
                </div>
            )
        }
        const { getByTestId } = render(<Component/>);
        expect(getByTestId('auto-focus')).toHaveFocus();
    });

    it('should respect autoFocus in children', () => {
        const { container, getByTestId } = render(
            <UseFocusTrap>
                <input autoFocus data-testid="auto-focus" />
            </UseFocusTrap>
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
                        <UseFocusTrap>
                            <input autoFocus data-testid="input" />
                            <button data-testid="close" onClick={() => setOpen(false)} />
                        </UseFocusTrap>
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
