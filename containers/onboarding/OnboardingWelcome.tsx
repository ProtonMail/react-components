import React from 'react';
import { c } from 'ttag';

import OnboardingContent, { Props as OnboardingContentProps } from './OnboardingContent';

const OnboardingWelcome = (props: Omit<OnboardingContentProps, 'decription' | 'img'>) => {
    return (
        <OnboardingContent
            title={c('Onboarding Proton').t`Welcome to Proton`}
            description={c('Onboarding Proton')
                .t`Our mission is to build an internet where you are in control of your data and your privacy. We have recently updated Proton - welcome to the secure internet.`}
            img={<img src="TODO" alt={c('Onboarding Proton').t`Welcome to Proton`} />}
            {...props}
        />
    );
};

export default OnboardingWelcome;
