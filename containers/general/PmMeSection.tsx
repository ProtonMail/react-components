import React from 'react';

import { Address } from 'proton-shared/lib/interfaces';

import PmMePanel from './PmMePanel';

interface Props {
    addresses: Address[];
}

const PmMeSection = ({ addresses }: Props) => {
    return <PmMePanel addresses={addresses} />;
};

export default PmMeSection;
