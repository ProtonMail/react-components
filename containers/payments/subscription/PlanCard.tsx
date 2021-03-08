import React from 'react';
import { c } from 'ttag';
import { Currency, Cycle } from 'proton-shared/lib/interfaces';
import { CYCLE } from 'proton-shared/lib/constants';

import { classnames } from '../../../helpers';
import { Icon, Price, PrimaryButton } from '../../../components';

interface Props {
    planName: string;
    price: number;
    info: string;
    action: string;
    onClick: () => void;
    features: React.ReactNode[];
    currency: Currency;
    cycle: Cycle;
    isCurrentPlan?: boolean;
    disabled?: boolean;
}

const PlanCard = ({
    planName,
    price,
    info,
    action,
    onClick,
    features,
    currency,
    cycle,
    disabled,
    isCurrentPlan,
}: Props) => {
    const billedPrice = (
        <Price key="price" currency={currency}>
            {price}
        </Price>
    );
    return (
        <>
            <div
                className={classnames([
                    'bordered-container relative h100 plan-selection-plan p2',
                    isCurrentPlan && 'plan-selection-plan-current-card',
                ])}
            >
                {isCurrentPlan ? (
                    <div className="text-xs text-uppercase text-bold text-center absolute m0 plan-selection-plan-current">{c(
                        'Title'
                    ).t`Current plan`}</div>
                ) : null}
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
                <PrimaryButton onClick={onClick} disabled={disabled} className="w100">
                    {action}
                </PrimaryButton>
                {features.length ? (
                    <ul className="unstyled">
                        {features.map((feature, index) => (
                            <li key={`${index}`} className="flex flex-nowrap mb0-5">
                                <span className="flex-item-noshrink mr1">
                                    <Icon name="on" className="color-primary" />
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
