import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    EmailInput,
    Input,
    IntlTelInput,
    InlineLinkButton,
    PrimaryButton,
    Alert,
    useApi,
    useLoading,
    useModals,
    useConfig,
    useNotifications
} from 'react-components';
import { queryVerificationCode, queryCheckVerificationCode } from 'proton-shared/lib/api/user';
import { c } from 'ttag';

import RequestNewCodeModal from './RequestNewCodeModal';

const STEPS = {
    ENTER_DESTINATION: 0,
    VERIFY_CODE: 1
};

const METHODS = {
    EMAIL: 'email',
    SMS: 'sms'
};

const CodeVerification = ({ email: defaultEmail = '', method, onSubmit }) => {
    const isEmail = method === METHODS.EMAIL;
    const isSms = method === METHODS.SMS;
    const { CLIENT_TYPE } = useConfig();
    const { createNotification } = useNotifications();
    const [email, setEmail] = useState(defaultEmail);
    const [phone, setPhone] = useState();
    const [code, setCode] = useState('');
    const [step, setStep] = useState(STEPS.ENTER_DESTINATION);
    const api = useApi();
    const [loadingCode, withLoadingCode] = useLoading();
    const [loadingVerification, withLoadingVerification] = useLoading();
    const { createModal } = useModals();

    const sendCode = async () => {
        await api(queryVerificationCode(method, isEmail ? { Address: email } : { Phone: phone }));
        setCode('');
        setStep(STEPS.VERIFY_CODE);
        createNotification();
    };

    const verifyCode = async () => {
        const Token = `${isEmail ? email : phone}:${code}`;
        const TokenType = method;
        const verificationToken = { Token, TokenType };
        await api(queryCheckVerificationCode(Token, TokenType, CLIENT_TYPE));
        createNotification();
        return onSubmit(verificationToken);
    };

    const editDestination = () => {
        setPhone('');
        setEmail('');
        setStep(STEPS.ENTER_DESTINATION);
    };

    if (step === STEPS.ENTER_DESTINATION && isEmail) {
        const handleChangeEmail = (event) => {
            event.preventDefault();

            if (event.key === 'Enter') {
                return withLoadingCode(sendCode());
            }

            setEmail(event.target.value);
        };
        return (
            <>
                <label htmlFor="email" className="bl mb0-5">{c('Label').t`Verification email`}</label>
                <div className="flex flex-nowrap">
                    <div className="flex-item-fluid mr1">
                        <EmailInput
                            id="email"
                            autoFocus={true}
                            value={email}
                            placeholder={c('Placeholder').t`Enter an email address`}
                            onChange={handleChangeEmail}
                            required
                        />
                    </div>
                    <PrimaryButton
                        disabled={!email}
                        loading={loadingCode}
                        onClick={() => withLoadingCode(sendCode())}
                    >{c('Action').t`Send`}</PrimaryButton>
                </div>
            </>
        );
    }

    if (step === STEPS.ENTER_DESTINATION && isSms) {
        const handleChangePhone = (status, value, countryData, number) => setPhone(number);
        return (
            <>
                <label htmlFor="phone" className="bl mb0-5">{c('Label').t`Verification phone`}</label>
                <div className="flex flex-nowrap">
                    <div className="flex-item-fluid mr1">
                        <IntlTelInput
                            id="phone"
                            autoFocus={true}
                            value={phone}
                            containerClassName="w100"
                            inputClassName="w100"
                            onPhoneNumberChange={handleChangePhone}
                            required
                        />
                    </div>
                    <PrimaryButton
                        disabled={!phone}
                        loading={loadingCode}
                        onClick={() => withLoadingCode(sendCode())}
                    >{c('Action').t`Send`}</PrimaryButton>
                </div>
            </>
        );
    }

    if (step === STEPS.VERIFY_CODE) {
        const destinationText = <strong key="destination">{isEmail ? email : phone}</strong>;
        const handleChangeCode = (event) => {
            event.preventDefault();
            if (event.key === 'Enter') {
                return withLoadingVerification(verifyCode());
            }
            setCode(event.target.value);
        };
        return (
            <>
                <Alert>
                    <div>{c('Info').jt`Enter the verification code that was sent to ${destinationText}.`}</div>
                    {isEmail ? (
                        <div>{c('Info')
                            .t`If you don't find the email in your inbox, please check your spam folder.`}</div>
                    ) : null}
                </Alert>
                <div className="flex flex-nowrap mb1">
                    <div className="flex-item-fluid mr1">
                        <Input
                            id="code"
                            value={code}
                            maxLength="6"
                            placeholder={c('Placeholder').t`123456`}
                            onChange={handleChangeCode}
                            autoFocus={true}
                        />
                    </div>
                    <PrimaryButton
                        loading={loadingVerification}
                        onClick={() => withLoadingVerification(verifyCode())}
                    >{c('Action').t`Send`}</PrimaryButton>
                </div>
                <div className="mb0-5">
                    <InlineLinkButton
                        onClick={() =>
                            createModal(
                                <RequestNewCodeModal
                                    onEdit={editDestination}
                                    onResend={() => withLoadingCode(sendCode())}
                                    email={email}
                                />
                            )
                        }
                    >{c('Action').t`Didn't get the code?`}</InlineLinkButton>
                </div>
                <div>
                    <InlineLinkButton onClick={editDestination}>
                        {isEmail
                            ? c('Action').t`Change verification email?`
                            : c('Action').t`Change verification phone?`}
                    </InlineLinkButton>
                </div>
            </>
        );
    }

    return null;
};

CodeVerification.propTypes = {
    email: PropTypes.string,
    method: PropTypes.oneOf([METHODS.SMS, METHODS.EMAIL]).isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default CodeVerification;
