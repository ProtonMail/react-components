import React from 'react';
import { validateEmailAddress } from 'proton-shared/lib/helpers/string';
import { c } from 'ttag';

import { UNSECURE_DOMAINS } from './constants';
import UnsecureEmailIcon from './UnsecureEmailIcon';

interface Props {
    email: string;
}

const UnsecureEmailInfo = ({ email }: Props) => {
    if (!validateEmailAddress(email)) {
        return null;
    }

    const [, domain = ''] = email
        .trim()
        .toLowerCase()
        .split('@');

    if (UNSECURE_DOMAINS.includes(domain)) {
        return (
            <div className="mb1 flex flex-nowrap flex-items-center">
                <span className="mr1">{c('Title').t`This email may be insecure`}</span>
                <UnsecureEmailIcon email={email} />
            </div>
        );
    }

    return null;
};

export default UnsecureEmailInfo;
