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
    bigger?: boolean;
    id?: string;
    error?: ErrorProp;
    children: React.ReactElement<RequiredChildProps>;
}

const FormField = ({ label, hint, children, assistiveText, disabled, bigger, error, id: idProp }: FormFieldProps) => {
    const id = useInstance(() => idProp || generateUID());

    const classes = {
        root: classnames([
            'inputform-container w100 mb0-5',
            disabled && 'inputform-container--disabled',
            Boolean(error) && 'inputform-container--invalid',
            bigger && 'inputform-container--bigger',
        ]),
        labelContainer: 'flex inputform-label flex-justify-space-between flex-nowrap flex-align-items-end',
        inputContainer: 'inputform-field-container relative',
    };

    const hintElement = hint && <div className="inputform-label-hint flex-item-noshrink">{hint}</div>;

    const errorElement = error && (
        <>
            {/* TODO: clear up inconsistency between design spacing & code unit system spacing */}
            <Icon name="exclamation-circle-filled" className="aligntop mr0-25" />
            <span>{error}</span>
        </>
    );

    const assistiveElement = <>{assistiveText}</>;

    return (
        <label className={classes.root} htmlFor={id}>
            <div className={classes.labelContainer}>
                <span className="inputform-label-text">{label}</span>
                {hintElement}
            </div>
            <div className={classes.inputContainer}>{React.cloneElement(children, { id, error, disabled })}</div>
            <div className="inputform-assist flex">{errorElement || assistiveElement}</div>
        </label>
    );
};

export default FormField;
