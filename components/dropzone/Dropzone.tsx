import React, { DragEvent } from 'react';
import { c } from 'ttag';

import './Dropzone.scss';

interface Props {
    children: JSX.Element;
    isHovered: boolean;
    onDrop: (event: DragEvent) => void;
    onDragEnter: (event: DragEvent) => void;
    onDragLeave: (event: DragEvent) => void;
    className?: string;
}

const Dropzone = ({ children, isHovered, onDrop, onDragEnter, onDragLeave, className }: Props) => {
    return (
        <div
            className={className}
            onDrop={onDrop}
            onDragEnter={onDragEnter}
            onDragOver={(event) => event.preventDefault()}
        >
            {isHovered && (
                <div
                    className="dropzone covered-absolute flex flex-justify-center flex-items-center"
                    onDragLeave={onDragLeave}
                >
                    <span className="dropzone-text no-pointer-events">{c('Info').t`Drop the file here to upload`}</span>
                </div>
            )}
            <div className="dropzone-content flex flex-items-center flex-justify-center w100">{children}</div>
        </div>
    );
};

export default Dropzone;
