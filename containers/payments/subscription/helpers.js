import { PLAN_SERVICES, PLAN_TYPES, CYCLE } from 'proton-shared/lib/constants';
import { hasBit } from 'proton-shared/lib/helpers/bitset';
import { c, ngettext, msgid } from 'ttag';
import { isEquivalent } from 'proton-shared/lib/helpers/object';

const { PLAN, ADDON } = PLAN_TYPES;
const { MAIL, VPN } = PLAN_SERVICES;
const { MONTHLY } = CYCLE;

const I18N = {
    included: c('Option').t`included`,
    address(value) {
        return ngettext(msgid`1 address`, `${value} addresses`, value);
    },
    space(value) {
        return ngettext(msgid`1 GB storage`, `${value} GB storage`, value);
    },
    domain(value) {
        return ngettext(msgid`1 custom domain`, `${value} custom domains`, value);
    },
    member(value) {
        return ngettext(msgid`1 user`, `${value} users`, value);
    },
    vpn(value) {
        return ngettext(msgid`1 VPN connection`, `${value} VPN connections`, value);
    }
};

/**
 * Build plansMap from current subscription and user demand
 * @param {Object} plansMap user demand
 * Possible entries for plansMap
 * {}
 * { vpnplus: 1 }
 * { plus: 1 }, { vpnplus: 1, plus: 1 }
 * { professional: 1 }, { vpnplus: 1, professional: 1 }
 * { visionary: 1 }
 * @param {Array} subscription.Plans
 * @returns {Object} plansMap
 */
export const mergePlansMap = (plansMap, { Plans = [] }) => {
    // Free user subscribing
    if (!Plans.length) {
        return plansMap;
    }

    // Has an existing subscription

    // Visionary includes mail and vpn service with no addons
    if (plansMap.visionary) {
        return plansMap;
    }

    const currentPlansMap = formatPlans(Plans);

    if (isEquivalent(plansMap, { vpnplus: 1 })) {
        const { vpn } = currentPlansMap;
        return {
            ...plansMap,
            vpn
        };
    }

    if (isEquivalent(plansMap, { plus: 1 })) {
        const { domain, address, space, vpnplus, vpnbasic, vpn } = currentPlansMap;
        return {
            ...plansMap,
            domain,
            address,
            space,
            vpnplus,
            vpnbasic,
            vpn
        };
    }

    if (isEquivalent(plansMap, { professional: 1 })) {
        const { domain, member, vpnplus, vpnbasic, vpn } = currentPlansMap;
        return {
            ...plansMap,
            domain,
            member,
            vpnplus,
            vpnbasic,
            vpn
        };
    }

    if (isEquivalent(plansMap, { vpnplus: 1, plus: 1 })) {
        const { domain, address, space, vpn } = currentPlansMap;
        return {
            ...plansMap,
            domain,
            address,
            space,
            vpn
        };
    }

    if (isEquivalent(plansMap, { vpnplus: 1, professional: 1 })) {
        const { domain, member, vpn } = currentPlansMap;
        return {
            ...plansMap,
            domain,
            member,
            vpn
        };
    }

    return plansMap;
};

export const getTextOption = (type, value, index) => {
    return `${I18N[type](value)} ${index ? '' : `(${I18N.included})`}`.trim();
};

export const getTotal = ({ plansMap, cycle, plans }) => {
    return Object.entries(plansMap).reduce((acc, [planName, quantity]) => {
        if (quantity) {
            const { Amount } = plans.find(({ Cycle, Name }) => Name === planName && Cycle === cycle);
            return acc + quantity * Amount;
        }
        return acc;
    }, 0);
};

/**
 * Convert subscription plans to PlanIDs format required by API requests
 * @param {Array} plans coming from Subscription API
 * @returns {Object}
 */
export const toPlanMap = (plans = [], key = 'ID') => {
    return plans.reduce((acc, plan) => {
        acc[plan[key]] = acc[plan[key]] || 0;
        acc[plan[key]] += 1;
        return acc;
    }, Object.create(null));
};

