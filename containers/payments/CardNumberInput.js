import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Input, Icon } from 'react-components';
import creditCardType from 'credit-card-type';

const banks = require.context('design-system/assets/img/shared/bank-icons', true, /.svg$/);

const banksMap = banks.keys().reduce((acc, key) => {
    acc[key] = () => banks(key);
    return acc;
}, {});

const getBankSvg = (type = '') => {
    const key = `./cc-${type}.svg`;
    if (!banksMap[key]) {
        return;
    }
    return banksMap[key]();
};

const CardNumberInput = (props) => {
    const [{ type, niceType }] = creditCardType(props.value) || [];
    const bankIcon = getBankSvg(type);
    return (
        <div className="relative">
            <Input
                autoComplete="cc-number"
                name="cardnumber"
                placeholder={c('Placeholder').t`Card number`}
                maxLength={20}
                {...props}
            />
            <span className="right-icon absolute flex">
                {props.value && bankIcon ? (
                    <img src={bankIcon} className="mauto" title={niceType} alt={niceType} width="20" />
                ) : (
                    <Icon className="mauto" name="payments-type-card" />
                )}
            </span>
        </div>
    );
};

CardNumberInput.propTypes = {
    value: PropTypes.string
};

export default CardNumberInput;
