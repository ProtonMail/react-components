import React, { ReactNode } from 'react';
import { LinkButton, SupportDropdown, classnames } from 'react-components';
import { c } from 'ttag';

import { SIGNUP_STEPS } from './constants';
import { SignupModel } from './interfaces';

interface Props {
    model: SignupModel;
    title: string;
    children: ReactNode;
    onBack?: () => void;
}

const { PLANS, PAYMENT } = SIGNUP_STEPS;

const SignLayout = ({ children, title, onBack, model }: Props) => {
    const larger = [PLANS, PAYMENT].includes(model.step);

    return (
        <div className="pt1 pb1 pl2 pr2 scroll-if-needed h100v">
            <div className="flex-item-fluid flex-item-noshrink flex flex-column flex-nowrap">
                <div className="flex flex-column flex-nowrap flex-item-noshrink">
                    <div
                        className={classnames([
                            'center bg-white-dm color-global-grey-dm mt2 mb2 onmobile-mt1 onmobile-pb1 w100 mw100 bordered-container flex-item-noshrink',
                            larger ? '' : 'mw40e'
                        ])}
                    >
                        <div className="flex flex-items-center flex-nowrap p2">
                            <span className="flex-item-fluid">
                                {onBack ? <LinkButton onClick={onBack}>{c('Action').t`Back`}</LinkButton> : null}
                            </span>
                            <div className="flex-item-fluid aligncenter h3 mb0">{title}</div>
                            <span className="flex-item-fluid alignright">
                                <SupportDropdown className="link" content={c('Action').t`Need help`} />
                            </span>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignLayout;
