import React from 'react';
import Icon from './Icon';

interface Props {
    name: string;
    size?: 'small' | 'medium' | 'large';
}

const sizesNamingMap = {
    'small': 'sm',
    'medium': 'md',
    'large': 'lg'
}
const sizeMap = {
    'small': 16,
    'medium': 24,
    'large': 48
}

const nameSpaceSvg = 'mime';


const MimeIcon = (
    { name, size = 'small', ...rest }: Props) => {

    const nameIcon = `${sizesNamingMap[size]}-${name}`;
    const viewBox = `0 0 ${sizeMap[size]} ${sizeMap[size]}`;

    return (
            <Icon name={nameIcon} size={sizeMap[size]} viewBox={viewBox} nameSpaceSvg={nameSpaceSvg} {...rest} />
    );
};

export default MimeIcon;
