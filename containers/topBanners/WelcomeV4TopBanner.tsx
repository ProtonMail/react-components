import React from 'react';
import { c } from 'ttag';

import TopBanner from './TopBanner';

const WelcomeV4TopBanner = () => {
    // if () {
    //     return null;
    // }
    return (
        <TopBanner className="bg-info">
            {c('Message display when user visit v4 login first time')
                .t`Welcome to the new ProtonMail design, modern and easy to use. Sign in to discover more.`}
        </TopBanner>
    );
};

export default WelcomeV4TopBanner;
