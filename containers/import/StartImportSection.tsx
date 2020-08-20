import React from 'react';
import { c } from 'ttag';

import { useModals } from '../../hooks';
import { PrimaryButton, Alert } from '../../components';

import ImportMailModal from './modals/ImportMailModal';

const StartImportSection = () => {
    const { createModal } = useModals();
    const handleClick = () => createModal(<ImportMailModal />);
    return (
        <>
            <Alert learnMore="https://protonmail.com/support/knowledge-base/">
                {c('Info')
                    .t`The Proton Migration Tool allows you to easily and securely import your data from your previous provider.`}
                <br />
                {c('Info')
                    .t`Simply connect to your previous account, select what you would like to import and you’re done. The selected data will be transferred, encrypted, and securely stored inside your Proton account.`}
            </Alert>
            <PrimaryButton className="mt0-5" onClick={handleClick}>{c('Action').t`Start import`}</PrimaryButton>
        </>
    );
};

export default StartImportSection;
