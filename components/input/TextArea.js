import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { generateUID } from '../../helpers/component';
import useInput from './useInput';
import ErrorZone from '../text/ErrorZone';

const useAutoGrow = ({ maxRows = 5, minRows = 1, autoGrow = false }, handlers) => {
    const [rows, setRows] = useState(minRows);

    const updateTextArea = useCallback(
        (event) => {
            const textAreaLineHeight = +getComputedStyle(event.target).lineHeight.replace('px', '');

            const previousRows = event.target.rows;

            // Reset rows so we can calculate calculate currentRows correctly
            event.target.rows = minRows;

            const currentRows = Math.min(
                maxRows,
                Math.max(minRows, ~~(event.target.scrollHeight / textAreaLineHeight))
            );

            // Set rows attribute directly because React won't update it as it stayed the same
            if (currentRows === previousRows) {
                event.target.rows = currentRows;
            }

            setRows(currentRows);

            handlers.onChange(event);
        },
        [minRows, maxRows, handlers]
    );

    if (!autoGrow) {
        return {
            rows: maxRows,
            updateTextArea: handlers.onChange
        };
    }
    return { rows, updateTextArea };
};

const TextArea = (props) => {
    const { className = '', error, ...rest } = props;
    const { handlers, statusClasses, status } = useInput(props);
    const [uid] = useState(generateUID('textarea'));
    const { rows, updateTextArea } = useAutoGrow(props, handlers);

    return (
        <>
            <textarea
                rows={rows}
                className={`pm-field w100 ${className} ${statusClasses}`}
                aria-invalid={error && status.isDirty}
                aria-describedby={uid}
                {...rest}
                {...handlers}
                onChange={updateTextArea}
            />
            <ErrorZone id={uid}>{error && status.isDirty ? error : ''}</ErrorZone>
        </>
    );
};

TextArea.propTypes = {
    error: PropTypes.string,
    autoGrow: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    onKeyDown: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onPressEnter: PropTypes.func,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    textareaRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default TextArea;
