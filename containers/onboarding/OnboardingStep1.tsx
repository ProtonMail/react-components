import React, { useState } from 'react';
import { c } from 'ttag';
import onboardingWelcome from 'design-system/assets/img/onboarding/onboarding-welcome.svg';
import onboardingWelcomeDark from 'design-system/assets/img/onboarding/onboarding-welcome-dark.svg';
import { getLightOrDark } from 'proton-shared/lib/themes/helpers';

import SignupLabelInputRow from '../signup/SignupLabelInputRow';
import { Label } from '../../components/label';
import { Input } from '../../components/input';
import OnboardingContent from './OnboardingContent';

export const getTitle = () => c('Title').t`Welcome to privacy`;

const OnboardingStep1 = () => {
    const [displayName, setDisplayName] = useState('');

    return (
        <OnboardingContent
            description={c('Info').t`Proton is your private space on the Internet. No one is reading your emails, monitoring your calendar events, or scanning your files. Your data is encrypted, and you’re in control.`}
            img={<img src={getLightOrDark(onboardingWelcome, onboardingWelcomeDark)} alt="Proton"/>}
            text={c('Info').t`Please choose a display name to finish setting up your account. (Other people will see this.)`}
        >
            <SignupLabelInputRow
                label={<Label htmlFor="displayName">{c('Label').t`Display name`}</Label>}
                input={
                    <Input
                        value={displayName}
                        onChange={({ target }) => setDisplayName(target.value)}
                        id="displayName"
                    />
                }
            />
        </OnboardingContent>
    );
}

export default OnboardingStep1;
