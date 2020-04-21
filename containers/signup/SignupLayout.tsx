import React, { ReactNode } from 'react';
import { Button, SupportDropdown } from 'react-components';
import { c } from 'ttag';

import { SIGNUP_STEPS } from './constants';
import { SignupModel } from './interfaces';

interface Props {
    model: SignupModel;
    children: ReactNode;
    aside: ReactNode;
    onBack: () => void;
}

const {
    PLANS
} = SIGNUP_STEPS;

const SignupLayout = ({ children, aside, onBack, model }: Props) => {
    const noAside = [PLANS].includes(model.step);
    const style = noAside ? {} : { maxWidth: '500px' };
    return (
        <div className="flex flex-nowrap h100v">
            <main className="flex flex-justify-center flex-item-fluid bg-white color-global-grey p2">
                <div style={style}>
                    <div className="flex flex-nowrap flex-items-center mb1">
                        <div className="flex-item-fluid">
                            <Button onClick={onBack}>{c('Action').t`Back`}</Button>
                        </div>
                        <div className="flex-item-fluid">
                            <span className="h1">{c('Page title').t`Signup`}</span>
                        </div>
                        <div className="flex-item-fluid">
                            <SupportDropdown className="pm-button" content={c('Action').t`Need help`} />
                        </div>
                    </div>
                    {children}
                </div>
            </main>
            {noAside ? null : (
                <aside className="flex-item-fluid bg-global-light color-global-grey nomobile notablet">{aside}</aside>
            )}
        </div>
    );
};

export default SignupLayout;
