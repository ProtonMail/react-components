import React from 'react';
import PropTypes from 'prop-types';
import { c, msgid } from 'ttag';
import { PLAN_NAMES, CYCLE } from 'proton-shared/lib/constants';
import { unique } from 'proton-shared/lib/helpers/array';
import { getMonthlyBaseAmount, hasVisionary } from 'proton-shared/lib/helpers/subscription';
import humanSize from 'proton-shared/lib/helpers/humanSize';

import { Alert, Loader, LinkButton, Time, Info } from '../../components';
import { useUser, useSubscription, useOrganization, useModals, usePlans } from '../../hooks';
import { classnames } from '../../helpers';
import { SettingsSection } from '../account';
import MozillaInfoPanel from '../account/MozillaInfoPanel';
import { formatPlans } from './subscription/helpers';
import DiscountBadge from './DiscountBadge';
import GiftCodeModal from './GiftCodeModal';
import CreditsModal from './CreditsModal';
import PlanPrice from './subscription/PlanPrice';
// import NewSubscriptionModal from './subscription/NewSubscriptionModal';
import CycleDiscountBadge from './CycleDiscountBadge';

const { MONTHLY, YEARLY, TWO_YEARS } = CYCLE;

const getCyclesI18N = () => ({
    [MONTHLY]: c('Billing cycle').t`Monthly`,
    [YEARLY]: c('Billing cycle').t`Yearly`,
    [TWO_YEARS]: c('Billing cycle').t`2-year`,
});

