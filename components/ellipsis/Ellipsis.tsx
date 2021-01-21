import React from 'react';
import { classnames } from '../../helpers';

interface Props {
    filename: string;
    caractersOnRight?: number;
    className?: string;
    displayTitle?: Boolean; // when you embed it into something with title/tooltip, you might not want to display it
}

const Ellipsis = ({ filename, className = '', displayTitle = true, caractersOnRight = 6 }: Props) => {
    const filenameStart = filename.slice(0, -caractersOnRight);
    const filenameEnd = filename.slice(-caractersOnRight);

    return (
        <span
            aria-label={filename}
            title={displayTitle ? filename : undefined}
            className={classnames(['inline-flex flex-nowrap mw100', className])}
        >
            <span className="ellipsis" aria-hidden="true">
                {filenameStart}
            </span>
            <span className="flex-item-noshrink" aria-hidden="true">
                {filenameEnd}
            </span>
        </span>
    );
};

export default Ellipsis;
