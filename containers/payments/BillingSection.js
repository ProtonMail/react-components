import React from 'react';
import { c } from 'ttag';
import { SubTitle, Bordered } from 'react-components';

const BillingSection = () => {
    return (
        <>
            <SubTitle>{c('Title').t`Billing details`}</SubTitle>
            <Bordered />
        </>
    );
};

export default BillingSection;
