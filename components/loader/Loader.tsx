import React from 'react';
import { c } from 'ttag';
import { classnames } from '../../helpers/component';

const WIDTH = {
    small: '20',
    medium: '80',
    big: '200'
};

const CLASSES_ORBIT1 = {
    small: 'loadingAnimation-circle--smaller loadingAnimation-orbit1--smaller',
    medium: 'loadingAnimation-orbit1',
    big: 'loadingAnimation-orbit1'
};
const CLASSES_ORBIT2 = {
    small: 'loadingAnimation-circle--smaller loadingAnimation-orbit2--smaller',
    medium: 'loadingAnimation-orbit2',
    big: 'loadingAnimation-orbit2'
};



interface Props {
    size?: 'small' | 'medium' | 'big';
    bgColor?: string;
}


const Loader = ({ size = 'small', bgColor = '' }: Props) => {
    const diameter = size !== 'small' ? '100' : '10';
    const radius = size !== 'small' ? '80' : '8';

    const classNameOrbit = [ 'loadingAnimation-circle ', bgColor === 'primary' && 'loadingAnimation-circle--pm-primary' ];
    const classNameOrbit1 = classnames([ ...classNameOrbit, CLASSES_ORBIT1[size] ]);
    const classNameOrbit2 = classnames([ ...classNameOrbit, CLASSES_ORBIT2[size] ]);

    return (
        <div className="center flex mb2 mt2">
            <svg xmlns="http://www.w3.org/2000/svg"
                className="loadingAnimation mauto"
                role="img"
                aria-hidden="true"
                focusable="false"
                viewBox={ size !== 'small' ? '0 0 200 200' : '0 0 20 20' }
                width={WIDTH[size]}
                height={WIDTH[size]}>
                <circle
                    cx={diameter}
                    cy={diameter}
                    r={radius}
                    className={classNameOrbit1} />
                <circle
                    cx={diameter}
                    cy={diameter}
                    r={radius}
                    className={classNameOrbit2} />
            </svg>
            <span className="sr-only">{c('Info').t`Loading`}</span>
        </div>
    );
};

export default Loader;
