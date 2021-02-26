import React, { useState, useEffect } from 'react';
import { c } from 'ttag';
import { Cycle, Currency, Plan, Organization } from 'proton-shared/lib/interfaces';
import { PLANS, PLAN_SERVICES, APPS, ADDON_NAMES } from 'proton-shared/lib/constants';
import { toMap } from 'proton-shared/lib/helpers/object';
import { switchPlan, getSupportedAddons } from 'proton-shared/lib/helpers/subscription';
import { getAppName } from 'proton-shared/lib/apps/helper';

import { InlineLinkButton, Icon, IntegerInput, Info, Price } from '../../components';
import { useConfig, useDebounceCallback } from '../../hooks';
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
    max = Number.MAX_SAFE_INTEGER,
    step = 1,
    disabled = false,
}: {
    step?: number;
    id: string;
    min?: number;
    max?: number;
    value: number;
    disabled?: boolean;
    onChange: (newValue: number) => void;
}) => {
    const [tmpValue, setTmpValue] = useState(value);
    const debouncedOnChange = useDebounceCallback(onChange, 100);
    useEffect(() => {
        setTmpValue(value);
    }, [value]);
    return (
        <div className="bordered-container flex flex-nowrap flex-items-align-center">
            <button
                type="button"
                disabled={disabled || value <= min + step}
                onClick={() => {
                    const newValue = value - step;
                    setTmpValue(newValue);
                    debouncedOnChange(newValue);
                }}
            >
                <Icon name="minus" alt={c('Action').t`Decrease`} />
            </button>
            <label htmlFor={id} className="mt0-25 mb0-25">
                <IntegerInput
                    value={value}
                    disabled={disabled}
                    id={id}
                    className="border-left border-right"
                    aria-live="assertive"
                    onChange={(newValue) => {
                        if (newValue === undefined) {
                            return;
                        }
                        setTmpValue(newValue);
                    }}
                    onBlur={() => {
                        onChange(tmpValue);
                    }}
                />
            </label>
            <button
                type="button"
                disabled={disabled || value >= max - step}
                onClick={() => {
                    const newValue = value + step;
                    setTmpValue(newValue);
                    debouncedOnChange(newValue);
                }}
            >
                <Icon name="plus" alt={c('Action').t`Increase`} />
            </button>
        </div>
    );
};

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
    const { APP_NAME } = useConfig();
    const plansMap = toMap(plans);
    const plansNameMap = toMap(plans, 'Name');

    const vpnAppName = getAppName(APPS.PROTONVPN_SETTINGS);
    const mailAppName = getAppName(APPS.PROTONMAIL);

    const isVpnApp = APP_NAME === APPS.PROTONVPN_SETTINGS;
    const appName = isVpnApp ? vpnAppName : mailAppName;
    const addonsToShow = isVpnApp ? VPNAddons : MailAddons;
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

    return (
        <>
            <h3>{c('Title').t`${appName} customization`}</h3>
            {service === PLAN_SERVICES.MAIL && planIDs[plansMap[PLANS.PLUS].ID] ? (
                <p>
                    {c('Info').t`ProtonMail Plus is limited to one user and starts with 5GB of storage.`}
                    <br />
                    {c('Info').jt`Switch to ${professionalPlan} to add more users.`}
                </p>
            ) : null}
            {service === PLAN_SERVICES.VPN && planIDs[plansMap[PLANS.VPNPLUS].ID] ? (
                <p>
                    {c('Info').t`ProtonVPN Plus is limited to 5 connections.`}
                    <br />
                    {c('Info').jt`Switch to ${professionalPlan} to add more connections.`}
                </p>
            ) : null}
            {service === PLAN_SERVICES.MAIL && planIDs[plansMap[PLANS.PROFESSIONAL].ID] ? (
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
                const min = Object.entries(planIDs).reduce((acc, [planID, planQuantity]) => {
                    return acc + planQuantity * (plansMap[planID][addonMaxKey] ?? 0);
                }, 0);
                const max = 1000; // TODO

                return (
                    <div className="flex flex-nowrap on-mobile-flex-wrap">
                        <label htmlFor={addon.ID} className="min-w14e text-bold pr0-5 on-mobile-w100">
                            {addonLabel[addonNameKey]}
                        </label>
                        <ButtonNumberInput
                            id={addon.ID}
                            value={min + quantity * addonMultiplier}
                            min={min}
                            max={max}
                            disabled={loading || !isSupported}
                            onChange={(newQuantity) => {
                                onChangePlanIDs({ ...planIDs, [addon.ID]: newQuantity / addonMultiplier - min });
                            }}
                            step={addonMultiplier}
                        />
                        {infoTooltipText && (
                            <div className="flex-item-noshrink">
                                <Info title={infoTooltipText} />
                            </div>
                        )}
                        <div className="mlauto flex-item-noshrink">
                            {isSupported && quantity && (
                                <Price currency={currency} prefix="+" suffix={c('Suffix for price').t`/ month`}>
                                    {(quantity * addon.Pricing[cycle]) / cycle}
                                </Price>
                            )}
                            {isSupported && !quantity && c('Info').t`included`}
                            {!isSupported && c('Info').t`not customizable`}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default ProtonPlanCustomizer;
