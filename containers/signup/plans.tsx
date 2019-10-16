import React from 'react';
import { c, msgid } from 'ttag';
import { PLAN_TYPES, CYCLE, CLIENT_TYPES } from 'proton-shared/lib/constants';
import freePlanSvg from 'design-system/assets/img/pv-images/plans/free.svg';
import basicPlanSvg from 'design-system/assets/img/pv-images/plans/basic.svg';
import plusPlanSvg from 'design-system/assets/img/pv-images/plans/plus.svg';
import visionaryPlanSvg from 'design-system/assets/img/pv-images/plans/visionary.svg';
import Info from '../../components/link/Info';

interface PlanCountries {
    free: string[];
    basic: string[];
    all: string[];
}

export enum PLAN {
    FREE = 'free',
    PLUS = 'plus',
    PROFESSIONAL = 'professional',
    VISIONARY = 'visionary',
    VPNBASIC = 'vpnbasic',
    VPNPLUS = 'vpnplus'
}

export const PLAN_NAMES = {
    [PLAN.FREE]: 'Free',
    [PLAN.VISIONARY]: 'Visionary',
    [PLAN.VPNBASIC]: 'Basic',
    [PLAN.VPNPLUS]: 'Plus',
    [PLAN.PLUS]: 'Plus',
    [PLAN.PROFESSIONAL]: 'Professional'
};

type VPNPlans = PLAN.FREE | PLAN.VPNBASIC | PLAN.VPNPLUS | PLAN.VISIONARY;
export const VPN_PLANS = [PLAN.FREE, PLAN.VPNBASIC, PLAN.VPNPLUS, PLAN.VISIONARY];
export const VPN_BEST_DEAL_PLANS = [PLAN.VPNBASIC, PLAN.VPNPLUS, PLAN.VISIONARY];

type MailPlans = PLAN.FREE | PLAN.PLUS | PLAN.VISIONARY | PLAN.PROFESSIONAL;
export const MAIL_PLANS = [PLAN.FREE, PLAN.PLUS, PLAN.VISIONARY, PLAN.PROFESSIONAL];

export const getPlusPlan = (clientType: CLIENT_TYPES) => (clientType === CLIENT_TYPES.VPN ? PLAN.VPNPLUS : PLAN.PLUS);

export const getAvailablePlans = (clientType: CLIENT_TYPES, bestDeal?: boolean) => {
    if (clientType === CLIENT_TYPES.VPN) {
        return bestDeal ? VPN_BEST_DEAL_PLANS : VPN_PLANS;
    }

    return MAIL_PLANS;
};

const getVPNPlanFeatures = (plan: VPNPlans, maxConnections: number, countries: PlanCountries) =>
    ({
        [PLAN.FREE]: {
            image: <img width={13} src={freePlanSvg} alt={`${PLAN_NAMES[PLAN.FREE]} plan image`} />,
            description: c('Plan Description').t`Privacy and security for everyone`,
            upsell: {
                planName: PLAN.VPNBASIC,
                features: [
                    c('Plan Feature').t`High speed 1 Gbps VPN servers`,
                    c('Plan Feature').t`Access to ${countries.basic.length} countries`,
                    c('Plan Feature').t`Filesharing/P2P support`
                ]
            },
            features: [
                c('Plan Feature').ngettext(
                    msgid`${maxConnections} simultaneous VPN connection`,
                    `${maxConnections} simultaneous VPN connections`,
                    maxConnections
                ),
                c('Plan Feature').t`Servers in ${countries.free.length} countries`,
                c('Plan Feature').t`Medium speed`,
                c('Plan Feature').t`No logs policy`,
                c('Plan Feature').t`No data limit`,
                c('Plan Feature').t`No ads`
            ]
        },
        [PLAN.VPNBASIC]: {
            image: <img width={60} src={basicPlanSvg} alt={`${PLAN_NAMES[PLAN.VPNBASIC]} plan image`} />,
            description: c('Plan Description').t`Basic privacy features`,
            additionalFeatures: c('Plan feature').t`All ${PLAN_NAMES[PLAN.FREE]} plan features`,
            upsell: {
                planName: PLAN.VPNPLUS,
                features: [
                    c('Plan Feature').t`Highest speed servers (10 Gbps)`,
                    c('Plan Feature').t`Access blocked content`,
                    c('Plan Feature').t`All advanced security features`
                ]
            },
            features: [
                c('Plan Feature').ngettext(
                    msgid`${maxConnections} simultaneous VPN connection`,
                    `${maxConnections} simultaneous VPN connections`,
                    maxConnections
                ),
                c('Plan Feature').t`Servers in ${countries.basic.length} countries`,
                c('Plan Feature').t`High speed servers`,
                <>
                    <span className="mr0-5">{c('Plan Feature').t`Filesharing/P2P support`}</span>
                    <Info title={c('Tooltip').t`Support for file sharing protocols such as Bittorrent.`} />
                </>,
                c('Plan Feature').t`No logs policy`
            ]
        },
        [PLAN.VPNPLUS]: {
            image: <img width={60} src={plusPlanSvg} alt={`${PLAN_NAMES[PLAN.VPNPLUS]} plan image`} />,
            isBest: true,
            description: c('Plan Description').t`Advanced security features`,
            additionalFeatures: c('Plan feature').t`All ${PLAN_NAMES[PLAN.VPNBASIC]} plan features`,
            features: [
                c('Plan Feature').ngettext(
                    msgid`${maxConnections} simultaneous VPN connection`,
                    `${maxConnections} simultaneous VPN connections`,
                    maxConnections
                ),
                countries.basic.length !== countries.all.length &&
                    c('Plan Feature').t`Servers in ${countries.all.length} countries`,
                c('Plan Feature').t`Secure Core`,
                c('Plan Feature').t`Highest speeds`,
                <>
                    <span className="mr0-5">{c('Plan Feature').t`Access blocked content`}</span>
                    <Info
                        title={c('Tooltip')
                            .t`Access content (Netflix, Amazon Prime, Wikipedia, Facebook, Youtube, etc) no matter where you are.`}
                    />
                </>,
                c('Plan Feature').t`All advanced security features`
            ]
        },
        [PLAN.VISIONARY]: {
            image: <img width={100} src={visionaryPlanSvg} alt={`${PLAN_NAMES[PLAN.VISIONARY]} plan image`} />,
            description: c('Plan Description').t`The complete privacy suite`,
            additionalFeatures: c('Plan feature').t`All ${PLAN_NAMES[PLAN.VPNPLUS]} plan features`,
            features: [
                c('Plan Feature').ngettext(
                    msgid`${maxConnections} simultaneous VPN connection`,
                    `${maxConnections} simultaneous VPN connections`,
                    maxConnections
                ),
                c('Plan Feature').t`ProtonMail Visionary account`
            ]
        }
    }[plan]);

