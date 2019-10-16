import React from 'react';
import PropTypes from 'prop-types';
import { FormModal, PrimaryButton, Alert } from 'react-components';
import { c } from 'ttag';
import { Link } from 'react-router-dom';
import useConfig from '../../config/useConfig';
import { CLIENT_TYPES } from 'proton-shared/lib/constants';

const LoginPromptModal = ({ email, ...rest }) => {
    const { CLIENT_TYPE } = useConfig();

    const title = CLIENT_TYPE === CLIENT_TYPES.VPN ? 'ProtonVPN' : 'ProtonMail';

    return (
        <FormModal
            title={title}
            close={c('Action').t`Cancel`}
            submit={
                <Link to="/login">
                    <PrimaryButton>{c('Action').t`Go to login`}</PrimaryButton>
                </Link>
            }
            {...rest}
        >
            <Alert>
                {c('Info').t`You already have a Proton account.`}
                <br />
                {c('Info')
                    .t`Your existing Proton account can be used to access all Proton services. Please login with ${email}`}
            </Alert>
        </FormModal>
    );
};

LoginPromptModal.propTypes = {
    email: PropTypes.string.isRequired
};

export default LoginPromptModal;
