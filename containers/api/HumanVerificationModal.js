import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormModal, Alert, Row, Label, Radio, useApiResult } from 'react-components';
import { c } from 'ttag';
import { getHumanVerificationMethods } from 'proton-shared/lib/api/users';

import Captcha from './Captcha';

const HumanVerificationModal = ({ token, onSubmit, ...rest }) => {
    const title = c('Title').t`Human verification`;
    const { result, loading } = useApiResult(getHumanVerificationMethods, []);
    const [method, setMethod] = useState('captcha');
    const { VerifyMethods = [] } = result;
    const handleChange = ({ target }) => target.checked && setMethod(target.value);

    const handleCaptcha = (token) => {
        onSubmit(token, method);
        rest.onClose();
    };

    return (
        <FormModal hasClose={false} noValidate={true} title={title} loading={loading} {...rest}>
            <Alert>{c('Info').t`For security reasons, please verify that you are not a robot.`}</Alert>
            {VerifyMethods.includes('captcha') ? (
                <Row>
                    <Label htmlFor="captcha">
                        {VerifyMethods.length ? (
                            <Radio
                                id="captcha"
                                checked={method === 'captcha'}
                                value="captcha"
                                className="mr0-5"
                                onChange={handleChange}
                            />
                        ) : null}
                        <span>{c('Label').t`Captcha`}</span>
                    </Label>
                    <div className="w100">
                        <Captcha token={token} onSubmit={handleCaptcha} />
                    </div>
                </Row>
            ) : null}
        </FormModal>
    );
};

HumanVerificationModal.propTypes = {
    token: PropTypes.string,
    onSubmit: PropTypes.func
};

export default HumanVerificationModal;
