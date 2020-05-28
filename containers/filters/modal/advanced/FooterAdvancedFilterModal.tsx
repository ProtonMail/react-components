import React from 'react';
import { Button, PrimaryButton } from 'react-components';
import { c } from 'ttag';

import { ModalModel, Step, Errors } from './interfaces';

interface Props {
    model: ModalModel;
    onClose: () => void;
    onChange: (newModel: ModalModel) => void;
    loading: boolean;
    errors: Errors;
}

const NEXT_STEP = {
    [Step.NAME]: Step.SIEVE,
    [Step.SIEVE]: Step.SIEVE
};

const BACK_STEP = {
    [Step.NAME]: Step.NAME,
    [Step.SIEVE]: Step.NAME
};

const FooterAdvancedFilterModal = ({ model, errors, onClose, onChange, loading }: Props) => {
    const handleNext = () => {
        onChange({ ...model, step: NEXT_STEP[model.step] });
    };
    const handleBack = () => {
        onChange({ ...model, step: BACK_STEP[model.step] });
    };
    return (
        <>
            {model.step === Step.NAME ? (
                <Button disabled={loading} onClick={onClose}>{c('Action').t`Cancel`}</Button>
            ) : (
                <Button disabled={loading} onClick={handleBack}>{c('Action').t`Back`}</Button>
            )}
            <div>
                {model.step === Step.NAME && (
                    <Button disabled={loading || !!errors.name} onClick={handleNext} className="mr1">{c('Action')
                        .t`Next`}</Button>
                )}
                <PrimaryButton disabled={loading || !!errors.name || !!errors.sieve} type="submit">{c('Action')
                    .t`Save`}</PrimaryButton>
            </div>
        </>
    );
};

export default FooterAdvancedFilterModal;
