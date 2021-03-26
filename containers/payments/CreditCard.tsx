import React, { ChangeEvent } from 'react';
import { c } from 'ttag';
import { Label, Block, Input, Select, Info } from '../../components';

import { getFullList } from '../../helpers/countries';
import ExpInput from './ExpInput';
import CardNumberInput from './CardNumberInput';
import { CardModel } from './interface';

interface Props {
    onChange: (key: string, value: string) => void;
    loading?: boolean;
    card: CardModel;
    errors: any;
}

const CreditCard = ({ card, errors, onChange, loading = false }: Props) => {
    const countries = getFullList().map(({ value, label: text }) => ({ value, text }));
    const handleChange = (key: keyof CardModel) => ({
        target,
    }: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => onChange(key, target.value);

    return (
        <>
            <Block>
                <Label className="mb0-5 block text-cut" htmlFor="ccname">{c('Label').t`Name on card`}</Label>
                <Input
                    autoComplete="cc-name"
                    id="ccname"
                    name="ccname"
                    value={card.fullname}
                    onChange={handleChange('fullname')}
                    placeholder="Thomas Anderson"
                    error={errors.fullname}
                    disabled={loading}
                    data-testid="field-card-name"
                    required
                />
            </Block>
            <Block>
                <Label className="mb0-5 block text-cut" htmlFor="ccnumber">{c('Label').t`Card number`}</Label>
                <CardNumberInput
                    id="ccnumber"
                    value={card.number}
                    onChange={(value) => onChange('number', value)}
                    error={errors.number}
                    disabled={loading}
                    data-testid="field-card-number"
                    required
                />
            </Block>
            <div className="flex flex-justify-space-between mb1 on-tiny-mobile-flex-column">
                <div className="flex-item-fluid mr0-5 on-tiny-mobile-mr0">
                    <Label className="mb0-5 block" htmlFor="exp">{c('Label').t`Expiry date`}</Label>
                    <ExpInput
                        id="exp"
                        month={card.month}
                        year={card.year}
                        error={errors.month}
                        disabled={loading}
                        data-testid="field-card-expiry"
                        onChange={({ month, year }) => {
                            onChange('month', month);
                            onChange('year', year);
                        }}
                        required
                    />
                </div>
                <div className="flex-item-fluid ml0-5 on-tiny-mobile-ml0">
                    <Label className="mb0-5 block flex flex-align-items-center text-cut" htmlFor="cvc">
                        <span className="mr0-25">{c('Label').t`Security code`}</span>
                        <Info
                            title={c('Info')
                                .t`For Visa, MasterCard and Discover, the 3 digits on the back of your card. For American Express, the 4 digits on the front of your card.`}
                        />
                    </Label>
                    <Input
                        autoComplete="cc-csc"
                        id="cvc"
                        name="cvc"
                        value={card.cvc}
                        onChange={handleChange('cvc')}
                        placeholder="000"
                        error={errors.cvc}
                        disabled={loading}
                        data-testid="field-card-cvc"
                        required
                    />
                </div>
            </div>
            <div className="flex flex-justify-space-between mb1 on-tiny-mobile-flex-column">
                <div className="flex-item-fluid mr0-5 on-tiny-mobile-mr0">
                    <Label className="mb0-5 block" htmlFor="country">{c('Label').t`Country`}</Label>
                    <Select
                        id="country"
                        value={card.country}
                        onChange={handleChange('country')}
                        options={countries}
                        disabled={loading}
                        autoComplete="country"
                        data-testid="field-card-country"
                        title={c('Label').t`Select your country`}
                    />
                </div>
                <div className="flex-item-fluid ml0-5 on-tiny-mobile-ml0">
                    <Label className="mb0-5 block" htmlFor="postalcode">
                        {card.country === 'US' ? c('Label').t`ZIP` : c('Label').t`Postal code`}
                    </Label>
                    <Input
                        id="postalcode"
                        autoComplete="postal-code"
                        value={card.zip}
                        onChange={handleChange('zip')}
                        placeholder={card.country === 'US' ? c('Placeholder').t`ZIP` : c('Placeholder').t`Postal code`}
                        title={c('Title').t`ZIP / postal code`}
                        error={errors.zip}
                        disabled={loading}
                        minLength={3}
                        maxLength={9}
                        required
                        data-testid="field-card-postal-code"
                    />
                </div>
            </div>
        </>
    );
};

export default CreditCard;
