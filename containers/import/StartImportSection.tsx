import React from 'react';
import { SubTitle, PrimaryButton, useModals } from 'react-components';
import { c } from 'ttag';

import ImportMailModal from './ImportMailModal';

const StartImportSection = () => {
    const { createModal } = useModals();
    const handleClick = () => createModal(<ImportMailModal />);
    return (
        <>
            <SubTitle>{c('Title').t`New import`}</SubTitle>
            <PrimaryButton onClick={handleClick}>{c('Action').t`Start import`}</PrimaryButton>
        </>
    );
};

export default StartImportSection;
