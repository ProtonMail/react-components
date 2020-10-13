import React from 'react';
import { c } from 'ttag';
import { APP_NAMES, APPS_CONFIGURATION } from 'proton-shared/lib/constants';
import { noop } from 'proton-shared/lib/helpers/function';

import { classnames } from '../../helpers';
import { FormModal } from '../../components';
import { getShortcutsForApp } from '../../components/shortcuts/constants';

interface Shortcut {
    name: string;
    keys: string | string[];
}

interface ShortcutSection {
    name: string;
    shortcuts: Shortcut[];
}

interface Props {
    app: APP_NAMES;
    onClose?: () => void;
}

const ShortcutsModal = ({ app, onClose = noop, ...rest }: Props) => {
    const shortcuts = getShortcutsForApp(app);

    const sectionRenderer = ({ name, shortcuts }: ShortcutSection) => (
        <div key={name} className="mb1">
            <h5>{name}</h5>
            {shortcuts.length > 0 && (
                <ul className="unstyled">
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

    return (
        <FormModal
            title={c('Title').t`${APPS_CONFIGURATION[app].name} Shortcuts`}
            close={c('Action').t`Close`}
            hasSubmit={false}
            onClose={onClose}
            {...rest}
        >
            {shortcuts.map(sectionRenderer)}
        </FormModal>
    );
};

export default ShortcutsModal;
