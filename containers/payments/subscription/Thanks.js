import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { PrimaryButton } from 'react-components';
import loveSvg from 'design-system/assets/img/pm-images/love.svg';

const Thanks = ({ onClose }) => {
    return (
        <div className="flex-autogrid onmobile-flex-column w100 p1">
            <div className="flex-autogrid-item flex flex-column flex-spacebetween">
                <h3>{c('Title').t`Thank you!`}</h3>
                <div className="mb2">
                    <div className="bold color-pm-blue-light">{c('Info').t`Thank you for your subscription.`}</div>
                    <div>{c('Info').t`Your new features are now available.`}</div>
                </div>
                <div>
                    <PrimaryButton onClick={onClose}>{c('Action').t`Got it`}</PrimaryButton>
                </div>
            </div>
            <div className="flex-autogrid-item flex flex-column flex-items-end">
                <img className="h100" src={loveSvg} alt={c('Info').t`Thank you`} />
            </div>
        </div>
    );
};

Thanks.propTypes = {
    onClose: PropTypes.func
};

export default Thanks;
