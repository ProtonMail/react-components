import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useToggle, Icon, LinkButton } from 'react-components';
import { isValid } from 'proton-shared/lib/helpers/giftCode';
import { c } from 'ttag';

import GiftCodeForm from './subscription/GiftCodeForm';

const PaymentGiftCode = ({ gift = '', onApply, loading }) => {
    const { state, toggle, set } = useToggle();
    const [code, setCode] = useState('');

    useEffect(() => {
        // When we remove the gift code
        if (!gift) {
            set(false);
            setCode('');
        }
    }, [gift]);

    if (gift) {
        return (
            <div className="flex flex-nowrap flex-items-center flex-spacebetween">
                <span>
                    <Icon name="gift" className="mr0-5" />
                    <code>{gift}</code>
                </span>
                <LinkButton icon="trash" onClick={() => onApply('')} />
            </div>
        );
    }

    if (state) {
        const handleSubmit = () => {
            if (!isValid(code)) {
                return;
            }

            onApply(code);
        };

        return <GiftCodeForm code={code} onChange={setCode} onSubmit={handleSubmit} loading={loading} />;
    }

    return (
        <div className="aligncenter">
            <LinkButton onClick={toggle} icon={gift}>{c('Link').t`Add a gift code`}</LinkButton>
        </div>
    );
};

PaymentGiftCode.propTypes = {
    loading: PropTypes.bool,
    gift: PropTypes.string,
    onApply: PropTypes.func.isRequired
};

export default PaymentGiftCode;
