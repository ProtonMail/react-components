import React from 'react';

import { FormModal } from '../../components/modal';

interface Props {
    title: string;
    isLoading?: boolean;
    hasClose?: boolean;
    close?: React.ReactNode;
    submit?: string;
    onSubmit?: () => void;
    onClose?: () => void;
    children?: React.ReactNode;
}
const OnboardingModal = ({ children, ...rest }: Props) => {
    const [step, setStep] = useState(0);

    return (
        <FormModal {...rest}>
            {children}
        </FormModal>
    )
}

export default OnboardingModal;
