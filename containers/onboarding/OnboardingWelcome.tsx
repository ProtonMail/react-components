import React from 'react';
import { c } from 'ttag';

import OnboardingContent, { Props as OnboardingContentProps } from './OnboardingContent';

const OnboardingWelcome = (props: Omit<OnboardingContentProps, 'decription' | 'img'>) => {
    return (
        <OnboardingContent
            title={c('Onboarding Proton').t`Welcome to Proton`}
            description={c('Onboarding Proton')
                .t`A suite of application that respects your privacy and secures your online activity like no other.`}
            img={<img src="TODO" alt="Proton" />}
            {...props}
        />
    );
};

export default OnboardingWelcome;
