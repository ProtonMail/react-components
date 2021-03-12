import React from 'react';
import { ThemeTypes } from 'proton-shared/lib/themes/themes';

import ThemeCard from './ThemeCard';

export interface Theme {
    label: string;
    identifier: ThemeTypes;
    src: string;
}
interface Props {
    themeIdentifier: ThemeTypes;
    onChange: (themeType: ThemeTypes) => void;
    disabled: boolean;
    list: Theme[];
}

const ThemeCards = ({ themeIdentifier, onChange, disabled, list }: Props) => {
    return (
        <>
            {list.map(({ identifier, label, src }) => {
                const id = `id_${identifier}`;
                return (
                    <ThemeCard
                        key={label}
                        label={label}
                        id={id}
                        src={src}
                        checked={themeIdentifier === identifier}
                        onChange={() => onChange(identifier)}
                        disabled={disabled}
                    />
                );
            })}
        </>
    );
};

export default ThemeCards;
