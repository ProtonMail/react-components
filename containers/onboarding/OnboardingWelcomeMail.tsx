import React from 'react';
import { c } from 'ttag';
import { APPS } from 'proton-shared/lib/constants';
import { getAppName } from 'proton-shared/lib/apps/helper';

import OnboardingContent, { Props as OnboardingContentProps } from './OnboardingContent';

const OnboardingWelcomeMail = (props: Omit<OnboardingContentProps, 'decription' | 'img'>) => {
    const mailAppName = getAppName(APPS.PROTONMAIL);
    return (
        <OnboardingContent
            img={<img src="TODO" alt="Proton" />}
            title={c('Onboarding ProtonMail').t`Meet your encrypted mailbox`}
            description={c('Onboarding ProtonMail')
                .t`${mailAppName} is now more modern and customizable while still protecting your data with advanced encryption.`}
            {...props}
        />
    );
};

export default OnboardingWelcomeMail;
