import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { getAccountSettingsApp } from 'proton-shared/lib/apps/helper';
import { Alert, AppLink, Href, Table, TableHeader, TableBody, TableRow, Icon } from '../../components';

const ProtonMailBridgeSection = ({ permission }) => {
    const bridgeClients = [
        {
            icon: 'apple',
            platform: 'Mac OSX',
            fileType: '.dmg',
            link: 'https://protonmail.com/bridge/install',
        },
        {
            icon: 'windows',
            platform: 'Windows',
            fileType: '.exe',
            link: 'https://protonmail.com/bridge/install',
        },
        {
            icon: 'linux',
            platform: 'Linux',
            fileType: '.deb',
            link: 'https://protonmail.com/bridge/install',
        },
        {
            icon: 'linux',
            platform: 'Linux',
            fileType: '.rpm',
            link: 'https://protonmail.com/bridge/install',
        },
        {
            icon: 'linux',
            platform: 'Linux',
            fileType: 'PKGBUILD',
            link: 'https://protonmail.com/bridge/install',
        },
    ];

    const bridgeLink = (
        <Href url="https://protonmail.com/bridge/" key="bridge-link">{c('Link').t`ProtonMail Bridge page`}</Href>
    );

    return (
        <>
            <Alert learnMore="https://protonmail.com/bridge/">{c('Info')
                .t`ProtonMail supports IMAP/SMTP via the ProtonMail Bridge application. Thunderbird, Microsoft Outlook, and Apple Mail are officially supported on both Windows and MacOS.`}</Alert>
            {permission ? (
                <>
                    <Table className="pm-simple-table--has-actions">
                        <TableHeader
                            cells={[
                                c('Title for downloads section').t`Platform`,
                                c('Title for downloads section').t`File type`,
                                c('Title for downloads section').t`Action`,
                            ]}
                        />
                        <TableBody>
                            {bridgeClients.map(({ fileType, icon, platform, link }, index) => {
                                const key = index.toString();
                                return (
                                    <TableRow
                                        key={key}
                                        cells={[
                                            <span className="inline-flex flex-items-center">
                                                <Icon name={icon} className="mr0-5" />
                                                <span>{platform}</span>
                                            </span>,
                                            fileType,
                                            <Href key={key} url={link}>{c('Action').t`Download`}</Href>,
                                        ]}
                                    />
                                );
                            })}
                        </TableBody>
                    </Table>
                    <Alert>{c('Info')
                        .jt`To access more download options and instructions on how to install and use ProtonMail Bridge, please visit our ${bridgeLink}`}</Alert>
                </>
            ) : (
                <AppLink to="/subscription" toApp={getAccountSettingsApp()} className="pm-button pm-button--primary">{c(
                    'Action'
                ).t`Upgrade`}</AppLink>
            )}
        </>
    );
};

ProtonMailBridgeSection.propTypes = {
    permission: PropTypes.bool,
};

export default ProtonMailBridgeSection;
