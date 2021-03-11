import React from 'react';
import { c } from 'ttag';

import OnboardingContent, { Props as OnboardingContentProps } from './OnboardingContent';

const OnboardingWelcome = (props: Omit<OnboardingContentProps, 'decription' | 'img'>) => {
    return (
        <OnboardingContent
            title={c('Onboarding Proton').t`Welcome to ProtonMail's new look`}
            description={c('Onboarding Proton')
                .t`Your encrypted inbox is now more modern and customizable. Get started now.`}
            img={<img src="TODO" alt="Proton" />}
            {...props}
        />
    );
};

export default OnboardingWelcome;
