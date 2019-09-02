import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormModal, Alert, useApi, useLoading, Loader, useNotifications } from 'react-components';
import { createToken } from 'proton-shared/lib/api/payments';
import { PAYMENT_METHOD_TYPES, PAYMENT_TOKEN_STATUS } from 'proton-shared/lib/constants';
import { c } from 'ttag';
import tabSvg from 'design-system/assets/img/pm-images/tab.svg';

import { process, toParams } from './paymentTokenHelper';

const { STATUS_CHARGEABLE } = PAYMENT_TOKEN_STATUS;
const { BITCOIN, CASH, TOKEN } = PAYMENT_METHOD_TYPES;

const PaymentVerificationModal = ({ params, onSubmit, ...rest }) => {
    const api = useApi();
    const { createNotification } = useNotifications();
    const { Payment, Amount, Currency, PaymentMethodID } = params;
    const { Type } = Payment || {};
    const [url, setUrl] = useState('');
    const [token, setToken] = useState('');
    const [tryAgain, setTryAgain] = useState(false);
    const [loadingToken, withLoadingToken] = useLoading();
    const [loadingTab, withLoadingTab] = useLoading();
    const title = loadingTab ? c('Title').t`Payment verification in progress` : c('Title').t`Payment verification`;

    const submit = () => {
        onSubmit(onSubmit(toParams(params, token)));
        rest.onClose();
    };

    const request = async () => {
        try {
            const { Token, Status, ApprovalURL } = await api(
                createToken({ Payment, Amount, Currency, PaymentMethodID })
            );

            setToken(Token);

            if (Status === STATUS_CHARGEABLE) {
                return submit();
            }

            setUrl(ApprovalURL);
        } catch (error) {
            setTryAgain(true);

            // TODO review with @mmso why notification is not display with throw
            if (error.message) {
                createNotification({ text: error.message, type: 'error' });
            }

            throw error;
        }
    };

    const handleClick = async () => {
        const tab = window.open(url);
        await process({ ApprovalURL: url, Token: token, api, tab });
        return submit();
    };

    useEffect(() => {
        if ([CASH, BITCOIN, TOKEN].includes(Type)) {
            return onSubmit(params);
        }
        withLoadingToken(request());
    }, []);

    return (
        <FormModal
            title={title}
            submit={tryAgain ? c('Action').t`Try again` : c('Action').t`Verify payment`}
            onSubmit={() => {
                if (tryAgain) {
                    setTryAgain(false);
                    withLoadingToken(request());
                } else {
                    withLoadingTab(handleClick());
                }
            }}
            loading={loadingToken}
            small={true}
            {...rest}
        >
            {loadingTab ? <Loader /> : <img src={tabSvg} alt={c('Title').t`New tab`} />}
            {loadingTab ? (
                <Alert>{c('Info').t`Please verify the payment in the new tab.`}</Alert>
            ) : (
                <Alert>{c('Info')
                    .t`A new tab will open to confirm the payment, please disable any popup blockers.`}</Alert>
            )}
        </FormModal>
    );
};

PaymentVerificationModal.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    params: PropTypes.object
};

export default PaymentVerificationModal;
