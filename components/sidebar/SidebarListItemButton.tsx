import React, { useEffect, useRef } from 'react';
import { classnames } from '../../helpers';

export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isFocused: boolean;
    onFocus: () => void;
}

const SidebarListItemButton = ({ children, className, isFocused, onFocus, ...rest }: Props) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isFocused) {
            buttonRef.current?.focus();
            buttonRef.current?.scrollIntoView({ block: 'nearest' });
        }
    }, [isFocused]);

    return (
        <button
            ref={buttonRef}
            onFocus={onFocus}
            className={classnames(['navigation__link w100 alignleft', className])}
            type="button"
            {...rest}
        >
            {children}
        </button>
    );
};

export default SidebarListItemButton;
