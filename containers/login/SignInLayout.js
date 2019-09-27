import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { c } from 'ttag';
import { Title, Href, VpnLogo, MailLogo, FooterDetails, SupportDropdown, useConfig } from 'react-components';
import { CLIENT_TYPES } from 'proton-shared/lib/constants';

import PublicHeader from './PublicHeader';

const { VPN } = CLIENT_TYPES;

const SignInLayout = ({ children, title }) => {
    const { CLIENT_TYPE } = useConfig();
    const isVPN = CLIENT_TYPE === VPN;
    const staticURL = isVPN ? 'https://protonvpn.com' : 'https://protonmail.com';

    useEffect(() => {
        document.title = `${title} - ${isVPN ? 'ProtonVPN' : 'ProtonMail'}`;
    }, []);

    return (
        <div className="pt1 pb1 pl2 pr2">
            <PublicHeader
                left={
                    <>
                        <span className="opacity-50">{c('Label').t`Back to:`}</span>{' '}
                        <Href url={staticURL} className="inbl color-white nodecoration hover-same-color" target="_self">
                            {staticURL}
                        </Href>
                    </>
                }
                middle={
                    <Href url={staticURL} target="_self">
                        {isVPN ? <VpnLogo className="fill-primary" /> : <MailLogo className="fill-primary" />}
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
                    <FooterDetails link={<a href={staticURL}>{isVPN ? 'ProtonVPN.com' : 'ProtonMail.com'}</a>} />
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
