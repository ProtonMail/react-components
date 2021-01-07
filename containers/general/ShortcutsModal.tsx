import React from 'react';
import { c } from 'ttag';
import { APP_NAMES, APPS_CONFIGURATION } from 'proton-shared/lib/constants';
import { noop } from 'proton-shared/lib/helpers/function';
import { getShortcutsForApp } from 'proton-shared/lib/shortcuts/constants';

import { classnames } from '../../helpers';
import { Alert, FormModal, AppLink } from '../../components';
import { useMailSettings, useActiveBreakpoint } from '../../hooks';

import './ShortcutsModal.scss';

interface Shortcut {
    name: string;
    keys: string | string[];
}

interface ShortcutSection {
    name: string;
    shortcuts: Shortcut[];
    alwaysActive?: boolean;
}

interface Props {
    app: APP_NAMES;
    onClose?: () => void;
}

const ShortcutsModal = ({ app, onClose = noop, ...rest }: Props) => {
    const { isNarrow } = useActiveBreakpoint();
    const [{ Hotkeys } = { Hotkeys: 0 }] = useMailSettings();

    const shortcutSections: ShortcutSection[] = getShortcutsForApp(app);

    const alwaysOnSections = shortcutSections.filter((section) => section.alwaysActive);
    const shortcutEnabledSections = shortcutSections.filter((section) => !section.alwaysActive);

    const sectionRenderer = ({ name, shortcuts }: ShortcutSection) => (
        <div key={name} className="pr2 onmobile-pr0 mb2">
            <h2 className="h5 mb0-5">{name}</h2>
            {shortcuts.length > 0 && (
                <ul className="unstyled mt1 onmobile-pr0">
                    {shortcuts.map(({ name, keys }: Shortcut) => (
                        <li key={name} className="flex flex-items-center flex-spacebetween mb0-5">
                            <span>{name}</span>
                            {typeof keys === 'string' ? (
                                <kbd>{keys}</kbd>
                            ) : (
                                <span>
                                    {keys.map((k: string, i: number) => (
                                        <kbd key={`${name} - ${k}`} className={classnames([i > 0 && 'ml0-5'])}>
                                            {k}
                                        </kbd>
                                    ))}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    const settingsLink = (
        <AppLink to="/settings/general#shortcuts" key="settings-link" onClick={onClose}>
            {c('Link').t`general settings.`}
        </AppLink>
    );

    return (
        <FormModal
            title={c('Title').t`${APPS_CONFIGURATION[app].name} Keyboard Shortcuts`}
            close={c('Action').t`Close`}
            hasSubmit={false}
            onClose={onClose}
            className="shortcut-modal"
            {...rest}
        >
            <Alert className="mb1">
                {c('Info')
                    .t`Basic navigation and actions remain available regardless of keyboard shortcuts being active or not in the settings.`}
            </Alert>
            <div
                className="list-2columns onmobile-list-1column"
                // to compensate for the right padding of the right column sections
                style={!isNarrow ? { marginRight: '-2em' } : undefined}
            >
                {alwaysOnSections.map(sectionRenderer)}
            </div>

            <hr className="mt2 mb2 border-bottom" />

            <Alert>
                {Hotkeys
                    ? c('Info').t`Your keyboard shortcuts are active`
                    : c('Info').jt`To activate your keyboard shortcuts, go to ${settingsLink}`}
            </Alert>
            <div
                className={classnames(['list-2columns onmobile-list-1column', !Hotkeys && 'opacity-50'])}
                // to compensate for the right padding of the right column sections
                style={!isNarrow ? { marginRight: '-2em' } : undefined}
            >
                {shortcutEnabledSections.map(sectionRenderer)}
            </div>
        </FormModal>
    );
};

export default ShortcutsModal;
