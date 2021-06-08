import React, { useEffect, useRef } from 'react';
import usePrevious from '../../hooks/usePrevious';
import { DropdownMenuButton } from '../dropdown';
import { classnames } from '../../helpers';

export interface Props<V> extends Omit<React.ComponentPropsWithoutRef<'button'>, 'value' | 'onChange' | 'title'> {
    value: V;
    onChange?: (value: V) => void;
    selected?: boolean;
    active?: boolean;
    title: string;
    focusOnActive?: boolean;
    searchStrings?: string[];
}

const Option = <V,>({
    type = 'button',
    value,
    selected,
    active,
    onChange,
    title,
    children = title,
    focusOnActive = true,
    searchStrings,
    ...rest
}: Props<V>) => {
    const ref = useRef<HTMLButtonElement | null>(null);
    const previousActive = usePrevious(active);

    useEffect(() => {
        if (!previousActive && active) {
            if (focusOnActive) {
                ref.current?.focus();
            } else {
                ref.current?.scrollIntoView({ block: 'center' });
            }
        }
    }, [active]);

    const handleClick = () => {
        onChange?.(value);
    };

    return (
        <li className="dropdown-item">
            <DropdownMenuButton
                ref={ref}
                type={type}
                isSelected={selected}
                onClick={handleClick}
                title={title}
                className={classnames(['block w100 text-ellipsis text-left no-outline', active && 'active'])}
                {...rest}
            >
                {children}
            </DropdownMenuButton>
        </li>
    );
};

export default Option;
