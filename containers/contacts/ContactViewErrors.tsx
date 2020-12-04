import React from 'react';
import { c } from 'ttag';
import { CryptoProcessingError } from 'proton-shared/lib/contacts/decrypt';
import { CRYPTO_PROCESSING_TYPES } from 'proton-shared/lib/contacts/constants';
import Icon from '../../components/icon/Icon';
import Href from '../../components/link/Href';
import { Button } from '../../components';
import { classnames } from '../../helpers';
import { useLoading } from '../../hooks';

const { SIGNATURE_NOT_VERIFIED, FAIL_TO_READ, FAIL_TO_LOAD, FAIL_TO_DECRYPT } = CRYPTO_PROCESSING_TYPES;

const importanceOrder = [FAIL_TO_LOAD, FAIL_TO_READ, FAIL_TO_DECRYPT, SIGNATURE_NOT_VERIFIED];

const matchType = (errors: CryptoProcessingError[], type: CRYPTO_PROCESSING_TYPES) =>
    errors.find((error) => error.type === type);

const selectError = (errors: CryptoProcessingError[]) =>
    importanceOrder.map((type) => matchType(errors, type)).filter(Boolean)[0];

const getText = (errorType: CRYPTO_PROCESSING_TYPES) => {
    switch (errorType) {
        case FAIL_TO_DECRYPT:
            return c('Warning').t`Error: the encrypted content failed decryption and cannot be read.`;
        case SIGNATURE_NOT_VERIFIED:
            return c('Warning')
                .t`Warning: the signature verification failed. Some of your contact's content cannot be displayed.`;
        default:
            return c('Warning').t`Error: the contact failed loading.`;
    }
};

interface Props {
    errors?: CryptoProcessingError[];
    onReload?: () => void;
    onResign?: () => Promise<void>;
}

const ContactViewErrors = ({ errors, onReload, onResign }: Props) => {
    const [loading, withLoading] = useLoading();

    if (!errors || !errors.length) {
        return null;
    }

    const error = selectError(errors);

    // Should not happen
    if (!error) {
        return null;
    }
    const isWarning = error.type === SIGNATURE_NOT_VERIFIED;

    const bgColor = isWarning ? 'bg-global-attention' : 'bg-global-warning';
    const textColor = isWarning ? 'color-black' : 'color-white';
    const text = getText(error.type);

    const showButton = isWarning ? !!onReload : !!onResign;
    const buttonText = isWarning ? c('Action').t`Resign` : c('Action').t`Try again`;

    const handleAction = () => {
        const action = async () => (isWarning ? onResign?.() : onReload?.());
        void withLoading(action());
    };

    return (
        <div className={classnames([bgColor, textColor, 'rounded p0-5 mb0-5 flex flex-nowrap'])}>
            <Icon name="attention" className="flex-item-noshrink mtauto mbauto" />
            <span className="pl0-5 pr0-5">{text}</span>
            <span className="flex-item-fluid flex">
                <Href
                    className="underline color-currentColor"
                    url="https://protonmail.com/support/knowledge-base/encrypted-contacts/"
                >{c('Link').t`Learn more`}</Href>
            </span>
            {showButton && (
                <span className="flex-item-noshrink flex">
                    <Button onClick={handleAction} disabled={loading} className="pm-button--small">
                        {buttonText}
                    </Button>
                </span>
            )}
        </div>
    );
};

export default ContactViewErrors;
