import React from 'react';
import { c } from 'ttag';
import { Alert, useConfig } from 'react-components';
import { CLIENT_TYPES } from 'proton-shared/lib/constants';

const { VPN } = CLIENT_TYPES;

const Cash = () => {
    const { CLIENT_TYPE } = useConfig();
    const email = <b>{CLIENT_TYPE === VPN ? 'contact@protonvpn.com' : 'contact@protonmail.com'}</b>;

    return (
        <Alert>{c('Info for cash payment method')
            .jt`To pay via Cash, please email us at ${email} for instructions.`}</Alert>
    );
};

export default Cash;
