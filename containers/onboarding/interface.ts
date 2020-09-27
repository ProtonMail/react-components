import React from 'react';

export interface OnboardingStepProps {
    title: React.ReactNode;
    submit: React.ReactNode;
    close: React.ReactNode;
    children: React.ReactNode;
}

export interface OnboardingStepRenderCallback {
    step: number;
    onNext: () => void;
    onClose?: () => void;
}
