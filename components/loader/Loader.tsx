import React from 'react';
import FullLoader from './FullLoader';

const SIZE = {
    small: 20,
    medium: 80,
    big: 200
};

interface Props {
    size?: 'small' | 'medium' | 'big';
    color?: string;
}

const Loader = ({ size = 'small', color = '' }: Props) => {
    return (
        <div className="center flex mb2 mt2">
            <FullLoader size={SIZE[size]} color={color} />
        </div>
    );
};

export default Loader;
