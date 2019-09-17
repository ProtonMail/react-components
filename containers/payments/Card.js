import React from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { Block, Input, Select } from 'react-components';
import { isNumber } from 'proton-shared/lib/helpers/validators';

import { getFullList } from '../../helpers/countries';

const isValidMonth = (m) => !m || (isNumber(m) && m.length <= 2);
const isValidYear = (y) => !y || (isNumber(y) && y.length <= 4);

const Card = ({ card, errors, onChange, loading = false }) => {
    const countries = getFullList().map(({ value, label: text }) => ({ value, text }));
    const handleChange = (key) => ({ target }) => onChange(key, target.value);

    const handleChangeExp = ({ target }) => {
        const [month = '', year = ''] = target.value.split('/');
        isValidMonth(month) && onChange('month', month);
        isValidYear(year) && onChange('year', year);
    };

    return (
        <>
            <Block>
                <Input
                    autoComplete="cc-name"
                    name="ccname"
                    value={card.fullname}
                    onChange={handleChange('fullname')}
                    placeholder={c('Placeholder').t`Full name`}
                    error={errors.fullname}
                    disabled={loading}
                    required
                />
            </Block>
            <Block>
                <Input
                    autoComplete="cc-number"
                    value={card.number}
                    name="cardnumber"
                    onChange={handleChange('number')}
                    placeholder={c('Placeholder').t`Card number`}
                    error={errors.number}
                    disabled={loading}
                    maxLength={20}
                    required
                />
            </Block>
            <div className="flex-autogrid">
                <div className="flex-autogrid-item ">
                    <Input
                        value={`${card.month}/${card.year}`}
                        autoComplete="cc-exp"
                        maxLength={7}
                        placeholder={c("Placeholder for card expiracy, don't change order between MM and YYYY")
                            .t`MM/YYYY`}
                        onChange={handleChangeExp}
                        disabled={loading}
                        error={errors.month}
                    />
                </div>
                <div className="flex-autogrid-item">
                    <Input
                        autoComplete="cc-csc"
                        name="cvc"
                        value={card.cvc}
                        onChange={handleChange('cvc')}
                        placeholder={c('Placeholder, make it short').t`Security code`}
                        error={errors.cvc}
                        disabled={loading}
                        required
                    />
                </div>
            </div>
            <div className="flex-autogrid">
                <div className="flex-autogrid-item">
                    <Input
                        value={card.zip}
                        onChange={handleChange('zip')}
                        placeholder={card.country === 'US' ? c('Placeholder').t`ZIP` : c('Placeholder').t`Postal code`}
                        title={c('Title').t`ZIP / postal code`}
                        error={errors.zip}
                        disabled={loading}
                        minLength={3}
                        maxLength={9}
                        required
                    />
                </div>
                <div className="flex-autogrid-item">
                    <Select
                        value={card.country}
                        onChange={handleChange('country')}
                        options={countries}
                        disabled={loading}
                    />
                </div>
            </div>
        </>
    );
};

Card.propTypes = {
    loading: PropTypes.bool,
    card: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default Card;
