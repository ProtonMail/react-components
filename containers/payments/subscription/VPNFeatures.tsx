import React from 'react';
import { c } from 'ttag';
import { APPS, PLANS } from 'proton-shared/lib/constants';

import { useVPNCountries } from '../../../hooks';
import { Icon } from '../../../components';
import { VPNFeature } from './interface';
import Features from './Features';

const CheckIcon = () => <Icon className="color-primary" name="on" alt={c('information').t`Included`} />;
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
            label: c('VPN feature').t`VPN servers`,
            free: vpnCountries.free.length,
            [PLANS.VPNBASIC]: vpnCountries.basic.length,
            [PLANS.VPNPLUS]: vpnCountries.all.length,
            [PLANS.VISIONARY]: vpnCountries.all.length,
        },
        {
            name: 'countries',
            label: c('VPN feature').t`Locations/Countries`,
            free: `${vpnCountries.free.length} (US, NL, JP)`,
            [PLANS.VPNBASIC]: vpnCountries.basic.length,
            [PLANS.VPNPLUS]: vpnCountries.all.length,
            [PLANS.VISIONARY]: vpnCountries.all.length,
        },
        {
            name: 'speed',
            label: c('VPN feature').t`Speed`,
            free: c('VPN feature option').t`Medium`,
            [PLANS.VPNBASIC]: c('VPN feature option').t`High`,
            [PLANS.VPNPLUS]: c('VPN feature option').t`Highest (up to 10Gbits/s)`,
            [PLANS.VISIONARY]: c('VPN feature option').t`Highest (10Gbps)`,
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
            name: 'filesharing',
            label: c('VPN feature').t`P2P/BitTorrent`,
            free: EmDash,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'content',
            label: c('VPN feature').t`Specific content unlocking`,
            free: EmDash,
            [PLANS.VPNBASIC]: EmDash,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'tor',
            label: c('VPN feature').t`Tor over VPN`,
            free: EmDash,
            [PLANS.VPNBASIC]: EmDash,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'secure-core',
            label: c('VPN feature').t`SecureCore servers`,
            free: EmDash,
            [PLANS.VPNBASIC]: EmDash,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'visionary',
            label: c('VPN feature').t`ProtonMail Visionary`,
            free: EmDash,
            [PLANS.VPNBASIC]: EmDash,
            [PLANS.VPNPLUS]: EmDash,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'juridiction',
            label: c('VPN feature').t`Juridiction`,
            free: c('VPN feature option').t`Switzerland`,
            [PLANS.VPNBASIC]: c('VPN feature option').t`Switzerland`,
            [PLANS.VPNPLUS]: c('VPN feature option').t`Switzerland`,
            [PLANS.VISIONARY]: c('VPN feature option').t`Switzerland`,
        },
        {
            name: 'audited',
            label: c('VPN feature').t`Open source and audited apps`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
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
            name: 'no-logs',
            label: c('VPN feature').t`Strict no-logs policy`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'bandwidth',
            label: c('VPN feature').t`Volume/bandwidth cap`,
            free: EmDash,
            [PLANS.VPNBASIC]: EmDash,
            [PLANS.VPNPLUS]: EmDash,
            [PLANS.VISIONARY]: EmDash,
        },
        {
            name: 'data',
            label: c('VPN feature').t`User data monetization`,
            free: c('VPN feature option').t`None`,
            [PLANS.VPNBASIC]: c('VPN feature option').t`None`,
            [PLANS.VPNPLUS]: c('VPN feature option').t`None`,
            [PLANS.VISIONARY]: c('VPN feature option').t`None`,
        },
        {
            name: 'platform',
            label: c('VPN feature').t`Platforms supported`,
            free: c('VPN feature option').t`Windows, macOS, iOS, Linux, Android, Android TV, Chromebook, Chromecast`,
            [PLANS.VPNBASIC]: c('VPN feature option')
                .t`Windows, macOS, iOS, Linux, Android, Android TV, Chromebook, Chromecast`,
            [PLANS.VPNPLUS]: c('VPN feature option')
                .t`Windows, macOS, iOS, Linux, Android, Android TV, Chromebook, Chromecast`,
            [PLANS.VISIONARY]: c('VPN feature option')
                .t`Windows, macOS, iOS, Linux, Android, Android TV, Chromebook, Chromecast`,
        },
        {
            name: 'language',
            label: c('VPN feature').t`Languages supported`,
            free: 12,
            [PLANS.VPNBASIC]: 12,
            [PLANS.VPNPLUS]: 12,
            [PLANS.VISIONARY]: 12,
        },
        {
            name: 'DNS',
            label: c('VPN feature').t`DNS leak protection`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'kill switch',
            label: c('VPN feature').t`Kill Switch / Always-on VPN`,
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
            label: c('VPN feature').t`Full Disk Encryption on Servers`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'split tunneling',
            label: c('VPN feature').t`Split tunneling`,
            free: (
                <>
                    <CheckIcon />
                    <span>{c('VPN feature option').t`(Android & windows only)`}</span>
                </>
            ),
            [PLANS.VPNBASIC]: (
                <>
                    <CheckIcon />
                    <span>{c('VPN feature option').t`(Android & windows only)`}</span>
                </>
            ),
            [PLANS.VPNPLUS]: (
                <>
                    <CheckIcon />
                    <span>{c('VPN feature option').t`(Android & windows only)`}</span>
                </>
            ),
            [PLANS.VISIONARY]: (
                <>
                    <CheckIcon />
                    <span>{c('VPN feature option').t`(Android & windows only)`}</span>
                </>
            ),
        },
        {
            name: 'profiles',
            label: c('VPN feature').t`Custom connection profiles`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'router',
            label: c('VPN feature').t`Router support`,
            free: <CheckIcon />,
            [PLANS.VPNBASIC]: <CheckIcon />,
            [PLANS.VPNPLUS]: <CheckIcon />,
            [PLANS.VISIONARY]: <CheckIcon />,
        },
        {
            name: 'money-back',
            label: c('VPN feature').t`30-days money-back guarantee`,
            free: EmDash,
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

    return (
        <Features appName={APPS.PROTONVPN_SETTINGS} onSelect={onSelect} planLabels={planLabels} features={features} />
    );
};

export default VPNFeatures;
