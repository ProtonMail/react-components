import React from 'react';
import { Button, PrimaryButton } from 'react-components';
import { c } from 'ttag';

import { ModalModel, Step } from './interfaces';

interface Props {
    model: ModalModel;
    onClose: () => void;
    onChange: (newModel: ModalModel) => void;
}

const NEXT_STEP = {
    [Step.NAME]: Step.CONDITIONS,
    [Step.CONDITIONS]: Step.ACTIONS,
    [Step.ACTIONS]: Step.PREVIEW,
    [Step.PREVIEW]: Step.PREVIEW
};

const FooterFilterModal = ({ model, onClose, onChange }: Props) => {
    const handleNext = () => {
        onChange({ ...model, step: NEXT_STEP[model.step] });
    };
    return (
        <footer className="flex flex-nowrap flex-spacebetween">
            <Button onClick={onClose}>{c('Action').t`Cancel`}</Button>
            <div>
                {[Step.NAME, Step.CONDITIONS, Step.ACTIONS].includes(model.step) ? (
                    <Button onClick={handleNext} className="mr1">{c('Action').t`Next`}</Button>
                ) : null}
                <PrimaryButton type="submit">{c('Action').t`Save`}</PrimaryButton>
            </div>
        </footer>
    );
};

export default FooterFilterModal;
