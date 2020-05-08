import React from 'react';

import { Icon, useUser, classnames } from 'react-components';
import { getPreferredValue } from 'proton-shared/lib/contacts/properties';
import { formatAdr } from 'proton-shared/lib/contacts/property';
import { ContactProperties } from 'proton-shared/lib/interfaces/contacts';

import ContactImageSummary from './ContactImageSummary';
import './ContactSummary.scss';

interface Props {
    properties: ContactProperties;
    leftBlockWidth?: string;
}

const ContactSummary = ({ properties, leftBlockWidth = 'w30' }: Props) => {
    const [user] = useUser();
    const { hasPaidMail } = user;
    const photo = getPreferredValue(properties, 'photo');
    const name = getPreferredValue(properties, 'fn');
    const email = getPreferredValue(properties, 'email');
    const tel = getPreferredValue(properties, 'tel');
    const adr = getPreferredValue(properties, 'adr');
    const org = getPreferredValue(properties, 'org');

    const summary = [
        email && {
            icon: 'email',
            component: (
                <a href={`mailto:${email}`} title={email}>
                    {email}
                </a>
            )
        },
        hasPaidMail && tel && { icon: 'phone', component: <a href={`tel:${tel}`}>{tel}</a> },
        hasPaidMail && adr && { icon: 'address', component: formatAdr(adr) },
        hasPaidMail && org && { icon: 'organization', component: org }
    ].filter(Boolean);

    return (
        <div className="contactsummary-container flex flex-nowrap p1 mb1 border-bottom">
            <div className={classnames(['aligncenter contactsummary-photo-container', leftBlockWidth])}>
                <ContactImageSummary photo={photo} name={name} />
            </div>
            <div className="pl1">
                <h2 className="mb0-5 ellipsis">{name}</h2>
                <ul className="unstyled m0">
                    {summary.map(({ icon, component }) => {
                        return (
                            <li key={icon} className="flex flex-nowrap flex-items-center mb0-5">
                                <Icon name={icon} className="mr0-5" />
                                <span className="ellipsis">{component}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default ContactSummary;
