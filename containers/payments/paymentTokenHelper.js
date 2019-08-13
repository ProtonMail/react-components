import { PAYMENT_METHOD_TYPES, PAYMENT_TOKEN_STATUS } from 'proton-shared/lib/constants';
import { createToken, getTokenStatus } from 'proton-shared/lib/api/payments';
import { wait } from 'proton-shared/lib/helpers/promise';
import { c } from 'ttag';

const {
    STATUS_PENDING,
    STATUS_CHARGEABLE,
    STATUS_FAILED,
    STATUS_CONSUMED,
    STATUS_NOT_SUPPORTED
} = PAYMENT_TOKEN_STATUS;

const { CARD, PAYPAL } = PAYMENT_METHOD_TYPES;

const DELAY_PULLING = 5000;
const DELAY_LISTENING = 1000;

const pull = async ({ timer = 0, Token, api }) => {
    if (timer > DELAY_PULLING * 30) {
        throw new Error(c('Error').t`Payment process cancelled`);
    }

    const { Status } = await api(getTokenStatus(Token));

    if (Status === STATUS_FAILED) {
        throw new Error(c('Error').t`Payment process failed`);
    }

    if (Status === STATUS_CONSUMED) {
        throw new Error(c('Error').t`Payment process consumed`);
    }

    if (Status === STATUS_NOT_SUPPORTED) {
        throw new Error(c('Error').t`Payment process not supported`);
    }

    if (Status === STATUS_CHARGEABLE) {
        return;
    }

    if (Status === STATUS_PENDING) {
        await wait(DELAY_PULLING);
        return pull({ Token, api, timer: timer + DELAY_PULLING });
    }

    throw new Error(c('Error').t`Unknown payment token status`);
};

const process = ({ ApprovalURL, Token, api }) => {
    return new Promise((resolve, reject) => {
        let listen = false;
        const tab = window.open(ApprovalURL, '3DS support');

        const reset = () => {
            window.removeEventListener('message', onMessage, false);
            tab.close();
        };

        const listenTab = async () => {
            if (!listen) {
                return;
            }

            if (tab.closed) {
                reject(new Error(c('Error').t`Tab closed`));
            }

            await wait(DELAY_LISTENING);
            return listenTab(tab);
        };

        const onMessage = (event) => {
            const origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.

            if (origin !== 'https://secure.protonmail.com') {
                return reject();
            }

            if (event.source !== tab) {
                return reject();
            }

            const { cancel } = event.data;
            listen = false;
            tab.close();

            if (cancel === '1') {
                return reject();
            }

            pull({ Token, api, tab })
                .then(() => {
                    reset();
                    resolve();
                })
                .catch((error) => {
                    reset();
                    reject(error);
                });
        };

        window.addEventListener('message', onMessage, false);
        listen = true;
        listenTab();
    });
};

const toParams = ({ Amount, Currency, Token }) => {
    return {
        Amount,
        Currency,
        Payment: {
            Type: 'token',
            Details: {
                Token
            }
        }
    };
};

export const handle3DS = async (params = {}, api) => {
    const { Payment = {}, Amount, Currency } = params;
    const { Type } = Payment;

    if (![CARD, PAYPAL].includes(Type)) {
        return params;
    }

    const { Token, Status, ApprovalURL } = await api(createToken(params));

    if (Status === STATUS_CHARGEABLE) {
        return toParams({ Amount, Currency, Token });
    }

    await process({ ApprovalURL, Token, api });
    return toParams({ Amount, Currency, Token });
};
