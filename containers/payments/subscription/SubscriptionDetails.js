import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Button, SmallButton, useToggle } from 'react-components';

import { getSubTotal, getPlan } from './helpers';
import PlanPrice from './PlanPrice';
import { PLAN_SERVICES } from 'proton-shared/lib/constants';
import CycleDiscountBadge from '../CycleDiscountBadge';
import CouponDiscountBadge from '../CouponDiscountBadge';
import CouponForm from './CouponForm';

const { MAIL, VPN } = PLAN_SERVICES;

const TITLES = {
    mailfree: `ProtonMail (${c('Info').t`no subuscription`})`,
    vpnfree: `ProtonVPN (${c('Info').t`no subuscription`})`,
    plus: 'ProtonMail Plus',
    professional: 'ProtonMail Professional',
    visionary: 'Proton Visionary',
    vpnplus: 'ProtonVPN Plus',
    vpnbasic: 'ProtonVPN Basic'
};

const Rows = ({ model, plans }) => {
    const { visionary, plus, vpnbasic, vpnplus, professional } = model.plansMap;

    if (visionary) {
        const visionaryPlan = getPlan(plans, { name: 'visionary', cycle: model.cycle });
        return (
            <div className="flex flex-spacebetween mb1">
                <div>{TITLES.visionary}</div>
                <div>
                    <PlanPrice amount={visionaryPlan.Amount} cycle={model.cycle} currency={model.currency} />
                </div>
            </div>
        );
    }

    const mailPlanName = plus ? 'plus' : professional ? 'professional' : '';
    const vpnPlanName = vpnbasic ? 'vpnbasic' : vpnplus ? 'vpnplus' : '';
    const mailPlan = mailPlanName ? getPlan(plans, { name: mailPlanName, cycle: model.cycle }) : '';
    const vpnPlan = vpnPlanName ? getPlan(plans, { name: vpnPlanName, cycle: model.cycle }) : '';
    const mailSubTotal = getSubTotal({ ...model, plans, services: MAIL });
    const vpnSubTotal = getSubTotal({ ...model, plans, services: VPN });
    const mailTitle = `${plus || professional ? (plus ? TITLES.plus : TITLES.professional) : TITLES.mailfree}`;
    const vpnTitle = `${vpnbasic || vpnplus ? (vpnbasic ? TITLES.vpnbasic : TITLES.vpnplus) : TITLES.vpnfree}`;

    return (
        <>
            <div className="flex flex-spacebetween mb1">
                <div>
                    {mailTitle} {plus || professional ? <CycleDiscountBadge cycle={model.cycle} /> : null}
                </div>
                <div>
                    {mailPlan ? (
                        <PlanPrice amount={mailSubTotal} cycle={model.cycle} currency={model.currency} />
                    ) : (
                        c('Price').t`Free`
                    )}
                </div>
            </div>
            <div className="flex flex-spacebetween mb1">
                <div>
                    {vpnTitle} {vpnbasic || vpnplus ? <CycleDiscountBadge cycle={model.cycle} /> : null}
                </div>
                <div>
                    {vpnPlan ? (
                        <PlanPrice amount={vpnSubTotal} cycle={model.cycle} currency={model.currency} />
                    ) : (
                        c('Price').t`Free`
                    )}
                </div>
            </div>
        </>
    );
};

Rows.propTypes = {
    model: PropTypes.object,
    plans: PropTypes.array
};

const SubscriptionDetails = ({ model, plans, check, onChange }) => {
    const subTotal = getSubTotal({ ...model, plans });
    const { state, toggle } = useToggle();
    const handleRemoveCoupon = () => onChange({ ...model, coupon: '' }, true);

    return (
        <>
            <h4>{c('Title').t`Subscription details`}</h4>
            <Rows model={model} plans={plans} />
            {model.coupon ? (
                <div className="flex flex-spacebetween mb1">
                    <div className="bold">{c('Label').t`Sub-total`}</div>
                    <div className="bold">
                        <PlanPrice amount={subTotal} cycle={model.cycle} currency={model.currency} />
                    </div>
                </div>
            ) : null}
            {model.coupon ? (
                <div className="flex flex-spacebetween mb1">
                    <div>
                        <span className="mr1">
                            {c('Label').t`Coupon`} {model.coupon}
                        </span>
                        <CouponDiscountBadge code={model.coupon} />
                        <SmallButton onClick={handleRemoveCoupon}>{c('Action').t`Remove coupon`}</SmallButton>
                    </div>
                    <div>
                        <PlanPrice
                            className="color-global-success"
                            amount={check.Amount - subTotal}
                            cycle={model.cycle}
                            currency={model.currency}
                        />
                    </div>
                </div>
            ) : null}
            <div className="flex flex-spacebetween mb1">
                <div className="bold">{c('Label').t`Total`}</div>
                <div className="bold">
                    <PlanPrice amount={check.Amount} cycle={model.cycle} currency={model.currency} />
                </div>
            </div>
            {model.coupon ? null : (
                <div className="mb1">
                    {state ? (
                        <CouponForm model={model} onChange={onChange} />
                    ) : (
                        <Button onClick={toggle}>{c('Action').t`Add coupon`}</Button>
                    )}
                </div>
            )}
        </>
    );
};

SubscriptionDetails.propTypes = {
    plans: PropTypes.array.isRequired,
    model: PropTypes.object.isRequired,
    check: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default SubscriptionDetails;
