import React from 'react';
import { c } from 'ttag';
import { classnames } from '../../helpers';

import './Dropzone.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * When true, reveals the overlay and content
     */
    isHovered: boolean;
    /**
     * The content to show when dragging over the dropzone
     */
    content?: React.ReactNode;
}

const Dropzone = ({
    children,
    isHovered,
    onDrop,
    onDragEnter,
    onDragLeave,
    className,
    content = c('Info').t`Drop the file here to upload`,
    ...rest
}: Props) => {
    return (
        <div
            className={className}
            onDrop={onDrop}
            onDragEnter={onDragEnter}
            onDragOver={(event) => event.preventDefault()}
            {...rest}
        >
            <div
                className={classnames([
                    'dropzone covered-absolute flex flex-justify-center flex-items-center',
                    isHovered && 'is-hovered',
                ])}
                onDragLeave={onDragLeave}
            >
                <span className="dropzone-text no-pointer-events">{content}</span>
            </div>

            <div className="dropzone-content flex flex-items-center flex-justify-center w100">{children}</div>
        </div>
    );
};

export default Dropzone;
