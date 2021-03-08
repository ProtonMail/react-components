import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { PLAN_NAMES } from 'proton-shared/lib/constants';
import humanSize from 'proton-shared/lib/helpers/humanSize';
import { identity } from 'proton-shared/lib/helpers/function';
import percentage from 'proton-shared/lib/helpers/percentage';
import { getPlanIDs } from 'proton-shared/lib/helpers/subscription';
import { Alert, Href, Loader, Meter, Label, Button } from '../../../components';
import { useModals, useSubscription, useOrganization, useUser, useAddresses } from '../../../hooks';
import MozillaInfoPanel from '../../account/MozillaInfoPanel';

import { formatPlans } from './helpers';
import NewSubscriptionModal from './NewSubscriptionModal';
import { SettingsSection } from '../../account';
import UpsellMailSubscription from './UpsellMailSubscription';
import UpsellVPNSubscription from './UpsellVPNSubscription';

const AddonRow = ({ label, used, max, format = identity }) => {
    return (
        <div className="flex-autogrid on-mobile-flex-column w100 mb1">
            <div className="flex-autogrid-item pl1">{label}</div>
            <div className="flex-autogrid-item">
                <strong>
                    {Number.isInteger(used) ? `${format(used)} ${c('x of y').t`of`} ${format(max)}` : format(max)}
                </strong>
            </div>
            <div className="flex-autogrid-item">
                {Number.isInteger(Math.round(percentage(max, used))) ? (
                    <Meter value={Math.round(percentage(max, used))} />
                ) : null}
            </div>
        </div>
    );
};

AddonRow.propTypes = {
    label: PropTypes.string.isRequired,
    used: PropTypes.number,
    max: PropTypes.number.isRequired,
    format: PropTypes.func,
};

const YourPlanSection = ({ permission }) => {
    const [{ hasPaidMail, hasPaidVpn }] = useUser();
    const [addresses, loadingAddresses] = useAddresses();
    const [subscription, loadingSubscription] = useSubscription();
    const { createModal } = useModals();
    const [organization, loadingOrganization] = useOrganization();
    const hasAddresses = Array.isArray(addresses) && addresses.length > 0;

    if (!permission) {
        return <Alert>{c('Info').t`No subscription yet`}</Alert>;
    }

    if (loadingSubscription || loadingOrganization || loadingAddresses) {
        return <Loader />;
    }

    const { Plans = [], Cycle, CouponCode, Currency, isManagedByMozilla } = subscription;

    if (isManagedByMozilla) {
        return <MozillaInfoPanel />;
    }

    const {
        UsedDomains,
        MaxDomains,
        UsedSpace,
        MaxSpace,
        UsedAddresses,
        MaxAddresses,
        UsedMembers,
        MaxMembers,
        MaxVPN,
    } = organization || {};

    const { mailPlan, vpnPlan } = formatPlans(Plans);
    const { Name: mailPlanName } = mailPlan || {};
    const { Name: vpnPlanName } = vpnPlan || {};

    const handleModal = () => {
        createModal(
            <NewSubscriptionModal
                planIDs={getPlanIDs(subscription)}
                coupon={CouponCode || undefined} // CouponCode can equal null
                currency={Currency}
                cycle={Cycle}
            />
        );
    };

    const mailAddons = Boolean(hasPaidMail) && (
        <>
            <div className="w100">
                {UsedMembers} {c('x of y').t`of`} {MaxMembers} {c('Label').t`Users`}
            </div>
            <div className="mt1">
                {UsedAddresses} {c('x of y').t`of`} {MaxAddresses} {c('Label').t`Email addresses`}
            </div>
            <div className="mt1">
                {UsedDomains} {c('x of y').t`of`} {MaxDomains} {c('Label').t`Custom domains`}
            </div>
            <div className="mt1">
                {c('Label').t`Using`} {humanSize(UsedSpace)} {c('x of y').t`of`} {humanSize(MaxSpace)}
                <Meter className="mt1" value={Math.round(percentage(MaxSpace, UsedSpace))} />
            </div>
        </>
    );

    const MailPlanName = PLAN_NAMES[mailPlanName];

    const VPNPlanName = PLAN_NAMES[vpnPlanName];

    return (
        <SettingsSection>
            <div className="bordered-container mb2">
                <div className="flex p1-5">
                    <Label className="text-semibold">
                        {hasPaidMail ? (
                            c('Plan').t`ProtonMail ${MailPlanName}`
                        ) : hasAddresses ? (
                            c('Plan').t`ProtonMail Free`
                        ) : (
                            <Href url="https://mail.protonmail.com/login">{c('Info').t`Not activated`}</Href>
                        )}
                    </Label>
                    <div>
                        {mailAddons}
                        <UpsellMailSubscription />
                    </div>
                </div>

                <div className="flex flex-nowrap p1-5 border-top">
                    <Label className="text-semibold">
                        {c('Label').t`ProtonVPN ${hasPaidVpn ? VPNPlanName : c('Plan').t`Free`}`}
                    </Label>
                    <div>
                        {hasPaidVpn ? MaxVPN : 1} {c('Label').t`VPN Connections available`}
                        <UpsellVPNSubscription />
                    </div>
                </div>
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
