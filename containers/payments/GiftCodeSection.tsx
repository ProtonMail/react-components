import React, { useState } from 'react';
import { c } from 'ttag';
import { validateCredit, buyCredit } from 'proton-shared/lib/api/payments';

import { useLoading, useEventManager, useNotifications, useApiWithoutResult } from '../../hooks';

import { Button, Field, Row } from '../../components';
import SettingsParagraph from '../account/SettingsParagraph';
import { SettingsSection } from '../account';
import GiftCodeInput from './GiftCodeInput';

const GiftCodeSection = () => {
    const [value, setValue] = useState('');
    const [loading, withLoading] = useLoading();
    const { request: requestBuyCredit } = useApiWithoutResult(buyCredit);
    const { request: requestValidateCredit } = useApiWithoutResult(validateCredit);
    const { call } = useEventManager();
    const { createNotification } = useNotifications();

    const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        setValue(target.value.replace(/\s|\t/g, '').toUpperCase());
    };

    const handleSubmit = async () => {
        await requestValidateCredit({ GiftCode: value });
        await requestBuyCredit({ GiftCode: value, Amount: 0 });
        await call();
        setValue('');
        createNotification({ text: c('Success').t`Gift code applied` });
    };

    return (
        <SettingsSection>
            <SettingsParagraph>
                {c('Info')
                    .t`If you purchased a gift code or received one from our support team, you can enter it below.`}
            </SettingsParagraph>
            <Row>
                <div className="label pt0 text-ellipsis flex-item-fluid" title="gift-code-input-title">
                    <GiftCodeInput id="giftCodeInput" value={value} onChange={handleChange} required />
                </div>
                <Field>
                    <Button
                        color="norm"
                        disabled={value === ''}
                        loading={loading}
                        onClick={() => withLoading(handleSubmit())}
                    >
                        {c('Action').t`Update`}
                    </Button>
                </Field>
            </Row>
        </SettingsSection>
    );
};

export default GiftCodeSection;
