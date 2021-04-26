import React, { useState } from 'react';
import Dropdown from './Dropdown';
import { usePopperAnchor } from '../popper';
import DropdownButton, { DropdownButtonProps } from './DropdownButton';
import { generateUID } from '../../helpers';

interface OwnProps {
    hasCaret?: boolean;
    content?: React.ReactNode;
    children?: React.ReactNode;
    originalPlacement?: string;
    autoClose?: boolean;
    dropdownClassName?: string;
}

export type Props<T extends React.ElementType> = OwnProps & DropdownButtonProps<T>;

const SimpleDropdown = <E extends React.ElementType>({
    content,
    children,
    originalPlacement,
    autoClose,
    hasCaret = true,
    dropdownClassName,
    ...rest
}: Props<E>) => {
    const [uid] = useState(generateUID('dropdown'));

    const { anchorRef, isOpen, toggle, close } = usePopperAnchor<HTMLButtonElement>();

    console.log({ as: rest.as });

    return (
        <>
            <DropdownButton {...rest} ref={anchorRef} isOpen={isOpen} onClick={toggle} hasCaret={hasCaret}>
                {content}
            </DropdownButton>
            <Dropdown
                id={uid}
                originalPlacement={originalPlacement}
                autoClose={autoClose}
                isOpen={isOpen}
                anchorRef={anchorRef}
                onClose={close}
                className={dropdownClassName}
            >
                {children}
            </Dropdown>
        </>
    );
};

export default SimpleDropdown;
