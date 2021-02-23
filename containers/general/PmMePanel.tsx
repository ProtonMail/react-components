import React, { useCallback } from 'react';
import { c } from 'ttag';

import { ADDRESS_TYPE } from 'proton-shared/lib/constants';
import { Address } from 'proton-shared/lib/interfaces';

import { Alert } from '../../components';
import { useUser } from '../../hooks';

import { SettingsSection, SettingsParagraph } from '../account';
import PmMeButton from './PmMeButton';

interface Props {
    addresses: Address[];
}

const PmMePanel = ({ addresses }: Props) => {
    const [{ canPay, hasPaidMail }] = useUser();

    const contentRenderer = useCallback(() => {
        if (canPay) {
            const hasPremium = addresses.some(({ Type }) => Type === ADDRESS_TYPE.TYPE_PREMIUM);

            if (!hasPremium) {
                if (hasPaidMail) {
                    return (
                        <>
                            <SettingsParagraph learnMoreUrl="https://protonmail.com/support/knowledge-base/pm-me-addresses/">
                                {c('Info')
                                    .t`ProtonMail supports @pm.me email addresses (short for ProtonMail me or Private Message me). Once activated, you can send and receive emails using your @pm.me address and create additional @pm.me addresses by navigating to the addresses section.`}
                            </SettingsParagraph>
                            <PmMeButton />
                        </>
                    );
                }

                return (
                    <>
                        <SettingsParagraph learnMoreUrl="https://protonmail.com/support/knowledge-base/pm-me-addresses/">
                            {c('Info')
                                .t`ProtonMail supports @pm.me email addresses (short for ProtonMail me or Private Message me). Once activated, you can receive emails to your @pm.me address. Upgrade to a paid plan to also send emails using your @pm.me address and create additional @pm.me addresses.`}
                        </SettingsParagraph>
                        <PmMeButton />
                    </>
                );
            }

            if (hasPaidMail) {
                return (
                    <>
                        <SettingsParagraph learnMoreUrl="https://protonmail.com/support/knowledge-base/pm-me-addresses/">
                            {c('Info')
                                .t`ProtonMail supports @pm.me email addresses (short for ProtonMail me or Private Message me). You can now send and receive emails using your @pm.me address and create additional @pm.me addresses by navigating to the addresses section.`}
                        </SettingsParagraph>
                        <Alert type="success">{c('Info').t`The short domain @pm.me is active on your account.`}</Alert>
                    </>
                );
            }

            return (
                <>
                    <SettingsParagraph learnMoreUrl="https://protonmail.com/support/knowledge-base/pm-me-addresses/">
                        {c('Info')
                            .t`You can now receive messages from your @pm.me address (short for ProtonMail me or Private Message me). Upgrade to a paid plan to also send emails using your @pm.me address and create additional @pm.me addresses.`}
                    </SettingsParagraph>
                    <Alert type="success">{c('Info').t`The short domain @pm.me is active on your account.`}</Alert>
                </>
            );
        }

        return (
            <SettingsParagraph>{c('Info')
                .t`ProtonMail now supports @pm.me email addresses (short for ProtonMail me or Private Message me). Upgrade to a paid account to also send emails from your @pm.me address.`}</SettingsParagraph>
        );
    }, [addresses]);

    return <SettingsSection>{contentRenderer()}</SettingsSection>;
};

export default PmMePanel;
