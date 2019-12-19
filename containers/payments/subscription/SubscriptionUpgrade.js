import React from 'react';
import { c } from 'ttag';
import { Loader, useConfig } from 'react-components';
import { CLIENT_TYPES } from 'proton-shared/lib/constants';

const SubscriptionUpgrade = () => {
    const { CLIENT_TYPE } = useConfig();
    return (
        <>
            <p className="aligncenter mb3">{c('Info')
                .t`Your account is being upgraded, this may take up to 30 seconds.`}</p>
            <Loader size="medium" />
            <p className="aligncenter mt3">
                {CLIENT_TYPE === CLIENT_TYPES.MAIL
                    ? c('Info').t`Thank you for supporting ProtonMail`
                    : c('Info').t`Thank you for supporting ProtonVPN`}
            </p>
        </>
    );
};

export default SubscriptionUpgrade;