const getMailPlanFeatures = (plan: MailPlans) =>
    ({
        [PLAN.FREE]: {
            image: <div>FREE PLAN IMAGE</div>,
            description: c('Plan Description').t`Basic account with limited features`,
            upsell: {
                planName: PLAN.PLUS,
                features: [
                    c('Plan Feature').t`Upsell feature 1`,
                    c('Plan Feature').t`Upsell feature 2`,
                    c('Plan Feature').t`Upsell feature 3`
                ]
            },
            features: [
                c('Plan Feature').t`500MB storage`,
                c('Plan Feature').t`150 messages per day`,
                c('Plan Feature').t`Limited Support`
            ]
        },
        [PLAN.PLUS]: {
            image: <div>PLUS PLAN IMAGE</div>,
            isBest: true,
            description: c('Plan Description').t`Secure email with advanced features`,
            upsell: {
                planName: PLAN.VISIONARY,
                features: [
                    c('Plan Feature').t`Upsell feature 1`,
                    c('Plan Feature').t`Upsell feature 2`,
                    c('Plan Feature').t`Upsell feature 3`,
                    c('Plan Feature').t`Upsell feature 4`
                ]
            },
            features: [
                c('Plan Feature').t`5 GB storage`,
                c('Plan Feature').t`1000 messages per day`,
                c('Plan Feature').t`Labels, Custom Filters, and Folders`,
                c('Plan Feature').t`Send encrypted messages to external recipients`,
                c('Plan Feature').t`Use your own domain (e.g. john@smith.com)`,
                c('Plan Feature').t`Up to 5 email aliases`,
                c('Plan Feature').t`Priority Customer Support`
            ]
        },
        [PLAN.VISIONARY]: {
            image: <div>VISIONARY PLAN IMAGE</div>,
            description: c('Plan Description').t`Special accounts for our supporters`,
            additionalFeatures: c('Plan feature').t`All ${PLAN_NAMES[PLAN.PLUS]} plan features`,
            features: [
                c('Plan Feature').t`20GB storage`,
                c('Plan Feature').t`No sending limits*`, // TODO: asterisk info
                c('Plan Feature').t`Support for up to 10 domains`,
                c('Plan Feature').t`Up to 50 email aliases`,
                c('Plan Feature').t`Multi-User Support (6 total)`,
                c('Plan Feature').t`Early access to new features`,
                c('Plan Feature').t`Includes access to ProtonVPN`
            ]
        },
        [PLAN.PROFESSIONAL]: {
            image: <div>PROFESSIONAL PLAN IMAGE</div>,
            description: c('Plan Description').t`Encrypted Email for your Organization`,
            features: [
                c('Plan Feature').t`Feature 1`,
                c('Plan Feature').t`Feature 2`,
                c('Plan Feature').t`Feature 3`,
                c('Plan Feature').t`Feature 4`
            ]
        }
    }[plan]);

// To use coupon, AmountDue from coupon must be merged into plan.
const getPlanPrice = (plan: any, cycle: number) => {
    const monthly = plan.Pricing[CYCLE.MONTHLY];
    const cyclePrice = plan.Pricing[cycle];
    const adjustedTotal = plan.AmountDue;

    const total = typeof adjustedTotal !== 'undefined' ? adjustedTotal : cyclePrice;
    const saved = monthly * cycle - cyclePrice;
    const totalMonthly = total / cycle;

    return { monthly, total, totalMonthly, saved };
};

export const getPlan = (
    clientType: CLIENT_TYPES,
    planName: VPNPlans | MailPlans,
    cycle: number,
    plans: any = [],
    countries: PlanCountries = { free: [], basic: [], all: [] }
) => {
    const plan = plans.find(({ Type, Name }: any) => Type === PLAN_TYPES.PLAN && Name === planName);
    const price = plan ? getPlanPrice(plan, cycle) : { monthly: 0, total: 0, totalMonthly: 0, saved: 0 };

    const planFeatures =
        clientType === CLIENT_TYPES.VPN
            ? getVPNPlanFeatures(planName as VPNPlans, plan ? plan.MaxVPN : 1, countries)
            : getMailPlanFeatures(planName as MailPlans);

    return {
        ...planFeatures,
        planName,
        title: PLAN_NAMES[planName],
        id: plan && plan.ID,
        disabled: !plan && planName !== PLAN.FREE,
        price,
        couponDiscount: plan && Math.abs(plan.CouponDiscount),
        couponDescription: plan && plan.CouponDescription
    };
};
