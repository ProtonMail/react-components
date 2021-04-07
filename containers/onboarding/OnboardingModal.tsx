import React, { useState } from 'react';
import { c } from 'ttag';
import { updateAddress } from 'proton-shared/lib/api/addresses';
import { updateWelcomeFlags, updateThemeType } from 'proton-shared/lib/api/settings';
import { noop } from 'proton-shared/lib/helpers/function';
import { range } from 'proton-shared/lib/helpers/array';
import { ThemeTypes } from 'proton-shared/lib/themes/themes';
import { getAccountSettingsApp, getAppName } from 'proton-shared/lib/apps/helper';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import { hasVisionary } from 'proton-shared/lib/helpers/subscription';

import { Icon, StepDots, StepDot, FormModal, Button, useAppLink } from '../../components';
import {
    useApi,
    useEventManager,
    useGetAddresses,
    useLoading,
    useOrganization,
    useOrganizationKey,
    useSubscription,
    useUser,
    useUserSettings,
    useWelcomeFlags,
    useConfig,
} from '../../hooks';
import { OnboardingStepProps, OnboardingStepRenderCallback } from './interface';
import OnboardingSetDisplayName from './OnboardingSetDisplayName';
import OnboardingThemes from './OnboardingThemes';
import OnboardingStep from './OnboardingStep';
import OnboardingDiscoverApps from './OnboardingDiscoverApps';
import OnboardingWelcome from './OnboardingWelcome';
import OnboardingSetupOrganization from './OnboardingSetupOrganization';
import { availableThemes } from '../themes/ThemesSection';
import { getOrganizationKeyInfo } from '../organization/helpers/organizationKeysHelper';

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
    hideDisplayName?: boolean;
}

