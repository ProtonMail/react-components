import React, { memo } from 'react';
import { classnames } from '../../helpers/component';

export interface Props extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
    name: string;
    alt?: string;
    viewBox?: string;
    className?: string;
    size?: number;
    color?: string;
    rotate?: number;
    noFill?: boolean;
}

/**
 * Component to print svg icon
 * <Icon name="label" alt="My label" />
 * @param {String} name of the svg icon present in the design-system
 * @param {String} className used on svg tag
 * @param {String} fill      To construct the fill-global className
 * @param {Number} size      To construct the icon size className icon-<size>p (default 16)
 * @param {String} viewBox
 * @param {String} alt       Used by screen reader
 * @param {Number} rotate    How many degrees the icon should be rotated
 * @return {React.Component}
 */
const Icon = ({
    name,
    alt,
    color,
    className = '',
    viewBox = '0 0 16 16',
    size = 16,
    rotate = 0,
    noFill,
    ...rest
}: Props) => {
    const fillClass = noFill || color || (className && className.includes('fill-')) ? undefined : 'fill-global-grey';
    const style = {
        ...(color && { fill: color }),
        ...(rotate && { transform: `rotate(${rotate}deg)` })
    };

    return (
        <>
            <svg
                style={style}
                viewBox={viewBox}
                className={classnames([`icon-${size}p`, fillClass, className])}
                role="img"
                focusable="false"
                {...rest}
            >
                <use xlinkHref={`#shape-${name}`} />
            </svg>
            {alt ? <span className="sr-only">{alt}</span> : null}
        </>
    );
};

export default memo(Icon);
