import React, { useEffect, useRef } from 'react';
import usePrevious from '../../hooks/usePrevious';
import { DropdownMenuButton } from '../dropdown';

export interface Props<V> extends Omit<React.ComponentPropsWithoutRef<'button'>, 'value' | 'onChange'> {
    value: V;
    onChange?: (value: V) => void;
    selected?: boolean;
    active?: boolean;
}

const Option = <V extends any>({ type = 'button', value, selected, active, onChange, ...rest }: Props<V>) => {
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
                className="ellipsis alignleft no-outline"
                {...rest}
            />
        </li>
    );
};

export default Option;
