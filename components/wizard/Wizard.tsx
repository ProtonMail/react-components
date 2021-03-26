import React from 'react';
import { classnames } from '../../helpers';
import Icon from '../icon/Icon';

interface Props {
    // current step
    step: number;
    // steps
    steps: string[];
    // hide text for steps
    hideText?: boolean;
}

const Wizard = ({ step = 0, steps = [], hideText = false }: Props) => {
    return (
        <div className={classnames(['wizard-container', hideText && 'wizard-container--no-text-displayed'])}>
            <ul className="wizard unstyled flex flex-nowrap flex-justify-space-between">
                {steps.map((text = '', index) => {
                    return (
                        <li
                            key={index.toString()}
                            className={classnames(['wizard-item', index < step && 'is-complete'])}
                            aria-current={index === step ? 'step' : undefined}
                        >
                            <span className="wizard-marker">
                                {index < step && <Icon name="on" size={12} className="z10 mauto wizard-marker-icon" />}
                            </span>
                            <span className="wizard-item-inner">{text}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Wizard;
