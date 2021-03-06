import React from 'react';
import { c } from 'ttag';
import onboardingAccessingApps from 'design-system/assets/img/onboarding/onboarding-accessing-apps.svg';
import onboardingAccessingAppsDark from 'design-system/assets/img/onboarding/onboarding-accessing-apps-dark.svg';
import { getLightOrDark } from 'proton-shared/lib/themes/helpers';

import OnboardingContent, { Props as OnboardingContentProps } from './OnboardingContent';

const OnboardingManageAccount = (props: Omit<OnboardingContentProps, 'decription' | 'img'>) => {
    /* TODO: A11y alt text for image */

    return (
        <OnboardingContent
            description={c('Onboarding Proton')
                .t`You can quickly open any Proton app from the menu in the top left corner.`}
            img={<img src={getLightOrDark(onboardingAccessingApps, onboardingAccessingAppsDark)} alt="Proton" />}
            {...props}
        />
    );
};

export default OnboardingManageAccount;
