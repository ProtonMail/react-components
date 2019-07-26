import React, { useState, useEffect } from 'react';
import { c } from 'ttag';
import {
    SubTitle,
    Alert,
    ConfirmModal,
    MozillaInfoPanel,
    useSubscription,
    useApiWithoutResult,
    Button,
    Loader,
    Paragraph,
    Icon,
    Info,
    SmallButton,
    Price,
    Tooltip,
    usePlans,
    useUser,
    useToggle,
    useModals,
    useEventManager,
    useNotifications
} from 'react-components';
import { hasBit } from 'proton-shared/lib/helpers/bitset';
import { checkSubscription, deleteSubscription } from 'proton-shared/lib/api/payments';
import { CYCLE, PLAN_SERVICES, DEFAULT_CURRENCY, DEFAULT_CYCLE } from 'proton-shared/lib/constants';

import CurrencySelector from './CurrencySelector';
import CycleSelector from './CycleSelector';
import SubscriptionModal from './subscription/SubscriptionModal';
import { mergePlansMap, getCheckParams, isBundleEligible } from './subscription/helpers';
import UpgradeModal from './subscription/UpgradeModal';

const { MAIL } = PLAN_SERVICES;
const { MONTHLY, YEARLY, TWO_YEARS } = CYCLE;

const PlansSection = () => {
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const { createModal } = useModals();
    const [{ isFree, isPaid, hasPaidMail, hasPaidVpn }] = useUser();
    const [subscription = {}, loadingSubscription] = useSubscription();
    const [plans = [], loadingPlans] = usePlans();
    const { state: showPlans, toggle: togglePlans } = useToggle(!isPaid);
    const { state: showFeatures, toggle: toggleFeatures } = useToggle();
    const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
    const [cycle, setCycle] = useState(DEFAULT_CYCLE);
    const { request: requestCheckSubscription } = useApiWithoutResult(checkSubscription);
    const { request: requestDeleteSubscription } = useApiWithoutResult(deleteSubscription);
    const bundleEligible = isBundleEligible(subscription);
    const { Plans = [] } = subscription;

    const handleUnsubscribe = async () => {
        await requestDeleteSubscription();
        await call();
        createNotification({ text: c('Success').t`You have successfully unsubscribed` });
    };

    const handleOpenModal = () => {
        if (isFree) {
            return createNotification({ type: 'error', text: c('Info').t`You already have a free account` });
        }
        createModal(
            <ConfirmModal
                title={c('Title').t`Confirm downgrade`}
                onConfirm={handleUnsubscribe}
                confirm={c('Action').t`Downgrade`}
            >
                <Paragraph>{c('Info')
                    .t`This will downgrade your account to a free account. ProtonMail is free software that is supported by donations and paid accounts. Please consider making a donation so we can continue to offer the service for free.`}</Paragraph>
                <Alert>{c('Info')
                    .t`Additional addresses, custom domains, and users must be removed/disabled before performing this action.`}</Alert>
            </ConfirmModal>
        );
    };

    const handleModal = (newPlansMap) => async () => {
        if (!newPlansMap) {
            handleOpenModal();
            return;
        }

        const plansMap = mergePlansMap(newPlansMap, subscription);
        const { Coupon } = await requestCheckSubscription(getCheckParams({ plans, plansMap, currency, cycle, coupon }));
        const coupon = Coupon ? Coupon.Code : undefined; // Coupon can equals null

        createModal(<SubscriptionModal plansMap={plansMap} coupon={coupon} currency={currency} cycle={cycle} />);
    };

    useEffect(() => {
        const [{ Currency, Cycle } = {}] = plans;
        setCurrency(subscription.Currency || Currency);
        setCycle(subscription.Cycle || Cycle);
    }, [loadingSubscription, loadingPlans]);

    useEffect(() => {
        if (isFree) {
            createModal(
                <UpgradeModal onComparePlans={() => !showPlans && togglePlans()} onUpgrade={handleModal({ plus: 1 })} />
            );
        }
    }, []);

    if (subscription.isManagedByMozilla) {
        return (
            <>
                <SubTitle>{c('Title').t`Plans`}</SubTitle>
                <MozillaInfoPanel />
            </>
        );
    }

    if (loadingSubscription || loadingPlans) {
        return (
            <>
                <SubTitle>{c('Title').t`Plans`}</SubTitle>
                <Loader />
            </>
        );
    }

    const currentPlan = Plans.find(({ Type, Services }) => Type === 1 && hasBit(Services, MAIL));
    const currentPlanName = hasPaidMail ? currentPlan.Name : 'free';

    const getPrice = (planName) => {
        const plan = plans.find(({ Name }) => Name === planName);
        const monthlyPrice = (
            <Price className="h3" currency={currency} suffix={planName === 'professional' ? '/mo/user' : '/mo'}>
                {plan.Pricing[cycle] / cycle}
            </Price>
        );

        if (cycle === MONTHLY) {
            return monthlyPrice;
        }

        const billedPrice = (
            <Price key="planPrice" currency={currency} suffix={cycle === YEARLY ? '/year' : '/2-year'}>
                {plan.Pricing[cycle]}
            </Price>
        );

        return (
            <>
                <div>{monthlyPrice}</div>
                <small>{c('Info').jt`billed as ${billedPrice}`}</small>
            </>
        );
    };

    return (
        <>
            <SubTitle>{c('Title').t`Plans`}</SubTitle>
            {bundleEligible ? (
                <Alert learnMore="https://protonmail.com/support/knowledge-base/paid-plans/">{c('Info')
                    .t`Get 20% bundle discount when you purchase ProtonMail and ProtonVPN together.`}</Alert>
            ) : null}
            <Button onClick={togglePlans}>{showPlans ? c('Action').t`Hide plans` : c('Action').t`Show plans`}</Button>
            {showPlans ? (
                <>
                    <table className="pm-simple-table" data-current-plan-name={currentPlanName}>
                        <thead>
                            <tr>
                                <th />
                                <th className="aligncenter">FREE</th>
                                <th className="aligncenter">PLUS</th>
                                <th className="aligncenter">PROFESSIONAL</th>
                                <th className="aligncenter">VISIONARY</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="bg-global-muted">
                                    <Tooltip title={c('Tooltip').t`Save 20% when billed annually`}>
                                        <div className="flex flex-column">
                                            <div className="mb0-5">
                                                <CurrencySelector currency={currency} onSelect={setCurrency} />
                                            </div>
                                            <div>
                                                <CycleSelector
                                                    cycle={cycle}
                                                    onSelect={setCycle}
                                                    twoYear={subscription.Cycle === TWO_YEARS}
                                                />
                                            </div>
                                        </div>
                                    </Tooltip>
                                </td>
                                <td className="bg-global-muted aligncenter">FREE</td>
                                <td className="bg-global-muted aligncenter">{getPrice('plus')}</td>
                                <td className="bg-global-muted aligncenter">{getPrice('professional')}</td>
                                <td className="bg-global-muted aligncenter">{getPrice('visionary')}</td>
                            </tr>
                            <tr>
                                <td className="bg-global-muted">{c('Header').t`Users`}</td>
                                <td className="aligncenter">1</td>
                                <td className="aligncenter">1</td>
                                <td className="aligncenter">1-5000*</td>
                                <td className="aligncenter">6</td>
                            </tr>
                            <tr>
                                <td className="bg-global-muted">{c('Header').t`Email addresses`}</td>
                                <td className="aligncenter">1</td>
                                <td className="aligncenter">5*</td>
                                <td className="aligncenter">5 / {c('X / user').t`user`}</td>
                                <td className="aligncenter">25</td>
                            </tr>
                            <tr>
                                <td className="bg-global-muted">{c('Header').t`Storage capacity (GB)`}</td>
                                <td className="aligncenter">0.5</td>
                                <td className="aligncenter">5*</td>
                                <td className="aligncenter">5 / {c('X / user').t`user`}</td>
                                <td className="aligncenter">30</td>
                            </tr>
                            <tr>
                                <td className="bg-global-muted">
                                    <span className="mr0-5">{c('Header').t`Messages per day`}</span>
                                    <Info
                                        title={c('Tooltip').t`ProtonMail cannot be used for bulk sending or spamming`}
                                    />
                                </td>
                                <td className="aligncenter">150</td>
                                <td className="aligncenter">1000</td>
                                <td className="aligncenter">{c('Plan option').t`Unlimited`}</td>
                                <td className="aligncenter">{c('Plan option').t`Unlimited`}</td>
                            </tr>
                            {showFeatures ? (
                                <tr>
                                    <td className="bg-global-muted">{c('Header').t`Folders`}</td>
                                    <td className="aligncenter">3</td>
                                    <td className="aligncenter">200</td>
                                    <td className="aligncenter">{c('Plan option').t`Unlimited`}</td>
                                    <td className="aligncenter">{c('Plan option').t`Unlimited`}</td>
                                </tr>
                            ) : null}
                            {showFeatures ? (
                                <tr>
                                    <td className="bg-global-muted">{c('Header').t`Labels`}</td>
                                    <td className="aligncenter">3</td>
                                    <td className="aligncenter">200</td>
                                    <td className="aligncenter">{c('Plan option').t`Unlimited`}</td>
                                    <td className="aligncenter">{c('Plan option').t`Unlimited`}</td>
                                </tr>
                            ) : null}
                            <tr>
                                <td className="bg-global-muted">
                                    <span className="mr0-5">{c('Header').t`Custom domains`}</span>
                                    <Info title={c('Tooltip').t`Use your own domain name`} />
                                </td>
                                <td className="aligncenter">
                                    <Icon name="off" />
                                </td>
                                <td className="aligncenter">1*</td>
                                <td className="aligncenter">2*</td>
                                <td className="aligncenter">10</td>
                            </tr>
                            <tr>
                                <td className="bg-global-muted">
                                    <span className="mr0-5">{c('Header').t`IMAP / SMTP support`}</span>
                                    <Info title={c('Tooltip').t`Use ProtonMail with a desktop email client`} />
                                </td>
                                <td className="aligncenter">
                                    <Icon name="off" />
                                </td>
                                <td className="aligncenter">
                                    <Icon name="on" />
                                </td>
                                <td className="aligncenter">
                                    <Icon name="on" />
                                </td>
                                <td className="aligncenter">
                                    <Icon name="on" />
                                </td>
                            </tr>
                            {showFeatures ? null : (
                                <tr>
                                    <td className="bg-global-muted">{c('Header').t`Additional features`}</td>
                                    <td className="aligncenter">{c('Plan option').t`Only basic email features`}</td>
                                    <td className="aligncenter">{c('Plan option')
                                        .t`Folders, Labels, Filters, Encrypted contacts, Auto-responder and more`}</td>
                                    <td className="aligncenter">{c('Plan option')
                                        .t`All Plus features, and catch-all email, multi-user support and more`}</td>
                                    <td className="aligncenter">{c('Plan option')
                                        .t`All Professional features, limited to 6 users, includes ProtonVPN`}</td>
                                </tr>
                            )}
                            {showFeatures ? (
                                <tr>
                                    <td className="bg-global-muted">{c('Header').t`Encrypted contact details`}</td>
                                    <td className="aligncenter">
                                        <Icon name="off" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="on" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="on" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="on" />
                                    </td>
                                </tr>
                            ) : null}
                            {showFeatures ? (
                                <tr>
                                    <td className="bg-global-muted">{c('Header').t`Short address (@pm.me)`}</td>
                                    <td className="aligncenter">
                                        <Icon name="off" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="on" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="on" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="on" />
                                    </td>
                                </tr>
                            ) : null}
                            {showFeatures ? (
                                <tr>
                                    <td className="bg-global-muted">{c('Header').t`Auto-reply`}</td>
                                    <td className="aligncenter">
                                        <Icon name="off" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="on" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="on" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="on" />
                                    </td>
                                </tr>
                            ) : null}
                            {showFeatures ? (
                                <tr>
                                    <td className="bg-global-muted">{c('Header').t`Catch-all email`}</td>
                                    <td className="aligncenter">
                                        <Icon name="off" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="off" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="on" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="on" />
                                    </td>
                                </tr>
                            ) : null}
                            {showFeatures ? (
                                <tr>
                                    <td className="bg-global-muted">{c('Header').t`Multi-user support`}</td>
                                    <td className="aligncenter">
                                        <Icon name="off" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="off" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="on" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="on" />
                                    </td>
                                </tr>
                            ) : null}
                            {showFeatures ? (
                                <tr>
                                    <td className="bg-global-muted">{c('Header').t`Priority customer support`}</td>
                                    <td className="aligncenter">
                                        <Icon name="off" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="off" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="on" />
                                    </td>
                                    <td className="aligncenter">
                                        <Icon name="on" />
                                    </td>
                                </tr>
                            ) : null}
                            <tr>
                                <td className="bg-global-muted">
                                    <span className="mr0-5">ProtonVPN</span>
                                    <Info title={c('Tooltip').t`ProtonVPN keeps your Internet traffic private`} />
                                </td>
                                <td className="aligncenter">
                                    <SmallButton className="pm-button--link" onClick={handleModal({ vpnplus: 1 })}>
                                        {hasPaidVpn ? c('Action').t`Edit VPN` : c('Action').t`Add VPN`}
                                    </SmallButton>
                                </td>
                                <td className="aligncenter">
                                    <SmallButton
                                        className="pm-button--link"
                                        onClick={handleModal({ plus: 1, vpnplus: 1 })}
                                    >
                                        {hasPaidVpn ? c('Action').t`Edit VPN` : c('Action').t`Add VPN`}
                                    </SmallButton>
                                </td>
                                <td className="aligncenter">
                                    <SmallButton
                                        className="pm-button--link"
                                        onClick={handleModal({ professional: 1, vpnplus: 1 })}
                                    >
                                        {hasPaidVpn ? c('Action').t`Edit VPN` : c('Action').t`Add VPN`}
                                    </SmallButton>
                                </td>
                                <td className="aligncenter">{c('Plan option').t`Included`}</td>
                            </tr>
                            <tr>
                                <td className="bg-global-muted">
                                    <SmallButton className="pm-button--link" onClick={toggleFeatures}>
                                        {showFeatures
                                            ? c('Action').t`Hide additional features`
                                            : c('Action').t`Compare all features`}
                                    </SmallButton>
                                </td>
                                <td className="aligncenter">
                                    <SmallButton className="pm-button--primary" onClick={handleModal()}>{c('Action')
                                        .t`Update`}</SmallButton>
                                </td>
                                <td className="aligncenter">
                                    <SmallButton
                                        className="pm-button--primary"
                                        onClick={handleModal({ plus: 1, vpnplus: 1 })}
                                    >{c('Action').t`Update`}</SmallButton>
                                </td>
                                <td className="aligncenter">
                                    <SmallButton
                                        className="pm-button--primary"
                                        onClick={handleModal({ professional: 1, vpnplus: 1 })}
                                    >{c('Action').t`Update`}</SmallButton>
                                </td>
                                <td className="aligncenter">
                                    <SmallButton
                                        className="pm-button--primary"
                                        onClick={handleModal({ visionary: 1 })}
                                    >{c('Action').t`Update`}</SmallButton>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="small">* {c('Info concerning plan features').t`denotes customizable features`}</p>
                </>
            ) : null}
        </>
    );
};

export default PlansSection;
