import React, { useState, useEffect } from 'react';
import { c } from 'ttag';
import { Icon, LinkButton } from '../../components';
import { useToggle } from '../../hooks';

import GiftCodeForm from './subscription/GiftCodeForm';

interface Props {
    loading?: boolean;
    gift?: string;
    onApply: (value: string) => void;
}

const PaymentGiftCode = ({ gift = '', onApply, loading }: Props) => {
    const { state, toggle, set } = useToggle();
    const [code, setCode] = useState('');

    const handleCancel = () => {
        set(false);
        setCode('');
    };

    useEffect(() => {
        // When we remove the gift code
        if (!gift) {
            handleCancel();
        }
    }, [gift]);

    if (gift) {
        return (
            <div className="inline-flex flex-nowrap flex-align-items-center">
                <span className="mr1 flex flex-nowrap flex-align-items-center">
                    <Icon name="gift" className="mr0-5 mb0-25" />
                    <code>{(gift.match(/.{1,4}/g) || ['']).join('-')}</code>
                </span>
                <LinkButton
                    className="flex flex-align-items-center ml0-25"
                    onClick={() => onApply('')}
                    title={c('Action').t`Remove gift code`}
                >
                    <Icon name="trash" className="fill-primary" />
                    <span className="sr-only">{c('Action').t`Remove gift code`}</span>
                </LinkButton>
            </div>
        );
    }

    if (state) {
        const handleSubmit = () => {
            if (!code) {
                return;
            }

            onApply(code);
        };

        return <GiftCodeForm code={code} onChange={setCode} onSubmit={handleSubmit} loading={loading} />;
    }

    return <LinkButton onClick={toggle} icon={gift}>{c('Link').t`Add a gift code`}</LinkButton>;
};

export default PaymentGiftCode;
