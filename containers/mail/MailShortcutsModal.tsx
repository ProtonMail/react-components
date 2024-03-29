import React from 'react';
import { c } from 'ttag';
import { APPS } from 'proton-shared/lib/constants';
import { getAppName } from 'proton-shared/lib/apps/helper';
import { getShortcuts } from 'proton-shared/lib/shortcuts/mail';
import { useMailSettings } from '../../hooks';
import { classnames } from '../../helpers';
import { Field, Row, ShortcutsSectionView, Alert, Label, ShortcutsModal } from '../../components';
import ShortcutsToggle from '../general/ShortcutsToggle';

interface Props {
    onClose?: () => void;
}

const MailShortCutsModal = ({ ...rest }: Props) => {
    const appName = getAppName(APPS.PROTONMAIL);
    const title = c('Title').t`${appName} Keyboard Shortcuts`;
    const [{ Shortcuts } = { Shortcuts: 0 }] = useMailSettings();
    const mailShortcuts = getShortcuts();
    const alwaysOnSections = mailShortcuts.filter((section) => section.alwaysActive);
    const shortcutEnabledSections = mailShortcuts.filter((section) => !section.alwaysActive);

    return (
        <ShortcutsModal title={title} {...rest}>
            <Alert className="mb1">
                {c('Info')
                    .t`Basic navigation and actions remain available regardless of keyboard shortcuts being active or not in the settings.`}
            </Alert>
            <div className="list-2columns on-mobile-list-1column mr-2 on-mobile-mr0">
                {alwaysOnSections.map((section) => {
                    return <ShortcutsSectionView key={section.name} {...section} />;
                })}
            </div>

            <hr className="mt2 mb2 border-bottom" />
            <Row className="mb2">
                <Label htmlFor="toggle-shortcuts" className="mr1">{c('Label').t`Keyboard shortcuts`}</Label>
                <Field className="pt0-5">
                    <ShortcutsToggle id="toggle-shortcuts" />
                </Field>
            </Row>
            <div
                className={classnames([
                    'list-2columns on-mobile-list-1column mr-2 on-mobile-mr0',
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
