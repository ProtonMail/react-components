import React from 'react';
import { c } from 'ttag';
import { ThemeTypes } from 'proton-shared/lib/themes/themes';
import { UserSettings } from 'proton-shared/lib/interfaces';

import OnboardingContent, { Props as OnboardingContentProps } from './OnboardingContent';
import ThemeCards, { Theme } from '../themes/ThemeCards';

interface Props extends Omit<OnboardingContentProps, 'decription' | 'onChange'> {
    themes: Theme[];
    userSettings: UserSettings;
    loading: boolean;
    onChange: (identifier: ThemeTypes) => void;
}

const OnboardingThemes = ({ themes, userSettings, loading, onChange, ...rest }: Props) => {
    return (
        <OnboardingContent
            title={c('Onboarding Proton').t`Select a theme`}
            description={c('Onboarding Proton').t`You can change this anytime in your settings.`}
            {...rest}
        >
            <div className="flex flex-nowrap">
                <ThemeCards
                    list={themes}
                    themeIdentifier={userSettings.ThemeType}
                    onChange={onChange}
                    disabled={loading}
                />
            </div>
        </OnboardingContent>
    );
};

export default OnboardingThemes;
