import React from 'react';
import PropTypes from 'prop-types';
import { c, msgid } from 'ttag';
import { PLANS, PLAN_NAMES } from 'proton-shared/lib/constants';
import humanSize from 'proton-shared/lib/helpers/humanSize';
import percentage from 'proton-shared/lib/helpers/percentage';
import { getPlanIDs } from 'proton-shared/lib/helpers/subscription';

import { Href, Loader, Meter, Button } from '../../../components';
import { useModals, useSubscription, useOrganization, useUser, useAddresses } from '../../../hooks';
import MozillaInfoPanel from '../../account/MozillaInfoPanel';
import { formatPlans } from './helpers';
import { SettingsParagraph, SettingsSection } from '../../account';
import UpsellMailSubscription from './UpsellMailSubscription';
import UpsellVPNSubscription from './UpsellVPNSubscription';
import SettingsLayoutLeft from '../../account/SettingsLayoutLeft';
import SettingsLayout from '../../account/SettingsLayout';
import SettingsLayoutRight from '../../account/SettingsLayoutRight';
import SubscriptionModal from './SubscriptionModal';
import { SUBSCRIPTION_STEPS } from './constants';

const getVpnConnectionsText = (n) => {
    return c('Label').ngettext(msgid`${n} VPN Connection available`, `${n} VPN Connections available`, n);
};

const YourPlanSection = ({ permission }) => {
    const [user] = useUser();
    const [addresses, loadingAddresses] = useAddresses();
    const [subscription, loadingSubscription] = useSubscription();
    const { createModal } = useModals();
    const [organization, loadingOrganization] = useOrganization();
    const hasAddresses = Array.isArray(addresses) && addresses.length > 0;

    if (!permission) {
        return <SettingsParagraph>{c('Info').t`No subscription yet`}</SettingsParagraph>;
    }

    if (loadingSubscription || loadingOrganization || loadingAddresses) {
        return <Loader />;
    }

    const { Plans = [], Cycle, CouponCode, Currency, isManagedByMozilla } = subscription;

    if (isManagedByMozilla) {
        return <MozillaInfoPanel />;
    }

    const { hasPaidMail, hasPaidVpn, isFree } = user;

    /*
     * For paid users, the feature data is found on their organization,
     * however free users don't have an organization, therefore we default
     * to 1 for addresses and users.
     *
     * For space, that information is found on the user directly (also on
     * the organization if the user has a paid plan)
     */
    const {
        UsedDomains,
        MaxDomains,
        UsedSpace = user.UsedSpace,
        MaxSpace = user.MaxSpace,
        UsedAddresses = 1,
        MaxAddresses = 1,
        UsedMembers = 1,
        MaxMembers = 1,
        MaxVPN,
    } = organization || {};

    const { mailPlan, vpnPlan } = formatPlans(Plans);
    const { Name: mailPlanName } = mailPlan || {};
    const { Name: vpnPlanName } = vpnPlan || {};

    const handleModal = () => {
        createModal(
            <SubscriptionModal
                planIDs={getPlanIDs(subscription)}
                coupon={CouponCode || undefined} // CouponCode can equal null
                currency={Currency}
                cycle={Cycle}
                step={isFree ? SUBSCRIPTION_STEPS.PLAN_SELECTION : SUBSCRIPTION_STEPS.CUSTOMIZATION}
            />
        );
    };

    const mailAddons = (
        <>
            <div className="w100 pt0-5">
                {UsedMembers} {c('x of y').t`of`} {MaxMembers} {c('Label').t`Users`}
            </div>
            <div className="mt1">
                {UsedAddresses} {c('x of y').t`of`} {MaxAddresses} {c('Label').t`Email addresses`}
            </div>
            {Boolean(hasPaidMail) && (
                <div className="mt1">
                    {UsedDomains} {c('x of y').t`of`} {MaxDomains} {c('Label').t`Custom domains`}
                </div>
            )}
            <div className="mt1">
                {c('Label').t`Using`} {humanSize(UsedSpace)} {c('x of y').t`of`} {humanSize(MaxSpace)}
                <Meter className="mt1" value={Math.round(percentage(MaxSpace, UsedSpace))} />
            </div>
        </>
    );

    const MailPlanName = PLAN_NAMES[mailPlanName];

    // visionary, while considered a mail plan, is a special case because it contains mail and vpn services
    const VPNPlanName = mailPlanName === PLANS.VISIONARY ? MailPlanName : PLAN_NAMES[vpnPlanName];
    const planType = hasPaidVpn ? VPNPlanName : c('Plan').t`Free`;

    return (
        <SettingsSection>
            <div className="bordered mb2">
                <SettingsLayout className="pb1 pt1 pl2 pr2">
                    <SettingsLayoutLeft className="text-semibold">
                        {hasPaidMail ? (
                            c('Plan').t`ProtonMail ${MailPlanName}`
                        ) : hasAddresses ? (
                            c('Plan').t`ProtonMail Free`
                        ) : (
                            <Href url="https://mail.protonmail.com/login">{c('Info').t`Not activated`}</Href>
                        )}
                    </SettingsLayoutLeft>
                    <SettingsLayoutRight className="flex-item-fluid">
                        {mailAddons}
                        <UpsellMailSubscription />
                    </SettingsLayoutRight>
                </SettingsLayout>

                <SettingsLayout className="pb1 pt1 pl2 pr2 border-top">
                    <SettingsLayoutLeft className="text-semibold">
                        {c('Label').t`ProtonVPN ${planType}`}
                    </SettingsLayoutLeft>
                    <SettingsLayoutRight className="flex-item-fluid pt0-5">
                        {getVpnConnectionsText(hasPaidVpn ? MaxVPN : 1)}
                        <UpsellVPNSubscription />
                    </SettingsLayoutRight>
                </SettingsLayout>
            </div>

            <Button shape="outline" onClick={handleModal}>
                {c('Action').t`Customize subscription`}
            </Button>
        </SettingsSection>
    );
};

YourPlanSection.propTypes = {
    permission: PropTypes.bool,
};

export default YourPlanSection;
