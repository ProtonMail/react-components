import React, { useEffect, useState } from 'react';
import { c } from 'ttag';
import { updateAddress } from 'proton-shared/lib/api/addresses';
import { updateWelcomeFlags, updateThemeType } from 'proton-shared/lib/api/settings';
import { noop } from 'proton-shared/lib/helpers/function';
import { range } from 'proton-shared/lib/helpers/array';
import { hasVisionary, hasMailProfessional } from 'proton-shared/lib/helpers/subscription';
import { ThemeTypes } from 'proton-shared/lib/themes/themes';
import { APPS } from 'proton-shared/lib/constants';
import { getAccountSettingsApp, getAppName } from 'proton-shared/lib/apps/helper';

import { StepDots, StepDot, FormModal, Button, useAppLink } from '../../components';
import {
    useApi,
    useEventManager,
    useGetAddresses,
    useLoading,
    useNotifications,
    useSubscription,
    useUser,
    useUserSettings,
    useWelcomeFlags,
} from '../../hooks';
import { OnboardingStepProps, OnboardingStepRenderCallback } from './interface';
import OnboardingSetDisplayName from './OnboardingSetDisplayName';
import OnboardingThemes from './OnboardingThemes';
import OnboardingStep from './OnboardingStep';
import OnboardingDiscoverApps from './OnboardingDiscoverApps';
import OnboardingWelcome from './OnboardingWelcome';
import { availableThemes } from '../themes/ThemesSection';
import BackButton from '../../components/modal/BackButton';

interface Props {
    title?: string;
    isLoading?: boolean;
    hasClose?: boolean;
    close?: React.ReactNode;
    submit?: string;
    onSubmit?: () => void;
    onClose?: () => void;
    children?: ((props: OnboardingStepRenderCallback) => JSX.Element)[];
    setWelcomeFlags?: boolean;
    showGenericSteps?: boolean;
    allowClose?: boolean;
}

