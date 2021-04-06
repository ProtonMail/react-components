import React from 'react';

import { classnames, opaqueClassName } from '../../../helpers';

interface Props {
    emails: string[];
    contactID: string;
    highlightedID: string;
    greyedOut: boolean;
}

const EmailsTableCell = ({ contactID, emails = [], highlightedID, greyedOut }: Props) => {
    return (
        <div
            className={classnames([
                'flex',
                'flex-align-items-center',
                'max-w100',
                opaqueClassName(greyedOut),
                contactID === highlightedID && 'text-bold',
            ])}
        >
            <span className="inline-block text-ellipsis">{emails.map((email) => `<${email}>`).join(', ')}</span>
        </div>
    );
};

export default EmailsTableCell;
