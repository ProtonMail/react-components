import React, { Ref } from 'react';
import { c } from 'ttag';
import { Icon } from '../../../components';

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    content?: string;
    className?: string;
    isOpen?: boolean;
    buttonRef?: Ref<HTMLButtonElement>;
    noCaret?: boolean;
}

const ContactsButton = ({
    content = c('Header').t`Contacts`,
    className,
    isOpen,
    buttonRef,
    noCaret,
    ...rest
}: Props) => {
    return (
        <button title={content} type="button" className={className} aria-expanded={isOpen} ref={buttonRef} {...rest}>
            <Icon name="contacts" className="flex-item-noshrink topnav-icon mr0-5 flex-item-centered-vert" />
            <span className="navigation-title topnav-linkText mr0-5">{content}</span>
        </button>
    );
};

export default ContactsButton;
