import React from 'react';
import { c } from 'ttag';
import { Currency, Cycle } from 'proton-shared/lib/interfaces';
import { CYCLE } from 'proton-shared/lib/constants';

import { Icon, Price, Button, PrimaryButton } from '../../../components';

interface Props {
    planName: string;
    price: number;
    info: string;
    action: string;
    onClick: () => void;
    features: React.ReactNode[];
    currency: Currency;
    cycle: Cycle;
    isSelected: undefined | true | false;
}

const PlanCard = ({ planName, price, info, action, onClick, features, currency, cycle, isSelected }: Props) => {
    const billedPrice = (
        <Price key="price" currency={currency}>
            {price}
        </Price>
    );
    return (
        <>
            {isSelected === true ? (
                <div className="text-xs text-uppercase text-bold text-center">{c('Title').t`Your plan`}</div>
            ) : null}
            <div className="bordered-container p1">
                <h3 className="text-bold text-capitalize">{planName}</h3>
                <Price currency={currency} suffix={c('Suffix for price').t`/ month`}>
                    {price / cycle}
                </Price>
                {cycle === CYCLE.YEARLY ? (
                    <p className="text-sm">{c('Info').jt`Billed as ${billedPrice} per year`}</p>
                ) : null}
                {cycle === CYCLE.TWO_YEARS ? (
                    <p className="text-sm">{c('Info').jt`Billed as ${billedPrice} every 2 years`}</p>
                ) : null}
                <p className="text-lg">{info}</p>
                {isSelected === false ? (
                    <Button onClick={onClick} className="w100">
                        {action}
                    </Button>
                ) : (
                    <PrimaryButton onClick={onClick} className="w100">
                        {action}
                    </PrimaryButton>
                )}
                {features.length ? (
                    <ul>
                        {features.map((feature, index) => (
                            <li key={`${index}`} className="flex flex-nowrap mb0-5">
                                <span className="flex-item-noshrink mr0-5">
                                    <Icon name="check" className="color-primary" />
                                </span>
                                <span className="flex-item-fluid">{feature}</span>
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        </>
    );
};

export default PlanCard;
