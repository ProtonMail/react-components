import React from 'react';
import PropTypes from 'prop-types';
import { c, msgid } from 'ttag';
import { CurrencySelector, CycleSelector, Loader, Price, useOrganization, classnames } from 'react-components';
import { isLoyal } from 'proton-shared/lib/helpers/organization';
import { toMap } from 'proton-shared/lib/helpers/object';
import { orderBy } from 'proton-shared/lib/helpers/array';
import { hasBit } from 'proton-shared/lib/helpers/bitset';
import {
    PLAN_SERVICES,
    PLAN_TYPES,
    CYCLE,
    LOYAL_BONUS_STORAGE,
    LOYAL_BONUS_CONNECTION,
    PLANS,
    ADDON_NAMES
} from 'proton-shared/lib/constants';
import humanSize from 'proton-shared/lib/helpers/humanSize';

import { getSubTotal } from './helpers';
import CycleDiscountBadge from '../CycleDiscountBadge';
import DiscountBadge from '../DiscountBadge';

const CheckoutRow = ({ title, amount = 0, currency, className = '' }) => {
    return (
        <div className={classnames(['flex flex-nowrap flex-spacebetween mb0-5', className])}>
            <div>{title}</div>
            <Price className={amount < 0 ? 'color-global-success' : ''} currency={currency}>
                {amount}
            </Price>
        </div>
    );
};

CheckoutRow.propTypes = {
    className: PropTypes.string,
    title: PropTypes.node.isRequired,
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired
};

