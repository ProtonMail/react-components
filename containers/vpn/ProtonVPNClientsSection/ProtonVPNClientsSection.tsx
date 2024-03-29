import React from 'react';
import { c } from 'ttag';
import VPNClientCard from './VPNClientCard';
import { DropdownMenuLink, Copy } from '../../../components';
import { SettingsParagraph, SettingsSectionWide } from '../../account';

const ProtonVPNClientsSection = () => {
    const androidLinks = [
        {
            href: 'https://protonvpn.com/download/ProtonVPN.apk',
            children: 'APK',
        },
        {
            href: 'https://github.com/ProtonVPN/android-app/releases',
            children: 'GitHub',
        },
        {
            href: 'https://f-droid.org/en/packages/ch.protonvpn.android/',
            children: 'F-Droid',
        },
    ].map(({ href, children }) => {
        return (
            <div className="flex flex-align-items-center" key={children}>
                <DropdownMenuLink className="flex-item-fluid" href={href}>
                    {children}
                </DropdownMenuLink>
                <Copy shape="ghost" value={href} className="flex-item-noshrink mr0-5" />
            </div>
        );
    });

    return (
        <SettingsSectionWide>
            <SettingsParagraph>
                {c('Info')
                    .t`To secure your internet connection, download and install the ProtonVPN application for your device and connect to a ProtonVPN server.`}
            </SettingsParagraph>
            <div className="flex on-mobile-flex-column">
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
                <VPNClientCard
                    title={c('VPNClient').t`Windows`}
                    icon="windows"
                    link="https://protonvpn.com/download-windows/"
                />
                <VPNClientCard
                    title={c('VPNClient').t`macOS`}
                    icon="macos"
                    link="https://protonvpn.com/download-macos/"
                />
                <VPNClientCard
                    title={c('VPNClient').t`GNU/Linux`}
                    icon="linux"
                    link="https://protonvpn.com/download-linux/"
                />
                <VPNClientCard
                    title={c('VPNClient').t`Chromebook`}
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
        </SettingsSectionWide>
    );
};

export default ProtonVPNClientsSection;
