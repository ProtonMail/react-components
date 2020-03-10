import React from 'react';
import { SubTitle, Alert } from 'react-components';
import { c } from 'ttag';

const PastImportsSection = () => {
    return (
        <>
            <SubTitle>{c('Title').t`Past imports`}</SubTitle>
            <Alert>{c('Info').t`No past imports found`}</Alert>
        </>
    );
};

export default PastImportsSection;
