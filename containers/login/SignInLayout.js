import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { c } from 'ttag';
import { Title, Href, VpnLogo, MailLogo, FooterDetails, SupportDropdown, useConfig } from 'react-components';
import { CLIENT_TYPES } from 'proton-shared/lib/constants';

import PublicHeader from './PublicHeader';

const { VPN, MAIL, DRIVE } = CLIENT_TYPES;

const SignInLayout = ({ children, title }) => {
    const { CLIENT_TYPE } = useConfig();

    const envSpecific = {
        [MAIL]: {
            title: 'ProtonMail',
            staticURL: 'protonmail.com',
            logo: <MailLogo className="fill-primary" />,
            footerLinkText: 'ProtonMail.com'
        },
        [VPN]: {
            title: 'ProtonVPN',
            staticURL: 'protonvpn.com',
            logo: <VpnLogo className="fill-primary" />,
            footerLinkText: 'ProtonVPN.com'
        },
        [DRIVE]: {
            title: 'ProtonDrive',
            staticURL: 'protondrive.com',
            logo: <MailLogo className="fill-primary" />,
            footerLinkText: 'ProtonDrive.com'
        }
    }[CLIENT_TYPE];

    useEffect(() => {
        document.title = `${title} - ${envSpecific.title}`;
    }, []);

    return (
        <div className="pt1 pb1 pl2 pr2">
            <PublicHeader
                left={
                    <>
                        <span className="opacity-50">{c('Label').t`Back to:`}</span>{' '}
                        <Href
                            url={`https://${envSpecific.staticURL}`}
                            className="inbl color-white nodecoration hover-same-color"
                            target="_self"
                        >
                            {envSpecific.staticURL}
                        </Href>
                    </>
                }
                middle={
                    <Href url={envSpecific.staticURL} target="_self">
                        {envSpecific.logo}
                    </Href>
                }
                right={
                    <>
                        <div className="flex flex-justify-end">
                            <SupportDropdown className="pm-button--primaryborder-dark" />
                            <Link className="ml1 notablet pm-button--primary" to="/signup">{c('Link')
                                .t`Sign up for free`}</Link>
                        </div>
                    </>
                }
            />
            <Title className="flex-item-noshrink aligncenter color-primary">{title}</Title>
            <div className="flex-item-fluid flex-item-noshrink flex flex-column flex-nowrap">
                <div className="flex flex-column flex-nowrap flex-item-noshrink">
                    <div className="center bg-white color-global-grey mt2 mw40e w100 p2 bordered-container flex-item-noshrink">
                        {children}
                    </div>
                    <p className="aligncenter flex-item-noshrink">
                        <Link className="bold nodecoration primary-link" to="/signup">{c('Link')
                            .t`Don't have an account yet? Sign up for free!`}</Link>
                    </p>
                </div>
                <footer className="opacity-50 mtauto flex-item-noshrink aligncenter pb1">
                    <FooterDetails link={<a href={envSpecific.staticURL}>{envSpecific.footerLinkText}</a>} />
                </footer>
            </div>
        </div>
    );
};

SignInLayout.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired
};

export default SignInLayout;
