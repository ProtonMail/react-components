import React, { useState } from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import {
    Label,
    Modal,
    Row,
    Field,
    Alert,
    ContentModal,
    FooterModal,
    ResetButton,
    PrimaryButton,
    useNotifications,
    useApiWithoutResult,
    useEventManager
} from 'react-components';
import { buyCredit } from 'proton-shared/lib/api/payments';
import { DEFAULT_CURRENCY, DEFAULT_CREDITS_AMOUNT } from 'proton-shared/lib/constants';

import PaymentSelector from './PaymentSelector';
import Payment from './Payment';
import usePayment from './usePayment';

const CreditsModal = ({ show, onClose }) => {
    const { call } = useEventManager();
    const { method, setMethod, parameters, setParameters, canPay, setCardValidity } = usePayment(handleSubmit);
    const { createNotification } = useNotifications();
    const { request, loading } = useApiWithoutResult(buyCredit);
    const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
    const [amount, setAmount] = useState(DEFAULT_CREDITS_AMOUNT);

    const handleSubmit = async () => {
        await request({ Amount: amount, Currency: currency, ...parameters });
        await call();
        onClose();
        createNotification({ text: c('Success').t`Credits added` });
    };

    return (
        <Modal type="small" show={show} onClose={onClose} title={c('Title').t`Add credits`}>
            <ContentModal onSubmit={handleSubmit} onReset={onClose}>
                <Alert>{c('Info')
                    .t`Your payment details are protected with TLS encryption and Swiss privacy laws.`}</Alert>
                <Alert learnMore="https://protonmail.com/support/knowledge-base/credit-proration/">{c('Info')
                    .jt`Top up your accounts with credits that can be used towards subscribing to a new plan or renewing your current plan. You get one credit for every ${currency} spent.`}</Alert>
                <Row>
                    <Label>{c('Label').t`Amount`}</Label>
                    <Field>
                        <PaymentSelector
                            amount={amount}
                            onChangeAmount={setAmount}
                            currency={currency}
                            onChangeCurrency={setCurrency}
                        />
                    </Field>
                </Row>
                <Payment
                    type="donation"
                    method={method}
                    amount={amount}
                    currency={currency}
                    onParameters={setParameters}
                    onMethod={setMethod}
                    onValidCard={setCardValidity}
                />
                <FooterModal>
                    <ResetButton>{c('Action').t`Cancel`}</ResetButton>
                    {canPay ? (
                        <PrimaryButton type="submit" loading={loading}>{c('Action').t`Top up`}</PrimaryButton>
                    ) : null}
                </FooterModal>
            </ContentModal>
        </Modal>
    );
};

CreditsModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default CreditsModal;
