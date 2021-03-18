import React from 'react';
import { c } from 'ttag';

import { COMPOSER_MODE } from 'proton-shared/lib/constants';

import composerPopUpSvg from 'design-system/assets/img/pm-images/composer-popup.svg';
import composerMaximizedSvg from 'design-system/assets/img/pm-images/composer-maximized.svg';

import { RadioCards } from '../../components';

const { POPUP, MAXIMIZED } = COMPOSER_MODE;

interface Props {
    composerMode: COMPOSER_MODE;
    onChange: (composerMode: COMPOSER_MODE) => void;
    loading: boolean;
    id: string;
}

const ComposerModeRadios = ({ composerMode, onChange, loading, id, ...rest }: Props) => {
    const radioCardPopup = {
        value: POPUP,
        checked: composerMode === POPUP,
        id: 'popupRadio',
        disabled: loading,
        name: 'composerMode',
        label: c('Label to change composer mode').t`Popup`,
        onChange() {
            onChange(POPUP);
        },
        children: <img alt="Popup" src={composerPopUpSvg} />,
    };
    const radioCardMaximized = {
        value: MAXIMIZED,
        checked: composerMode === MAXIMIZED,
        id: 'maximizedRadio',
        disabled: loading,
        name: 'composerMode',
        label: c('Label to change composer mode').t`Maximized`,
        onChange() {
            onChange(MAXIMIZED);
        },
        children: <img alt="Maximized" src={composerMaximizedSvg} />,
    };

    return <RadioCards list={[radioCardPopup, radioCardMaximized]} id={id} {...rest} />;
};

export default ComposerModeRadios;
