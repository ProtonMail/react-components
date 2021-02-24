import React from 'react';
import { c } from 'ttag';

import {
    updateMessageButtons,
    updateViewMode,
    updateStickyLabels,
    updateDraftType,
    updateRightToLeft,
} from 'proton-shared/lib/api/mailSettings';
import { MESSAGE_BUTTONS, VIEW_MODE, MIME_TYPES, RIGHT_TO_LEFT, STICKY_LABELS } from 'proton-shared/lib/constants';

import { ButtonGroup, Group, Row, Label, Field, Radio, Info } from '../../components';
import {
    useEventManager,
    useMailSettings,
    useNotifications,
    useApi,
    useApiWithoutResult,
    useLoading,
} from '../../hooks';

import DraftTypeSelect from './DraftTypeSelect';
import TextDirectionSelect from './TextDirectionSelect';
import ViewModeToggle from './ViewModeToggle';
import StickyLabelsToggle from './StickyLabelsToggle';

const { READ_UNREAD, UNREAD_READ } = MESSAGE_BUTTONS;

const AppearanceOtherSection = () => {
    const api = useApi();
    const { request, loading } = useApiWithoutResult(updateMessageButtons);
    const [
        {
            MessageButtons = 0,
            ViewMode = 0,
            StickyLabels = 0,
            DraftMIMEType = MIME_TYPES.DEFAULT,
            RightToLeft = 0,
        } = {},
    ] = useMailSettings();
    const { createNotification } = useNotifications();
    const { call } = useEventManager();

    const [loadingViewMode, withLoadingViewMode] = useLoading();
    const [loadingStickyLabels, withLoadingStickyLabels] = useLoading();
    const [loadingDraftType, withLoadingDraftType] = useLoading();
    const [loadingRightToLeft, withLoadingRightToLeft] = useLoading();

    const notifyPreferenceSaved = () => createNotification({ text: c('Success').t`Preference saved` });

    const handleButtonOrderChange = async ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const newState = parseInt(target.value, 10);
        await request(newState);
        await call();
        createNotification({
            text: c('Success').t`Buttons position saved`,
        });
    };

    const handleToggleStickyLabels = async (value: number) => {
        await api(updateStickyLabels(value));
        await call();
        notifyPreferenceSaved();
    };

    const handleChangeDraftType = async (value: MIME_TYPES) => {
        await api(updateDraftType(value));
        await call();
        notifyPreferenceSaved();
    };

    const handleChangeViewMode = async (mode: VIEW_MODE) => {
        if (mode === VIEW_MODE.SINGLE) {
            await api(updateStickyLabels(STICKY_LABELS.OFF));
        }
        await api(updateViewMode(mode));
        await call();
        notifyPreferenceSaved();
    };

    const handleChangeRightToLeft = async (value: RIGHT_TO_LEFT) => {
        await api(updateRightToLeft(value));
        await call();
        notifyPreferenceSaved();
    };

    return (
        <>
            <Row>
                <Label htmlFor="stickyLabelsToggle" className="text-bold">
                    <span className="mr0-5">{c('Label').t`Use sticky labels`}</span>
                    <Info
                        title={c('Tooltip')
                            .t`When a label is added to a message in a conversation, all future messages you send or receive will have that same label automatically applied.`}
                    />
                </Label>
                <Field>
                    <StickyLabelsToggle
                        id="stickyLabelsToggle"
                        stickyLabels={StickyLabels}
                        loading={loadingStickyLabels}
                        onToggle={(value) => withLoadingStickyLabels(handleToggleStickyLabels(value))}
                    />
                </Field>
            </Row>

            <Row>
                <Label htmlFor="viewMode" className="text-bold">
                    <span className="mr0-5">{c('Label').t`Conversation grouping`}</span>
                    <Info
                        title={c('Tooltip')
                            .t`Conversation grouping automatically groups messages in the same conversation together.`}
                    />
                </Label>

                <Field>
                    <ViewModeToggle
                        id="viewMode"
                        viewMode={ViewMode}
                        loading={loadingViewMode}
                        onToggle={(value) => withLoadingViewMode(handleChangeViewMode(value))}
                    />
                </Field>
            </Row>

            <Row>
                <Label htmlFor="draftType" className="text-bold">
                    {c('Label').t`Composer mode`}
                </Label>
                <Field>
                    <DraftTypeSelect
                        id="draftTypeSelect"
                        draftType={DraftMIMEType}
                        onChange={(value) => withLoadingDraftType(handleChangeDraftType(value))}
                        loading={loadingDraftType}
                    />
                </Field>
            </Row>
            <Row>
                <Label htmlFor="textDirection" className="text-bold">
                    {c('Label').t`Composer text direction`}
                </Label>
                <Field>
                    <TextDirectionSelect
                        id="textDirection"
                        rightToLeft={RightToLeft}
                        onChange={(value) => withLoadingRightToLeft(handleChangeRightToLeft(value))}
                        loading={loadingRightToLeft}
                    />
                </Field>
            </Row>

            <Row>
                <Label className="text-bold">{c('Label').t`Read/unread order`}</Label>
                <Field>
                    <div className="mb1">
                        <Radio
                            id="read-unread"
                            name="read-unread"
                            checked={MessageButtons === READ_UNREAD}
                            disabled={loading}
                            onChange={handleButtonOrderChange}
                            value={READ_UNREAD}
                        >
                            <Group className="ml0-5 no-pointer-events">
                                <ButtonGroup icon="read" title={c('Action').t`Read`} />
                                <ButtonGroup icon="unread" title={c('Action').t`Unread`} />
                            </Group>
                        </Radio>
                    </div>
                    <div>
                        <Radio
                            id="unread-read"
                            name="unread-read"
                            checked={MessageButtons === UNREAD_READ}
                            disabled={loading}
                            onChange={handleButtonOrderChange}
                            value={UNREAD_READ}
                        >
                            <Group className="ml0-5 no-pointer-events">
                                <ButtonGroup icon="unread" title={c('Action').t`Unread`} />
                                <ButtonGroup icon="read" title={c('Action').t`Read`} />
                            </Group>
                        </Radio>
                    </div>
                </Field>
            </Row>
        </>
    );
};

export default AppearanceOtherSection;
