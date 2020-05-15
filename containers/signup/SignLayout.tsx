import React, { ReactNode, useEffect } from 'react';
import { c } from 'ttag';
import { classnames, Href, useConfig } from 'react-components';

import './SignLayout.scss';
import LanguageSelect from './LanguageSelect';

interface Props {
    children: ReactNode;
    title: string;
    aside?: ReactNode;
    right?: ReactNode;
    left?: ReactNode;
    center?: ReactNode;
    larger?: boolean;
}

const SignLayout = ({ children, title, aside, larger, left, center, right }: Props) => {
    const { CLIENT_VERSION } = useConfig();
    const termsLink = <Href key="terms" to="https://protonmail.com/terms-and-conditions">{c('Link').t`Terms`}</Href>;
    const privacyLink = <Href key="privacy" to="https://protonmail.com/privacy-policy">{c('Link').t`Privacy`}</Href>;

    useEffect(() => {
        document.title = `${title} - Proton`;
    }, []);

    return (
        <div className="pt1 pb1 pl2 pr2 scroll-if-needed h100v signLayout-container flex flex-column flex-spacebetween">
            <div className="flex-item-fluid flex-item-noshrink flex flex-column flex-nowrap">
                <div className="flex flex-column flex-nowrap flex-item-noshrink">
                    <div
                        className={classnames([
                            'center bg-white-dm color-global-grey-dm mt2 mb2 onmobile-mt1 onmobile-pb1 w100 mw100 bordered-container flex-item-noshrink flex flex-nowrap',
                            larger ? '' : aside ? 'mw50e' : 'mw40e'
                        ])}
                    >
                        <div className="p2">
                            <header className="flex flex-items-center flex-nowrap mb2">
                                <span className="flex-item-fluid">{left}</span>
                                <span className="flex-item-fluid aligncenter">{center}</span>
                                <span className="flex-item-fluid alignright" />
                            </header>
                            <div className="mb2 flex-item-fluid">
                                {title ? <h1 className="h4 bold mb1 mt0">{title}</h1> : null}
                                {children}
                            </div>
                            <footer className="flex flex-items-center flex-nowrap">
                                <span className="flex-item-fluid">
                                    <LanguageSelect className="noborder" />
                                </span>
                                <span className="flex-item-fluid alignright">{right}</span>
                            </footer>
                        </div>
                        {aside ? (
                            <aside className="nomobile bg-global-light p2 flex flex-items-center flex-justify-center small m0">
                                {aside}
                            </aside>
                        ) : null}
                    </div>
                </div>
            </div>
            <footer className="opacity-50 aligncenter small m0 flex-item-noshrink">{c('Info')
                .jt`Made globally - Hosted in Switzerland | ${termsLink} | ${privacyLink} | Version ${CLIENT_VERSION}`}</footer>
        </div>
    );
};

export default SignLayout;
