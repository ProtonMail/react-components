import React from 'react';
import { c } from 'ttag';
import { PLAN_NAMES, CYCLE } from 'proton-shared/lib/constants';
import {
    SubTitle,
    Bordered,
    Price,
    Loader,
    SmallButton,
    Time,
    useUser,
    useSubscription,
    useModal
} from 'react-components';

import { formatPlans } from './subscription/helpers';
import CycleDiscountBadge from './CycleDiscountBadge';
import CouponDiscountBadge from './CouponDiscountBadge';
import GiftCodeModal from './GiftCodeModal';
import CreditsModal from './CreditsModal';
import PlanPrice from './subscription/PlanPrice';

const { MONTHLY, YEARLY, TWO_YEARS } = CYCLE;

const CYCLES = {
    [MONTHLY]: c('Billing cycle').t`Monthly`,
    [YEARLY]: c('Billing cycle').t`Yearly`,
    [TWO_YEARS]: c('Billing cycle').t`2-year`
};

/**
 * Define sub-total from current subscription
 * @param {Array} plans coming from Subscription API
 * @returns {Number} subTotal
 */
const getSubTotal = (plans = []) => {
    const config = formatPlans(plans);

    return Object.entries(config).reduce((acc, [, { Amount }]) => {
        return acc + Amount;
    }, 0);
};

