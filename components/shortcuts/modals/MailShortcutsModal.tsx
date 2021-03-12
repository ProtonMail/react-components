import React from 'react';
import { c } from 'ttag';

import { getShortcuts } from 'proton-shared/lib/shortcuts/mail';
import { APPS } from 'proton-shared/lib/constants';

import { useMailSettings } from '../../../hooks';
import { classnames } from '../../../helpers';
import Title from '../../modal/Title';
import SettingsLink from '../../link/SettingsLink';
import Alert from '../../alert/Alert';
import ShortcutsSectionView from '../ShortcutsSectionView';
import ShortcutsModal from '../ShortcutsModal';

interface Props {
    onClose?: () => void;
}

const MailShortCutsModal = ({ ...rest }: Props) => {
    const questionMark = <kbd key="key">?</kbd>;
    // translator: the variable here is a HTML tag representing the question mark key, here is the complete sentence: "Keyboard Shortcuts (Open with [?])"
    const title = <Title id="modalTitle">{c('Title').jt`Keyboard Shortcuts (Open with ${questionMark})`}</Title>;

    const [{ Shortcuts = 1 } = {}] = useMailSettings();

    const mailShortcuts = getShortcuts();
    const alwaysOnSections = mailShortcuts.filter((section) => section.alwaysActive);
    const shortcutEnabledSections = mailShortcuts.filter((section) => !section.alwaysActive);

    const settingsLink = (
        <SettingsLink
            app={APPS.PROTONMAIL}
            path="/general#shortcuts"
            key="settings-link"
            onClick={() => rest.onClose?.()}
        >
            {c('Link').t`general settings.`}
        </SettingsLink>
    );

    return (
        <ShortcutsModal title={title} {...rest}>
            <Alert className="mb1">
                {c('Info')
                    .t`Basic navigation and actions remain available regardless of keyboard shortcuts being active or not in the settings.`}
            </Alert>
            <div className="list-2columns on-mobile-list-1column mr-2e on-mobile-mr0">
                {alwaysOnSections.map((section) => {
                    return <ShortcutsSectionView key={section.name} {...section} />;
                })}
            </div>

            <hr className="mt2 mb2 border-bottom" />

            <Alert>
                {Shortcuts
                    ? c('Info').t`Your keyboard shortcuts are active`
                    : c('Info').jt`To activate your keyboard shortcuts, go to ${settingsLink}`}
            </Alert>
            <div
                className={classnames([
                    'list-2columns on-mobile-list-1column mr-2e on-mobile-mr0',
                    !Shortcuts && 'opacity-50',
                ])}
            >
                {shortcutEnabledSections.map((section) => {
                    return <ShortcutsSectionView key={section.name} {...section} />;
                })}
            </div>
        </ShortcutsModal>
    );
};

export default MailShortCutsModal;
