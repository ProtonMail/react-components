import React from 'react';
import { Button, PrimaryButton } from 'react-components';
import { c } from 'ttag';

import { ModalModel, Step, Filter } from './interfaces';
import { hasValidName } from './helpers';

interface Props {
    model: ModalModel;
    onClose: () => void;
    onChange: (newModel: ModalModel) => void;
    loading: boolean;
    filters: Filter[];
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

const FooterFilterModal = ({ model, filters, onClose, onChange, loading }: Props) => {
    const validName = hasValidName(model, filters);
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
                    <Button disabled={loading || !validName} onClick={handleNext} className="mr1">{c('Action')
                        .t`Next`}</Button>
                )}
                {model.step === Step.CONDITIONS && (
                    <Button disabled={loading} onClick={handleNext} className="mr1">{c('Action').t`Next`}</Button>
                )}
                {model.step === Step.ACTIONS && (
                    <Button disabled={loading} onClick={handleNext} className="mr1">{c('Action').t`Next`}</Button>
                )}
                <PrimaryButton disabled={loading} type="submit">{c('Action').t`Save`}</PrimaryButton>
            </div>
        </>
    );
};

export default FooterFilterModal;
