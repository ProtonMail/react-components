import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { FormModal, Alert, EmailInput, Input, useApi, useLoading } from 'react-components';
import { getAuthenticationMethod } from 'proton-shared/lib/api/importMail';

const STEPS = {
    START: 'start',
    PROCESS: 'process',
    READY: 'ready',
    SUCCESS: 'success'
};

// const AUTHENTICATION_METHOD = {
//     OAUTH2: 'XOAUTH2',
//     PLAIN: 'PLAIN'
// };

const ImportMailModal = ({ ...rest }) => {
    const [loading, withLoading] = useLoading();
    const [model, setModel] = useState({ step: STEPS.START });
    const api = useApi();
    const TITLES = {
        [STEPS.START]: c('Title').t`Start a new import`,
        [STEPS.PROCESS]: c('Title').t`Start import process`,
        [STEPS.READY]: c('Title').t`Ready to start import`,
        [STEPS.SUCCESS]: c('Title').t`Success`
    };
    const handleSubmit = async () => {
        if (model.step === STEPS.START) {
            try {
                const { Authentication } = await api(getAuthenticationMethod({ Email: model.email }));
                setModel({
                    ...model,
                    authenticationMethod: Authentication.Sasl,
                    step: STEPS.PROCESS
                });
                return;
            } catch (error) {
                // if (Code === ) {

                // }
                return;
            }
        }
    };
    return (
        <FormModal title={TITLES[model.step]} loading={loading} onSubmit={() => withLoading(handleSubmit())} {...rest}>
            {model.step === STEPS.START ? (
                <>
                    <Alert>TODO</Alert>
                    <label>{c('Label').t`Email address`}</label>
                    <EmailInput
                        value={model.email}
                        onChange={({ target }) => setModel({ ...model, email: target.value })}
                        placeholder={c('Placeholder').t`Enter your email address to import`}
                    />
                    <label>{c('Label').t`Client ID`}</label>
                    <Input
                        value={model.clientID}
                        onChange={({ target }) => setModel({ ...model, clientID: target.value })}
                        placeholder={c('Placeholder').t`Client ID`}
                    />
                </>
            ) : null}
        </FormModal>
    );
};

ImportMailModal.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default ImportMailModal;
