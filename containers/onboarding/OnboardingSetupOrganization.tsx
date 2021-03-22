import React from 'react';
import { c } from 'ttag';

import OnboardingContent, { Props as OnboardingContentProps } from './OnboardingContent';

const OnboardingSetupOrganization = (props: Omit<OnboardingContentProps, 'decription' | 'img'>) => {
    return (
        <OnboardingContent
            title={c('Onboarding Proton').t`Set your organization up`}
            description={c('Onboarding Proton')
                .t`Configure your organization, link your custom domain and add users to spread the power of privacy.`}
            img={<img src="TODO" alt="Proton" />}
            {...props}
        />
    );
};

export default OnboardingSetupOrganization;
