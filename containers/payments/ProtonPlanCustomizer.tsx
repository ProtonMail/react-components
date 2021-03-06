import React from 'react';
import { c } from 'ttag';
import { Cycle, Currency, Plan, Organization } from 'proton-shared/lib/interfaces';
import {
    PLANS,
    PLAN_SERVICES,
    APPS,
    ADDON_NAMES,
    PLAN_TYPES,
    MAX_SPACE_ADDON,
    MAX_MEMBER_ADDON,
    MAX_DOMAIN_PRO_ADDON,
    MAX_ADDRESS_ADDON,
    MAX_VPN_ADDON,
    GIGA,
} from 'proton-shared/lib/constants';
import { toMap } from 'proton-shared/lib/helpers/object';
import { range } from 'proton-shared/lib/helpers/array';
import { switchPlan, getSupportedAddons } from 'proton-shared/lib/helpers/planIDs';
import { getAppName } from 'proton-shared/lib/apps/helper';

import { InlineLinkButton, Icon, SelectTwo, Option, Info, Price } from '../../components';
import { PlanIDs } from '../signup/interfaces';

const MailAddons: ADDON_NAMES[] = [ADDON_NAMES.MEMBER, ADDON_NAMES.SPACE, ADDON_NAMES.ADDRESS, ADDON_NAMES.DOMAIN];
const VPNAddons: ADDON_NAMES[] = [ADDON_NAMES.VPN];
const AddonKey = {
    [ADDON_NAMES.ADDRESS]: 'MaxAddresses',
    [ADDON_NAMES.MEMBER]: 'MaxMembers',
    [ADDON_NAMES.DOMAIN]: 'MaxDomains',
    [ADDON_NAMES.VPN]: 'MaxVPN',
    [ADDON_NAMES.SPACE]: 'MaxSpace',
} as const;

interface Props {
    cycle: Cycle;
    currency: Currency;
    planIDs: PlanIDs;
    onChangePlanIDs: (planIDs: PlanIDs) => void;
    plans: Plan[];
    organization?: Organization;
    service: PLAN_SERVICES;
    loading?: boolean;
}

const ButtonNumberInput = ({
    value,
    onChange,
    id,
    min = 0,
    max = 999,
    step = 1,
    disabled = false,
    divider = 1,
}: {
    step?: number;
    id: string;
    min?: number;
    max?: number;
    value: number;
    disabled?: boolean;
    divider?: number;
    onChange: (newValue: number) => void;
}) => {
    return (
        <div className="bordered-container flex flex-nowrap flex-items-align-center">
            <button
                type="button"
                className="pl0-5 pr0-5"
                disabled={disabled || value - step < min}
                onClick={() => {
                    const newValue = value - step;
                    onChange(newValue);
                }}
            >
                <Icon name="minus" alt={c('Action').t`Decrease`} />
            </button>
            <label htmlFor={id} className="mt0-25 mb0-25">
                <SelectTwo
                    value={value}
                    disabled={disabled}
                    id={id}
                    className="border-left border-right"
                    aria-live="assertive"
                    onChange={({ value: newValue }) => {
                        onChange(newValue);
                    }}
                >
                    {range(min, max, step).map((quantity) => {
                        return <Option key={`${quantity}`} value={quantity} title={`${(min + quantity) / divider}`} />;
                    })}
                </SelectTwo>
            </label>
            <button
                type="button"
                className="pl0-5 pr0-5"
                disabled={disabled || value + step > max}
                onClick={() => {
                    const newValue = value + step;
                    onChange(newValue);
                }}
            >
                <Icon name="plus" alt={c('Action').t`Increase`} />
            </button>
        </div>
    );
};

const addonLimit = {
    [ADDON_NAMES.SPACE]: MAX_SPACE_ADDON,
    [ADDON_NAMES.MEMBER]: MAX_MEMBER_ADDON,
    [ADDON_NAMES.DOMAIN]: MAX_DOMAIN_PRO_ADDON,
    [ADDON_NAMES.ADDRESS]: MAX_ADDRESS_ADDON,
    [ADDON_NAMES.VPN]: MAX_VPN_ADDON,
} as const;

