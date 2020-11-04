import React, { useEffect, useRef } from 'react';
import usePrevious from '../../hooks/usePrevious';
import { DropdownMenuButton } from '../dropdown';

export interface Props extends Omit<React.ComponentPropsWithoutRef<'button'>, 'value' | 'onChange'> {
    value: unknown;
    onChange?: (value: unknown) => void;
    selected?: boolean;
    active?: boolean;
}

const Option = ({ type = 'button', value, selected, active, onChange, ...rest }: Props) => {
    function handleClick() {
        onChange?.(value);
    }

    const ref = useRef<HTMLButtonElement | null>(null);

    const previousActive = usePrevious(active);

    useEffect(
        function () {
            if (!previousActive && active) {
                ref.current?.focus();
            }
        },
        [active]
    );

    return (
        <li className="dropDown-item">
            <DropdownMenuButton
                style={{ display: 'block', width: '100%' }}
                ref={ref}
                type={type}
                isSelected={selected}
                onClick={handleClick}
                className="ellipsis alignleft"
                {...rest}
            />
        </li>
    );
};

export default Option;
