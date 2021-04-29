import React from 'react';
import { c } from 'ttag';

import { DENSITY } from 'proton-shared/lib/constants';

import comfortableDensitySvg from 'design-system/assets/img/pm-images/comfortable-density.svg';
import compactDensitySvg from 'design-system/assets/img/pm-images/compact-density.svg';

import { LayoutCards } from '../../components';

const { COMFORTABLE, COMPACT } = DENSITY;

interface Props {
    density: DENSITY;
    onChange: (density: DENSITY) => void;
    loading: boolean;
    id: string;
    describedByID: string;
}

const DensityRadiosCards = ({ density, onChange, loading, id, describedByID, ...rest }: Props) => {
    const layoutCardComfortable = {
        value: COMFORTABLE,
        selected: density === COMFORTABLE,
        id: 'comfortableRadio',
        disabled: loading,
        name: 'density',
        label: c('Label to change density').t`Comfortable`,
        onChange() {
            onChange(COMFORTABLE);
        },
        src: comfortableDensitySvg,
        describedByID,
    };
    const layoutCardCompact = {
        value: COMPACT,
        selected: density === COMPACT,
        id: 'compactRadio',
        disabled: loading,
        name: 'density',
        label: c('Label to change density').t`Compact`,
        onChange() {
            onChange(COMPACT);
        },
        src: compactDensitySvg,
        describedByID,
    };

    return <LayoutCards list={[layoutCardComfortable, layoutCardCompact]} describedByID={describedByID} {...rest} />;
};

export default DensityRadiosCards;
