import React from 'react';
import PropTypes from 'prop-types';
import { SubTitle, Alert, Price, useConfig } from 'react-components';
import { c, msgid } from 'ttag';
import { PLANS, CYCLE, ADDON_NAMES, CLIENT_TYPES, PLAN_SERVICES } from 'proton-shared/lib/constants';
import { getTotal } from 'proton-shared/lib/helpers/subscription';
import { toMap } from 'proton-shared/lib/helpers/object';
import humanSize from 'proton-shared/lib/helpers/humanSize';

import SubscriptionPlan from './SubscriptionPlan';
import SubscriptionAddonRow from './SubscriptionAddonRow';
import SubscriptionFeatureRow from './SubscriptionFeatureRow';
import MailSubscriptionTable from './MailSubscriptionTable';
import VpnSubscriptionTable from './VpnSubscriptionTable';
import { hasBit } from 'proton-shared/lib/helpers/bitset';

const FREE = 'free';
const VPNFREE = 'vpnfree';

const TITLE = {
    [FREE]: 'ProtonMail Free',
    [PLANS.PLUS]: 'ProtonMail Plus',
    [PLANS.PROFESSIONAL]: 'ProtonMail Professional',
    [PLANS.VISIONARY]: 'Proton Visionary',
    [VPNFREE]: 'ProtonVPN Free',
    [PLANS.VPNBASIC]: 'ProtonVPN Basic',
    [PLANS.VPNPLUS]: 'ProtonVPN Plus'
};

const Description = ({ planName, setModel, model }) => {
    const DESCRIPTION = {
        [FREE]: c('Description plan').t`To get more features and security, upgrade to ProtonMail Plus`,
        [PLANS.PLUS]: c('Description plan')
            .t`You can customize the storage, number of addresses, etc, included with ProtonMail Plus`,
        [PLANS.PROFESSIONAL]: c('Description plan').t`Select the number of users within your organization`,
        [PLANS.VISIONARY]: '???', // TODO
        [VPNFREE]: '???', // TODO
        [PLANS.VPNBASIC]: '???', // TODO
        [PLANS.VPNPLUS]: '???' // TODO
    };

    const annualBilling = (
        <a key="annual-billing" onClick={() => setModel({ ...model, cycle: CYCLE.YEARLY })}>{c('Link')
            .t`annual billing`}</a>
    );

    return (
        <>
            {model.cycle === CYCLE.MONTHLY && <Alert>{c('Info').jt`Save 20% by switching to ${annualBilling}.`}</Alert>}
            <Alert>{DESCRIPTION[planName]}</Alert>
        </>
    );
};

Description.propTypes = {
    planName: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
    setModel: PropTypes.func.isRequired
};

const removeService = (planIDs = {}, plansMap = {}, service = PLAN_SERVICES.MAIL) => {
    return Object.entries(planIDs).reduce((acc, [planID = '', quantity = 0]) => {
        const { Services } = plansMap[planID];

        if (!hasBit(Services, service)) {
            acc[planID] = quantity;
        }

        return acc;
    }, {});
};

