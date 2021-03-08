import React, { useRef, useState } from 'react';
import { c } from 'ttag';

import { isMac } from 'proton-shared/lib/helpers/browser';
import { updateAutoresponder } from 'proton-shared/lib/api/mailSettings';
import { AutoReplyDuration } from 'proton-shared/lib/constants';
import { getAccountSettingsApp } from 'proton-shared/lib/apps/helper';

import {
    useMailSettings,
    useLoading,
    useApi,
    useNotifications,
    useEventManager,
    useHotkeys,
    useHandler,
    useUser,
} from '../../hooks';
import { Toggle, Field, Label, Row, SimpleSquireEditor, Button, AppLink } from '../../components';

import { SettingsSection, SettingsParagraph } from '../account';

import { SquireEditorRef } from '../../components/editor/SquireEditor';

import AutoReplyFormMonthly from './AutoReplyForm/AutoReplyFormMonthly';
import AutoReplyFormDaily from './AutoReplyForm/AutoReplyFormDaily';
import AutoReplyFormWeekly from './AutoReplyForm/AutoReplyFormWeekly';
import AutoReplyFormPermanent from './AutoReplyForm/AutoReplyFormPermanent';
import AutoReplyFormFixed from './AutoReplyForm/AutoReplyFormFixed';
import DurationField from './AutoReplyForm/fields/DurationField';
import useAutoReplyForm, { getDefaultAutoResponder } from './AutoReplyForm/useAutoReplyForm';

const AutoReplySection = () => {
    const [{ hasPaidMail }] = useUser();
    const [mailSettings] = useMailSettings();
    const { Shortcuts = 1 } = mailSettings || {};
    const AutoResponder = mailSettings?.AutoResponder || getDefaultAutoResponder();
    const api = useApi();
    const { call } = useEventManager();
    const [enablingLoading, withEnablingLoading] = useLoading();
    const [updatingLoading, withUpdatingLoading] = useLoading();
    const [isEnabled, setIsEnabled] = useState(AutoResponder.IsEnabled);

    const { createNotification } = useNotifications();
    const { model, updateModel, toAutoResponder } = useAutoReplyForm(AutoResponder);

    const editorRef = useRef<SquireEditorRef>(null);
    const composerRef = useRef<HTMLDivElement>(null);

    const handleToggle = async (IsEnabled: boolean) => {
        await api(updateAutoresponder({ ...AutoResponder, IsEnabled }));
        await call();
        setIsEnabled(IsEnabled);
        createNotification({
            text: IsEnabled ? c('Success').t`Auto-reply enabled` : c('Success').t`Auto-reply disabled`,
        });
    };

    const handleSubmit = async () => {
        await api(updateAutoresponder(toAutoResponder(model)));
        await call();
        createNotification({ text: c('Success').t`Auto-reply updated` });
    };

    const handleEditorReady = () => {
        if (editorRef.current) {
            editorRef.current.value = model.message;
        }
    };

    const formRenderer = (duration: AutoReplyDuration) => {
        switch (duration) {
            case AutoReplyDuration.FIXED:
                return <AutoReplyFormFixed model={model} updateModel={updateModel} />;
            case AutoReplyDuration.DAILY:
                return <AutoReplyFormDaily model={model} updateModel={updateModel} />;
            case AutoReplyDuration.MONTHLY:
                return <AutoReplyFormMonthly model={model} updateModel={updateModel} />;
            case AutoReplyDuration.WEEKLY:
                return <AutoReplyFormWeekly model={model} updateModel={updateModel} />;
            case AutoReplyDuration.PERMANENT:
                return <AutoReplyFormPermanent />;
            default:
                return null;
        }
    };

    const squireKeydownHandler = useHandler((e: KeyboardEvent) => {
        const ctrlOrMetaKey = (e: KeyboardEvent) => (isMac() ? e.metaKey : e.ctrlKey);

        switch (e.key.toLowerCase()) {
            case 'enter':
                if (Shortcuts && ctrlOrMetaKey(e)) {
                    void withUpdatingLoading(handleSubmit());
                }
                break;
            default:
                break;
        }
    });

    useHotkeys(composerRef, [
        [
            ['Meta', 'Enter'],
            async () => {
                if (Shortcuts) {
                    await withUpdatingLoading(handleSubmit());
                }
            },
        ],
    ]);

    return (
        <SettingsSection className="no-scroll">
            {hasPaidMail ? (
                <SettingsParagraph className="mt0 mb1">
                    {c('Info')
                        .t`Use automatic replies to inform contacts you are out of the office or otherwise unable to respond.`}
                </SettingsParagraph>
            ) : (
                <div className="flex flex-align-items-center bg-pm-blue-gradient color-white rounded mt0 mb1 p1">
                    <p className="m0 mr1 flex-item-fluid">
                        {c('Info')
                            .t`Upgrade to ProtonMail Professional to enable automatic replies for when you are out of the office.`}
                    </p>
                    <AppLink to="/subscription" toApp={getAccountSettingsApp()} className="color-white">
                        {c('Action').t`Upgrade`}
                    </AppLink>
                </div>
            )}

            <Row>
                <Label htmlFor="autoReplyToggle" className="on-mobile-pb0 on-mobile-no-border w16r text-semibold">
                    {c('Label').t`Auto reply`}
                </Label>
                <Field className="on-mobile-pb0 on-mobile-no-border flex flex-nowrap w100">
                    <span className="flex-item-noshrink">
                        <Toggle
                            id="autoReplyToggle"
                            loading={enablingLoading}
                            checked={isEnabled}
                            onChange={({ target: { checked } }) => withEnablingLoading(handleToggle(checked))}
                        />
                    </span>
                </Field>
            </Row>
            {hasPaidMail && isEnabled ? (
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        await withUpdatingLoading(handleSubmit());
                    }}
                >
                    <DurationField value={model.duration} onChange={updateModel('duration')} />

                    {formRenderer(model.duration)}

                    <Row>
                        <Label className="w16r text-semibold" onClick={() => editorRef.current?.focus()}>
                            {c('Label').t`Message`}
                        </Label>
                        <Field className="w100">
                            <div ref={composerRef} tabIndex={-1} className="w100">
                                <SimpleSquireEditor
                                    ref={editorRef}
                                    supportImages={false}
                                    onReady={handleEditorReady}
                                    onChange={updateModel('message')}
                                    keydownHandler={squireKeydownHandler}
                                />
                            </div>

                            <Button
                                color="norm"
                                type="submit"
                                disabled={updatingLoading}
                                loading={updatingLoading}
                                className="mt1"
                            >
                                {c('Action').t`Update`}
                            </Button>
                        </Field>
                    </Row>
                </form>
            ) : null}
        </SettingsSection>
    );
};

export default AutoReplySection;
