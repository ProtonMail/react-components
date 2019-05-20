import React from 'react';
import { c } from 'ttag';
import {
    SubTitle,
    Alert,
    Row,
    Field,
    Label,
    Info,
    useMailSettings,
    useEventManager,
    useApiWithoutResult
} from 'react-components';
import {
    updateComposerMode,
    updateViewMode,
    updateViewLayout,
    updateStickyLabels,
    updateDraftType,
    updateRightToLeft
} from 'proton-shared/lib/api/mailSettings';

import DraftTypeSelect from './DraftTypeSelect';
import TextDirectionSelect from './TextDirectionSelect';
import ComposerModeRadios from './ComposerModeRadios';
import ViewLayoutRadios from './ViewLayoutRadios';
import ViewModeRadios from './ViewModeRadios';
import StickyLabelsToggle from './StickyLabelsToggle';

const LayoutsSection = () => {
    const [{ ComposerMode, ViewMode, ViewLayout, StickyLabels, DraftMIMEType, RightToLeft } = {}] = useMailSettings();
    const { call } = useEventManager();

    const { request: requestComposerMode, loading: loadingComposerMode } = useApiWithoutResult(updateComposerMode);
    const { request: requestViewMode, loading: loadingViewMode } = useApiWithoutResult(updateViewMode);
    const { request: requestViewLayout, loading: loadingViewLayout } = useApiWithoutResult(updateViewLayout);
    const { request: requestStickyLabels, loading: loadingStickyLabels } = useApiWithoutResult(updateStickyLabels);
    const { request: requestDraftType, loading: loadingDraftType } = useApiWithoutResult(updateDraftType);
    const { request: requestRightToLeft, loading: loadingRightToLeft } = useApiWithoutResult(updateRightToLeft);

    const handleChangeComposerMode = async (mode) => {
        await requestComposerMode(mode);
        call();
    };

    const handleChangeViewMode = async (mode) => {
        await requestViewMode(mode);
        call();
    };

    const handleChangeViewLayout = async (mode) => {
        await requestViewLayout(mode);
        call();
    };

    const handleToggleStickyLabels = async (value) => {
        await requestStickyLabels(value);
        call();
    };

    const handleChangeDraftType = async (value) => {
        await requestDraftType(value);
        call();
    };

    const handleChangeRightToLeft = async (value) => {
        await requestRightToLeft(value);
        call();
    };

    return (
        <>
            <SubTitle>{c('Title').t`Layouts`}</SubTitle>
            <Alert>{c('Info').t`Lorem ipsum`}</Alert>
            <Row>
                <Label>
                    <span className="mr1">{c('Label').t`Default Composer`}</span>
                    <Info
                        url="https://protonmail.com/support/knowledge-base/composer/"
                        title={c('Tooltip')
                            .t`This sets the default composer size. Two sizes are available, a smaller popup composer, and a bigger full screen composer.`}
                    />
                </Label>
                <Field>
                    <ComposerModeRadios
                        composerMode={ComposerMode}
                        onChange={handleChangeComposerMode}
                        loading={loadingComposerMode}
                    />
                </Field>
            </Row>
            <Row>
                <Label>
                    <span className="mr1">{c('Label').t`Default Inbox`}</span>
                    <Info
                        url="https://protonmail.com/support/knowledge-base/change-inbox-layout/"
                        title={c('Tooltip')
                            .t`ProtonMail supports both column and row layouts for the inbox. Using this setting, it is possible to change between the two layouts.`}
                    />
                </Label>
                <Field>
                    <ViewLayoutRadios
                        viewLayout={ViewLayout}
                        onChange={handleChangeViewLayout}
                        loading={loadingViewLayout}
                    />
                </Field>
            </Row>
            <Row>
                <Label>
                    <span className="mr1">{c('Label').t`Conversations`}</span>
                    <Info
                        title={c('Tooltip')
                            .t`Conversation Grouping automatically groups messages in the same conversation together.`}
                    />
                </Label>
                <Field>
                    <ViewModeRadios viewMode={ViewMode} onChange={handleChangeViewMode} loading={loadingViewMode} />
                </Field>
            </Row>
            <Row>
                <Label>
                    <span className="mr1">{c('Label').t`Use sticky labels`}</span>
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
                        onToggle={handleToggleStickyLabels}
                    />
                </Field>
            </Row>
            <Row>
                <Label>{c('Label').t`Composer Mode`}</Label>
                <Field>
                    <DraftTypeSelect
                        draftType={DraftMIMEType}
                        onChange={handleChangeDraftType}
                        loading={loadingDraftType}
                    />
                </Field>
            </Row>
            <Row>
                <Label>{c('Label').t`Composer Text Direction`}</Label>
                <Field>
                    <TextDirectionSelect
                        rightToLeft={RightToLeft}
                        onChange={handleChangeRightToLeft}
                        loading={loadingRightToLeft}
                    />
                </Field>
            </Row>
        </>
    );
};

export default LayoutsSection;
