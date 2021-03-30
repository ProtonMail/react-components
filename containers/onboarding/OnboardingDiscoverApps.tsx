import React from 'react';
import { c } from 'ttag';
import onboardingAccessingApps from 'design-system/assets/img/onboarding/onboarding-accessing-apps.svg';
import onboardingAccessingAppsDark from 'design-system/assets/img/onboarding/onboarding-accessing-apps-dark.svg';
import { getLightOrDark } from 'proton-shared/lib/themes/helpers';

import OnboardingContent, { Props as OnboardingContentProps } from './OnboardingContent';

const OnboardingDiscoverApps = (props: Omit<OnboardingContentProps, 'decription' | 'img'>) => {
    return (
        <OnboardingContent
            title={c('Onboarding Proton').t`Discover all Proton services`}
            description={c('Onboarding Proton')
                .t`Use the app selector in the top left to access other Proton services, including VPN, Calendar, and Drive.`}
            img={<img src={getLightOrDark(onboardingAccessingApps, onboardingAccessingAppsDark)} alt="Proton" />}
            {...props}
        />
    );
};

export default OnboardingDiscoverApps;
