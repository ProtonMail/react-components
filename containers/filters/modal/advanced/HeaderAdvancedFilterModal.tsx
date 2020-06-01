import React from 'react';
import { c } from 'ttag';

import { FilterModalModel, Step, Errors } from './interfaces';

interface Props {
    model: FilterModalModel;
    onChange: (newModel: FilterModalModel) => void;
    errors: Errors;
}

const HeaderAdvancedFilterModal = ({ model, errors, onChange }: Props) => {
    return (
        <header>
            <ul className="breadcrumb-container unstyled inline-flex pl0-5 pr0-5 mt0">
                <li className="breadcrumb-item">
                    <button
                        type="button"
                        disabled={model.step === Step.NAME}
                        aria-current={model.step === Step.NAME ? 'step' : false}
                        onClick={() => onChange({ ...model, step: Step.NAME })}
                        className="breadcrumb-button"
                    >
                        {c('Step in filter modal').t`Name`}
                    </button>
                </li>
                <li className="breadcrumb-item">
                    <button
                        type="button"
                        disabled={model.step === Step.SIEVE || !!errors.name}
                        aria-current={model.step === Step.SIEVE ? 'step' : false}
                        onClick={() => onChange({ ...model, step: Step.SIEVE })}
                        className="breadcrumb-button"
                    >
                        {c('Step in filter modal').t`Sieve editor`}
                    </button>
                </li>
            </ul>
        </header>
    );
};

export default HeaderAdvancedFilterModal;
