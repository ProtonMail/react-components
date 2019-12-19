import React from 'react';
import { useAddresses, useUser, useSubscription, useModals, PrimaryButton } from 'react-components';
import { hasMailPlus, hasVpnBasic } from 'proton-shared/lib/helpers/subscription';
import { c } from 'ttag';

import NewSubscriptionModal from './NewSubscriptionModal';

const UpsellSubscription = () => {
    const [{ hasPaidMail, hasPaidVpn }] = useUser();
    const [subscription] = useSubscription();
    const [addresses] = useAddresses();
    const hasAddresses = Array.isArray(addresses) && addresses.length > 0;
    const isFreeMail = !hasPaidMail;
    const isFreeVpn = !hasPaidVpn;
    const { createModal } = useModals();
    const upsells = [
        isFreeMail && {
            title: c('Title').t`Upgrade to ProtonMail Plus`,
            description: c('Title')
                .t`Upgrade to ProtonMail Plus to get more storage, more email addresses and more ways to customize your mailbox with folders, labels and filters. Upgrading to a paid plan also allows you to get early access to new products.`,
            upgradeButton: (
                <PrimaryButton
                    onClick={() => {
                        createModal(<NewSubscriptionModal />);
                    }}
                >{c('Action').t`Upgrade`}</PrimaryButton>
            )
        },
        hasAddresses &&
            hasMailPlus(subscription) && {
                title: c('Title').t`Upgrade to ProtonMail Professional`,
                description: c('Title')
                    .t`Ugrade to ProtonMail Professional to get multi-user support. This allows you to use ProtonMail host email for your organization and provide separate logins for each user. Professional also comes with priority support.`,
                upgradeButton: (
                    <PrimaryButton
                        onClick={() => {
                            createModal(<NewSubscriptionModal />);
                        }}
                    >{c('Action').t`Upgrade`}</PrimaryButton>
                )
            },
        isFreeVpn ||
            (hasVpnBasic(subscription) && {
                title: c('Title').t`Upgrade to ProtonVPN Plus`,
                description: c('Title')
                    .t`Upgrade to ProtonVPN Plus to get access to higher speed servers (up to 10 Gbps) and unlock advanced features such as Secure Core VPN, Tor over VPN, and access geo-blocked content (such as Netflix, Youtube, Amazon Prime, etc...).`,
                upgradeButton: (
                    <PrimaryButton
                        onClick={() => {
                            createModal(<NewSubscriptionModal />);
                        }}
                    >{c('Action').t`Upgrade`}</PrimaryButton>
                )
            })
    ]
        .filter(Boolean)
        .map(({ title = '', description = '', upgradeButton }, index) => {
            return (
                <div className="p1 bordered-container bg-global-light mb1" key={index}>
                    <strong className="bl mb1">{title}</strong>
                    <div className="flex flex-nowrap flex-items-center flex-spacebetween">
                        <p className="mt0 mr1 mb0">{description}</p>
                        {upgradeButton}
                    </div>
                </div>
            );
        });
    return upsells;
};

export default UpsellSubscription;
