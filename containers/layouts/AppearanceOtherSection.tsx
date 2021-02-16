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

import { ButtonGroup, Row, Label, Field, Radio, Info, Button, Icon } from '../../components';
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
                <Label htmlFor="stickyLabelsToggle" className="text-semibold">
                    <span className="mr0-5">{c('Label').t`Use sticky labels`}</span>
                    <Info
                        title={c('Tooltip')
                            .t`When you add a label to a message in a conversation, it will automatically be applied to all future messages you send or receive in that conversation.`}
                    />
                </Label>
                <Field className="pt0-5">
                    <StickyLabelsToggle
                        id="stickyLabelsToggle"
                        stickyLabels={StickyLabels}
                        loading={loadingStickyLabels}
                        onToggle={(value) => withLoadingStickyLabels(handleToggleStickyLabels(value))}
                    />
                </Field>
            </Row>

            <Row>
                <Label htmlFor="viewMode" className="text-semibold">
                    <span className="mr0-5">{c('Label').t`Conversation grouping`}</span>
                    <Info
                        title={c('Tooltip')
                            .t`Group emails in the same conversation together in your Inbox or display them separately.`}
                    />
                </Label>

                <Field className="pt0-5">
                    <ViewModeToggle
                        id="viewMode"
                        viewMode={ViewMode}
                        loading={loadingViewMode}
                        onToggle={(value) => withLoadingViewMode(handleChangeViewMode(value))}
                    />
                </Field>
            </Row>

            <Row>
                <Label htmlFor="draftType" className="text-semibold">
                    {c('Label').t`Composer mode`}
                </Label>
                <Field>
                    <DraftTypeSelect
                        id="draftType"
                        draftType={DraftMIMEType}
                        onChange={(value) => withLoadingDraftType(handleChangeDraftType(value))}
                        loading={loadingDraftType}
                    />
                </Field>
            </Row>
            <Row>
                <Label htmlFor="textDirection" className="text-semibold">
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
                <Label className="text-semibold">{c('Label').t`Read/unread toolbar order`}</Label>
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
                            <ButtonGroup className="ml1 no-pointer-events">
                                <Button group icon title={c('Action').t`Read`}>
                                    <Icon name="read" />
                                </Button>
                                <Button group icon title={c('Action').t`Unread`}>
                                    <Icon name="unread" />
                                </Button>
                            </ButtonGroup>
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
                            <ButtonGroup className="ml1 no-pointer-events">
                                <Button group icon title={c('Action').t`Unread`}>
                                    <Icon name="unread" />
                                </Button>
                                <Button group icon title={c('Action').t`Read`}>
                                    <Icon name="read" />
                                </Button>
                            </ButtonGroup>
                        </Radio>
                    </div>
                </Field>
            </Row>
        </>
    );
};

export default AppearanceOtherSection;
