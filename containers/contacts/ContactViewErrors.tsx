import React from 'react';
import { c } from 'ttag';

import { CryptoProcessingError } from 'proton-shared/lib/contacts/decrypt';
import { CRYPTO_PROCESSING_TYPES } from 'proton-shared/lib/contacts/constants';
import Icon from '../../components/icon/Icon';
import Href from '../../components/link/Href';
import { InlineLinkButton } from '../../components';
import { classnames } from '../../helpers';

const { SIGNATURE_NOT_VERIFIED } = CRYPTO_PROCESSING_TYPES;

interface Props {
    errors?: CryptoProcessingError[];
    onReload?: () => void;
}

const ContactViewErrors = ({ errors, onReload }: Props) => {
    if (!errors || !errors.length) {
        return null;
    }

    const errorTypes = errors.map(({ type }) => type);
    const isSignature = errorTypes.includes(SIGNATURE_NOT_VERIFIED);
    const bgColor = isSignature ? 'bg-global-attention' : 'bg-global-warning';
    const textColor = isSignature ? 'color-black' : 'color-white';
    const text = isSignature
        ? c('Warning').t`Warning: the verification of this contact's signature failed.`
        : c('Warning').t`Error: the encrypted content failed decryption and cannot be read.`;

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
            {onReload && (
                <span className="flex-item-noshrink flex">
                    <InlineLinkButton onClick={onReload} className="underline color-currentColor">
                        {c('Action').t`Try again`}
                    </InlineLinkButton>
                </span>
            )}
        </div>
    );
};

export default ContactViewErrors;
