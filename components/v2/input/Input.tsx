import React from 'react';

import { classnames } from '../../../helpers';

export interface InputTwoProps extends React.ComponentPropsWithoutRef<'input'> {
    error?: React.ReactNode | boolean;
    suffix?: React.ReactNode;
    icon?: React.ReactNode;
}

const InputTwo = (props: InputTwoProps) => {
    const { error, icon, suffix, className: classNameProp, ...rest } = props;

    const className = classnames([classNameProp, 'w100 inputform-field', Boolean(error) && 'error']);

    const inputElement = <input {...rest} className={className} />;

    if (icon) {
        return (
            <div className="inputform-icon-container relative">
                {inputElement}
                <span className="right-icon absolute flex">{icon}</span>
            </div>
        );
    }

    if (suffix) {
        return (
            <div className="inputform-icon-container flex flex-nowrap flex-align-items-center flex-item-fluid relative">
                <div className="flex-item-fluid">{inputElement}</div>
                <div className="inputform-suffix right-icon pr0-5 flex">{suffix}</div>
            </div>
        );
    }

    return inputElement;
};

export default InputTwo;
