/* eslint-disable react/destructuring-assignment */
import React from 'react';
import humanPrice from 'proton-shared/lib/helpers/humanPrice';

import { classnames } from '../../helpers';

const CURRENCIES = {
    USD: '$',
    EUR: '€',
    CHF: 'CHF',
} as const;

interface Props {
    currency?: keyof typeof CURRENCIES;
    children?: number;
    className?: string;
    divisor?: number;
    suffix?: string;
    prefix?: string;
}

const Price = ({ children: amount = 0, className = '', divisor = 100, suffix = '', prefix = '', ...props }: Props) => {
    const value = humanPrice(amount, divisor);
    const [integer, decimal] = `${value}`.split('.');

    const c = <span className="currency">{props.currency ? CURRENCIES[props.currency] : ''}</span>;
    const p = amount < 0 ? <span className="prefix">-</span> : null;
    const v = (
        <span className="amount">
            <span className="integer">{integer}</span>
            {decimal ? <span className="decimal">.{decimal}</span> : null}
        </span>
    );
    const s = suffix ? <span className="suffix ml0-25">{suffix}</span> : null;
    const pr = prefix ? <span className="prefix">{prefix}</span> : null;

    if (props.currency === 'USD') {
        return (
            <span
                className={classnames(['price flex-item-noshrink inline-flex', className])}
                data-currency={props.currency}
            >
                {pr}
                {p}
                {c}
                {v}
                {s}
            </span>
        ); // -$2/month
    }

    return (
        <span
            className={classnames(['price flex-item-noshrink inline-flex', className])}
            data-currency={props.currency}
        >
            {pr}
            {p}
            {v}
            {props.currency ? <> {c}</> : null}
            {s}
        </span>
    ); // -2 EUR/month
};

export default Price;
