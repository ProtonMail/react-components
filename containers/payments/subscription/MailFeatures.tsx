import React from 'react';
import { c } from 'ttag';
import { PLANS } from 'proton-shared/lib/constants';

import { Icon } from '../../../components';
import { MailFeature } from './interface';
import Features from './Features';

const CheckIcon = () => <Icon className="color-primary" name="on" alt={c('Info').t`included`} />;
const EmDash = '—';

const getFeatures = (): MailFeature[] => {
    return [
        {
            name: 'users',
            label: c('Mail feature').t`Users`,
            free: '1',
            [PLANS.PLUS]: '1',
            [PLANS.PROFESSIONAL]: '1 - 5000 *',
            [PLANS.VISIONARY]: '6',
        },
        {
            name: 'storage',
            label: c('Mail feature').t`Storage`,
            free: '0.5 GB',
            [PLANS.PLUS]: '5 GB *',
            [PLANS.PROFESSIONAL]: c('Mail feature option').t`5 GB / user *`,
            [PLANS.VISIONARY]: '20 GB',
        },
        {
            name: 'addresses',
            label: c('Mail feature').t`Addresses`,
            free: '1',
            [PLANS.PLUS]: '5',
            [PLANS.PROFESSIONAL]: c('Mail feature option').t`5 / user *`,
            [PLANS.VISIONARY]: '50',
        },
        {
            name: 'custom domains',
            label: c('Mail feature').t`Custom domains`,
            free: EmDash,
            [PLANS.PLUS]: '1 *',
            [PLANS.PROFESSIONAL]: '2 *',
            [PLANS.VISIONARY]: '10',
        },
        {
            name: 'messages per day',
            label: c('Mail feature').t`Messages per day`,
            free: '150',
            [PLANS.PLUS]: c('Mail feature option').t`Unlimited`,
            [PLANS.PROFESSIONAL]: c('Mail feature option').t`Unlimited **`,
            [PLANS.VISIONARY]: c('Mail feature option').t`Unlimited **`,
        },
        {
            name: 'folders / labels',
            label: c('Mail feature').t`Folders / labels`,
            free: '3',
            [PLANS.PLUS]: '200',
            [PLANS.PROFESSIONAL]: c('Mail feature option').t`Unlimited`,
            [PLANS.VISIONARY]: c('Mail feature option').t`Unlimited`,
        },
        {
            name: 'support',
            label: c('Mail feature').t`Support`,
            free: c('Mail feature').t`Limited`,
            [PLANS.PLUS]: c('Mail feature').t`Priority`,
            [PLANS.PROFESSIONAL]: c('Mail feature').t`Priority`,
            [PLANS.VISIONARY]: c('Mail feature').t`Priority`,
        },
        {
            name: 'encrypted contacts',
            label: c('Mail feature').t`Encrypted contacts`,
            free: EmDash,
            [PLANS.PLUS]: <CheckIcon />,
            [PLANS.PROFESSIONAL]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'address verification',
            label: c('Mail feature').t`Address verification`,
            free: EmDash,
            [PLANS.PLUS]: <CheckIcon />,
            [PLANS.PROFESSIONAL]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'custom filters',
            label: c('Mail feature').t`Custom filters`,
            free: EmDash,
            [PLANS.PLUS]: <CheckIcon />,
            [PLANS.PROFESSIONAL]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'IMAP/SMTP',
            label: c('Mail feature').t`IMAP / SMTP`,
            free: EmDash,
            [PLANS.PLUS]: <CheckIcon />,
            [PLANS.PROFESSIONAL]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'autoresponder',
            label: c('Mail feature').t`Autoresponder`,
            free: EmDash,
            [PLANS.PLUS]: <CheckIcon />,
            [PLANS.PROFESSIONAL]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'short domain',
            label: c('Mail feature').t`Short domain`,
            free: EmDash,
            [PLANS.PLUS]: <CheckIcon />,
            [PLANS.PROFESSIONAL]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'catch all email',
            label: c('Mail feature').t`Catch all email`,
            free: EmDash,
            [PLANS.PLUS]: EmDash,
            [PLANS.PROFESSIONAL]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'multi user support',
            label: c('Mail feature').t`Multi user support`,
            free: EmDash,
            [PLANS.PLUS]: EmDash,
            [PLANS.PROFESSIONAL]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
    ];
};

interface Props {
    onSelect: (planName: PLANS | 'free') => void;
}

const MailFeatures = ({ onSelect }: Props) => {
    const features = getFeatures();
    const planLabels = [
        { label: 'Free', key: 'free' } as const,
        { label: 'Plus', key: PLANS.PLUS },
        { label: 'Professional', key: PLANS.PROFESSIONAL },
        { label: 'Visionary', key: PLANS.VISIONARY },
    ];
    return (
        <>
            <Features onSelect={onSelect} planLabels={planLabels} features={features} />
            <p className="text-sm mt1 mb1">* {c('Info concerning plan features').t`Denotes customizable features`}</p>
            <p className="text-sm mt0 mb1">
                **{' '}
                {c('Info concerning plan features')
                    .t`ProtonMail cannot be used for mass emailing or spamming. Legitimate emails are unlimited.`}
            </p>
        </>
    );
};

export default MailFeatures;
