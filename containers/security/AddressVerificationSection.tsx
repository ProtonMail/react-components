import React from 'react';
import { c } from 'ttag';
import { updatePromptPin } from 'proton-shared/lib/api/mailSettings';
import { Row, Field, Label, Info, Toggle } from '../../components';
import { useApi, useLoading, useMailSettings, useEventManager, useNotifications } from '../../hooks';

import { SettingsSection, SettingsParagraph } from '../account';

const AddressVerificationSection = () => {
    const { createNotification } = useNotifications();
    const { call } = useEventManager();
    const api = useApi();
    const [loading, withLoading] = useLoading();
    const [{ PromptPin = 0 } = {}] = useMailSettings();

    const handleChange = async ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        await api(updatePromptPin(+target.checked));
        await call();
        createNotification({ text: c('Success').t`Preference saved` });
    };

    return (
        <SettingsSection>
            <SettingsParagraph learnMoreUrl="https://protonmail.com/support/knowledge-base/address-verification/">
                {c('Info')
                    .t`Address verification is an advanced security feature. Only turn this on if you know what it does.`}
            </SettingsParagraph>
            <Row>
                <Label htmlFor="trustToggle">
                    <span className="mr0-5">{c('Label').t`Prompt to trust keys`}</span>
                    <Info
                        url="https://protonmail.com/support/knowledge-base/address-verification/"
                        title={c('Tooltip prompt to trust keys')
                            .t`When receiving an internal message from a sender that has no trusted keys in your contacts, show a banner asking if you want to enable trusted keys.`}
                    />
                </Label>
                <Field>
                    <Toggle
                        id="trustToggle"
                        loading={loading}
                        checked={!!PromptPin}
                        onChange={(e) => withLoading(handleChange(e))}
                    />
                </Field>
            </Row>
        </SettingsSection>
    );
};

export default AddressVerificationSection;
