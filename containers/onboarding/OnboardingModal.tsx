import React, { useState } from 'react';
import { c } from 'ttag';
import { updateAddress } from 'proton-shared/lib/api/addresses';

import { FormModal, PrimaryButton } from '../../components';
import { useApi, useEventManager, useGetAddresses, useLoading, WelcomeFlagsState } from '../../hooks';

import { OnboardingStepProps, OnboardingStepRenderCallback } from './interface';
import OnboardingSetDisplayName from './OnboardingSetDisplayName';
import OnboardingStep from './OnboardingStep';

interface Props {
    title: string;
    welcomeFlags: WelcomeFlagsState;
    isLoading?: boolean;
    hasClose?: boolean;
    close?: React.ReactNode;
    submit?: string;
    onSubmit?: () => void;
    onClose?: () => void;
    children?: ((props: OnboardingStepRenderCallback) => JSX.Element)[];
}

const OnboardingModal = ({ children = [], welcomeFlags, ...rest }: Props) => {
    const [displayName, setDisplayName] = useState('');
    const [loading, withLoading] = useLoading();
    const getAddresses = useGetAddresses();
    const api = useApi();
    const { call } = useEventManager();

    const setDisplayNameStep = (({ onNext }: OnboardingStepRenderCallback) => {
        const handleNext = async () => {
            const addresses = await getAddresses();
            const firstAddress = addresses[0];
            // Should never happen.
            if (!firstAddress) {
                onNext();
                return;
            }
            await api(updateAddress(firstAddress.ID, { DisplayName: displayName, Signature: firstAddress.Signature }));
            await call();
            onNext();
        }
        return (
            <OnboardingStep
                title={c('Onboarding Proton').t`Welcome to privacy`}
                submit={<PrimaryButton loading={loading} onClick={() => withLoading(handleNext())}>{c('Action').t`Next`}</PrimaryButton>}
                close={null}
            >
                <OnboardingSetDisplayName displayName={displayName} setDisplayName={setDisplayName} />
            </OnboardingStep>
        )
    });

    const [step, setStep] = useState(0);
    const handleNext = () => {
        setStep((step) => step + 1);
    }

    const childrenSteps = [
        true || welcomeFlags?.isSignupFlow ? setDisplayNameStep : null,
        ...Array.isArray(children) ? children : [children]
    ].map((renderCallback) => {
        if (!renderCallback) {
            return null;
        }
        return renderCallback({
            step,
            onNext: handleNext,
            onClose: rest?.onClose
        });
    }).filter((x) => x !== null);

    const childStep = childrenSteps[step];

    if (!React.isValidElement<OnboardingStepProps>(childStep)) {
        throw new Error('Missing step');
    }

    const { title, submit, close } = childStep.props;

    return (
        <FormModal
            {...rest}
            hasClose={false}
            title={title}
            submit={submit}
            close={close}
        >
            {childStep}
        </FormModal>

    )
}

export default OnboardingModal;
