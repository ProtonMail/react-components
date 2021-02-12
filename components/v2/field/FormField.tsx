import React from 'react';

import Icon from '../../icon/Icon';
import { classnames, generateUID } from '../../../helpers';
import { useInstance } from '../../../hooks';

type ErrorProp = React.ReactNode | boolean;
interface RequiredChildProps {
    id: string;
    error: ErrorProp;
    disabled?: boolean;
}
export interface FormFieldProps {
    label?: React.ReactNode;
    hint?: React.ReactNode;
    assistiveText?: React.ReactNode;
    disabled?: boolean;
    id?: string;
    error?: ErrorProp;
    children: React.ReactElement<RequiredChildProps>;
}

const FormField = ({ label, hint, children, assistiveText, disabled, error, id: idProp }: FormFieldProps) => {
    const id = useInstance(() => idProp || generateUID());

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
        <label className={classes.root} htmlFor={id}>
            <div className={classes.labelContainer}>
                <span className="inputform-label-text">{label}</span>

                {hintElement}
            </div>
            <div className={classes.inputContainer}>{React.cloneElement(children, { id, error, disabled })}</div>
            {error ? errorElement : assitiveTextElement}
        </label>
    );
};

export default FormField;
