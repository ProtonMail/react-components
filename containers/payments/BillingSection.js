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

import { formatPlans } from './helpers';
import CycleDiscountBadge from './CycleDiscountBadge';
import CouponDiscountBadge from './CouponDiscountBadge';
import GiftCodeModal from './GiftCodeModal';
import CreditsModal from './CreditsModal';

const { MONTHLY, YEARLY, TWO_YEARS } = CYCLE;

const CYCLES = {
    [MONTHLY]: c('Billing cycle').t`Monthly`,
    [YEARLY]: c('Billing cycle').t`Yearly`,
    [TWO_YEARS]: c('Billing cycle').t`2-year`
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

    return (
        <>
            <SubTitle>{c('Title').t`Billing details`}</SubTitle>
            <Bordered>
                {hasPaidMail ? (
                    <div className="flex-autogrid onmobile-flex-column w100 mb1">
                        <div className="flex-autogrid-item">ProtonMail plan</div>
                        <div className="flex-autogrid-item bold">{PLAN_NAMES[mailPlan.Name]}</div>
                        <div className="flex-autogrid-item">
                            <Price currency={mailPlan.Currency} suffix={c('Suffix').t`/ month`}>
                                {mailPlan.Amount / mailPlan.Cycle}
                            </Price>
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
                            <Price currency={memberAddon.Currency} suffix={c('Suffix').t`/ month`}>
                                {memberAddon.Amount / memberAddon.Cycle}
                            </Price>
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
                            <Price currency={addressAddon.Currency} suffix={c('Suffix').t`/ month`}>
                                {addressAddon.Amount / addressAddon.Cycle}
                            </Price>
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
                            <Price currency={spaceAddon.Currency} suffix={c('Suffix').t`/ month`}>
                                {spaceAddon.Amount / spaceAddon.Cycle}
                            </Price>
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
                            <Price currency={domainAddon.Currency} suffix={c('Suffix').t`/ month`}>
                                {domainAddon.Amount / domainAddon.Cycle}
                            </Price>
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
                            <Price currency={vpnPlan.Currency} suffix={c('Suffix').t`/ month`}>
                                {vpnPlan.Amount / vpnPlan.Cycle}
                            </Price>
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
                            <Price currency={vpnAddon.Currency} suffix={c('Suffix').t`/ month`}>
                                {vpnAddon.Amount / vpnAddon.Cycle}
                            </Price>
                        </div>
                        <div className="flex-autogrid-item">
                            <CycleDiscountBadge cycle={Cycle} />
                        </div>
                    </div>
                ) : null}
                {CouponCode ? (
                    <div className="flex-autogrid onmobile-flex-column w100 mb1">
                        <div className="flex-autogrid-item">{c('Label').t`Coupon`}</div>
                        <div className="flex-autogrid-item bold">
                            {CouponCode} <CouponDiscountBadge code={CouponCode} />
                        </div>
                        <div className="flex-autogrid-item" />
                        <div className="flex-autogrid-item" />
                    </div>
                ) : null}
                {Cycle !== MONTHLY ? (
                    <div className="flex-autogrid onmobile-flex-column w100 mb1">
                        <div className="flex-autogrid-item">{c('Label').t`Total`}</div>
                        <div className="flex-autogrid-item" />
                        <div className="flex-autogrid-item">
                            <Price currency={Currency} suffix={c('Suffix').t`/ month`}>
                                {Amount / Cycle}
                            </Price>
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
                    <div className="flex-autogrid-item">
                        <Price currency={Currency}>{Credit}</Price>
                    </div>
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