const OnboardingModal = ({
    children,
    showGenericSteps,
    allowClose = false,
    setWelcomeFlags = true,
    ...rest
}: Props) => {
    const [user] = useUser();
    const goToApp = useAppLink();
    const [userSettings] = useUserSettings();
    const [subscription] = useSubscription();
    const { createNotification } = useNotifications();
    const [displayName, setDisplayName] = useState(user.DisplayName || user.Name || '');
    const [loading, withLoading] = useLoading();
    const getAddresses = useGetAddresses();
    const api = useApi();
    const { call } = useEventManager();
    const [welcomeFlags] = useWelcomeFlags();
    const canManageOrganization = user.isAdmin && (hasVisionary(subscription) || hasMailProfessional(subscription));
    const mailAppName = getAppName(APPS.PROTONMAIL);
    const themes = availableThemes.map(({ identifier, getI18NLabel, src }) => {
        return { identifier, label: getI18NLabel(), src };
    });
    const handleUpdateWelcomeFlags = async () => {
        if (setWelcomeFlags) {
            return api(updateWelcomeFlags()).catch(noop);
        }
    };

    useEffect(() => {
        if (!welcomeFlags?.hasDisplayNameStep) {
            handleUpdateWelcomeFlags();
        }
    }, []);

    const [step, setStep] = useState(0);

    const handleNext = () => {
        setStep((step) => step + 1);
    };

    const handleBack = () => {
        setStep((step) => step - 1);
    };

    const handleChange = (step: number) => {
        setStep(step);
    };

    const handleChangeTheme = async (newThemeIdentifier: ThemeTypes) => {
        await api(updateThemeType(newThemeIdentifier));
        await call();
        createNotification({ text: c('Success').t`Theme saved` });
    };

    const handleSetDisplayNameNext = async () => {
        const addresses = await getAddresses();
        const firstAddress = addresses[0];
        // Should never happen.
        if (!firstAddress) {
            handleUpdateWelcomeFlags();
            handleNext();
            return;
        }
        await api(updateAddress(firstAddress.ID, { DisplayName: displayName, Signature: firstAddress.Signature }));
        await call();
        handleUpdateWelcomeFlags();
        handleNext();
    };

    const welcomeStep = (
        <OnboardingStep
            submit={
                canManageOrganization ? (
                    <Button
                        size="large"
                        color="norm"
                        shape="solid"
                        fullWidth
                        onClick={() => {
                            goToApp('/organization', getAccountSettingsApp());
                            handleNext();
                        }}
                    >{c('Action').t`Setup your organization`}</Button>
                ) : (
                    c('Action').t`Next`
                )
            }
            close={
                canManageOrganization ? (
                    <Button size="large" color="norm" shape="ghost" fullWidth onClick={handleNext}>{c('Action')
                        .t`Setup your inbox`}</Button>
                ) : null
            }
            onSubmit={handleNext}
        >
            <OnboardingWelcome />
        </OnboardingStep>
    );

    const setDisplayNameStep = (
        <OnboardingStep
            submit={c('Action').t`Next`}
            loading={loading}
            close={null}
            onSubmit={() => withLoading(handleSetDisplayNameNext())}
        >
            <OnboardingSetDisplayName id="onboarding-0" displayName={displayName} setDisplayName={setDisplayName} />
        </OnboardingStep>
    );

    const themesStep = (
        <OnboardingStep submit={c('Action').t`Next`} close={null} onSubmit={handleNext}>
            <OnboardingThemes
                userSettings={userSettings}
                themes={themes}
                loading={loading}
                onChange={(newIdentifier) => withLoading(handleChangeTheme(newIdentifier))}
            />
        </OnboardingStep>
    );

    const discoverAppsStep = (
        <OnboardingStep submit={c('Action').t`Start using ${mailAppName}`} close={null} onSubmit={handleNext}>
            <OnboardingDiscoverApps />
        </OnboardingStep>
    );

    const hasDisplayNameStep = welcomeFlags?.hasDisplayNameStep;
    const displayGenericSteps = showGenericSteps || hasDisplayNameStep;
    const genericSteps = displayGenericSteps ? [welcomeStep, setDisplayNameStep, themesStep] : [];
    const finalGenericSteps = displayGenericSteps ? [discoverAppsStep] : [];

    const productSteps = children
        ? (Array.isArray(children) ? children : [children])
              .map(
                  (renderCallback) =>
                      renderCallback?.({
                          onNext: handleNext,
                          onBack: handleBack,
                          onClose: rest?.onClose,
                      }) ?? null
              )
              .filter((x) => x !== null)
        : [];

    const steps = [...genericSteps, ...productSteps, ...finalGenericSteps];
    const childStep = steps[step];

    if (!React.isValidElement<OnboardingStepProps>(childStep)) {
        throw new Error('Missing step');
    }

    const hasDots = steps.length > 1 && step < steps.length;

    const isLastStep = steps.length - 1 === step;

    const childStepProps =
        isLastStep && productSteps.length === 0
            ? {
                  ...childStep.props,
                  submit: c('Action').t`Done`,
                  onSubmit: rest?.onClose,
              }
            : childStep.props;

    return (
        <FormModal
            {...rest}
            hasClose={allowClose}
            {...childStepProps}
            title={<BackButton onClick={childStep.props.onClose || handleBack} />}
            small
            footer={
                <div className="flex flex-nowrap flex-column">
                    {typeof childStep.props.submit === 'string' ? (
                        <Button
                            shape="solid"
                            size="large"
                            color="norm"
                            fullWidth
                            loading={childStep.props.loading}
                            type="submit"
                            className="mb1"
                            data-focus-fallback={1}
                        >
                            {childStepProps.submit}
                        </Button>
                    ) : (
                        childStep.props.submit
                    )}

                    {typeof childStep.props.close === 'string' ? (
                        <Button
                            shape="ghost"
                            size="large"
                            color="norm"
                            fullWidth
                            disabled={childStep.props.loading}
                            className="mb1"
                            onClick={childStep.props.onClose || handleBack}
                        >
                            {childStepProps.close}
                        </Button>
                    ) : (
                        childStep.props.close
                    )}

                    {hasDots && (
                        <StepDots
                            className="absolute centered-absolute-horizontal"
                            onChange={handleChange}
                            value={step}
                        >
                            {range(0, genericSteps.length).map((index) => (
                                <StepDot key={index} aria-controls={`onboarding-${index}`} />
                            ))}
                        </StepDots>
                    )}
                </div>
            }
        >
            {childStep}
        </FormModal>
    );
};

export default OnboardingModal;
