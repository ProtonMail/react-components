import React from 'react';
import { c } from 'ttag';

import { useModals } from '../../hooks';
import { PrimaryButton } from '../../components';

import ImportMailModal from './modals/ImportMailModal';

const StartImportSection = () => {
    const { createModal } = useModals();
    const handleClick = () => createModal(<ImportMailModal />);
    return <PrimaryButton onClick={handleClick}>{c('Action').t`Start import`}</PrimaryButton>;
};

export default StartImportSection;