const OnboardingModal = ({
    children,
    showGenericSteps,
    allowClose = false,
    setWelcomeFlags = true,
    hideDisplayName = false,
    ...rest
}: Props) => {
    const [user] = useUser();
    const goToApp = useAppLink();
    const [userSettings] = useUserSettings();
    const [organization, loadingOrganization] = useOrganization();
    const [subscription, loadingSubscription] = useSubscription();
    const [displayName, setDisplayName] = useState(user.DisplayName || user.Name || '');
    const [organizationKey, loadingOrganizationKey] = useOrganizationKey(organization);
    const { hasOrganizationKey } = getOrganizationKeyInfo(organizationKey);
    const [loading, withLoading] = useLoading();
    const getAddresses = useGetAddresses();
    const api = useApi();
    const { call } = useEventManager();
    const [welcomeFlags] = useWelcomeFlags();
    const { APP_NAME } = useConfig();
    const canManageOrganization =
        !loadingOrganization &&
        !loadingSubscription &&
        !loadingOrganizationKey &&
        user.isAdmin &&
        organization.MaxMembers > 1 &&
        organization.UsedMembers === 1 &&
        !hasOrganizationKey &&
        !hasVisionary(subscription);
    const appName = getAppName(APP_NAME);
    const themes = availableThemes.map(({ identifier, getI18NLabel, src }) => {
        return { identifier, label: getI18NLabel(), src };
    });

    const handleUpdateWelcomeFlags = async () => {
        if (setWelcomeFlags) {
            return api(updateWelcomeFlags()).catch(noop);
        }
    };

    const [step, setStep] = useState(0);

    const handleNext = () => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (isLastStep) {
            rest?.onClose?.();
        }
        setStep((step) => step + 1);
    };

    const handleBack = () => {
        setStep((step) => step - 1);
    };

    const handleChangeTheme = async (newThemeIdentifier: ThemeTypes) => {
        await api(updateThemeType(newThemeIdentifier));
        await call();
    };

    const handleSetDisplayNameNext = () => {
        const process = async () => {
            const addresses = await getAddresses();
            const firstAddress = addresses[0];
            // Should never happen.
            if (!firstAddress) {
                return;
            }
            await api(updateAddress(firstAddress.ID, { DisplayName: displayName, Signature: firstAddress.Signature }));
            await call();
        };
        void process();
        handleNext();
    };

    const welcomeStep = (
        <OnboardingStep submit={c('Action').t`Get started`} close={null} onSubmit={handleNext}>
            <OnboardingWelcome />
        </OnboardingStep>
    );

    const setDisplayNameStep = (
        <OnboardingStep submit={c('Action').t`Next`} loading={loading} close={null} onSubmit={handleSetDisplayNameNext}>
            <OnboardingSetDisplayName id="onboarding-0" displayName={displayName} setDisplayName={setDisplayName} />
        </OnboardingStep>
    );

    const setupOrganizationStep = (
        <OnboardingStep
            submit={c('Action').t`Start setup`}
            close={
                <Button size="large" color="norm" shape="ghost" className="mb1" fullWidth onClick={handleNext}>{c(
                    'Action'
                ).t`Skip`}</Button>
            }
            onSubmit={() => {
                goToApp('/organization', getAccountSettingsApp());
                handleNext();
            }}
        >
            <OnboardingSetupOrganization />
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
        <OnboardingStep submit={c('Action').t`Start using ${appName}`} close={null} onSubmit={handleNext}>
            <OnboardingDiscoverApps />
        </OnboardingStep>
    );

    const hasDisplayNameStep = welcomeFlags?.hasDisplayNameStep && !hideDisplayName;
    const displayGenericSteps = showGenericSteps || hasDisplayNameStep;
    const genericSteps = displayGenericSteps
        ? [
              welcomeStep,
              hasDisplayNameStep && setDisplayNameStep,
              canManageOrganization && setupOrganizationStep,
              themesStep,
          ].filter(isTruthy)
        : [];
    const finalGenericSteps = displayGenericSteps ? [discoverAppsStep] : [];

    const productSteps = children
        ? (Array.isArray(children) ? children : [children])
              .map(
                  (renderCallback) =>
                      renderCallback?.({
                          onNext: handleNext,
                          onBack: handleBack,
                          displayGenericSteps,
                      }) ?? null
              )
              .filter((x) => x !== null)
        : [];

    const steps = [...genericSteps, ...productSteps, ...finalGenericSteps];
    const isLastStep = steps.length - 1 === step;
    const childStep = steps[step];
    const hasDots = steps.length > 1 && step < steps.length;
    const hasBack = step > 0;

    if (!steps.length) {
        rest?.onClose?.();
    }

    if (!React.isValidElement<OnboardingStepProps>(childStep)) {
        throw new Error('Missing step');
    }

    const childStepProps = isLastStep
        ? {
              ...childStep.props,
              onSubmit: () => {
                  if (isLastStep) {
                      void handleUpdateWelcomeFlags();
                  }
                  rest?.onClose?.();
              },
          }
        : childStep.props;

    return (
        <FormModal
            {...rest}
            hasClose={allowClose}
            {...childStepProps}
            title={
                hasBack ? (
                    <button type="button" title={c('Action').t`Back`} onClick={childStepProps.onClose || handleBack}>
                        <Icon name="arrow-left" alt={c('Action').t`Back`} />
                    </button>
                ) : null
            }
            small
            footer={null}
        >
            {childStep}
            <footer className="flex flex-nowrap flex-column">
                {typeof childStepProps.submit === 'string' ? (
                    <Button
                        shape="solid"
                        size="large"
                        color="norm"
                        fullWidth
                        loading={childStepProps.loading}
                        type="submit"
                        className="mb0-25"
                        data-focus-fallback={1}
                    >
                        {childStepProps.submit}
                    </Button>
                ) : (
                    childStepProps.submit
                )}

                {typeof childStepProps.close === 'string' ? (
                    <Button
                        shape="ghost"
                        size="large"
                        color="norm"
                        fullWidth
                        disabled={childStepProps.loading}
                        onClick={childStepProps.onClose || handleBack}
                    >
                        {childStepProps.close}
                    </Button>
                ) : (
                    childStepProps.close
                )}
            </footer>
            {hasDots && (
                <div className="text-center">
                    <StepDots value={step}>
                        {range(0, steps.length).map((index) => (
                            <StepDot key={index} aria-controls={`onboarding-${index}`} />
                        ))}
                    </StepDots>
                </div>
            )}
        </FormModal>
    );
};

export default OnboardingModal;
