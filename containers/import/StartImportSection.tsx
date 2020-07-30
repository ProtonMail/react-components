import React from 'react';
import { PrimaryButton, useModals } from '../..';
import { c } from 'ttag';

import ImportMailModal from './modal/ImportMailModal';

const StartImportSection = () => {
    const { createModal } = useModals();
    const handleClick = () => createModal(<ImportMailModal />);
    return <PrimaryButton onClick={handleClick}>{c('Action').t`Start import`}</PrimaryButton>;
};

export default StartImportSection;
