import React from 'react';
import { useUser, useSubscription, useModals, usePlans, PrimaryButton, Loader } from 'react-components';
import { hasMailPlus, hasVpnBasic, removeService } from 'proton-shared/lib/helpers/subscription';
import { DEFAULT_CURRENCY, DEFAULT_CYCLE, PLAN_SERVICES, PLANS } from 'proton-shared/lib/constants';
import { toMap } from 'proton-shared/lib/helpers/object';
import { c } from 'ttag';

import NewSubscriptionModal from './NewSubscriptionModal';

const UpsellSubscription = () => {
    const [{ hasPaidMail, hasPaidVpn }, loadingUser] = useUser();
    const [subscription, loadingSubscription] = useSubscription();
    const [plans, loadingPlans] = usePlans();
    const { Currency = DEFAULT_CURRENCY, Cycle = DEFAULT_CYCLE, Plans = [] } = subscription || {};
    const isFreeMail = !hasPaidMail;
    const isFreeVpn = !hasPaidVpn;
    const { createModal } = useModals();

    if (loadingUser || loadingSubscription || loadingPlans) {
        return <Loader />;
    }

    const plansMap = toMap(plans, 'Name');
    const planIDs = Plans.reduce((acc, { ID, Quantity }) => {
        acc[ID] = Quantity;
        return acc;
    }, {});

    return [
        isFreeMail && {
            title: c('Title').t`Upgrade to ProtonMail Plus`,
            description: c('Title')
                .t`Upgrade to ProtonMail Plus to get more storage, more email addresses and more ways to customize your mailbox with folders, labels and filters. Upgrading to a paid plan also allows you to get early access to new products.`,
            upgradeButton: (
                <PrimaryButton
                    className="pm-button--small flex-item-noshrink"
                    onClick={() => {
                        createModal(
                            <NewSubscriptionModal
                                currency={Currency}
                                cycle={Cycle}
                                planIDs={{
                                    ...removeService(planIDs, plans, PLAN_SERVICES.MAIL),
                                    [plansMap[PLANS.PLUS].ID]: 1
                                }}
                            />
                        );
                    }}
                >{c('Action').t`Upgrade`}</PrimaryButton>
            )
        },
        hasMailPlus(subscription) && {
            title: c('Title').t`Upgrade to ProtonMail Professional`,
            description: c('Title')
                .t`Ugrade to ProtonMail Professional to get multi-user support. This allows you to use ProtonMail host email for your organization and provide separate logins for each user. Professional also comes with priority support.`,
            upgradeButton: (
                <PrimaryButton
                    className="pm-button--small flex-item-noshrink"
                    onClick={() => {
                        createModal(
                            <NewSubscriptionModal
                                currency={Currency}
                                cycle={Cycle}
                                planIDs={{
                                    ...removeService(planIDs, plans, PLAN_SERVICES.MAIL),
                                    [plansMap[PLANS.PROFESSIONAL].ID]: 1
                                }}
                            />
                        );
                    }}
                >{c('Action').t`Upgrade`}</PrimaryButton>
            )
        },
        (isFreeVpn || hasVpnBasic(subscription)) && {
            title: c('Title').t`Upgrade to ProtonVPN Plus`,
            description: c('Title')
                .t`Upgrade to ProtonVPN Plus to get access to higher speed servers (up to 10 Gbps) and unlock advanced features such as Secure Core VPN, Tor over VPN, and access geo-blocked content (such as Netflix, Youtube, Amazon Prime, etc...).`,
            upgradeButton: (
                <PrimaryButton
                    className="pm-button--small flex-item-noshrink"
                    onClick={() => {
                        createModal(
                            <NewSubscriptionModal
                                currency={Currency}
                                cycle={Cycle}
                                planIDs={{
                                    ...removeService(planIDs, plans, PLAN_SERVICES.VPN),
                                    [plansMap[PLANS.VPNPLUS].ID]: 1
                                }}
                            />
                        );
                    }}
                >{c('Action').t`Upgrade`}</PrimaryButton>
            )
        }
    ]
        .filter(Boolean)
        .map(({ title = '', description = '', upgradeButton }, index) => {
            return (
                <div className="p1 bordered-container bg-global-light mb1" key={index}>
                    <strong className="bl mb1">{title}</strong>
                    <div className="flex flex-nowrap flex-items-center">
                        <p className="flex-item-fluid mt0 mb0 pr2">{description}</p>
                        {upgradeButton}
                    </div>
                </div>
            );
        });
};

export default UpsellSubscription;
