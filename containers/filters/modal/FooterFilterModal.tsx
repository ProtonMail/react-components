import React from 'react';
import { Button, PrimaryButton } from 'react-components';
import { c } from 'ttag';

import { ModalModel, Step } from './interfaces';

interface Props {
    model: ModalModel;
    onClose: () => void;
    onChange: (newModel: ModalModel) => void;
    loading: boolean;
}

const NEXT_STEP = {
    [Step.NAME]: Step.CONDITIONS,
    [Step.CONDITIONS]: Step.ACTIONS,
    [Step.ACTIONS]: Step.PREVIEW,
    [Step.PREVIEW]: Step.PREVIEW
};

const BACK_STEP = {
    [Step.NAME]: Step.NAME,
    [Step.CONDITIONS]: Step.NAME,
    [Step.ACTIONS]: Step.CONDITIONS,
    [Step.PREVIEW]: Step.ACTIONS
};

const FooterFilterModal = ({ model, onClose, onChange, loading }: Props) => {
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
                {[Step.NAME, Step.CONDITIONS, Step.ACTIONS].includes(model.step) ? (
                    <Button disabled={loading} onClick={handleNext} className="mr1">{c('Action').t`Next`}</Button>
                ) : null}
                <PrimaryButton disabled={loading} type="submit">{c('Action').t`Save`}</PrimaryButton>
            </div>
        </>
    );
};

export default FooterFilterModal;
