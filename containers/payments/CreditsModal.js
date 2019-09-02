import React, { useState } from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import {
    Label,
    FormModal,
    Row,
    Field,
    Alert,
    useNotifications,
    useEventManager,
    useConfig,
    useModals,
    useApi,
    useLoading
} from 'react-components';
import { buyCredit } from 'proton-shared/lib/api/payments';
import { DEFAULT_CURRENCY, DEFAULT_CREDITS_AMOUNT, APPS } from 'proton-shared/lib/constants';

import PaymentSelector from './PaymentSelector';
import Payment from './Payment';
import usePayment from './usePayment';
import { handlePaymentToken } from './paymentTokenHelper';

const getCurrenciesI18N = () => ({
    EUR: c('Monetary unit').t`Euro`,
    CHF: c('Monetary unit').t`Swiss franc`,
    USD: c('Monetary unit').t`Dollar`
});

const { PROTONVPN_SETTINGS } = APPS;

const CreditsModal = ({ onClose, ...rest }) => {
    const api = useApi();
    const { APP_NAME } = useConfig();
    const { call } = useEventManager();
    const { createModal } = useModals();
    const { method, setMethod, parameters, setParameters, canPay, setCardValidity } = usePayment();
    const { createNotification } = useNotifications();
    const [loading, withLoading] = useLoading();
    const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
    const [amount, setAmount] = useState(DEFAULT_CREDITS_AMOUNT);

    const i18n = getCurrenciesI18N();
    const i18nCurrency = i18n[currency];

    const handleSubmit = async (params = parameters) => {
        const requestBody = await handlePaymentToken({
            params: { ...params, Amount: amount, Currency: currency },
            api,
            createModal
        });
        await api(buyCredit(requestBody));
        await call();
        onClose();
        createNotification({ text: c('Success').t`Credits added` });
    };

    return (
        <FormModal
            type="small"
            onClose={onClose}
            onSubmit={() => withLoading(handleSubmit())}
            loading={loading}
            submit={canPay && c('Action').t`Top up`}
            title={c('Title').t`Add credits`}
            {...rest}
        >
            <Alert>{c('Info').t`Your payment details are protected with TLS encryption and Swiss privacy laws.`}</Alert>
            <Alert
                learnMore={
                    APP_NAME === PROTONVPN_SETTINGS
                        ? 'https://protonvpn.com/support/vpn-credit-proration/'
                        : 'https://protonmail.com/support/knowledge-base/credit-proration/'
                }
            >{c('Info')
                .jt`Top up your account with credits that you can use to subscribe to a new plan or renew your current plan. You get one credit for every ${i18nCurrency} spent.`}</Alert>
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
                type="credit"
                method={method}
                amount={amount}
                currency={currency}
                parameters={parameters}
                onParameters={setParameters}
                onMethod={setMethod}
                onValidCard={setCardValidity}
                onPay={handleSubmit}
            />
        </FormModal>
    );
};

CreditsModal.propTypes = {
    onClose: PropTypes.func
};

export default CreditsModal;