const BillingSection = ({ permission }) => {
    const i18n = getCyclesI18N();
    const { createModal } = useModals();
    const [{ hasPaidMail, hasPaidVpn, Credit }] = useUser();
    const [plans, loadingPlans] = usePlans();
    const [subscription, loadingSubscription] = useSubscription();
    const [organization, loadingOrganization] = useOrganization();
    const handleOpenGiftCodeModal = () => createModal(<GiftCodeModal />);
    const handleOpenCreditsModal = () => createModal(<CreditsModal />);

    // const handleOpenSubscriptionModal = () =>
    //     createModal(
    //         <NewSubscriptionModal
    //             planIDs={getPlanIDs(subscription)}
    //             coupon={subscription.CouponCode}
    //             currency={subscription.Currency}
    //             cycle={YEARLY}
    //         />
    //     );

    if (!permission) {
        return (
            <>
                <Alert>{c('Info').t`There are no billing details available for your current subscription.`}</Alert>
                <div className="bg-global-highlight mb1 pt1 pl1 pr1">
                    <div className="flex-autogrid on-mobile-flex-column w100 mb1">
                        <div className="flex-autogrid-item">{c('Label').t`Credits`}</div>
                        <div className="flex-autogrid-item">
                            <LinkButton className="p0" onClick={handleOpenCreditsModal}>{c('Action')
                                .t`Add credits`}</LinkButton>
                        </div>
                        <div className="text-right">{Credit / 100}</div>
                    </div>
                    <div className="flex-autogrid on-mobile-flex-column w100">
                        <div className="flex-autogrid-item">
                            {c('Label').t`Gift code`}{' '}
                            <Info
                                title={c('Info')
                                    .t`If you purchased a gift code or received one from our support team, you can enter it here.`}
                            />
                        </div>
                        <div className="flex-autogrid-item">
                            <LinkButton className="p0" onClick={handleOpenGiftCodeModal}>{c('Action')
                                .t`Use gift code`}</LinkButton>
                        </div>
                        <div className="flex-autogrid-item" />
                    </div>
                </div>
            </>
        );
    }

    if (loadingSubscription || loadingPlans || loadingOrganization) {
        return <Loader />;
    }

    if (subscription.ManagedByMozilla) {
        return <MozillaInfoPanel />;
    }

    const { Plans = [], Cycle, Currency, CouponCode, Amount, PeriodEnd } = subscription;
    const { mailPlan, vpnPlan, addressAddon, domainAddon, memberAddon, vpnAddon, spaceAddon } = formatPlans(Plans);
    const subTotal = unique(Plans.map(({ Name }) => Name)).reduce((acc, planName) => {
        return acc + getMonthlyBaseAmount(planName, plans, subscription);
    }, 0);
    const discount = Amount / Cycle - subTotal;
    const spaceBonus = organization?.BonusSpace;
    const vpnBonus = organization?.BonusVPN;

    const priceRowClassName = 'flex w100 mb1 color-global-altgrey';
    const priceLabelClassName = 'flex-item-fluid';

    return (
        <SettingsSection>
            {hasPaidMail ? (
                <div className="border-bottom on-mobile-pb1">
                    {mailPlan ? (
                        <div className={classnames([priceRowClassName, 'text-bold'])}>
                            <div className={priceLabelClassName}>
                                {c('Label').t`ProtonMail`} {PLAN_NAMES[mailPlan.Name]}
                            </div>
                            <div className="text-right">
                                <PlanPrice
                                    amount={getMonthlyBaseAmount(mailPlan.Name, plans, subscription)}
                                    currency={Currency}
                                    cycle={MONTHLY}
                                />
                            </div>
                        </div>
                    ) : null}
                    {memberAddon ? (
                        <div className={priceRowClassName}>
                            <div className={priceLabelClassName}>
                                +{' '}
                                {c('Addon unit for subscription').ngettext(
                                    msgid`${memberAddon?.MaxMembers || 5} user`,
                                    `${memberAddon?.MaxMembers || 5} users`,
                                    memberAddon?.MaxMembers || 5
                                )}
                            </div>
                            <div className="text-right">
                                <PlanPrice
                                    amount={getMonthlyBaseAmount(memberAddon.Name, plans, subscription)}
                                    currency={Currency}
                                    cycle={MONTHLY}
                                />
                            </div>
                        </div>
                    ) : null}
                    {addressAddon ? (
                        <div className={priceRowClassName}>
                            <div className={priceLabelClassName}>
                                +{' '}
                                {c('Addon unit for subscription').ngettext(
                                    msgid`${addressAddon?.MaxAddresses || 5} address`,
                                    `${addressAddon?.MaxAddresses || 5} addresses`,
                                    addressAddon?.MaxAddresses || 5
                                )}
                            </div>
                            <div className="text-right">
                                <PlanPrice
                                    amount={getMonthlyBaseAmount(addressAddon.Name, plans, subscription)}
                                    currency={Currency}
                                    cycle={MONTHLY}
                                />
                            </div>
                        </div>
                    ) : null}
                    {spaceAddon ? (
                        <div className={priceRowClassName}>
                            <div className={priceLabelClassName}>
                                + {humanSize(spaceAddon?.MaxSpace || 2 ** 30)} {c('Label').t`extra storage`}
                            </div>
                            <div className="text-right">
                                <PlanPrice
                                    amount={getMonthlyBaseAmount(spaceAddon.Name, plans, subscription)}
                                    currency={Currency}
                                    cycle={MONTHLY}
                                />
                            </div>
                        </div>
                    ) : null}
                    {spaceBonus ? (
                        <div className={priceRowClassName}>
                            <div className={priceLabelClassName}>
                                + {humanSize(spaceBonus)} {c('Label').t`bonus storage`}
                            </div>
                            <div className="text-right">
                                <PlanPrice amount={0} currency={Currency} cycle={MONTHLY} />
                            </div>
                        </div>
                    ) : null}
                    {domainAddon ? (
                        <div className={priceRowClassName}>
                            <div className={priceLabelClassName}>
                                +{' '}
                                {c('Addon unit for subscription').ngettext(
                                    msgid`${domainAddon?.MaxDomains || 5} domain`,
                                    `${domainAddon?.MaxDomains || 5} domains`,
                                    domainAddon?.MaxDomains || 5
                                )}
                            </div>
                            <div className="text-right">
                                <PlanPrice
                                    amount={getMonthlyBaseAmount(domainAddon.Name, plans, subscription)}
                                    currency={Currency}
                                    cycle={MONTHLY}
                                />
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}
            {hasPaidVpn && !hasVisionary(subscription) ? (
                <div className="border-bottom pt1 on-mobile-pb1">
                    {vpnPlan ? (
                        <div className={classnames([priceRowClassName, 'text-bold'])}>
                            <div className={priceLabelClassName}>
                                {c('Label').t`ProtonVPN`} {PLAN_NAMES[vpnPlan.Name]}
                            </div>
                            <div className="text-right">
                                <PlanPrice
                                    amount={getMonthlyBaseAmount(vpnPlan.Name, plans, subscription)}
                                    currency={Currency}
                                    cycle={MONTHLY}
                                />
                            </div>
                        </div>
                    ) : null}
                    {vpnAddon ? (
                        <div className={priceRowClassName}>
                            <div className={priceLabelClassName}>
                                +{' '}
                                {c('Addon unit for subscription').ngettext(
                                    msgid`${vpnAddon?.MaxVPN || 5} connection`,
                                    `${vpnAddon?.MaxVPN || 5} connections`,
                                    vpnAddon?.MaxVPN || 5
                                )}
                            </div>
                            <div className="text-right">
                                <PlanPrice
                                    amount={getMonthlyBaseAmount(vpnAddon.Name, plans, subscription)}
                                    currency={Currency}
                                    cycle={MONTHLY}
                                />
                            </div>
                        </div>
                    ) : null}
                    {vpnBonus ? (
                        <div className={priceRowClassName}>
                            <div className={priceLabelClassName}>
                                +{' '}
                                {c('Addon unit for subscription').ngettext(
                                    msgid`${vpnBonus} connection`,
                                    `${vpnBonus} connections`,
                                    vpnBonus
                                )}
                            </div>
                            <div className="text-right">
                                <PlanPrice amount={0} currency={Currency} cycle={MONTHLY} />
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}
            {CouponCode || [YEARLY, TWO_YEARS].includes(Cycle) ? (
                <div className="border-bottom pt1 on-mobile-pb1">
                    <div className={classnames([priceRowClassName, 'text-bold'])}>
                        <div className={priceLabelClassName}>{c('Label').t`Subtotal`}</div>
                        <div className="text-right">
                            <PlanPrice amount={subTotal} currency={Currency} cycle={MONTHLY} />
                        </div>
                    </div>
                    <div className={priceRowClassName}>
                        <div className={classnames([priceLabelClassName, 'flex flex-align-items-center'])}>
                            <div className="mr1">{c('Label').t`Discount`}</div>
                            <div className="flex flex-align-items-center">
                                {CouponCode ? (
                                    <>
                                        <code>{CouponCode}</code>&nbsp;
                                        <DiscountBadge code={CouponCode} />
                                    </>
                                ) : (
                                    <CycleDiscountBadge cycle={Cycle} />
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <PlanPrice amount={discount} currency={Currency} cycle={MONTHLY} />
                        </div>
                    </div>
                </div>
            ) : null}
            <div className="pt1">
                <div className={classnames([priceRowClassName, 'text-bold'])}>
                    <div className={priceLabelClassName}>{c('Label').t`Total`}</div>
                    <div className="text-right">
                        <PlanPrice amount={Amount} currency={Currency} cycle={Cycle} />
                    </div>
                </div>
            </div>
            <div className={classnames([priceRowClassName, 'text-right mt1'])}>
                <div className="text-right w100">
                    {i18n[Cycle]} billing (Renewal on <Time>{PeriodEnd}</Time>)
                </div>
            </div>
        </SettingsSection>
    );
};

BillingSection.propTypes = {
    permission: PropTypes.bool,
};

export default BillingSection;