const BillingSection = () => {
    const { isOpen: showCreditsModal, open: openCreditsModal, close: closeCreditsModal } = useModal();
    const { isOpen: showGiftCodeModal, open: openGiftCodeModal, close: closeGiftCodeModal } = useModal();
    const [{ hasPaidMail, hasPaidVpn, Credit }] = useUser();
    const [
        { Plans = [], Cycle, Currency, CouponCode, Amount, PeriodEnd } = {},
        loadingSubscription
    ] = useSubscription();

    if (loadingSubscription) {
        return (
            <>
                <SubTitle>{c('Title').t`Billing details`}</SubTitle>
                <Loader />
            </>
        );
    }

    const { mailPlan, vpnPlan, addressAddon, domainAddon, memberAddon, vpnAddon, spaceAddon } = formatPlans(Plans);
    const subTotal = getSubTotal(Plans);

    return (
        <>
            <SubTitle>{c('Title').t`Billing details`}</SubTitle>
            <Bordered>
                {hasPaidMail ? (
                    <div className="flex-autogrid onmobile-flex-column w100 mb1">
                        <div className="flex-autogrid-item">ProtonMail plan</div>
                        <div className="flex-autogrid-item bold">{PLAN_NAMES[mailPlan.Name]}</div>
                        <div className="flex-autogrid-item">
                            <PlanPrice amount={mailPlan.Amount} currency={mailPlan.Currency} cycle={mailPlan.Cycle} />
                        </div>
                        <div className="flex-autogrid-item">
                            <CycleDiscountBadge cycle={Cycle} />
                        </div>
                    </div>
                ) : null}
                {memberAddon ? (
                    <div className="flex-autogrid onmobile-flex-column w100 mb1">
                        <div className="flex-autogrid-item">{c('Label').t`Extra users`}</div>
                        <div className="flex-autogrid-item bold">+{memberAddon.MaxMembers}</div>
                        <div className="flex-autogrid-item">
                            <PlanPrice
                                amount={memberAddon.Amount}
                                currency={memberAddon.Currency}
                                cycle={memberAddon.Cycle}
                            />
                        </div>
                        <div className="flex-autogrid-item">
                            <CycleDiscountBadge cycle={Cycle} />
                        </div>
                    </div>
                ) : null}
                {addressAddon ? (
                    <div className="flex-autogrid onmobile-flex-column w100 mb1">
                        <div className="flex-autogrid-item">{c('Label').t`Extra email addresses`}</div>
                        <div className="flex-autogrid-item bold">+{addressAddon.MaxAddresses}</div>
                        <div className="flex-autogrid-item">
                            <PlanPrice
                                amount={addressAddon.Amount}
                                currency={addressAddon.Currency}
                                cycle={addressAddon.Cycle}
                            />
                        </div>
                        <div className="flex-autogrid-item">
                            <CycleDiscountBadge cycle={Cycle} />
                        </div>
                    </div>
                ) : null}
                {spaceAddon ? (
                    <div className="flex-autogrid onmobile-flex-column w100 mb1">
                        <div className="flex-autogrid-item">{c('Label').t`Extra storage`}</div>
                        <div className="flex-autogrid-item bold">+{spaceAddon.MaxSpace}</div>
                        <div className="flex-autogrid-item">
                            <PlanPrice
                                amount={spaceAddon.Amount}
                                currency={spaceAddon.Currency}
                                cycle={spaceAddon.Cycle}
                            />
                        </div>
                        <div className="flex-autogrid-item">
                            <CycleDiscountBadge cycle={Cycle} />
                        </div>
                    </div>
                ) : null}
                {domainAddon ? (
                    <div className="flex-autogrid onmobile-flex-column w100 mb1">
                        <div className="flex-autogrid-item">{c('Label').t`Extra domains`}</div>
                        <div className="flex-autogrid-item bold">+{domainAddon.MaxDomains}</div>
                        <div className="flex-autogrid-item">
                            <PlanPrice
                                amount={domainAddon.Amount}
                                currency={domainAddon.Currency}
                                cycle={domainAddon.Cycle}
                            />
                        </div>
                        <div className="flex-autogrid-item">
                            <CycleDiscountBadge cycle={Cycle} />
                        </div>
                    </div>
                ) : null}
                {hasPaidVpn ? (
                    <div className="flex-autogrid onmobile-flex-column w100 mb1">
                        <div className="flex-autogrid-item">ProtonVPN plan</div>
                        <div className="flex-autogrid-item bold">{PLAN_NAMES[vpnPlan.Name]}</div>
                        <div className="flex-autogrid-item">
                            <PlanPrice amount={vpnPlan.Amount} currency={vpnPlan.Currency} cycle={vpnPlan.Cycle} />
                        </div>
                        <div className="flex-autogrid-item">
                            <CycleDiscountBadge cycle={Cycle} />
                        </div>
                    </div>
                ) : null}
                {vpnAddon ? (
                    <div className="flex-autogrid onmobile-flex-column w100 mb1">
                        <div className="flex-autogrid-item">{c('Label').t`Extra VPN connections`}</div>
                        <div className="flex-autogrid-item bold">+{vpnAddon.MaxVPN}</div>
                        <div className="flex-autogrid-item">
                            <PlanPrice amount={vpnAddon.Amount} currency={vpnAddon.Currency} cycle={vpnAddon.Cycle} />
                        </div>
                        <div className="flex-autogrid-item">
                            <CycleDiscountBadge cycle={Cycle} />
                        </div>
                    </div>
                ) : null}
                {CouponCode ? (
                    <div className="flex-autogrid onmobile-flex-column w100 mb1">
                        <div className="flex-autogrid-item">{c('Label').t`Sub-total`}</div>
                        <div className="flex-autogrid-item" />
                        <div className="flex-autogrid-item">
                            <PlanPrice amount={subTotal} currency={Currency} cycle={Cycle} />
                        </div>
                        <div className="flex-autogrid-item" />
                    </div>
                ) : null}
                {CouponCode ? (
                    <div className="flex-autogrid onmobile-flex-column w100 mb1">
                        <div className="flex-autogrid-item">{c('Label').t`Coupon`}</div>
                        <div className="flex-autogrid-item bold">
                            {CouponCode} <CouponDiscountBadge code={CouponCode} />
                        </div>
                        <div className="flex-autogrid-item">
                            <PlanPrice amount={Amount - subTotal} currency={Currency} cycle={Cycle} />
                        </div>
                        <div className="flex-autogrid-item" />
                    </div>
                ) : null}
                {Cycle !== MONTHLY ? (
                    <div className="flex-autogrid onmobile-flex-column w100 mb1">
                        <div className="flex-autogrid-item">{c('Label').t`Total`}</div>
                        <div className="flex-autogrid-item" />
                        <div className="flex-autogrid-item">
                            <PlanPrice amount={Amount} currency={Currency} cycle={Cycle} />
                        </div>
                        <div className="flex-autogrid-item" />
                    </div>
                ) : null}
                <div className="flex-autogrid onmobile-flex-column w100 mb1">
                    <div className="flex-autogrid-item">{c('Label').t`Amount due`}</div>
                    <div className="flex-autogrid-item bold">{CYCLES[Cycle]}</div>
                    <div className="flex-autogrid-item">
                        <Price currency={Currency}>{Amount}</Price>
                    </div>
                    <div className="flex-autogrid-item alignright">
                        <SmallButton onClick={openGiftCodeModal}>{c('Action').t`Use gift code`}</SmallButton>
                    </div>
                </div>
                <div className="flex-autogrid onmobile-flex-column w100 mb1">
                    <div className="flex-autogrid-item">{c('Label').t`Credits`}</div>
                    <div className="flex-autogrid-item" />
                    <div className="flex-autogrid-item">{Credit / 100}</div>
                    <div className="flex-autogrid-item alignright">
                        <SmallButton onClick={openCreditsModal}>{c('Action').t`Add credits`}</SmallButton>
                    </div>
                </div>
                <div className="flex-autogrid onmobile-flex-column w100">
                    <div className="flex-autogrid-item">{c('Label').t`Billing cycle end date`}</div>
                    <div className="flex-autogrid-item" />
                    <div className="flex-autogrid-item">
                        <Time>{PeriodEnd}</Time>
                    </div>
                    <div className="flex-autogrid-item" />
                </div>
            </Bordered>
            <GiftCodeModal show={showGiftCodeModal} onClose={closeGiftCodeModal} />
            <CreditsModal show={showCreditsModal} onClose={closeCreditsModal} />
        </>
    );
};

export default BillingSection;
