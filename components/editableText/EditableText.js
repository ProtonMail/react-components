import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SmallButton, Icon, Input } from 'react-components';
import { c } from 'ttag';

const EditableText = ({ icon, onSubmit, initialText, children, readOnly, className, ...rest }) => {
    const [inputValue, setInputValue] = useState(initialText);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (editing) {
            setInputValue(initialText);
        }
    }, [editing, initialText]);

    const onToggleEditing = () => {
        setEditing(!editing);
    };

    const submit = (value) => {
        onSubmit(value);
        setEditing(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        submit(inputValue);
    };

    const handleChangeInputValue = ({ target }) => setInputValue(target.value);

    return editing ? (
        <form className="flex" onSubmit={handleFormSubmit}>
            <SmallButton onClick={onToggleEditing} className="mr0-5" title={c('Action').t`Close`}>
                <Icon name="close" />
            </SmallButton>
            {children ? (
                children({ submit })
            ) : (
                <>
                    <SmallButton type="submit" className="mr0-5" title={c('Action').t`Confirm`}>
                        <Icon name="on" />
                    </SmallButton>
                    <div className="flex">
                        <Input
                            autoFocus
                            value={inputValue}
                            onChange={handleChangeInputValue}
                            className={`pm-field--small ${className}`}
                            {...rest}
                        />
                    </div>
                </>
            )}
        </form>
    ) : (
        <>
            {!readOnly && (
                <SmallButton onClick={onToggleEditing} className="mr0-5" title={c('Action').t`Toggle edit`}>
                    <Icon name={icon} />
                </SmallButton>
            )}
            {initialText === null ? '--' : initialText}
        </>
    );
};

EditableText.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    className: PropTypes.string,
    initialText: PropTypes.string,
    readOnly: PropTypes.bool,
    children: PropTypes.func,
    icon: PropTypes.string
};

EditableText.defaultProps = {
    readOnly: false,
    icon: 'compose',
    initialText: '',
    className: ''
};

export default EditableText;
