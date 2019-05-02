import { PLAN_SERVICES, PLAN_TYPES } from 'proton-shared/lib/constants';
import { hasBit } from 'proton-shared/lib/helpers/bitset';

const { PLAN, ADDON } = PLAN_TYPES;
const { MAIL, VPN } = PLAN_SERVICES;

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
 * Define sub-total from current subscription
 * @param {Array} plans coming from Subscription API
 * @returns {Number} subTotal
 */
export const getSubTotal = (plans = []) => {
    const config = formatPlans(plans);

    return Object.entries(config).reduce((acc, [, { Amount }]) => {
        return acc + Amount;
    }, 0);
};
