import React from 'react';
import { c } from 'ttag';
import { RadioCard, useApiWithoutResult, useMailSettings, useEventManager } from 'react-components';
import { updateComposerMode } from 'proton-shared/lib/api/mailSettings';
import { COMPOSER_MODE } from 'proton-shared/lib/constants';
import composerPopUpSvg from 'design-system/assets/img/design-system-website/popup.png';
import composerMaximizedSvg from 'design-system/assets/img/design-system-website/popup.png';

const { POPUP, MAXIMIZED } = COMPOSER_MODE;

const ComposerModeRadios = () => {
    const [{ ComposerMode }] = useMailSettings();
    const { call } = useEventManager();
    const { request, loading } = useApiWithoutResult(updateComposerMode);

    const handleChange = (mode) => async () => {
        await request(mode);
        call();
    };

    return (
        <>
            <RadioCard
                value={POPUP}
                checked={ComposerMode === POPUP}
                id="popupRadio"
                disabled={loading}
                name="composerMode"
                label={c('Label to change composer mode').t`Popup`}
                onChange={handleChange(POPUP)}
            >
                <img alt="Popup" src={composerPopUpSvg} />
            </RadioCard>
            <RadioCard
                value={MAXIMIZED}
                checked={ComposerMode === MAXIMIZED}
                id="maximizedRadio"
                disabled={loading}
                name="composerMode"
                label={c('Label to change composer mode').t`Maximized`}
                onChange={handleChange(MAXIMIZED)}
            >
                <img alt="Maximized" src={composerMaximizedSvg} />
            </RadioCard>
        </>
    );
};

export default ComposerModeRadios;
