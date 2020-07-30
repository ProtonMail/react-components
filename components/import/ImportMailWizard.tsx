import React from 'react';
import { classnames } from '../../helpers/component';

import './ImportMailWizard.scss';

interface Props {
    step: number;
    steps: string[];
}

const ImportMailWizard = ({ step = 0, steps = [] }: Props) => {
    return (
        <div className="wizard-container import-mail-wizard-container">
            <ul className="wizard import-mail-wizard unstyled flex flex-nowrap flex-spacebetween">
                {steps.map((text = '', index) => {
                    return (
                        <li
                            key={index.toString()}
                            className={classnames(['wizard-item', index < step && 'is-complete'])}
                            aria-current={index === step ? 'step' : undefined}
                        >
                            <span className="wizard-marker" />
                            <span className="wizard-item-inner">{text}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ImportMailWizard;
