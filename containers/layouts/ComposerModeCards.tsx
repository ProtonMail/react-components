import React from 'react';
import { c } from 'ttag';

import { COMPOSER_MODE } from 'proton-shared/lib/constants';

import composerPopUpSvg from 'design-system/assets/img/pm-images/composer-popup.svg';
import composerMaximizedSvg from 'design-system/assets/img/pm-images/composer-maximized.svg';

import { LayoutCards } from '../../components';

const { POPUP, MAXIMIZED } = COMPOSER_MODE;

interface Props {
    composerMode: COMPOSER_MODE;
    onChange: (composerMode: COMPOSER_MODE) => void;
    loading: boolean;
    id: string;
    describedByID: string;
    src: string;
}

const ComposerModeCards = ({ composerMode, onChange, loading, id, describedByID, ...rest }: Props) => {
    const layoutCardPopup = {
        value: POPUP,
        selected: composerMode === POPUP,
        id: 'popupRadio',
        disabled: loading,
        name: 'composerMode',
        label: c('Label to change composer mode').t`Normal`,
        onChange() {
            onChange(POPUP);
        },
        src: composerPopUpSvg,
        describedByID,
    };
    const layoutCardMaximized = {
        value: MAXIMIZED,
        selected: composerMode === MAXIMIZED,
        id: 'maximizedRadio',
        disabled: loading,
        name: 'composerMode',
        label: c('Label to change composer mode').t`Maximized`,
        onChange() {
            onChange(MAXIMIZED);
        },
        src: composerMaximizedSvg,
        describedByID,
    };

    return <LayoutCards list={[layoutCardPopup, layoutCardMaximized]} describedByID={describedByID} {...rest} />;
};

export default ComposerModeCards;
