import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Button } from 'react-components';

const SubscriptionThanks = ({ onClose }) => {
    return (
        <>
            <div>{c('Info').t`Thanks`}</div>
            <div>
                <Button onClick={onClose}>{c('Action').t`Close`}</Button>
            </div>
        </>
    );
};

SubscriptionThanks.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default SubscriptionThanks;
