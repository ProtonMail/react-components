import React from 'react';
import { c } from 'ttag';

import { updateComposerMode, updateViewLayout } from 'proton-shared/lib/api/mailSettings';
import { updateDensity } from 'proton-shared/lib/api/settings';
import { DENSITY, VIEW_LAYOUT, COMPOSER_MODE } from 'proton-shared/lib/constants';

import { Row, Label, Info, Loader } from '../../components';
import { useNotifications, useUserSettings, useMailSettings, useEventManager, useLoading, useApi } from '../../hooks';
import { SettingsSectionWide } from '../account';

import ComposerModeRadios from './ComposerModeRadios';
import ViewLayoutRadios from './ViewLayoutRadios';
import DensityRadios from './DensityRadios';

const LayoutsSection = () => {
    const [{ ComposerMode = 0, ViewLayout = 0 } = {}, loadingMailSettings] = useMailSettings();
    const [{ Density }, loadingUserSettings] = useUserSettings();
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const api = useApi();
    const [loadingComposerMode, withLoadingComposerMode] = useLoading();
    const [loadingViewLayout, withLoadingViewLayout] = useLoading();
    const [loadingDensity, withLoadingDensity] = useLoading();

    const notifyPreferenceSaved = () => createNotification({ text: c('Success').t`Preference saved` });

    const handleChangeComposerMode = async (mode: COMPOSER_MODE) => {
        await api(updateComposerMode(mode));
        await call();
        notifyPreferenceSaved();
    };

    const handleChangeViewLayout = async (layout: VIEW_LAYOUT) => {
        await api(updateViewLayout(layout));
        await call();
        notifyPreferenceSaved();
    };

    const handleChangeDensity = async (density: DENSITY) => {
        await api(updateDensity(density));
        await call();
        notifyPreferenceSaved();
    };

    return (
        <SettingsSectionWide className="flex flex-wrap">
            {loadingMailSettings || loadingUserSettings ? (
                <Loader />
            ) : (
                <>
                    <Row className="flex-column">
                        <Label htmlFor="layoutMode" className="mb1 text-bold">
                            <span className="mr0-5">{c('Label').t`Inbox`}</span>
                            <Info
                                url="https://protonmail.com/support/knowledge-base/change-inbox-layout/"
                                title={c('Tooltip').t`Set the default layout for your Inbox.`}
                            />
                        </Label>
                        <ViewLayoutRadios
                            id="layoutMode"
                            viewLayout={ViewLayout}
                            onChange={(value) => withLoadingViewLayout(handleChangeViewLayout(value))}
                            loading={loadingViewLayout}
                        />
                    </Row>

                    <Row className="flex-column">
                        <Label htmlFor="composerMode" className="mb1 text-bold">
                            <span className="mr0-5">{c('Label').t`Composer`}</span>
                            <Info
                                url="https://protonmail.com/support/knowledge-base/composer/"
                                title={c('Tooltip').t`Set the default Composer popup size as small or full screen.`}
                            />
                        </Label>
                        <ComposerModeRadios
                            id="composerMode"
                            composerMode={ComposerMode}
                            onChange={(value) => withLoadingComposerMode(handleChangeComposerMode(value))}
                            loading={loadingComposerMode}
                        />
                    </Row>
                    <Row className="flex-column">
                        <Label htmlFor="density" className="mb1 text-bold">{c('Label').t`Density`}</Label>
                        <DensityRadios
                            density={Density}
                            onChange={(value) => withLoadingDensity(handleChangeDensity(value))}
                            loading={loadingDensity}
                            id="density"
                        />
                    </Row>
                </>
            )}
        </SettingsSectionWide>
    );
};

export default LayoutsSection;
