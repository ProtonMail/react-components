import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormModal, Alert, Row, Label, Radio } from 'react-components';
import { c } from 'ttag';

import Captcha from './Captcha';

const HumanVerificationModal = ({ token, methods = [], onSubmit, ...rest }) => {
    const title = c('Title').t`Human verification`;
    const [method, setMethod] = useState('captcha');
    const handleChange = ({ target }) => target.checked && setMethod(target.value);

    const handleCaptcha = (token) => {
        onSubmit(token, method);
        rest.onClose();
    };

    return (
        <FormModal hasClose={false} noValidate={true} title={title} {...rest}>
            <Alert>{c('Info').t`For security reasons, please verify that you are not a robot.`}</Alert>
            {methods.includes('captcha') ? (
                <Row>
                    <Label htmlFor="captcha">
                        {methods.length ? (
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
    methods: PropTypes.arrayOf(PropTypes.string),
    onSubmit: PropTypes.func
};

export default HumanVerificationModal;
