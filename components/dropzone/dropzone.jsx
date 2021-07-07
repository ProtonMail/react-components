import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { classnames } from '../../helpers/component';

import './dropzone.sass';

const CLASSNAMES = {
    default: 'dropBorder-default',
    error: 'dropBorder-error',
    success: 'dropBorder-success'
};

// no operation function
const noop = () => {};

const DropZone = ({
    children,
    validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/x-vcard'],
    onDrop,
    onDragEnter = noop,
    onDragExit = noop
}) => {
    const [status, setStatus] = useState('default');

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items) {
            const isFileValid = e.dataTransfer.items.length === 1 && validTypes.includes(e.dataTransfer.items[0].type);
            onDragEnter(isFileValid);
            if (isFileValid) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        }
    };

    const handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setStatus('default');
        onDragExit();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setStatus('default');
        if (
            e.dataTransfer.files &&
            e.dataTransfer.files.length === 1 &&
            validTypes.includes(e.dataTransfer.items[0].type)
        ) {
            onDrop(e.dataTransfer.files[0]);
        }
    };

    return (
        <div
            className={classnames([CLASSNAMES[status], 'dropBorder'])}
            onDrag={handleDrag}
            onDrop={handleDrop}
            onDragOver={handleDragIn}
            onDragLeave={handleDragOut}
        >
            {children}
        </div>
    );
};

DropZone.propTypes = {
    children: PropTypes.node.isRequired,
    onDrop: PropTypes.func.isRequired,
    onDragEnter: PropTypes.func,
    onDragExit: PropTypes.func,
    validTypes: PropTypes.array
};

export default DropZone;
