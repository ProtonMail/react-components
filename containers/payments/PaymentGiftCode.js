import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useToggle, Icon, LinkButton, Button } from 'react-components';
import { isValid } from 'proton-shared/lib/helpers/giftCode';
import { c } from 'ttag';

import GiftCodeForm from './subscription/GiftCodeForm';

const PaymentGiftCode = ({ gift = '', onApply, loading }) => {
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

        return (
            <div className="flex flex-nowrap">
                <div className="flex-item-fluid mr1">
                    <GiftCodeForm code={code} onChange={setCode} onSubmit={handleSubmit} loading={loading} />
                </div>
                <Button onClick={handleCancel} title={c('Action').t`Cancel`} className="flex-self-start" icon="off">
                  <span className="sr-only">{c('Action').t`Cancel`}</span>
                </Button>
            </div>
        );
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