const ProtonPlanCustomizer = ({
    cycle,
    currency,
    onChangePlanIDs,
    planIDs,
    plans,
    organization,
    service,
    loading,
}: Props) => {
    const plansMap = toMap(plans);
    const plansNameMap = toMap(plans, 'Name');
    const [currentPlanID] =
        Object.entries(planIDs).find(([planID, planQuantity]) => {
            if (planQuantity) {
                const { Services, Type } = plansMap[planID];
                return Services & service && Type === PLAN_TYPES.PLAN;
            }
            return false;
        }) || [];
    const currentPlan = currentPlanID && plansMap[currentPlanID];

    const vpnAppName = getAppName(APPS.PROTONVPN_SETTINGS);
    const mailAppName = getAppName(APPS.PROTONMAIL);

    const isVpn = service === PLAN_SERVICES.VPN;
    const appName = isVpn ? vpnAppName : mailAppName;
    const addonsToShow = isVpn ? VPNAddons : MailAddons;
    const supportedAddons = getSupportedAddons(planIDs, plans);

    const professionalPlan = (
        <InlineLinkButton
            key="professional-plan"
            onClick={() => {
                onChangePlanIDs(
                    switchPlan({ planIDs, plans, planID: plansNameMap[PLANS.PROFESSIONAL].ID, service, organization })
                );
            }}
        >
            {mailAppName} Professional
        </InlineLinkButton>
    );

    const addonLabel = {
        [ADDON_NAMES.SPACE]: c('Info').t`Storage GB`,
        [ADDON_NAMES.MEMBER]: c('Info').t`Users`,
        [ADDON_NAMES.DOMAIN]: c('Info').t`Domains`,
        [ADDON_NAMES.ADDRESS]: c('Info').t`Addresses`,
        [ADDON_NAMES.VPN]: c('Info').t`Connections`,
    } as const;

    const infoTooltip = {
        [ADDON_NAMES.SPACE]: '',
        [ADDON_NAMES.MEMBER]: '',
        [ADDON_NAMES.DOMAIN]: c('Info')
            .t`Allows you to host emails for your own domain(s) at ${mailAppName}, e.g. john.smith@example.com`,
        [ADDON_NAMES.ADDRESS]: c('Info').t`Add additional addresses to your account like username2@protonmail.com`,
        [ADDON_NAMES.VPN]: c('Info')
            .t`Number of VPN connections which can be assigned to users. Each connected device consumes one VPN connection.`,
    } as const;

    if (!currentPlan) {
        return null;
    }

    if ([PLANS.VPNBASIC, PLANS.VISIONARY].includes(currentPlan.Name as PLANS)) {
        return null;
    }

    return (
        <div className="pb2 mb2 border-bottom">
            <h3>{c('Title').t`${appName} customization`}</h3>
            {service === PLAN_SERVICES.MAIL && planIDs[plansNameMap[PLANS.PLUS].ID] ? (
                <p>
                    {c('Info').t`ProtonMail Plus is limited to one user and starts with 5GB of storage.`}
                    <br />
                    {c('Info').jt`Switch to ${professionalPlan} to add more users.`}
                </p>
            ) : null}
            {service === PLAN_SERVICES.VPN && planIDs[plansNameMap[PLANS.VPNPLUS].ID] ? (
                <p>
                    {c('Info').t`ProtonVPN Plus is limited to 5 connections.`}
                    <br />
                    {planIDs[plansNameMap[PLANS.PROFESSIONAL].ID]
                        ? c('Info').t`Each additional connection can be assigned to users in your organization.`
                        : c('Info').jt`Switch to ${professionalPlan} to add more connections.`}
                </p>
            ) : null}
            {service === PLAN_SERVICES.MAIL && planIDs[plansNameMap[PLANS.PROFESSIONAL].ID] ? (
                <p>{c('Info')
                    .t`${mailAppName} Professional starts with one user, and each user adds 5GB and 5 email addresses to the organization’s pool.`}</p>
            ) : null}
            {addonsToShow.map((addonName) => {
                const addon = plansNameMap[addonName];

                if (!addon) {
                    return null;
                }

                const addonNameKey = addon.Name as ADDON_NAMES;
                const infoTooltipText = infoTooltip[addonNameKey];
                const quantity = planIDs[addon.ID] ?? 0;
                const isSupported = !!supportedAddons[addonNameKey];
                const addonMaxKey = AddonKey[addonNameKey];
                const addonMultiplier = addon[addonMaxKey] ?? 1;
                const min = currentPlan[addonMaxKey] ?? 0;
                const max = addonLimit[addonNameKey] * addonMultiplier;
                const value = min + quantity * addonMultiplier;
                const divider = addonNameKey === ADDON_NAMES.SPACE ? GIGA : 1;

                return (
                    <div
                        className="flex-no-min-children flex-nowrap flex-align-items-center mb1 on-mobile-flex-wrap"
                        key={addon.ID}
                    >
                        <label htmlFor={addon.ID} className="min-w14e text-bold pr0-5 on-mobile-w100">
                            {addonLabel[addonNameKey]}
                        </label>
                        <ButtonNumberInput
                            id={addon.ID}
                            value={value}
                            min={min}
                            max={max}
                            divider={divider}
                            disabled={loading || !isSupported}
                            onChange={(newQuantity) => {
                                onChangePlanIDs({ ...planIDs, [addon.ID]: (newQuantity - min) / addonMultiplier });
                            }}
                            step={addonMultiplier}
                        />
                        {infoTooltipText && (
                            <div className="flex-item-noshrink ml1">
                                <Info title={infoTooltipText} />
                            </div>
                        )}
                        <div className="mlauto flex-item-noshrink">
                            {isSupported && quantity ? (
                                <Price currency={currency} prefix="+" suffix={c('Suffix for price').t`/ month`}>
                                    {(quantity * addon.Pricing[cycle]) / cycle}
                                </Price>
                            ) : null}
                            {isSupported && !quantity ? c('Info').t`included` : null}
                            {!isSupported && c('Info').t`not customizable`}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProtonPlanCustomizer;
