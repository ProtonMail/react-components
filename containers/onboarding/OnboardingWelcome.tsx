import React from 'react';
import { c } from 'ttag';

import OnboardingContent, { Props as OnboardingContentProps } from './OnboardingContent';

const OnboardingWelcome = (props: Omit<OnboardingContentProps, 'decription' | 'img'>) => {
    return (
        <OnboardingContent
            title={c('Onboarding Proton').t`Welcome to Proton the Privacy world of Proton`}
            description={c('Onboarding Proton')
                .t`An extended suite of applications with ProtonCalendar and ProtonDrive. Always the same respect for your privacy.`}
            img={<img src="TODO" alt="Proton" />}
            {...props}
        />
    );
};

export default OnboardingWelcome;
