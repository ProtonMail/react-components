import React from 'react';
import { c } from 'ttag';
import { RadioCards, useApiWithoutResult, useMailSettings, useEventManager } from 'react-components';
import { updateComposerMode } from 'proton-shared/lib/api/mailSettings';
import { COMPOSER_MODE } from 'proton-shared/lib/constants';
import composerPopUpSvg from 'design-system/assets/img/design-system-website/popup.svg';
import composerMaximizedSvg from 'design-system/assets/img/design-system-website/popup.svg';

const { POPUP, MAXIMIZED } = COMPOSER_MODE;

const ComposerModeRadios = () => {
    const [{ ComposerMode }] = useMailSettings();
    const { call } = useEventManager();
    const { request, loading } = useApiWithoutResult(updateComposerMode);

    const handleChange = (mode) => async () => {
        await request(mode);
        call();
    };

    const radioCardPopup = {
        value: POPUP,
        checked: ComposerMode === POPUP,
        id: 'popupRadio',
        disabled: loading,
        name: 'composerMode',
        label: c('Label to change composer mode').t`Popup`,
        onChange: handleChange(POPUP),
        children: <img alt="Popup" src={composerPopUpSvg} />
    };
    const radioCardMaximized = {
        value: MAXIMIZED,
        checked: ComposerMode === MAXIMIZED,
        id: 'maximizedRadio',
        disabled: loading,
        name: 'composerMode',
        label: c('Label to change composer mode').t`Maximized`,
        onChange: handleChange(MAXIMIZED),
        children: <img alt="Maximized" src={composerMaximizedSvg} />
    };

    return <RadioCards list={[radioCardPopup, radioCardMaximized]} />;
};

export default ComposerModeRadios;
