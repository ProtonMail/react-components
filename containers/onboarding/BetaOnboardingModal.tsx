import React, { useEffect } from 'react';
import { c } from 'ttag';
import betaEnabled from 'design-system/assets/img/onboarding/beta-enabled.svg';
import { noop } from 'proton-shared/lib/helpers/function';

import useEarlyAccess from '../../hooks/useEarlyAccess';

import OnboardingContent from './OnboardingContent';
import OnboardingStep from './OnboardingStep';
import OnboardingModal from './OnboardingModal';

const BetaOnboardingModal = (props: any) => {
    const earlyAccess = useEarlyAccess();

    useEffect(() => {
        earlyAccess.update(true).catch(noop);
    }, []);

    const handleSubmit = () => {
        window.location.reload();
    };

    return (
        <OnboardingModal setWelcomeFlags={false} showGenericSteps={false} hideDisplayName {...props}>
            {() => (
                <OnboardingStep close={null} submit={c('Onboarding Beta').t`Got it`} onSubmit={handleSubmit}>
                    <OnboardingContent
                        title={c('Onboarding Beta').t`Beta enabled`}
                        description={c('Onboarding Beta')
                            .t`To disable beta, open the settings dropdown menu and click on the "early access" option.`}
                        img={<img src={betaEnabled} alt={c('Onboarding Beta').t`Beta enabled`} />}
                    />
                </OnboardingStep>
            )}
        </OnboardingModal>
    );
};

export default BetaOnboardingModal;
