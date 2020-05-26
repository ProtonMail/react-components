import React from 'react';
import { SubTitle, Alert } from 'react-components';
import { c } from 'ttag';

const PastImportsSection = () => {
    return (
        <>
            <SubTitle>{c('Title').t`Import history`}</SubTitle>
            <Alert>{c('Info').t`No past imports found`}</Alert>
        </>
    );
};

export default PastImportsSection;
