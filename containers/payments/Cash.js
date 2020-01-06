import React from 'react';
import { c } from 'ttag';
import { Alert, useConfig } from 'react-components';
import { CLIENT_TYPES } from 'proton-shared/lib/constants';
import envelopSvg from 'design-system/assets/img/pm-images/envelop.svg';

const { VPN } = CLIENT_TYPES;

const Cash = () => {
    const { CLIENT_TYPE } = useConfig();
    const email = <b>{CLIENT_TYPE === VPN ? 'contact@protonvpn.com' : 'contact@protonmail.com'}</b>;

    return (
        <div className="p1 bordered-container bg-global-highlight mb1">
            <Alert>{c('Info for cash payment method')
                .jt`Please contact us at ${email} for instructions on how pay us with cash.`}</Alert>
            <div className="aligncenter">
                <img src={envelopSvg} alt="Envelop" />
            </div>
        </div>
    );
};

export default Cash;
