import React from 'react';
import PropTypes from 'prop-types';
import { c, msgid } from 'ttag';
import { toMap } from 'proton-shared/lib/helpers/object';
import { orderBy } from 'proton-shared/lib/helpers/array';
import { hasBit } from 'proton-shared/lib/helpers/bitset';
import { PLAN_SERVICES, PLAN_TYPES, CYCLE, PLANS, ADDON_NAMES, APPS, BLACK_FRIDAY } from 'proton-shared/lib/constants';
import humanSize from 'proton-shared/lib/helpers/humanSize';
import { getAppName } from 'proton-shared/lib/apps/helper';
import { getTimeRemaining } from 'proton-shared/lib/date/date';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';

import { Price, Time, Info, Badge, Loader } from '../../../components';
import { useConfig } from '../../../hooks';
import CycleSelector from '../CycleSelector';
import CurrencySelector from '../CurrencySelector';
import { getSubTotal } from './helpers';
import CycleDiscountBadge from '../CycleDiscountBadge';
import DiscountBadge from '../DiscountBadge';
import CheckoutRow from './CheckoutRow';

/** @type any */
const SubscriptionCheckout = ({ submit = c('Action').t`Pay`, plans = [], model, setModel, checkResult, loading }) => {
    const { APP_NAME } = useConfig();
    const driveAppName = getAppName(APPS.PROTONDRIVE);
    const isVPN = APP_NAME === APPS.PROTONVPN_SETTINGS;
    const isUpdating = !!checkResult.Additions; // Additions is present if the user is updating his current configuration by adding add-ons
    const plansMap = toMap(plans);
    const storageAddon = plans.find(({ Name }) => Name === ADDON_NAMES.SPACE);
    const addressAddon = plans.find(({ Name }) => Name === ADDON_NAMES.ADDRESS);
    const domainAddon = plans.find(({ Name }) => Name === ADDON_NAMES.DOMAIN);
    const memberAddon = plans.find(({ Name }) => Name === ADDON_NAMES.MEMBER);
    const vpnAddon = plans.find(({ Name }) => Name === ADDON_NAMES.VPN);
    const { years, months, days } = getTimeRemaining(new Date(), new Date((checkResult.PeriodEnd || 0) * 1000));
    const monthsWithYears = months + years * 12;
    const countdown = [
        monthsWithYears &&
            c('Countdown unit').ngettext(msgid`${monthsWithYears} month`, `${monthsWithYears} months`, monthsWithYears),
        days && c('Countdown unit').ngettext(msgid`${days} day`, `${days} days`, days),
    ]
        .filter(isTruthy)
        .join(', ');
    const renewalDate = <Time key="renewal-date">{checkResult.PeriodEnd}</Time>;
    const totalLabel = isUpdating ? c('Label').t`Total (${countdown})` : c('Label').t`Total`;
    const getQuantity = (name, quantity) => {
        if (isUpdating) {
            return checkResult.Additions[name] || 0;
        }
        return quantity;
    };
    const subTotal =
        getSubTotal({
            cycle: model.cycle,
            plans,
            plansMap: Object.entries(model.planIDs).reduce((acc, [planID, quantity]) => {
                const { Name } = plansMap[planID];
                acc[Name] = getQuantity(Name, quantity);
                return acc;
            }, {}),
        }) / model.cycle;

    const total = isUpdating
        ? checkResult.AmountDue - checkResult.Credit
        : checkResult.Amount + checkResult.CouponDiscount;
    const monthlyTotal = (checkResult.Amount + checkResult.CouponDiscount) / model.cycle;
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
    const hasMailPlus = collection.some(({ Name }) => Name === PLANS.PLUS);
    const hasVpnPlus = collection.some(({ Name }) => Name === PLANS.VPNPLUS);

    const getTitle = (planName, quantity) => {
        const addresses = quantity * addressAddon.MaxAddresses;
        const storage = humanSize(quantity * storageAddon.MaxSpace, 'GB');
        const domains = quantity * domainAddon.MaxDomains;
        const members = quantity * memberAddon.MaxMembers;
        const vpn = quantity * vpnAddon.MaxVPN;
        return {
            [ADDON_NAMES.ADDRESS]: c('Addon').ngettext(
                msgid`+ ${addresses} email address`,
                `+ ${addresses} email addresses`,
                addresses
            ),
            [ADDON_NAMES.SPACE]: c('Addon').t`+ ${storage} storage`,
            [ADDON_NAMES.DOMAIN]: c('Addon').ngettext(
                msgid`+ ${domains} custom domain`,
                `+ ${domains} custom domains`,
                domains
            ),
            [ADDON_NAMES.MEMBER]: c('Addon').ngettext(msgid`+ ${members} user`, `+ ${members} users`, members),
            [ADDON_NAMES.VPN]: c('Addon').ngettext(msgid`+ ${vpn} connection`, `+ ${vpn} connections`, vpn),
        }[planName];
    };

    const printSummary = (service = PLAN_SERVICES.MAIL) => {
        return collection
            .filter(({ Services, quantity }) => hasBit(Services, service) && quantity)
            .map(({ ID, Title, Pricing, Type, Name, quantity }) => {
                const update = (isUpdating && checkResult.Additions[Name]) || 0;
                return (
                    <React.Fragment key={ID}>
                        {quantity - update ? (
                            <CheckoutRow
                                className={Type === PLAN_TYPES.PLAN ? 'text-bold' : ''}
                                title={
                                    <>
                                        <span className="mr0-5 pr0-5">
                                            {Type === PLAN_TYPES.PLAN ? Title : getTitle(Name, quantity - update)}
                                        </span>
                                        {!isUpdating && [CYCLE.YEARLY, CYCLE.TWO_YEARS].includes(model.cycle) && (
                                            <span className="text-no-bold">
                                                <CycleDiscountBadge cycle={model.cycle} />
                                            </span>
                                        )}
                                    </>
                                }
                                amount={isUpdating ? 0 : ((quantity - update) * Pricing[model.cycle]) / model.cycle}
                                currency={model.currency}
                            />
                        ) : null}
                        {update ? (
                            <CheckoutRow
                                className="color-global-success"
                                title={
                                    <>
                                        <span className="mr0-5 pr0-5">{getTitle(Name, update)}</span>
                                        {[CYCLE.YEARLY, CYCLE.TWO_YEARS].includes(model.cycle) && (
                                            <span className="text-no-bold">
                                                <CycleDiscountBadge cycle={model.cycle} />
                                            </span>
                                        )}
                                    </>
                                }
                                amount={(update * Pricing[model.cycle]) / model.cycle}
                                currency={model.currency}
                            />
                        ) : null}
                    </React.Fragment>
                );
            });
    };

    return (
        <>
            <div className="flex flex-nowrap cycle-currency-selectors mb1">
                <CycleSelector
                    className="mr1"
                    loading={loading}
                    cycle={model.cycle}
                    onSelect={(newCycle) => setModel({ ...model, cycle: newCycle })}
                    options={[
                        { text: c('Billing cycle option').t`Monthly`, value: CYCLE.MONTHLY },
                        { text: c('Billing cycle option').t`Annually SAVE 20%`, value: CYCLE.YEARLY },
                        { text: c('Billing cycle option').t`Two years SAVE 33%`, value: CYCLE.TWO_YEARS },
                    ]}
                />
                <CurrencySelector
                    loading={loading}
                    currency={model.currency}
                    onSelect={(newCurrency) => setModel({ ...model, currency: newCurrency })}
                />
            </div>
            <div className="rounded mb1">
                <header className="text-sm mt0 mb0 bg-global-border text-uppercase pl1 pr1 pt0-5 pb0-5">
                    <span className="mr0-5">{c('Title').t`Plan summary`}</span>
                    {model.cycle === CYCLE.MONTHLY ? <span>{c('Info').t`(1 month subscription)`}</span> : null}
                    {model.cycle === CYCLE.YEARLY ? <span>{c('Info').t`(1 year subscription)`}</span> : null}
                    {model.cycle === CYCLE.TWO_YEARS ? <span>{c('Info').t`(2 year subscription)`}</span> : null}
                </header>
                <div className="bg-global-highlight p1">
                    {loading ? (
                        <Loader />
                    ) : (
                        <>
                            {hasMailPlan ? (
                                printSummary(PLAN_SERVICES.MAIL)
                            ) : (
                                <CheckoutRow
                                    className="text-bold"
                                    title={c('Info').t`ProtonMail Free`}
                                    amount={0}
                                    currency={model.currency}
                                />
                            )}
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
                                </div>
                            )}
                            {hasVisionary ||
                            (hasMailPlus && hasVpnPlus && model.cycle === CYCLE.TWO_YEARS) ||
                            (model.coupon === BLACK_FRIDAY.COUPON_CODE &&
                                hasMailPlus &&
                                hasVpnPlus &&
                                [CYCLE.YEARLY, CYCLE.TWO_YEARS].includes(model.cycle)) ? (
                                <div className="border-top border-top--dashed pt0-5">
                                    <CheckoutRow className="bold" title={c('Info').t`ProtonDrive`} amount={0} />
                                </div>
                            ) : null}
                        </>
                    )}
                </div>
            </div>
            {checkResult.Amount ? (
                <div className="rounded p1 mb1 bg-global-highlight">
                    {loading ? (
                        <Loader />
                    ) : (
                        <>
                            {model.coupon ? (
                                <div className="border-bottom border-bottom--dashed border-bottom--currentColor mb0-5">
                                    <CheckoutRow
                                        className="m0"
                                        title={c('Title').t`Subtotal`}
                                        amount={subTotal}
                                        currency={model.currency}
                                    />
                                    <CheckoutRow
                                        title={
                                            <>
                                                <span className="mr0-5">{c('Title').t`Coupon discount`}</span>
                                                <DiscountBadge code={model.coupon} cycle={model.cycle} />
                                            </>
                                        }
                                        amount={discount}
                                        currency={model.currency}
                                        className="text-sm mt0 mb0"
                                    />
                                </div>
                            ) : null}
                            <div className="border-bottom border-bottom--dashed border-bottom--currentColor mb0-5">
                                {[CYCLE.YEARLY, CYCLE.TWO_YEARS].includes(model.cycle) ? (
                                    <CheckoutRow
                                        title={c('Title').t`Total (monthly)`}
                                        amount={monthlyTotal}
                                        currency={model.currency}
                                        className="mt0 mb0"
                                    />
                                ) : null}
                                <CheckoutRow
                                    className="m0"
                                    title={
                                        <>
                                            <span className="mr0-5">{totalLabel}</span>
                                            {isUpdating ? (
                                                <Info
                                                    title={c('Info')
                                                        .jt`Billed to the end of your current billing cycle (renews ${renewalDate})`}
                                                />
                                            ) : null}
                                        </>
                                    }
                                    amount={total}
                                    currency={model.currency}
                                />
                            </div>
                            {checkResult.Proration || checkResult.Credit || checkResult.Gift ? (
                                <div className="border-bottom border-bottom--dashed border-bottom--currentColor mb0-5">
                                    {checkResult.Proration ? (
                                        <CheckoutRow
                                            title={
                                                <>
                                                    <span className="mr0-5">{c('Label').t`Proration`}</span>
                                                    <Info
                                                        url={
                                                            isVPN
                                                                ? 'https://protonvpn.com/support/vpn-credit-proration/'
                                                                : 'https://protonmail.com/support/knowledge-base/credit-proration/'
                                                        }
                                                    />
                                                </>
                                            }
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
                            ) : null}
                            <CheckoutRow
                                title={c('Title').t`Amount due`}
                                amount={checkResult.AmountDue}
                                currency={model.currency}
                                className="text-bold m0"
                            />
                        </>
                    )}
                    <div className="mt1">{submit}</div>
                </div>
            ) : null}
        </>
    );
};

SubscriptionCheckout.propTypes = {
    submit: PropTypes.node,
    plans: PropTypes.array.isRequired,
    checkResult: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    setModel: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

export default SubscriptionCheckout;
