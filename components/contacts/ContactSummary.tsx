import React, { ReactNode } from 'react';
import { c } from 'ttag';
import { formatImage } from 'proton-shared/lib/helpers/image';
import { getPreferredValue } from 'proton-shared/lib/contacts/properties';
import { formatAdr } from 'proton-shared/lib/contacts/property';
import { ContactProperties } from 'proton-shared/lib/interfaces/contacts';

import ContactImageSummary from './ContactImageSummary';
import './ContactSummary.scss';
import Tooltip from '../tooltip/Tooltip';
import { Button, LinkButton } from '../button';
import Icon from '../icon/Icon';
import { classnames } from '../../helpers';
import useActiveBreakpoint from '../../hooks/useActiveBreakpoint';

interface Props {
    properties: ContactProperties;
    onExport: () => void;
    onDelete: () => void;
    onEdit: (field?: string) => void;
    leftBlockWidth?: string;
    isPreview?: boolean;
    hasError?: boolean;
}

const ContactSummary = ({
    properties,
    onEdit,
    onDelete,
    onExport,
    isPreview,
    leftBlockWidth = 'w30',
    hasError = false,
}: Props) => {
    const { isNarrow } = useActiveBreakpoint();
    const photo = formatImage(getPreferredValue(properties, 'photo') as string);
    const name = getPreferredValue(properties, 'fn') as string;
    const email = getPreferredValue(properties, 'email');
    const tel = getPreferredValue(properties, 'tel');
    const adr = getPreferredValue(properties, 'adr') as string[];

    const summary: { icon: string; component: ReactNode }[] = [
        {
            icon: 'email',
            component: email ? (
                <a href={`mailto:${email}`} title={`${email}`}>
                    {email}
                </a>
            ) : (
                !isPreview && (
                    <LinkButton className="p0" onClick={() => onEdit('email')}>
                        {c('Action').t`Add email`}
                    </LinkButton>
                )
            ),
        },
    ];

    if (!hasError) {
        summary.push(
            {
                icon: 'phone',
                component: tel ? (
                    <a href={`tel:${tel}`}>{tel}</a>
                ) : (
                    !isPreview && (
                        <LinkButton className="p0" onClick={() => onEdit('tel')}>
                            {c('Action').t`Add phone number`}
                        </LinkButton>
                    )
                ),
            },
            {
                icon: 'address',
                component: adr
                    ? formatAdr(adr)
                    : !isPreview && (
                          <LinkButton className="p0" onClick={() => onEdit('adr')}>
                              {c('Action').t`Add address`}
                          </LinkButton>
                      ),
            }
        );
    }

    return (
        <div
            className={classnames([
                'contactsummary-container mt1 mb1',
                !isNarrow && 'flex flex-nowrap flex-align-items-center',
            ])}
        >
            <div
                className={classnames([
                    'text-center contactsummary-photo-container pt0-5 on-mobile-mb0-5 on-mobile-center',
                    leftBlockWidth,
                ])}
            >
                <ContactImageSummary photo={photo} name={name} />
            </div>
            <div className="contactsummary-contact-name-container pl2 on-mobile-pl0 flex-item-fluid">
                <h2
                    className="contactsummary-contact-name on-mobile-text-center mb0 on-mobile-mb1 text-bold text-ellipsis"
                    title={name}
                >
                    {name}
                </h2>
            </div>
            {!isPreview && (
                <div className="contactsummary-action-buttons flex-item-noshrink on-mobile-text-center ">
                    {!hasError && (
                        <Tooltip title={c('Action').t`Export`} className="ml0-5">
                            <Button onClick={onExport} className="button--for-icon inline-flex">
                                <Icon className="mt0-25 mb0-1" name="export" alt={c('Action').t`Export`} />
                            </Button>
                        </Tooltip>
                    )}

                    <Tooltip title={c('Action').t`Delete`} className="ml0-5">
                        <Button onClick={onDelete} className="button--for-icon inline-flex">
                            <Icon className="mt0-25 mb0-1" name="trash" alt={c('Action').t`Delete`} />
                        </Button>
                    </Tooltip>

                    {!hasError && (
                        <Tooltip title={c('Action').t`Edit`} className="ml0-5">
                            <Button onClick={() => onEdit()} className="button--for-icon button--primary inline-flex">
                                <Icon className="mt0-25 mb0-1" name="pen" alt={c('Action').t`Edit`} />
                            </Button>
                        </Tooltip>
                    )}
                </div>
            )}
        </div>
    );
};

export default ContactSummary;
