import React from 'react';
import { c } from 'ttag';

import { updateComposerMode, updateViewLayout } from 'proton-shared/lib/api/mailSettings';
import { updateDensity } from 'proton-shared/lib/api/settings';
import { DENSITY, VIEW_LAYOUT, COMPOSER_MODE } from 'proton-shared/lib/constants';

import { Info, Loader } from '../../components';
import { useNotifications, useUserSettings, useMailSettings, useEventManager, useLoading, useApi } from '../../hooks';
import { SettingsSectionWide } from '../account';

import ComposerModeRadios from './ComposerModeRadios';
import ViewLayoutRadios from './ViewLayoutRadios';
import DensityRadios from './DensityRadios';
import SettingsLayout from '../account/SettingsLayout';
import SettingsLayoutLeft from '../account/SettingsLayoutLeft';
import SettingsLayoutRight from '../account/SettingsLayoutRight';

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
                    <SettingsLayout>
                        <SettingsLayoutLeft>
                            <label htmlFor="layoutMode" className="mb1 text-semibold">
                                <span className="mr0-5">
                                    {c('Label').t`Inbox`}
                                </span>
                                <Info
                                    url="https://protonmail.com/support/knowledge-base/change-inbox-layout/"
                                    title={c('Tooltip').t`Set the default layout for your Inbox.`}
                                />
                            </label>
                        </SettingsLayoutLeft>
                        <SettingsLayoutRight>
                            <ViewLayoutRadios
                                id="layoutMode"
                                viewLayout={ViewLayout}
                                onChange={(value) => withLoadingViewLayout(handleChangeViewLayout(value))}
                                loading={loadingViewLayout}
                            />
                        </SettingsLayoutRight>
                    </SettingsLayout>

                    <SettingsLayout className="flex-column">
                        <SettingsLayoutLeft>
                            <label htmlFor="composerMode" className="mb1 text-semibold">
                                <span className="mr0-5">{c('Label').t`Composer`}</span>
                                <Info
                                    url="https://protonmail.com/support/knowledge-base/composer/"
                                    title={c('Tooltip').t`Set the default Composer popup size as small or full screen.`}
                                />
                            </label>
                        </SettingsLayoutLeft>
                        <SettingsLayoutRight>
                            <ComposerModeRadios
                                id="composerMode"
                                composerMode={ComposerMode}
                                onChange={(value) => withLoadingComposerMode(handleChangeComposerMode(value))}
                                loading={loadingComposerMode}
                            />
                        </SettingsLayoutRight>
                    </SettingsLayout>

                    <SettingsLayout className="flex-column">
                        <SettingsLayoutLeft>
                            <label htmlFor="density" className="mb1 text-semibold">
                                {c('Label').t`Density`}
                            </label>
                        </SettingsLayoutLeft>
                        <SettingsLayoutRight>
                            <DensityRadios
                                density={Density}
                                onChange={(value) => withLoadingDensity(handleChangeDensity(value))}
                                loading={loadingDensity}
                                id="density"
                            />
                        </SettingsLayoutRight>
                    </SettingsLayout>
                </>
            )}
        </SettingsSectionWide>
    );
};

export default LayoutsSection;
