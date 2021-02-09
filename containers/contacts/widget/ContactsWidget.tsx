import { Recipient } from 'proton-shared/lib/interfaces';
import React, { useState } from 'react';
import { usePopperAnchor } from '../../../components';
import { generateUID } from '../../../helpers';
import ContactsButton from './ContactsButton';
import ContactsDropdown from './ContactsDropdown';
import './ContactsWidget.scss';

interface Props {
    className?: string;
    onCompose?: (emails: Recipient[]) => void;
}

const ContactsWidget = ({ className, onCompose }: Props) => {
    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, toggle, close } = usePopperAnchor<HTMLButtonElement>();

    return (
        <>
            <ContactsButton
                className={className}
                aria-describedby={uid}
                buttonRef={anchorRef}
                isOpen={isOpen}
                onClick={toggle}
            />
            <ContactsDropdown uid={uid} isOpen={isOpen} anchorRef={anchorRef} onClose={close} onCompose={onCompose} />
        </>
    );
};

export default ContactsWidget;
