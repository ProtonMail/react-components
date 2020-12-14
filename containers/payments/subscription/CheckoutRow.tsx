import React from 'react';
import { c } from 'ttag';
import { Currency } from 'proton-shared/lib/interfaces';

import { classnames } from '../../../helpers';
import { Price } from '../../../components';

interface Props {
    title: string;
    amount: number;
    currency?: Currency;
    className?: string;
}

const CheckoutRow = ({ title, amount = 0, currency, className = '' }: Props) => {
    if (amount === 0 && !currency) {
        return (
            <div className={classnames(['flex flex-nowrap flex-justify-space-between mb0-5', className])}>
                <div className="pr0-5">{title}</div>
                <span className="color-global-success text-uppercase">{c('Price').t`Free`}</span>
            </div>
        );
    }
    return (
        <div className={classnames(['flex flex-nowrap flex-justify-space-between mb0-5', className])}>
            <div className="pr0-5">{title}</div>
            {amount ? (
                <Price className={amount < 0 ? 'color-global-success' : ''} currency={currency}>
                    {amount}
                </Price>
            ) : null}
        </div>
    );
};

export default CheckoutRow;
