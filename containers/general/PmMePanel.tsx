import React from 'react';
import { c } from 'ttag';

import { ADDRESS_TYPE } from 'proton-shared/lib/constants';
import { Address } from 'proton-shared/lib/interfaces';

import { SettingsSection, SettingsParagraph } from '../account';
import PmMeButton from './PmMeButton';

interface Props {
    addresses: Address[];
}

const PmMePanel = ({ addresses }: Props) => {
    const hasPremium = addresses.some(({ Type }) => Type === ADDRESS_TYPE.TYPE_PREMIUM);

    return !hasPremium ? (
        <SettingsSection>
            <SettingsParagraph learnMoreUrl="https://protonmail.com/support/knowledge-base/pm-me-addresses/">
                {c('Info')
                    .t`ProtonMail now supports @pm.me email addresses (short for ProtonMail me or Private Message me).`}
            </SettingsParagraph>
            <PmMeButton />
        </SettingsSection>
    ) : null;
};

export default PmMePanel;
