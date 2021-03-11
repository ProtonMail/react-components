import React from 'react';
import { c } from 'ttag';
import onboardingWelcome from 'design-system/assets/img/onboarding/proton-welcome.svg';

import { Label } from '../../components/label';
import { Input, LegacyInputField } from '../../components/input';
import OnboardingContent, { Props as OnboardingContentProps } from './OnboardingContent';

interface Props extends Omit<OnboardingContentProps, 'img' | 'text' | 'description'> {
    displayName: string;
    setDisplayName: (displayName: string) => void;
    displayNameError?: string;
    isSubmitted?: boolean;
}

const OnboardingSetDisplayName = ({ isSubmitted, displayName, setDisplayName, displayNameError, ...rest }: Props) => {
    return (
        <OnboardingContent
            description={c('Onboarding Proton').t`This is what people will see when you send them an email.`}
            img={<img src={onboardingWelcome} alt="Proton" />}
            title={c('Onboarding Proton').t`Choose a display name`}
            {...rest}
        >
            <div className="sign-layout-container">
                <LegacyInputField
                    label={<Label htmlFor="displayName">{c('Label').t`Display name`}</Label>}
                    input={
                        <Input
                            value={displayName}
                            onChange={({ target }) => setDisplayName(target.value)}
                            id="displayName"
                            placeholder={c('Placeholder').t`e.g. Julia Smith`}
                            isSubmitted={isSubmitted}
                            error={displayNameError}
                            autoFocus
                        />
                    }
                />
            </div>
        </OnboardingContent>
    );
};

export default OnboardingSetDisplayName;
