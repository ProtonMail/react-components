import React from 'react';
import { c } from 'ttag';
import { updateKT } from 'proton-shared/lib/api/mailSettings';
import { KT_STATUS } from 'key-transparency-web-client';
import { Alert, Row, Field, Label, Info, Toggle, Button, Block } from '../../components';
import { useApi, useLoading, useMailSettings, useEventManager, useNotifications, useModals } from '../../hooks';
import useKeyTransparency from './useKeyTransparency';
import KTModalSelf from './modals/KTModalSelf';

const KeyTransparencySection = () => {
    const { createNotification } = useNotifications();
    const { call } = useEventManager();
    const api = useApi();
    const [loading, withLoading] = useLoading();
    const [{ KT } = { KT: 0 }] = useMailSettings();
    const { ktSelfAuditResult, isRunning } = useKeyTransparency();
    const { createModal } = useModals();

    let alertKT: 'info' | 'error' | 'warning' | 'success' = 'success';
    let ktText;
    if (isRunning) {
        alertKT = 'info';
        ktText = c('Info').t`Key Transparency self-audit is running.`;
    } else {
        let ktInfo;
        for (ktInfo of ktSelfAuditResult.values()) {
            if (ktInfo.code === KT_STATUS.KT_PASSED) {
                continue;
            } else if (ktInfo.code === KT_STATUS.KT_FAILED) {
                alertKT = 'error';
                break;
            } else {
                alertKT = 'warning';
            }
        }

        switch (alertKT) {
            case 'success':
                ktText = c('Info').t`Key Transparency self-audit succesfully verified all your public keys.`;
                break;
            case 'warning':
                ktText = c('Info')
                    .t`Key Transparency self-audit found some problems with one or more of your public keys.`;
                break;
            case 'error':
                ktText = c('Info').t`Key Transparency self-audit failed to verify one or more of your public keys.`;
                break;
            default:
                break;
        }
    }

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await api(updateKT(+e.target.checked));
        await call();
        createNotification({ text: c('Success').t`Preference saved` });
    };

    const button = !isRunning ? ( // && KT === 1 ? (
        <Block>
            <Button onClick={() => createModal(<KTModalSelf />)}>{c('Action').t`Key Transparency Result`}</Button>
        </Block>
    ) : null;

    return (
        <>
            <Alert learnMore="https://protonmail.com/support/knowledge-base/key-transparency/">
                {c('Info')
                    .t`Key Transparency is an advanced security feature. Only turn this on if you know what it does.`}
            </Alert>
            <Alert type={alertKT}>{ktText}</Alert>
            {button}
            <Row>
                <Label htmlFor="trustToggle">
                    <span className="mr0-5">{c('Label').t`Verify keys using Key Transparency`}</span>
                    <Info
                        url="https://protonmail.com/support/knowledge-base/key-transparency/"
                        title={c('Tooltip verify keys using Key Transparency')
                            .t`When sending an internal message to a sender that has keys in Key Transparency, verify them.`}
                    />
                </Label>
                <Field>
                    <Toggle
                        id="trustToggle"
                        loading={loading}
                        checked={!!KT}
                        onChange={(e) => withLoading(handleChange(e))}
                    />
                </Field>
            </Row>
        </>
    );
};

export default KeyTransparencySection;
