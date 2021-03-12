import React, { useState } from 'react';
import { c } from 'ttag';
import { Recipient } from 'proton-shared/lib/interfaces';
import { Dropdown, Icon, Tabs, usePopperAnchor } from '../../../components';
import { generateUID } from '../../../helpers';
import ContactsWidgetContainer from './ContactsWidgetContainer';
import ContactsWidgetGroupsContainer from './ContactsWidgetGroupsContainer';
import './ContactsWidget.scss';

interface Props {
    className?: string;
    onCompose?: (emails: Recipient[], attachments: File[]) => void;
}

const ContactsWidget = ({ className, onCompose }: Props) => {
    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, toggle, close } = usePopperAnchor<HTMLButtonElement>();
    const [tabIndex, setTabIndex] = useState(0);
    const title = c('Header').t`Contacts`;

    return (
        <>
            <button
                title={title}
                type="button"
                className={className}
                aria-expanded={isOpen}
                ref={anchorRef}
                onClick={toggle}
            >
                <Icon name="contacts" className="flex-item-noshrink topnav-icon mr0-5 flex-item-centered-vert" />
                <span className="navigation-title topnav-linkText mr0-5">{title}</span>
            </button>
            <Dropdown
                id={uid}
                isOpen={isOpen}
                anchorRef={anchorRef}
                onClose={close}
                autoClose={false}
                originalPlacement="bottom"
                className="contacts-widget"
                noMaxWidth
                noMaxHeight
            >
                <Tabs
                    tabs={[
                        {
                            title: c('Title').t`Contacts`,
                            content: <ContactsWidgetContainer onClose={close} onCompose={onCompose} />,
                        },
                        {
                            title: c('Title').t`Groups`,
                            content: <ContactsWidgetGroupsContainer onClose={close} onCompose={onCompose} />,
                        },
                    ]}
                    value={tabIndex}
                    onChange={setTabIndex}
                />
            </Dropdown>
        </>
    );
};

export default ContactsWidget;