const SubscriptionCheckout = ({ submit = c('Action').t`Pay`, plans = [], model, setModel, checkResult, loading }) => {
    const plansMap = toMap(plans);
    const storageAddon = plans.find(({ Name }) => Name === ADDON_NAMES.SPACE);
    const addressAddon = plans.find(({ Name }) => Name === ADDON_NAMES.ADDRESS);
    const domainAddon = plans.find(({ Name }) => Name === ADDON_NAMES.DOMAIN);
    const memberAddon = plans.find(({ Name }) => Name === ADDON_NAMES.MEMBER);
    const vpnAddon = plans.find(({ Name }) => Name === ADDON_NAMES.VPN);
    const [organization, loadingOrganization] = useOrganization();
    const loyal = isLoyal(organization);
    const subTotal =
        getSubTotal({
            cycle: model.cycle,
            plans,
            plansMap: Object.entries(model.planIDs).reduce((acc, [planID, quantity]) => {
                const { Name } = plansMap[planID];
                acc[Name] = quantity;
                return acc;
            }, {})
        }) / model.cycle;
    const total = checkResult.Amount + checkResult.CouponDiscount;
    const monthlyTotal = total / model.cycle;
    const discount = monthlyTotal - subTotal;
    const collection = orderBy(
        Object.entries(model.planIDs).map(([planID, quantity]) => ({ ...plansMap[planID], quantity })),
        'Type'
    ).reverse(); // We need to reverse because: plan type = 1, addon type = 0
    const hasMailPlan = collection.some(
        ({ Type, Services }) => Type === PLAN_TYPES.PLAN && hasBit(Services, PLAN_SERVICES.MAIL)
    );
    const hasVpnPlan = collection.some(
        ({ Type, Services }) => Type === PLAN_TYPES.PLAN && hasBit(Services, PLAN_SERVICES.VPN)
    );
    const hasVisionary = collection.some(({ Name }) => Name === PLANS.VISIONARY);

    if (loadingOrganization) {
        return <Loader />;
    }

    const bonusStorage = humanSize(LOYAL_BONUS_STORAGE, 'GB');

    const getTitle = (planName, quantity) => {
        const addresses = quantity * addressAddon.MaxAddresses;
        const storage = humanSize(quantity * storageAddon.MaxSpace, 'GB');
        const domains = quantity * domainAddon.MaxDomains;
        const members = quantity * memberAddon.MaxMembers;
        const vpn = quantity * vpnAddon.MaxVPN;
        return {
            [ADDON_NAMES.ADDRESS]: c('Addon').t`+ ${addresses} email addresses`,
            [ADDON_NAMES.SPACE]: c('Addon').t`+ ${storage} storage`,
            [ADDON_NAMES.DOMAIN]: c('Addon').ngettext(
                msgid`+ ${domains} custom domain`,
                `+ ${domains} custom domains`,
                domains
            ),
            [ADDON_NAMES.MEMBER]: c('Addon').ngettext(msgid`+ ${members} user`, `+ ${members} users`, members),
            [ADDON_NAMES.VPN]: c('Addon').ngettext(msgid`+ ${vpn} connection`, `+ ${vpn} connections`, vpn)
        }[planName];
    };

    const printSummary = (service = PLAN_SERVICES.MAIL) => {
        return collection
            .filter(({ Services }) => hasBit(Services, service))
            .map(({ ID, Title, Pricing, Type, Name, quantity }) => {
                return (
                    <CheckoutRow
                        key={ID}
                        className={Type === PLAN_TYPES.PLAN ? 'bold' : ''}
                        title={
                            <>
                                <span className="mr0-5">
                                    {Type === PLAN_TYPES.PLAN ? Title : getTitle(Name, quantity)}
                                </span>
                                {[CYCLE.YEARLY, CYCLE.TWO_YEARS].includes(model.cycle) && (
                                    <CycleDiscountBadge cycle={model.cycle} />
                                )}
                            </>
                        }
                        amount={(quantity * Pricing[model.cycle]) / model.cycle}
                        currency={model.currency}
                    />
                );
            });
    };

    return (
        <>
            <div className="flex flex-nowrap mb1">
                <CycleSelector
                    className="mr1"
                    loading={loading}
                    cycle={model.cycle}
                    onSelect={(newCycle) => setModel({ ...model, cycle: newCycle })}
                />
                <CurrencySelector
                    currency={model.currency}
                    onSelect={(newCurrency) => setModel({ ...model, currency: newCurrency })}
                />
            </div>
            <div className="rounded mb1">
                <header className="small mt0 mb0 bg-global-border uppercase pl1 pr1 pt0-5 pb0-5">{c('Title')
                    .t`Plan summary`}</header>
                <div className="bg-global-light p1">
                    <div className="">
                        {hasMailPlan ? (
                            printSummary(PLAN_SERVICES.MAIL)
                        ) : (
                            <CheckoutRow
                                className="bold"
                                title={c('Info').t`ProtonMail Free`}
                                amount={0}
                                currency={model.currency}
                            />
                        )}
                        {loyal && (
                            <CheckoutRow
                                title={c('Info').t`+ ${bonusStorage} bonus storage`}
                                amount={0}
                                currency={model.currency}
                            />
                        )}
                        {hasVisionary && loyal && (
                            <CheckoutRow
                                title={c('Info').t`+ ${LOYAL_BONUS_CONNECTION} bonus connections`}
                                amount={0}
                                currency={model.currency}
                            />
                        )}
                    </div>
                    {hasVisionary ? null : (
                        <div className="border-top border-top--dashed pt0-5">
                            {hasVpnPlan ? (
                                printSummary(PLAN_SERVICES.VPN)
                            ) : (
                                <CheckoutRow
                                    className="bold"
                                    title={c('Info').t`ProtonVPN Free`}
                                    amount={0}
                                    currency={model.currency}
                                />
                            )}
                            {loyal && (
                                <CheckoutRow
                                    title={c('Info').t`+ ${LOYAL_BONUS_CONNECTION} bonus connections`}
                                    amount={0}
                                    currency={model.currency}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
            {checkResult.Amount ? (
                <div className="rounded p1 mb1 bg-global-light">
                    {model.coupon ? (
                        <div className="border-bottom border-bottom--dashed mb0-5">
                            <CheckoutRow title={c('Title').t`Sub-total`} amount={subTotal} currency={model.currency} />
                            <CheckoutRow
                                title={
                                    <>
                                        <span className="mr0-5">{c('Title').t`Coupon discount`}</span>
                                        <DiscountBadge code={model.coupon} cycle={model.cycle} />
                                    </>
                                }
                                amount={discount}
                                currency={model.currency}
                                className="small mt0 mb0"
                            />
                        </div>
                    ) : null}
                    <div className="border-bottom border-bottom--dashed mb0-5">
                        {[CYCLE.YEARLY, CYCLE.TWO_YEARS].includes(model.cycle) ? (
                            <CheckoutRow
                                title={c('Title').t`Total (monthly)`}
                                amount={monthlyTotal}
                                currency={model.currency}
                                className="small mt0 mb0"
                            />
                        ) : null}
                        <CheckoutRow title={c('Title').t`Total`} amount={total} currency={model.currency} />
                        {checkResult.Proration ? (
                            <CheckoutRow
                                title={c('Title').t`Proration`}
                                amount={checkResult.Proration}
                                currency={model.currency}
                                className="small mt0 mb0"
                            />
                        ) : null}
                        {checkResult.Credit ? (
                            <CheckoutRow
                                title={c('Title').t`Credits`}
                                amount={checkResult.Credit}
                                currency={model.currency}
                                className="small mt0 mb0"
                            />
                        ) : null}
                        {checkResult.Gift ? (
                            <CheckoutRow
                                title={c('Title').t`Gift code`}
                                amount={checkResult.Gift}
                                currency={model.currency}
                                className="small mt0 mb0"
                            />
                        ) : null}
                    </div>
                    <CheckoutRow
                        title={c('Title').t`Amount due`}
                        amount={checkResult.AmountDue}
                        currency={model.currency}
                        className="bold"
                    />
                    <div className="mt1">{submit}</div>
                </div>
            ) : null}
        </>
    );
};

SubscriptionCheckout.propTypes = {
    disabled: PropTypes.bool,
    submit: PropTypes.node,
    plans: PropTypes.array.isRequired,
    checkResult: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    setModel: PropTypes.func.isRequired,
    onCheckout: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

export default SubscriptionCheckout;
