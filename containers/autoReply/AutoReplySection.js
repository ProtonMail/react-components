import React from 'react';
import { updateAutoresponder } from 'proton-shared/lib/api/mailSettings';
import { c } from 'ttag';

import { useModals, useMailSettings, useLoading, useApi, useEventManager } from '../../hooks';
import { Toggle, Button, Field, Label, Alert } from '../../components';
import AutoReplyModal from './AutoReplyModal';
import AutoReplyTemplate from './AutoReplyTemplate';

const AutoReplySection = () => {
    const { createModal } = useModals();
    const [{ AutoResponder }] = useMailSettings();
    const api = useApi();
    const { call } = useEventManager();
    const [loading, withLoading] = useLoading();

    const handleOpenModal = () => {
        createModal(<AutoReplyModal autoresponder={AutoResponder} />);
    };

    const handleToggle = async (isEnabled) => {
        if (isEnabled) {
            return handleOpenModal();
        }
        await api(updateAutoresponder({ ...AutoResponder, IsEnabled: false }));
        await call();
    };

    return (
        <>
            <Alert className="mt1 mb1" learnMore="https://protonmail.com/support/knowledge-base/autoresponder/">
                {c('Info')
                    .t`Automatic replies can respond automatically to incoming messages (such as when you are on vacation and can't respond).`}
            </Alert>

            <div className="inline-grid-container onmobile-w100 editableSection-container editableSection-container--sizeTablet">
                <Label htmlFor="autoReplyToggle" className="border-bottom onmobile-pb0 onmobile-no-border">{c('Label')
                    .t`Auto-reply`}</Label>
                <Field className="auto border-bottom onmobile-pb0 onmobile-no-border flex flex-nowrap">
                    <span className="flex-item-noshrink">
                        <Toggle
                            id="autoReplyToggle"
                            loading={loading}
                            checked={AutoResponder.IsEnabled}
                            onChange={({ target: { checked } }) => withLoading(handleToggle(checked))}
                        />
                    </span>
                    <span className="onmobile-pb0 onmobile-no-border mlauto">
                        <Button className="pm-button--primary mt0-25" onClick={handleOpenModal}>{c('Action')
                            .t`Edit`}</Button>
                    </span>
                </Field>
                {AutoResponder.IsEnabled && (
                    <AutoReplyTemplate autoresponder={AutoResponder} onEdit={handleOpenModal} />
                )}
            </div>
        </>
    );
};

export default AutoReplySection;
