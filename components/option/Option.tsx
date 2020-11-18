import React, { useEffect, useRef } from 'react';
import usePrevious from '../../hooks/usePrevious';
import { DropdownMenuButton } from '../dropdown';
import { classnames } from '../../helpers';

export interface Props<V> extends Omit<React.ComponentPropsWithoutRef<'button'>, 'value' | 'onChange' | 'title'> {
    value: V;
    onChange?: (value: V) => void;
    selected?: boolean;
    active?: boolean;
    focusOnActive?: boolean;
    title: string;
}

const Option = <V extends any>({
    type = 'button',
    value,
    selected,
    active,
    focusOnActive = true,
    onChange,
    title,
    children = title,
    ...rest
}: Props<V>) => {
    function handleClick() {
        onChange?.(value);
    }

    const ref = useRef<HTMLButtonElement | null>(null);

    const previousActive = usePrevious(active);

    useEffect(
        function () {
            if (!previousActive && active && focusOnActive) {
                ref.current?.focus();
            }
        },
        [active]
    );

    return (
        <li className="dropDown-item">
            <DropdownMenuButton
                ref={ref}
                type={type}
                isSelected={selected}
                onClick={handleClick}
                title={title}
                className={classnames(['bl w100 ellipsis alignleft no-outline', active && 'active'])}
                {...rest}
            >
                {children}
            </DropdownMenuButton>
        </li>
    );
};

export default Option;
