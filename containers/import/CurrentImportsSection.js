import React from 'react';
import { SubTitle, Alert } from 'react-components';
import { c } from 'ttag';

const CurrentImportsSection = () => {
    return (
        <>
            <SubTitle>{c('Title').t`Current imports`}</SubTitle>
            <Alert>{c('Info').t`No ongoing import`}</Alert>
        </>
    );
};

export default CurrentImportsSection;
