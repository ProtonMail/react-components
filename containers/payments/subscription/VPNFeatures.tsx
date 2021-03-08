import React from 'react';
import { c } from 'ttag';
import { PLANS } from 'proton-shared/lib/constants';

import { useVPNCountries } from '../../../hooks';
import { Icon } from '../../../components';
import { VPNFeature } from './interface';
import Features from './Features';

const CheckIcon = () => <Icon name="on" />;
const EmDash = '—';

interface VPNCountries {
    free: string[];
    basic: string[];
    all: string[];
}

const getFeatures = (vpnCountries: VPNCountries): VPNFeature[] => {
    return [
        {
            name: 'connections',
            label: c('VPN feature').t`VPN Connections`,
            free: '1',
            [PLANS.VPNBASIC]: '2',
            [PLANS.VPNPLUS]: '5',
            [PLANS.VISIONARY]: '10',
        },
        {
            name: 'countries',
            label: c('VPN feature').t`Servers in countries`,
            free: vpnCountries.free.length,
            [PLANS.VPNBASIC]: vpnCountries.basic.length,
            [PLANS.VPNPLUS]: vpnCountries.all.length,
            [PLANS.VISIONARY]: vpnCountries.all.length,
        },
        {
            name: 'connection speed',
            label: c('VPN feature').t`Speed`,
            free: c('VPN feature option').t`Medium speed`,
            [PLANS.VPNBASIC]: c('VPN feature option').t`High speed`,
            [PLANS.VPNPLUS]: c('VPN feature option').t`Highest speed (up to 10Gbps)`,
            [PLANS.VISIONARY]: c('VPN feature option').t`Highest speed (10Gbps)`,
        },
        {
            name: 'filesharing',
            label: c('VPN feature').t`Filesharing / P2P`,
            free: EmDash,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'netshield',
            label: c('VPN feature').t`Adblocker (NetShield)`,
            free: EmDash,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'secure core',
            label: c('VPN feature').t`Secure Core and Tor VPN`,
            free: EmDash,
            [PLANS.VPNBASIC]: EmDash,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'privacy features',
            label: c('VPN feature').t`Advanced privacy features`,
            free: EmDash,
            [PLANS.VPNBASIC]: EmDash,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'access blocked content',
            label: c('VPN feature').t`Access blocked content`,
            free: EmDash,
            [PLANS.VPNBASIC]: EmDash,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'no logs',
            label: c('VPN feature').t`No logs / no ads`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'PFS',
            label: c('VPN feature').t`Perfect Forward Secrecy (PFS)`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'encryption',
            label: c('VPN feature').t`AES-256 encryption`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'DNS leak protection',
            label: c('VPN feature').t`DNS leak protection`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'kill switch',
            label: c('VPN feature').t`Kill switch`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'always-on',
            label: c('VPN feature').t`Always-on VPN`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'open source',
            label: c('VPN feature').t`Open source`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: '10 Gbps servers',
            label: c('VPN feature').t`10 Gbps servers`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'split tunneling',
            label: c('VPN feature').t`Split tunneling support`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'swiss based',
            label: c('VPN feature').t`Swiss based`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'support',
            label: c('VPN feature').t`Professional support`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
    ];
};

interface Props {
    onSelect: (planName: PLANS | 'free') => void;
}

const VPNFeatures = ({ onSelect }: Props) => {
    const [vpnCountries] = useVPNCountries();

    const features = getFeatures(vpnCountries);
    const planLabels = [
        { label: 'Free', key: 'free' } as const,
        { label: 'Basic', key: PLANS.VPNBASIC },
        { label: 'Plus', key: PLANS.VPNPLUS },
        { label: 'Visionary', key: PLANS.VISIONARY },
    ];

    return <Features onSelect={onSelect} planLabels={planLabels} features={features} />;
};

export default VPNFeatures;
