import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { PrimaryButton, useConfig } from 'react-components';
import { CLIENT_TYPES } from 'proton-shared/lib/constants';
import mailLandscapeSvg from 'design-system/assets/img/pm-images/landscape.svg';
import vpnLandscapeSvg from 'design-system/assets/img/pv-images/landscape.svg';

const SubscriptionThanks = ({ onClose }) => {
    const { CLIENT_TYPE } = useConfig();

    return (
        <>
            <p className="aligncenter mb0">{c('Info').t`Your account has been successfully updated.`}</p>
            <p className="aligncenter mb1">{c('Info')
                .t`Download your favorite app today and take privacy with you everywhere you go.`}</p>
            <div className="aligncenter mb1">
                <img src={CLIENT_TYPE === CLIENT_TYPES.MAIL ? mailLandscapeSvg : vpnLandscapeSvg} alt="landscape" />
            </div>
            <div className="aligncenter">
                <PrimaryButton onClick={onClose}>{c('Action').t`Close`}</PrimaryButton>
            </div>
        </>
    );
};

SubscriptionThanks.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default SubscriptionThanks;
