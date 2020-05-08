import React, { RefObject, ReactNode } from 'react';

import { DropdownCaret, classnames } from 'react-components';

interface Props {
    buttonRef: RefObject<HTMLElement>;
    children: ReactNode;
    isOpen: boolean;
    caretClassName?: string;
}

const ContactGroupDropdownButton = ({ buttonRef, caretClassName = '', children, isOpen, ...rest }: Props) => {
    return (
        <button type="button" role="button" ref={buttonRef} {...rest}>
            {children}
            <DropdownCaret
                isOpen={isOpen}
                className={classnames(['ml0-25 expand-caret mtauto mbauto', caretClassName])}
            />
        </button>
    );
};

export default ContactGroupDropdownButton;
