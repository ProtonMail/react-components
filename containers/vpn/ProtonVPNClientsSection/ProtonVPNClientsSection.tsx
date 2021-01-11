import React from 'react';
import { c } from 'ttag';
import VPNClientCard from './VPNClientCard';
import { DropdownMenuLink } from '../../../components';

const ProtonVPNClientsSection = () => {
    const androidLinks = [
        {
            href: 'https://protonvpn.com/download/ProtonVPN.apk',
            children: 'Direct APK link',
        },
        {
            href: 'https://github.com/ProtonVPN/android-app/releases',
            children: 'GitHub',
        },
        {
            href: 'https://f-droid.org/en/packages/ch.protonvpn.android/',
            children: 'F-droid',
        },
    ].map(({ href, children }) => {
        return <DropdownMenuLink href={href}>{children}</DropdownMenuLink>;
    });

    return (
        <div className="flex onmobile-flex-column">
            <VPNClientCard
                title={c('VPNClient').t`Android`}
                icon="android"
                link="https://play.google.com/store/apps/details?id=ch.protonvpn.android&utm_source=protonvpn.com&utm_content=dashboard"
                items={androidLinks}
            />
            <VPNClientCard
                title={c('VPNClient').t`iOS`}
                icon="apple"
                link="https://itunes.apple.com/us/app/protonvpn-fast-secure-vpn/id1437005085"
            />
            <VPNClientCard title={c('VPNClient').t`Windows`} icon="windows" link="https://protonvpn.com/download/" />
            <VPNClientCard title={c('VPNClient').t`macOS`} icon="apple" link="https://protonvpn.com/download/" />
            <VPNClientCard
                title={c('VPNClient').t`GNU/Linux`}
                icon="linux"
                link=" https://protonvpn.com/support/official-linux-client/"
            />
            <VPNClientCard
                title={c('VPNClient').t`ChromeBook`}
                icon="chrome"
                link="https://play.google.com/store/apps/details?id=ch.protonvpn.android&utm_source=protonvpn.com&utm_content=dashboard"
                items={androidLinks}
            />
            <VPNClientCard
                title={c('VPNClient').t`Android TV`}
                icon="tv"
                link="https://play.google.com/store/apps/details?id=ch.protonvpn.android&utm_source=protonvpn.com&utm_content=dashboard"
                items={androidLinks}
            />
        </div>
    );
};

export default ProtonVPNClientsSection;
