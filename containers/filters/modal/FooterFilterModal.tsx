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

const FooterFilterModal = ({ model, onClose, onChange, loading }: Props) => {
    const handleNext = () => {
        onChange({ ...model, step: NEXT_STEP[model.step] });
    };
    return (
        <>
            <Button disabled={loading} onClick={onClose}>{c('Action').t`Cancel`}</Button>
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
