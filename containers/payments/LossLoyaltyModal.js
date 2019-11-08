import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Alert, ConfirmModal, ErrorButton, Paragraph } from 'react-components';

const LossLoyaltyModal = ({ user = {}, ...rest }) => {
    return (
        <ConfirmModal
            title={c('Title').t`Confirm loss of Proton loyalty benefits`}
            confirm={<ErrorButton type="submit">{c('Action').t`Confirm`}</ErrorButton>}
            {...rest}
        >
            <Paragraph>{c('Info')
                .t`You are currently entitled to Proton loyalty benefits for being a long term paid user.`}</Paragraph>
            <Alert type="warning">
                {c('Info').t`By downgrading you will irreversible loss your current loyalty benefits:`}
                {user.hasPaidMail ? <div>{c('Info').t`+ 5 GB free storage`}</div> : null}
                {user.hasPaidVpn ? <div>{c('Info').t`+ 2 VPN free connections`}</div> : null}
            </Alert>
        </ConfirmModal>
    );
};

LossLoyaltyModal.propTypes = {
    user: PropTypes.object.isRequired
};

export default LossLoyaltyModal;
