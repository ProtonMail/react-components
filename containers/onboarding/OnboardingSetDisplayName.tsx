import React from 'react';
import { c } from 'ttag';
import onboardingDisplayName from 'design-system/assets/img/illustrations/display-name.svg';

import { LegacyInputField, Label, Input } from '../../components';
import OnboardingContent, { Props as OnboardingContentProps } from './OnboardingContent';

interface Props extends Omit<OnboardingContentProps, 'img' | 'text' | 'description'> {
    displayName: string;
    setDisplayName: (displayName: string) => void;
    displayNameError?: string;
}

const OnboardingSetDisplayName = ({ displayName, setDisplayName, displayNameError, ...rest }: Props) => {
    return (
        <OnboardingContent
            description={c('Onboarding Proton')
                .t`This is what people will see when you send them an email, invite them to an event, or share a file with them.`}
            img={<img src={onboardingDisplayName} alt={c('Onboarding Proton').t`Choose a display name`} />}
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
