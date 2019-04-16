import React from 'react';
import { c } from 'ttag';
import { PrimaryButton } from 'react-components';

const ActivateOrganizationButton = () => {
    const handleClick = () => {};
    return <PrimaryButton onClick={handleClick}>{c('Action').t`Enable multi-user support`}</PrimaryButton>;
};

export default ActivateOrganizationButton;
