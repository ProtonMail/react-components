import { UserModel } from 'proton-shared/lib/interfaces';
import { c } from 'ttag';
import { PERMISSIONS, APPS } from 'proton-shared/lib/constants';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import { SectionConfig } from '../..';

const { PAID_MAIL } = PERMISSIONS;

export const getOverviewPage = () => {
    return {
        text: c('Title').t`General`,
        toApp: APPS.PROTONMAIL,
        to: '/settings/overview',
        icon: 'apps',
    };
};

export const getGeneralPage = () => {
    return {
        text: c('Title').t`General`,
        to: '/settings/general',
        toApp: APPS.PROTONMAIL,
        icon: 'general',
        subsections: [
            {
                text: c('Title').t`Desktop notifications`,
                id: 'desktop-notifications',
            },
            {
                text: c('Title').t`Messages`,
                id: 'messages',
            },
            {
                text: c('Title').t`Keyboard shortcuts`,
                id: 'shortcuts',
            },
        ],
    };
};

export const getImportPage = () => {
    return {
        text: c('Title').t`Import & export`,
        to: '/settings/import',
        toApp: APPS.PROTONMAIL,
        icon: 'import',
        subsections: [
            {
                text: c('Title').t`Import Assistant`,
                id: 'start-import',
            },
            {
                text: c('Title').t`Current imports`,
                id: 'current-import',
            },
            {
                text: c('Title').t`Past imports`,
                id: 'past-import',
            },
            {
                text: c('Title').t`Import-Export app`,
                id: 'import-export',
                permissions: [PAID_MAIL],
            },
            {
                text: c('Title').t`Related features`,
                id: 'related-features',
                hide: true,
            },
        ],
    };
};

export const getAddressesPage = (user: UserModel) => {
    return {
        text: c('Title').t`Addresses`,
        to: '/settings/addresses',
        toApp: APPS.PROTONMAIL,
        icon: 'addresses',
        subsections: [
            {
                text: c('Title').t`My addresses`,
                id: 'addresses',
            },
            user.canPay &&
                !user.isSubUser && {
                    text: c('Title').t`Short domain (@pm.me)`,
                    id: 'pmme',
                },
            user.canPay && {
                text: c('Title').t`Related features`,
                id: 'related-features',
                hide: true,
            },
        ].filter(isTruthy),
    };
};

export const getIdentityPage = () => {
    return {
        text: c('Title').t`Identity`,
        to: '/settings/identity',
        toApp: APPS.PROTONMAIL,
        icon: 'identity',
        subsections: [
            {
                text: c('Title').t`Display name & signature`,
                id: 'name-signature',
            },
            {
                text: c('Title').t`Signature footer `,
                id: 'proton-footer',
            },
        ],
    };
};

export const getAutoReply = () => {
    return {
        text: c('Title').t`Auto-reply`,
        to: '/settings/auto-reply',
        toApp: APPS.PROTONMAIL,
        icon: 'mailbox',
        permissions: [PAID_MAIL],
        subsections: [
            {
                text: c('Title').t`Auto-reply`,
                id: 'auto-reply',
            },
            {
                text: c('Title').t`Related features`,
                id: 'related-features',
                hide: true,
            },
        ],
    };
};

export const getAppearancePage = () => {
    return {
        text: c('Title').t`Appearance`,
        to: '/settings/appearance',
        toApp: APPS.PROTONMAIL,
        icon: 'apparence',
        subsections: [
            {
                text: c('Title').t`Layouts`,
                id: 'layouts',
            },
            {
                text: c('Title').t`Toolbars`,
                id: 'toolbars',
            },
            {
                text: c('Title').t`Themes`,
                id: 'themes',
            },
        ],
    };
};

export const getLabelsPage = () => {
    return {
        text: c('Title').t`Folders & labels`,
        to: '/settings/labels',
        toApp: APPS.PROTONMAIL,
        icon: 'folder-label',
        subsections: [
            {
                text: c('Title').t`Folders`,
                id: 'folderlist',
            },
            {
                text: c('Title').t`Labels`,
                id: 'labellist',
            },
        ],
    };
};

export const getFiltersPage = () => {
    return {
        text: c('Title').t`Filters`,
        to: '/settings/filters',
        toApp: APPS.PROTONMAIL,
        icon: 'filter',
        subsections: [
            {
                text: c('Title').t`Custom filters`,
                id: 'custom',
            },
            {
                text: c('Title').t`Spam filters`,
                id: 'spam',
            },
            {
                text: c('Title').t`Related features`,
                id: 'related-features',
                hide: true,
            },
        ],
    };
};

export const getSecurityPage = () => {
    return {
        text: c('Title').t`Security & keys`,
        to: '/settings/security',
        toApp: APPS.PROTONMAIL,
        icon: 'security',
        subsections: [
            {
                text: c('Title').t`Address verification`,
                id: 'address-verification',
            },
            {
                text: c('Title').t`External PGP settings`,
                id: 'pgp-settings',
            },
            {
                text: c('Title').t`Email encryption keys`,
                id: 'addresses',
            },
            {
                text: c('Title').t`Contact encryption keys`,
                id: 'user',
            },
        ],
    };
};

export const getAppsPage = () => {
    return {
        text: c('Title').t`Apps`,
        to: '/settings/apps',
        toApp: APPS.PROTONMAIL,
        icon: 'vpn-connx',
        subsections: [
            {
                text: c('Title').t`Mobile apps`,
                id: 'protonmail-apps',
            },
            {
                text: c('Title').t`Beta program`,
                id: 'protonmail-beta',
            },
        ],
    };
};

export const getBridgePage = () => {
    return {
        text: c('Title').t`IMAP/SMTP tool`,
        to: '/settings/bridge',
        toApp: APPS.PROTONMAIL,
        icon: 'imap-smtp',
        permissions: [PAID_MAIL],
        subsections: [
            {
                text: c('Title').t`ProtonMail Bridge`,
                id: 'protonmail-bridge',
            },
        ],
    };
};

export const getMailPages = (user: UserModel): SectionConfig[] => [
    getOverviewPage(),
    // getGeneralPage(),
    getImportPage(),
    getAddressesPage(user),
    getIdentityPage(),
    getAppearancePage(),
    getLabelsPage(),
    getFiltersPage(),
    getAutoReply(),
    getSecurityPage(),
    getAppsPage(),
    getBridgePage(),
];
