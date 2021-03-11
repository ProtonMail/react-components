import React from 'react';
import { c } from 'ttag';
import onboardingAccessingApps from 'design-system/assets/img/onboarding/onboarding-managing-account.svg';
import onboardingAccessingAppsDark from 'design-system/assets/img/onboarding/onboarding-managing-account-dark.svg';
import { getLightOrDark } from 'proton-shared/lib/themes/helpers';

import OnboardingContent, { Props as OnboardingContentProps } from './OnboardingContent';

const OnboardingDiscoverApps = (props: Omit<OnboardingContentProps, 'decription' | 'img'>) => {
    return (
        <OnboardingContent
            title={c('Onboarding Proton').t`Discover more Proton apps`}
            description={c('Onboarding Proton')
                .t`Use the app selector in the top left top open other Proton tools, including VPN, Calendar and Drive.`}
            img={<img src={getLightOrDark(onboardingAccessingApps, onboardingAccessingAppsDark)} alt="Proton" />}
            {...props}
        />
    );
};

export default OnboardingDiscoverApps;
