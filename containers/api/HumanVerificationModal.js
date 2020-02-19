import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormModal, Alert, Row, Label } from 'react-components';
import { c } from 'ttag';

import Captcha from './Captcha';
import HumanVerificationLabel from './HumanVerificationLabel';
import CodeVerification from './CodeVerification';
import RequestInvite from './RequestInvite';

const HumanVerificationModal = ({ token, methods = [], onSuccess, ...rest }) => {
    const title = c('Title').t`Human verification`;
    const [method, setMethod] = useState();

    const handleSubmit = (token) => {
        onSuccess({ token, method });
        rest.onClose();
    };

    useEffect(() => {
        if (methods.length) {
            setMethod(methods[0]);
        }
    }, []);

    return (
        <FormModal hasClose={false} hasSubmit={false} title={title} {...rest}>
            <Alert type="warning">{c('Info').t`For security reasons, please verify that you are not a robot.`}</Alert>
            {methods.includes('captcha') ? (
                <Row>
                    <Label>
                        {methods.includes('captcha') ? (
                            <HumanVerificationLabel
                                value="captcha"
                                methods={methods}
                                method={method}
                                onChange={setMethod}
                            >{c('Label').t`Captcha`}</HumanVerificationLabel>
                        ) : null}
                        {methods.includes('email') ? (
                            <HumanVerificationLabel
                                value="email"
                                methods={methods}
                                method={method}
                                onChange={setMethod}
                            >{c('Label').t`Verify with email`}</HumanVerificationLabel>
                        ) : null}
                        {methods.includes('sms') ? (
                            <HumanVerificationLabel
                                value="sms"
                                methods={methods}
                                method={method}
                                onChange={setMethod}
                            >{c('Label').t`Verify with SMS`}</HumanVerificationLabel>
                        ) : null}
                        {methods.includes('payment') ? (
                            <HumanVerificationLabel
                                value="payment"
                                methods={methods}
                                method={method}
                                onChange={setMethod}
                            >{c('Label').t`Donation`}</HumanVerificationLabel>
                        ) : null}
                        {methods.includes('invite') ? (
                            <HumanVerificationLabel
                                value="invite"
                                methods={methods}
                                method={method}
                                onChange={setMethod}
                            >{c('Label').t`Manual verification`}</HumanVerificationLabel>
                        ) : null}
                    </Label>
                    <div className="w100">
                        {method === 'captcha' ? <Captcha token={token} onSubmit={handleSubmit} /> : null}
                        {method === 'email' ? <CodeVerification onSubmit={handleSubmit} method="email" /> : null}
                        {method === 'sms' ? <CodeVerification onSubmit={handleSubmit} method="sms" /> : null}
                        {methods === 'payment' ? null : null}
                        {method === 'invite' ? <RequestInvite /> : null}
                    </div>
                </Row>
            ) : null}
        </FormModal>
    );
};

HumanVerificationModal.propTypes = {
    token: PropTypes.string,
    methods: PropTypes.oneOf(['captcha', 'sms', 'email', 'invite', 'payment']).isRequired,
    onSuccess: PropTypes.func.isRequired
};

export default HumanVerificationModal;