export const toPlanIDs = toPlanMap;
export const toPlanNames = (plans = []) => toPlanMap(plans, 'Name');

/**
 * Merge addon to addition parameters
 * @param {Number} oldAddon.Quantity
 * @param {Number} oldAddon.Amount
 * @param {Number} oldAddon.MaxDomains
 * @param {Number} oldAddon.MaxAddresses
 * @param {Number} oldAddon.MaxSpace
 * @param {Number} oldAddon.MaxMembers
 * @param {Number} oldAddon.MaxVPN
 * @param {Object} addon to merge with
 * @returns {Object} new addon
 */
const mergeAddons = (
    { Quantity = 0, Amount = 0, MaxDomains = 0, MaxAddresses = 0, MaxSpace = 0, MaxMembers = 0, MaxVPN = 0 } = {},
    addon
) => ({
    ...addon,
    MaxAddresses: MaxAddresses + addon.MaxAddresses,
    MaxSpace: MaxSpace + addon.MaxSpace,
    MaxMembers: MaxMembers + addon.MaxMembers,
    MaxVPN: MaxVPN + addon.MaxVPN,
    MaxDomains: MaxDomains + addon.MaxDomains,
    Quantity: Quantity + addon.Quantity,
    Amount: Amount + addon.Amount
});

/**
 * Format plans to returns essential structure
 * @param {Array} plans coming from Subscription API
 * @returns {Object} { mailPlan, vpnPlan, addressAddon, vpnAddon, domainAddon, memberAddon, spaceAddon }
 */
export const formatPlans = (plans = []) => {
    return plans.reduce((acc, plan) => {
        if (plan.Type === PLAN) {
            // visionary is a special case because it contains mail and vpn services
            // we consider it as a mail plan
            if (plan.Name === 'visionary') {
                acc.mailPlan = plan;
                return acc;
            }
            if (hasBit(plan.Services, MAIL)) {
                acc.mailPlan = plan;
            }
            if (hasBit(plan.Services, VPN)) {
                acc.vpnPlan = plan;
            }
            return acc;
        }

        if (plan.Type === ADDON) {
            if (plan.Name === '1domain') {
                acc.domainAddon = mergeAddons(acc.domainAddon, plan);
            }
            if (plan.Name === '1member') {
                acc.memberAddon = mergeAddons(acc.memberAddon, plan);
            }
            if (plan.Name === '1vpn') {
                acc.vpnAddon = mergeAddons(acc.vpnAddon, plan);
            }
            if (plan.Name === '5address') {
                acc.addressAddon = mergeAddons(acc.addressAddon, plan);
            }
            if (plan.Name === '1gb') {
                acc.spaceAddon = mergeAddons(acc.spaceAddon, plan);
            }
            return acc;
        }

        return acc;
    }, {});
};

/**
 * Helper to find plans from Subscription.Plans or Plans
 * @param {Array} plans from Subscription.Plans or Plans
 * @param {String} params.planName examples: 'plus', 'vpnplus', 'visionary', '5address', '1member'
 * @param {String} params.id plan ID
 * @param {Number} params.type default: plan
 * @param {String} params.cycle default: monthly
 * @returns {Object} plan Object
 */
export const getPlan = (plans = [], { type = PLAN, name = '', id = '', cycle = MONTHLY }) => {
    if (!plans.length) {
        throw new Error('plans not defined');
    }

    if (!name && !id) {
        throw new Error('name or id not defined to get plan');
    }

    if (name) {
        return plans.find(({ Type, Name, Cycle }) => Type === type && Name === name && Cycle === cycle);
    }

    return plans.find(({ Type, ID, Cycle }) => Type === type && ID === id && Cycle === cycle);
};

/**
 * Alias to getPlan with Type = ADDON
 * @param {Array} plans
 * @param {Object} params
 */
export const getAddon = (plans, params) => getPlan(plans, { ...params, type: ADDON });
