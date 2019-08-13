import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import './CircularProgress.scss';
import { classnames } from '../../helpers/component';

const CircularProgress = ({
    children,
    className,
    progress,
    rootRef,
    size = 32,
    backgroundColor = '#555',
    color = '#4cc75a',
    ...rest
}) => {
    const backgroundCircleStyle = useMemo(
        () => ({
            stroke: backgroundColor
        }),
        backgroundColor
    );

    const circleStyle = useMemo(
        () => ({
            stroke: color
        }),
        color
    );

    return (
        <svg
            ref={rootRef}
            viewBox="0 0 36 36"
            className={classnames(['circular-chart', className])}
            width={size}
            height={size}
            {...rest}
        >
            <path
                style={backgroundCircleStyle}
                className="circle"
                strokeDasharray="100, 100"
                d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
                circleStyle={circleStyle}
                className="circle"
                strokeDasharray={`${progress}, 100`}
                d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {children}
        </svg>
    );
};

CircularProgress.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    rootRef: PropTypes.object,
    size: PropTypes.number,
    progress: PropTypes.number.isRequired,
    backgroundColor: PropTypes.string,
    color: PropTypes.string
};

export default CircularProgress;
