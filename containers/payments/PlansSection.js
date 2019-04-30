import React, { useState, useEffect } from 'react';
import { c } from 'ttag';
import {
    SubTitle,
    Alert,
    useSubscription,
    Button,
    Loader,
    Icon,
    Info,
    SmallButton,
    Price,
    usePlans,
    useUser,
    useToggle
} from 'react-components';
import { hasBit } from 'proton-shared/lib/helpers/bitset';
import { CYCLE, PLAN_SERVICES } from 'proton-shared/lib/constants';

import CurrencySelector from './CurrencySelector';
import CycleSelector from './CycleSelector';

const { MAIL } = PLAN_SERVICES;
const { MONTHLY, YEARLY, TWO_YEARS } = CYCLE;

const PlansSection = () => {
    const [{ isPaid, hasPaidMail, hasPaidVpn }] = useUser();
    const [subscription = {}, loadingSubscription] = useSubscription();
    const [plans = [], loadingPlans] = usePlans();
    const { state: showPlans, toggle: togglePlans } = useToggle(!isPaid);
    const { state: showFeatures, toggle: toggleFeatures } = useToggle();
    const [currency, setCurrency] = useState();
    const [cycle, setCycle] = useState();
    const handleModal = (action) => {
        // eslint-disable-next-line no-console
        console.log('open modal', action); // TODO
    };

    useEffect(() => {
        const [{ Currency, Cycle } = {}] = plans;
        setCurrency(subscription.Currency || Currency);
        setCycle(subscription.Cycle || Cycle);
    }, [loadingSubscription, loadingPlans]);

    if (loadingSubscription || loadingPlans) {
        return (
            <>
                <SubTitle>{c('Title').t`Plans`}</SubTitle>
                <Loader />
            </>
        );
    }

    const currentPlan = subscription.Plans.find(({ Type, Services }) => Type === 1 && hasBit(Services, MAIL));
    const currentPlanName = hasPaidMail ? currentPlan.Name : 'free';

    const getPrice = (planName) => {
        const plan = plans.find(({ Name, Cycle }) => Name === planName && Cycle === cycle);
        const monthlyPrice = (
            <Price currency={currency} suffix={planName === 'professional' ? '/mo/user' : '/mo'}>
                {plan.Amount / cycle}
            </Price>
        );

        if (cycle === MONTHLY) {
            return monthlyPrice;
        }

        const billedPrice = (
            <Price key="planPrice" currency={currency} suffix={cycle === YEARLY ? '/year' : '/2-year'}>
                {plan.Amount}
            </Price>
        );

        return (
            <>
                <div>{monthlyPrice}</div>
                <small>({c('Info').jt`billed as ${billedPrice}`})</small>
            </>
        );
    };

    return (
        <>
            <SubTitle>{c('Title').t`Plans`}</SubTitle>
            <Alert>{c('Info').t`Get 20% bundle discount when you purchase ProtonMail and ProtonVPN together.`}</Alert>
            <Button onClick={togglePlans}>{showPlans ? c('Action').t`Hide plans` : c('Action').t`Show plans`}</Button>
            {showPlans ? (
                <table className="pm-simple-table" data-current-plan-name={currentPlanName}>
                    <thead>
                        <tr>
                            <th />
                            <th>FREE</th>
                            <th>PLUS</th>
                            <th>PROFESSIONAL</th>
                            <th>VISIONARY</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>
                                {c('Header').t`Pricing`}
                                <CurrencySelector currency={currency} onSelect={setCurrency} />
                                <CycleSelector
                                    cycle={cycle}
                                    onSelect={setCycle}
                                    twoYear={subscription.Cycle === TWO_YEARS}
                                />
                            </th>
                            <td>FREE</td>
                            <td>{getPrice('plus')}</td>
                            <td>{getPrice('professional')}</td>
                            <td>{getPrice('visionary')}</td>
                        </tr>
                        <tr>
                            <th>{c('Header').t`Users`}</th>
                            <td>1</td>
                            <td>1</td>
                            <td>1-5000*</td>
                            <td>6</td>
                        </tr>
                        <tr>
                            <th>{c('Header').t`Email addresses`}</th>
                            <td>1</td>
                            <td>5*</td>
                            <td>5 / {c('X / user').t`user`}</td>
                            <td>25</td>
                        </tr>
                        <tr>
                            <th>{c('Header').t`Storage capacity (GB)`}</th>
                            <td>0.5</td>
                            <td>5*</td>
                            <td>5 / {c('X / user').t`user`}</td>
                            <td>30</td>
                        </tr>
                        <tr>
                            <th>
                                {c('Header').t`Messages per day`}{' '}
                                <Info title={c('Tooltip').t`ProtonMail cannot be used for bulk sending or spamming`} />
                            </th>
                            <td>150</td>
                            <td>1000</td>
                            <td>{c('Plan option').t`Unlimited`}</td>
                            <td>{c('Plan option').t`Unlimited`}</td>
                        </tr>
                        {showFeatures ? (
                            <tr>
                                <th>{c('Header').t`Folders`}</th>
                                <td>3</td>
                                <td>200</td>
                                <td>{c('Plan option').t`Unlimited`}</td>
                                <td>{c('Plan option').t`Unlimited`}</td>
                            </tr>
                        ) : null}
                        {showFeatures ? (
                            <tr>
                                <th>{c('Header').t`Labels`}</th>
                                <td>3</td>
                                <td>200</td>
                                <td>{c('Plan option').t`Unlimited`}</td>
                                <td>{c('Plan option').t`Unlimited`}</td>
                            </tr>
                        ) : null}
                        <tr>
                            <th>
                                {c('Header').t`Custom domains`}{' '}
                                <Info title={c('Tooltip').t`Use your own domain name`} />
                            </th>
                            <td>
                                <Icon name="off" />
                            </td>
                            <td>1*</td>
                            <td>2*</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <th>
                                {c('Header').t`IMAP / SMTP support`}{' '}
                                <Info title={c('Tooltip').t`Use ProtonMail with a desktop email client`} />
                            </th>
                            <td>
                                <Icon name="off" />
                            </td>
                            <td>
                                <Icon name="on" />
                            </td>
                            <td>
                                <Icon name="on" />
                            </td>
                            <td>
                                <Icon name="on" />
                            </td>
                        </tr>
                        {showFeatures ? null : (
                            <tr>
                                <th>{c('Header').t`Additional features`}</th>
                                <td>{c('Plan option').t`Basic email features only`}</td>
                                <td>{c('Plan option')
                                    .t`Folders, Labels, Filters, Encrypted Contacts, Auto-responder and more`}</td>
                                <td>{c('Plan option')
                                    .t`All Plus features, and catch-all email, multi-user support and more`}</td>
                                <td>{c('Plan option')
                                    .t`All Professional features, limited to 6 users, includes ProtonVPN`}</td>
                            </tr>
                        )}
                        {showFeatures ? (
                            <tr>
                                <th>{c('Header').t`Encrypted contact details`}</th>
                                <td>
                                    <Icon name="off" />
                                </td>
                                <td>
                                    <Icon name="on" />
                                </td>
                                <td>
                                    <Icon name="on" />
                                </td>
                                <td>
                                    <Icon name="on" />
                                </td>
                            </tr>
                        ) : null}
                        {showFeatures ? (
                            <tr>
                                <th>{c('Header').t`Short address (@pm.me)`}</th>
                                <td>
                                    <Icon name="off" />
                                </td>
                                <td>
                                    <Icon name="on" />
                                </td>
                                <td>
                                    <Icon name="on" />
                                </td>
                                <td>
                                    <Icon name="on" />
                                </td>
                            </tr>
                        ) : null}
                        {showFeatures ? (
                            <tr>
                                <th>{c('Header').t`Auto-reply`}</th>
                                <td>
                                    <Icon name="off" />
                                </td>
                                <td>
                                    <Icon name="on" />
                                </td>
                                <td>
                                    <Icon name="on" />
                                </td>
                                <td>
                                    <Icon name="on" />
                                </td>
                            </tr>
                        ) : null}
                        {showFeatures ? (
                            <tr>
                                <th>{c('Header').t`Catch-all email`}</th>
                                <td>
                                    <Icon name="off" />
                                </td>
                                <td>
                                    <Icon name="off" />
                                </td>
                                <td>
                                    <Icon name="on" />
                                </td>
                                <td>
                                    <Icon name="on" />
                                </td>
                            </tr>
                        ) : null}
                        {showFeatures ? (
                            <tr>
                                <th>{c('Header').t`Multi-user support`}</th>
                                <td>
                                    <Icon name="off" />
                                </td>
                                <td>
                                    <Icon name="off" />
                                </td>
                                <td>
                                    <Icon name="on" />
                                </td>
                                <td>
                                    <Icon name="on" />
                                </td>
                            </tr>
                        ) : null}
                        {showFeatures ? (
                            <tr>
                                <th>{c('Header').t`Priority customer support`}</th>
                                <td>
                                    <Icon name="off" />
                                </td>
                                <td>
                                    <Icon name="off" />
                                </td>
                                <td>
                                    <Icon name="on" />
                                </td>
                                <td>
                                    <Icon name="on" />
                                </td>
                            </tr>
                        ) : null}
                        <tr>
                            <th>
                                ProtonVPN <Info title={c('Tooltip').t`ProtonVPN keeps your Internet traffic private`} />
                            </th>
                            <td>
                                <SmallButton onClick={handleModal('vpn')}>
                                    {hasPaidVpn ? c('Action').t`Edit VPN` : c('Action').t`Add VPN`}
                                </SmallButton>
                            </td>
                            <td>
                                <SmallButton onClick={handleModal('vpn')}>
                                    {hasPaidVpn ? c('Action').t`Edit VPN` : c('Action').t`Add VPN`}
                                </SmallButton>
                            </td>
                            <td>
                                <SmallButton onClick={handleModal('vpn')}>
                                    {hasPaidVpn ? c('Action').t`Edit VPN` : c('Action').t`Add VPN`}
                                </SmallButton>
                            </td>
                            <td>{c('Plan option').t`Included`}</td>
                        </tr>
                        <tr>
                            <th>
                                <SmallButton onClick={toggleFeatures}>
                                    {showFeatures ? c('Action').t`Hide` : c('Action').t`Compare all features`}
                                </SmallButton>
                            </th>
                            <td>
                                <SmallButton
                                    className="pm-button--primary"
                                    disabled={currentPlanName === 'free'}
                                    onClick={handleModal('free')}
                                >{c('Action').t`Select`}</SmallButton>
                            </td>
                            <td>
                                <SmallButton
                                    className="pm-button--primary"
                                    disabled={currentPlanName === 'plus'}
                                    onClick={handleModal('plus')}
                                >{c('Action').t`Select`}</SmallButton>
                            </td>
                            <td>
                                <SmallButton
                                    className="pm-button--primary"
                                    disabled={currentPlanName === 'professional'}
                                    onClick={handleModal('professional')}
                                >{c('Action').t`Select`}</SmallButton>
                            </td>
                            <td>
                                <SmallButton
                                    className="pm-button--primary"
                                    disabled={currentPlanName === 'visionary'}
                                    onClick={handleModal('visionary')}
                                >{c('Action').t`Select`}</SmallButton>
                            </td>
                        </tr>
                    </tbody>
                </table>
            ) : null}
        </>
    );
};

export default PlansSection;
