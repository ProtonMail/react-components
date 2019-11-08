import React from 'react';
import PropTypes from 'prop-types';
import { FullLoader, TextLoader, useConfig } from 'react-components';
import { c } from 'ttag';
import { CLIENT_TYPES } from 'proton-shared/lib/constants';

const { VPN } = CLIENT_TYPES;

const LoaderPage = ({ text, color = 'global-light' }) => {
    const { CLIENT_TYPE } = useConfig();
    const appName = CLIENT_TYPE === VPN ? 'ProtonVPN' : 'ProtonMail';
    return (
        <div className="centered-absolute aligncenter">
            <FullLoader color={color} size={200} />
            <TextLoader>{text || c('Info').t`Loading ${appName}`}</TextLoader>
        </div>
    );
};

LoaderPage.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string
};

export default LoaderPage;
