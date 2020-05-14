import React, { ReactNode } from 'react';
import { c } from 'ttag';
import { classnames, Icon } from 'react-components';
import { Locales } from 'proton-shared/lib/interfaces/Locales';

import './SignLayout.scss';
import LanguageSelect from './LanguageSelect';

interface Props {
    children: ReactNode;
    aside?: ReactNode;
    help?: ReactNode;
    onBack?: () => void;
    locales: Locales;
    larger?: boolean;
}

const SignLayout = ({ children, aside, larger, help, onBack, locales }: Props) => {
    return (
        <div className="pt1 pb1 pl2 pr2 scroll-if-needed h100v">
            <div className="flex-item-fluid flex-item-noshrink flex flex-column flex-nowrap">
                <div className="flex flex-column flex-nowrap flex-item-noshrink">
                    <div
                        className={classnames([
                            'center bg-white-dm color-global-grey-dm mt2 mb2 onmobile-mt1 onmobile-pb1 w100 mw100 bordered-container flex-item-noshrink flex flex-nowrap',
                            larger ? '' : aside ? 'mw50e' : 'mw40e'
                        ])}
                    >
                        <div>
                            <div className="flex flex-items-center flex-nowrap p2">
                                <span className="flex-item-fluid">
                                    {onBack ? (
                                        <button onClick={onBack} type="button" title={c('Action').t`Back`}>
                                            <Icon name="arrow-left" />
                                        </button>
                                    ) : null}
                                </span>
                                <div className="flex-item-fluid aligncenter">TODO:ProtonLogo</div>
                                <span className="flex-item-fluid alignright" />
                            </div>
                            {children}
                            <div className="flex flex-items-center flex-nowrap p2">
                                <span className="flex-item-fluid">
                                    <LanguageSelect locales={locales} className="noborder" />
                                </span>
                                <span className="flex-item-fluid alignright">{help}</span>
                            </div>
                        </div>
                        {aside ? (
                            <aside className="nomobile bg-global-light p2 flex flex-items-center flex-justify-center small m0">
                                {aside}
                            </aside>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignLayout;