const SubscriptionCustomization = ({ plans, planName, model, setModel, expanded = false }) => {
    const { CLIENT_TYPE } = useConfig();
    const plansMap = toMap(plans, 'Name');
    const plusPlan = plansMap[PLANS.PLUS];
    const vpnplusPlan = plansMap[PLANS.VPNPLUS];
    const professionalPlan = plansMap[PLANS.PROFESSIONAL];
    const storageAddon = plansMap[ADDON_NAMES.SPACE];
    const addressAddon = plansMap[ADDON_NAMES.ADDRESS];
    const domainAddon = plansMap[ADDON_NAMES.DOMAIN];
    const memberAddon = plansMap[ADDON_NAMES.MEMBER];
    const vpnAddon = plansMap[ADDON_NAMES.VPN];

    const CAN_CUSTOMIZE = {
        [FREE]: false,
        [PLANS.PLUS]: true,
        [PLANS.PROFESSIONAL]: true,
        [PLANS.VISIONARY]: false,
        [VPNFREE]: false,
        [PLANS.VPNBASIC]: false,
        [PLANS.VPNPLUS]: !!model.planIDs[professionalPlan.ID]
    };

    const FEATURES = {
        [FREE]: [
            <SubscriptionFeatureRow key="user" icon="organization-users" feature={c('Feature').t`1 User`} />,
            <SubscriptionFeatureRow key="storage" icon="user-storage" feature={c('Feature').t`500 MB storage`} />,
            <SubscriptionFeatureRow key="address" icon="email-address" feature={c('Feature').t`1 email address`} />,
            <SubscriptionFeatureRow key="all" icon="add" feature={c('Feature').t`150 messages per day`} />
        ],
        [PLANS.PLUS]: [
            <SubscriptionFeatureRow key="user" icon="organization-users" feature={c('Feature').t`1 User`} />,
            <SubscriptionFeatureRow
                key="storage"
                icon="user-storage"
                feature={humanSize(
                    model.planIDs[storageAddon.ID] * storageAddon.MaxSpace + plusPlan.MaxSpace,
                    'GB',
                    true
                )}
            />,
            <SubscriptionFeatureRow
                key="address"
                icon="email-address"
                feature={c('Feature').t`${model.planIDs[addressAddon.ID] * addressAddon.MaxAddresses +
                    plusPlan.MaxAddresses} email addresses`}
            />,
            <SubscriptionFeatureRow
                key="domain"
                icon="domains"
                feature={c('Feature').ngettext(
                    msgid`${model.planIDs[domainAddon.ID] * domainAddon.MaxDomains +
                        plusPlan.MaxDomains} custom domain`,
                    `${model.planIDs[domainAddon.ID] * domainAddon.MaxDomains + plusPlan.MaxDomains} custom domains`,
                    model.planIDs[domainAddon.ID] * domainAddon.MaxDomains + plusPlan.MaxDomains
                )}
            />,
            <SubscriptionFeatureRow key="all" icon="add" feature={c('Feature').t`All plus features`} />
        ],
        [PLANS.PROFESSIONAL]: [
            <SubscriptionFeatureRow
                key="member"
                icon="organization-users"
                feature={c('Feature').ngettext(
                    msgid`${model.planIDs[memberAddon.ID] * memberAddon.MaxMembers + professionalPlan.MaxMembers}`,
                    `${model.planIDs[memberAddon.ID] * memberAddon.MaxMembers + professionalPlan.MaxMembers}`,
                    model.planIDs[memberAddon.ID] * memberAddon.MaxMembers + professionalPlan.MaxMembers
                )}
            />,
            <SubscriptionFeatureRow
                key="storage"
                icon="user-storage"
                feature={c('Feature').ngettext(
                    msgid`${model.planIDs[memberAddon.ID] * memberAddon.MaxSpace + professionalPlan.MaxSpace}`,
                    `${model.planIDs[memberAddon.ID] * memberAddon.MaxSpace + professionalPlan.MaxSpace}`,
                    model.planIDs[memberAddon.ID] * memberAddon.MaxSpace + professionalPlan.MaxSpace
                )}
            />,
            <SubscriptionFeatureRow
                key="address"
                icon="email-address"
                feature={c('Feature').ngettext(
                    msgid`${model.planIDs[memberAddon.ID] * memberAddon.MaxAddresses + professionalPlan.MaxAddresses}`,
                    `${model.planIDs[memberAddon.ID] * memberAddon.MaxAddresses + professionalPlan.MaxAddresses}`,
                    model.planIDs[memberAddon.ID] * memberAddon.MaxAddresses + professionalPlan.MaxAddresses
                )}
            />,
            <SubscriptionFeatureRow
                key="domain"
                icon="domains"
                feature={c('Feature').ngettext(
                    msgid`${model.planIDs[memberAddon.ID] * memberAddon.MaxDomains + professionalPlan.MaxDomains}`,
                    `${model.planIDs[memberAddon.ID] * memberAddon.MaxDomains + professionalPlan.MaxDomains}`,
                    model.planIDs[memberAddon.ID] * memberAddon.MaxDomains + professionalPlan.MaxDomains
                )}
            />,
            <SubscriptionFeatureRow key="all" icon="add" feature={c('Feature').t`All professional features`} />
        ],
        [PLANS.VISIONARY]: [
            <SubscriptionFeatureRow key="user" icon="organization-users" feature={c('Feature').t`6 Users`} />,
            <SubscriptionFeatureRow key="storage" icon="user-storage" feature={c('Feature').t`20 GB storage`} />,
            <SubscriptionFeatureRow key="address" icon="email-address" feature={c('Feature').t`50 email addresses`} />,
            <SubscriptionFeatureRow key="all" icon="domains" feature={c('Feature').t`10 custom domains`} />
        ],
        [VPNFREE]: [
            '???' // TODO
        ],
        [PLANS.VPNBASIC]: [
            '???' // TODO
        ],
        [PLANS.VPNPLUS]: [
            '???' // TODO
        ]
    };

    const ADDONS = {
        [PLANS.PLUS]: [
            <SubscriptionAddonRow
                key="storage"
                label={c('Label').t`Storage space`}
                price={
                    <Price currency={model.currency} prefix="+" suffix={c('Suffix').t`/month`}>
                        {model.planIDs[storageAddon.ID] * storageAddon.Pricing[CYCLE.MONTHLY]}
                    </Price>
                }
                format={(value) => humanSize(value, 'GB')}
                step={storageAddon.MaxSpace}
                start={plusPlan.MaxSpace}
                quantity={model.planIDs[storageAddon.ID]}
                onChange={(quantity) =>
                    setModel({ ...model, planIDs: { ...model.planIDs, [storageAddon.ID]: quantity } })
                }
            />,
            <SubscriptionAddonRow
                key="address"
                label={c('Label').t`Email addresses`}
                price={
                    <Price currency={model.currency} prefix="+" suffix={c('Suffix').t`/month`}>
                        {model.planIDs[addressAddon.ID] * plansMap[ADDON_NAMES.ADDRESS].Pricing[CYCLE.MONTHLY]}
                    </Price>
                }
                step={addressAddon.MaxAddresses}
                start={plusPlan.MaxAddresses}
                quantity={model.planIDs[addressAddon.ID]}
                onChange={(quantity) =>
                    setModel({ ...model, planIDs: { ...model.planIDs, [addressAddon.ID]: quantity } })
                }
            />,
            <SubscriptionAddonRow
                key="domain"
                label={c('Label').t`Custom domains`}
                price={
                    <Price currency={model.currency} prefix="+" suffix={c('Suffix').t`/month`}>
                        {model.planIDs[domainAddon.ID] * plansMap[ADDON_NAMES.DOMAIN].Pricing[CYCLE.MONTHLY]}
                    </Price>
                }
                step={domainAddon.MaxDomains}
                start={plusPlan.MaxDomains}
                quantity={model.planIDs[domainAddon.ID]}
                onChange={(quantity) =>
                    setModel({ ...model, planIDs: { ...model.planIDs, [domainAddon.ID]: quantity } })
                }
            />
        ],
        [PLANS.PROFESSIONAL]: [
            <SubscriptionAddonRow
                key="member"
                label={c('Label').t`Users`}
                price={
                    <Price currency={model.currency} prefix="+" suffix={c('Suffix').t`/month`}>
                        {model.planIDs[memberAddon.ID] * plansMap[ADDON_NAMES.MEMBER].Pricing[CYCLE.MONTHLY]}
                    </Price>
                }
                step={memberAddon.MaxMembers}
                start={professionalPlan.MaxMembers}
                quantity={model.planIDs[memberAddon.ID]}
                onChange={(quantity) =>
                    setModel({ ...model, planIDs: { ...model.planIDs, [memberAddon.ID]: quantity } })
                }
            />,
            <SubscriptionAddonRow
                key="domain"
                label={c('Label').t`Custom domains`}
                price={
                    <Price currency={model.currency} prefix="+" suffix={c('Suffix').t`/month`}>
                        {model.planIDs[domainAddon.ID] * plansMap[ADDON_NAMES.DOMAIN].Pricing[CYCLE.MONTHLY]}
                    </Price>
                }
                step={domainAddon.MaxDomains}
                start={professionalPlan.MaxDomains}
                quantity={model.planIDs[domainAddon.ID]}
                onChange={(quantity) =>
                    setModel({ ...model, planIDs: { ...model.planIDs, [domainAddon.ID]: quantity } })
                }
            />
        ],
        [PLANS.VPNPLUS]: [
            <SubscriptionAddonRow
                key="vpn"
                label={c('Label').t`VPN connections`}
                price={
                    <Price currency={model.currency} prefix="+" suffix={c('Suffix').t`/month`}>
                        {model.planIDs[vpnAddon.ID] * plansMap[ADDON_NAMES.VPN].Pricing[CYCLE.MONTHLY]}
                    </Price>
                }
                step={vpnAddon.MaxVpn}
                start={vpnplusPlan.MaxVpn}
                quantity={model.planIDs[vpnAddon.ID]}
                onChange={(quantity) => setModel({ ...model, planIDs: { ...model.planIDs, [vpnAddon.ID]: quantity } })}
            />
        ]
    };

    return (
        <>
            <SubTitle>{TITLE[planName]}</SubTitle>
            <Description planName={planName} cycle={model.cycle} setModel={setModel} />
            <SubscriptionPlan
                canCustomize={CAN_CUSTOMIZE[planName]}
                addons={ADDONS[planName]}
                features={FEATURES[planName]}
                currency={model.currency}
                totalPerMonth={getTotal({
                    plans,
                    planIDs: model.planIDs,
                    cycle: CYCLE.MONTHLY,
                    service: CLIENT_TYPE === CLIENT_TYPES.MAIL ? PLAN_SERVICES.MAIL : PLAN_SERVICES.VPN
                })}
                expanded={expanded}
            />

            {CLIENT_TYPE === CLIENT_TYPES.MAIL ? (
                <>
                    <SubTitle>{c('Title').t`Add ProtonVPN`}</SubTitle>
                    <Alert learnMore="https://protonvpn.com">{c('Info')
                        .t`ProtonVPN encrypts your internet connection, adding a powerful layer of security to your devices and ensuring your online activity stays private.`}</Alert>
                    <VpnSubscriptionTable
                        planNameSelected={planName}
                        plans={plans}
                        cycle={model.cycle}
                        currency={model.currency}
                        onSelect={(planID) => {
                            setModel({
                                ...model,
                                planIDs: {
                                    ...removeService(model.planIDs, plansMap, PLAN_SERVICES.VPN),
                                    [planID]: 1
                                }
                            });
                        }}
                    />
                    <SubscriptionPlan
                        canCustomize={CAN_CUSTOMIZE[planName]}
                        addons={ADDONS[planName]}
                        features={FEATURES[planName]}
                        currency={model.currency}
                        totalPerMonth={getTotal({
                            plans,
                            planIDs: model.planIDs,
                            cycle: CYCLE.MONTHLY,
                            service: PLAN_SERVICES.VPN
                        })}
                    />
                </>
            ) : null}

            {CLIENT_TYPE === CLIENT_TYPES.VPN ? (
                <>
                    <SubTitle>{c('Title').t`Add ProtonMail`}</SubTitle>
                    <Alert>{c('Info').t`Get 20% off when you buy both ProtonMail and ProtonVPN.`}</Alert>
                    <MailSubscriptionTable
                        planNameSelected={planName}
                        plans={plans}
                        cycle={model.cycle}
                        currency={model.currency}
                        onSelect={(planID) => {
                            setModel({
                                ...model,
                                planIDs: {
                                    ...removeService(model.planIDs, plansMap, PLAN_SERVICES.MAIL),
                                    [planID]: 1
                                }
                            });
                        }}
                    />
                    <SubscriptionPlan
                        canCustomize={CAN_CUSTOMIZE[planName]}
                        addons={ADDONS[planName]}
                        features={FEATURES[planName]}
                        currency={model.currency}
                        totalPerMonth={getTotal({
                            plans,
                            planIDs: model.planIDs,
                            cycle: CYCLE.MONTHLY,
                            service: PLAN_SERVICES.MAIL
                        })}
                    />
                </>
            ) : null}
        </>
    );
};

SubscriptionCustomization.propTypes = {
    plans: PropTypes.arrayOf(PropTypes.object).isRequired,
    expanded: PropTypes.bool,
    planName: PropTypes.string,
    model: PropTypes.object.isRequired,
    setModel: PropTypes.func.isRequired
};

export default SubscriptionCustomization;
