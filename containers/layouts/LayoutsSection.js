import React from 'react';
import { c } from 'ttag';
import {
    SubTitle,
    Alert,
    Row,
    Label,
    Info,
    useMailSettings,
    useEventManager,
    useApiWithoutResult
} from 'react-components';
import { updateComposerMode, updateViewMode, updateViewLayout } from 'proton-shared/lib/api/mailSettings';

import DraftTypeSelect from './DraftTypeSelect';
import TextDirectionSelect from './TextDirectionSelect';
import ShowMovedSelect from './ShowMovedSelect';
import ComposerModeRadios from './ComposerModeRadios';
import ViewLayoutRadios from './ViewLayoutRadios';
import ViewModeRadios from './ViewModeRadios';

const LayoutsSection = () => {
    const [{ ComposerMode, ViewMode, ViewLayout }] = useMailSettings();
    const { call } = useEventManager();
    const request = {
        composerMode: useApiWithoutResult(updateComposerMode).request,
        viewMode: useApiWithoutResult(updateViewMode).request,
        viewLayout: useApiWithoutResult(updateViewLayout).request
    };
    const loading = {
        composerMode: useApiWithoutResult(updateComposerMode).loading,
        viewMode: useApiWithoutResult(updateViewMode).loading,
        viewLayout: useApiWithoutResult(updateViewLayout).loading
    };
    const handleChange = {
        composerMode: (mode) => async () => {
            await request.composerMode(mode);
            call();
        },
        viewMode: (mode) => async () => {
            await request.viewMode(mode);
            call();
        },
        viewLayout: (mode) => async () => {
            await request.viewLayout(mode);
            call();
        }
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
                <ComposerModeRadios
                    composerMode={ComposerMode}
                    handleChange={handleChange.composerMode}
                    loading={loading.composerMode}
                />
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
                <ViewLayoutRadios viewMode={ViewMode} handleChange={handleChange.viewMode} loading={loading.viewMode} />
            </Row>
            <Row>
                <Label>
                    <span className="mr1">{c('Label').t`Conversations`}</span>
                    <Info
                        title={c('Tooltip')
                            .t`Conversation Grouping automatically groups messages in the same conversation together.`}
                    />
                </Label>
                <ViewModeRadios
                    viewLayout={ViewLayout}
                    handleChange={handleChange.ViewLayout}
                    loading={loading.ViewLayout}
                />
            </Row>
            <Row>
                <Label>{c('Label').t`Composer Mode`}</Label>
                <DraftTypeSelect />
            </Row>
            <Row>
                <Label>{c('Label').t`Composer Text Direction`}</Label>
                <TextDirectionSelect />
            </Row>
            <Row>
                <Label>
                    <span className="mr1">{c('Label').t`Sent/Drafts`}</span>
                    <Info
                        title={c('Tooltip')
                            .t`Setting to 'Include Moved' means that sent / drafts messages that have been moved to other folders will continue to appear in the Sent/Drafts folder.`}
                    />
                </Label>
                <ShowMovedSelect />
            </Row>
        </>
    );
};

export default LayoutsSection;
