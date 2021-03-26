import React from 'react';
import { c } from 'ttag';

import OnboardingContent, { Props as OnboardingContentProps } from './OnboardingContent';

const OnboardingWelcomeMail = (props: Omit<OnboardingContentProps, 'decription' | 'img'>) => {
    return (
        <OnboardingContent
            img={<img src="TODO" alt="Proton" />}
            title={c('Onboarding ProtonMail').t`Meet you new private Mailbox`}
            description={c('Onboarding ProtonMail').t`Your encrypted inbox is now more modern and customizable.`}
            {...props}
        />
    );
};

export default OnboardingWelcomeMail;
