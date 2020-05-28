import React from 'react';
import { Group, ButtonGroup, RoundedIcon } from 'react-components';
import { c } from 'ttag';

import { ModalModel, Step, Filter } from './interfaces';
import { hasValidName } from './helpers';

interface Props {
    model: ModalModel;
    filters: Filter[];
    onChange: (newModel: ModalModel) => void;
}

const HeaderFilterModal = ({ model, filters, onChange }: Props) => {
    const validName = hasValidName(model, filters);

    return (
        <header className="mb1">
            <Group>
                <ButtonGroup
                    onClick={() => onChange({ ...model, step: Step.NAME })}
                    className={model.step === Step.NAME ? 'is-active' : ''}
                >
                    {validName ? <RoundedIcon className="mr0-5" type="success" name="on" /> : null}
                    {c('Step in filter modal').t`Name`}
                </ButtonGroup>
                <ButtonGroup
                    disabled={!validName}
                    onClick={() => onChange({ ...model, step: Step.CONDITIONS })}
                    className={model.step === Step.CONDITIONS ? 'is-active' : ''}
                >{c('Step in filter modal').t`Conditions`}</ButtonGroup>
                <ButtonGroup
                    disabled={!validName || !model.conditions.length}
                    onClick={() => onChange({ ...model, step: Step.ACTIONS })}
                    className={model.step === Step.ACTIONS ? 'is-active' : ''}
                >{c('Step in filter modal').t`Actions`}</ButtonGroup>
                <ButtonGroup
                    disabled={!validName || !model.actions.length || !model.conditions.length}
                    onClick={() => onChange({ ...model, step: Step.PREVIEW })}
                    className={model.step === Step.PREVIEW ? 'is-active' : ''}
                >{c('Step in filter modal').t`Preview`}</ButtonGroup>
            </Group>
        </header>
    );
};

export default HeaderFilterModal;
