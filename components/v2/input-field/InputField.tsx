import React from 'react';

import Icon from '../../icon/Icon';
import Input, { InputTwoProps } from '../input/Input';
import { classnames } from '../../../helpers';

interface InputFieldProps extends InputTwoProps {
    label?: React.ReactNode;
    hint?: React.ReactNode;
    assistiveText?: React.ReactNode;
    disabled?: boolean;
}

const InputField = (props: InputFieldProps) => {
    const { label, hint, assistiveText, disabled, error, ...rest } = props;

    const classes = {
        root: classnames([
            'inputform-container w100 mb1',
            disabled && 'inputform-container--disabled',
            Boolean(error) && 'inputform-container--invalid',
        ]),
        labelContainer: 'flex inputform-label flex-justify-space-between flex-nowrap flex-align-items-end',
        inputContainer: 'inputform-field-container relative',
    };

    const hintElement = hint && <div className="inputform-label-hint flex-item-noshrink">{hint}</div>;

    const errorElement = error && (
        <div className="inputform-assist">
            {/* TODO: clear up inconsistency between design spacing & code unit system spacing */}
            {/* TODO: find out about missing "vertical-align-top" helper */}
            <Icon name="exclamation-circle-filled" style={{ verticalAlign: 'top', marginRight: '5px' }} />
            <span>{error}</span>
        </div>
    );

    const assitiveTextElement = assistiveText && <div className="inputform-assist">{assistiveText}</div>;

    return (
        <label className={classes.root} htmlFor="id_element1">
            <div className={classes.labelContainer}>
                <span className="inputform-label-text">{label}</span>

                {hintElement}
            </div>
            <div className={classes.inputContainer}>
                <Input id="id_element1" className="w100" disabled={disabled} {...rest} />
            </div>

            {error ? errorElement : assitiveTextElement}
        </label>
    );
};

export default InputField;
