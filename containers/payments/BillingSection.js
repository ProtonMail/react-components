import React from 'react';
import { c } from 'ttag';
import { SubTitle } from 'react-components';

const BillingSection = () => {
    return (
        <>
            <SubTitle>{c('Title').t`Billing`}</SubTitle>
        </>
    );
};

export default BillingSection;
