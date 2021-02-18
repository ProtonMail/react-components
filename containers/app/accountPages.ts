import { UserModel } from 'proton-shared/lib/interfaces';
import { c } from 'ttag';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import { PERMISSIONS, APPS } from 'proton-shared/lib/constants';
import { SectionConfig } from '../../components';

const { UPGRADER, NOT_SUB_USER, PAID } = PERMISSIONS;

export const getOverviewPage = () => {
    return {
        text: c('Title').t`Dashboard`,
        to: '/overview',
        toApp: APPS.PROTONACCOUNT,
        icon: 'apps',
    };
};

export const getAccountPage = (user: UserModel) => {
    return {
        text: c('Title').t`Password & Recovery`,
        to: '/account',
        toApp: APPS.PROTONACCOUNT,
        icon: 'account',
        subsections: [
            {
                text: user.Name ? c('Title').t`Username` : c('Title').t`Email`,
                id: 'username',
            },
            {
                text: c('Title').t`Passwords`,
                id: 'passwords',
            },
            {
                text: c('Title').t`Two factor authentication`,
                id: 'two-fa',
            },
            {
                text: c('Title').t`Recovery & notification`,
                id: 'email',
            },
            user.canPay && {
                text: c('Title').t`Email subscriptions`,
                id: 'news',
            },
            user.canPay && {
                text: c('Title').t`Delete account`,
                id: 'delete',
            },
        ].filter(isTruthy),
    };
};

export const getSubscriptionPage = (user: UserModel) => {
    return {
        text: c('Title').t`Payment`,
        to: '/subscription',
        toApp: APPS.PROTONACCOUNT,
        icon: 'dashboard',
        permissions: [UPGRADER, NOT_SUB_USER],
        subsections: [
            !user.hasPaidMail && {
                text: c('Title').t`Plans`,
                id: 'plans',
            },
            {
                text: c('Title').t`Subscription`,
                id: 'subscription',
                permissions: [UPGRADER],
            },
            {
                text: c('Title').t`Billing details`,
                id: 'billing',
                permissions: [PAID],
            },
            {
                text: c('Title').t`Payment methods`,
                id: 'payment-methods',
            },
            {
                text: c('Title').t`Invoices`,
                id: 'invoices',
            },
        ].filter(isTruthy),
    };
};

export const getSecurityPage = () => {
    return {
        text: c('Title').t`Security`,
        to: '/security',
        toApp: APPS.PROTONACCOUNT,
        icon: 'security',
        subsections: [
            {
                text: c('Title').t`Session management`,
                id: 'sessions',
            },
            {
                text: c('Title').t`Authentication logs`,
                id: 'logs',
            },
        ],
    };
};

export const getAccountPages = (user: UserModel): SectionConfig[] =>
    [getOverviewPage(), getAccountPage(user), user.canPay && getSubscriptionPage(user), getSecurityPage()].filter(
        isTruthy
    );
