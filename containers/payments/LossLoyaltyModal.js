import React from 'react';
import { c } from 'ttag';
import { Alert, ConfirmModal, ErrorButton, Paragraph } from 'react-components';

const LossLoyaltyModal = (props) => {
    return (
        <ConfirmModal
            title={c('Title').t`Confirm loss of Proton loyalty benefits`}
            confirm={<ErrorButton type="submit">{c('Action').t`Confirm`}</ErrorButton>}
            {...props}
        >
            <Paragraph>{c('Info').t``}</Paragraph>
            <Alert type="warning">{c('Info').t``}</Alert>
        </ConfirmModal>
    );
};

export default LossLoyaltyModal;
