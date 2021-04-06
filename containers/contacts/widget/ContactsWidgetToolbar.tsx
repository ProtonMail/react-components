import React, { ChangeEvent } from 'react';
import { c, msgid } from 'ttag';
import { APPS } from 'proton-shared/lib/constants';

import { Checkbox, Icon, Button, Tooltip } from '../../../components';
import { useConfig } from '../../../hooks';

interface Props {
    allChecked: boolean;
    selectedCount: number;
    onCheckAll: (checked: boolean) => void;
    onCompose: () => void;
    onForward: () => void;
    onDelete: () => void;
    onCreate: () => void;
    onMerge: () => void;
}

const ContactsWidgetToolbar = ({
    allChecked,
    selectedCount,
    onCheckAll,
    onCompose,
    onForward,
    onDelete,
    onCreate,
    onMerge,
}: Props) => {
    const { APP_NAME } = useConfig();
    const isMailApp = APP_NAME === APPS.PROTONMAIL;
    const handleCheck = ({ target }: ChangeEvent<HTMLInputElement>) => onCheckAll(target.checked);
    const noSelection = !selectedCount;
    const canMerge = selectedCount > 1;
    const deleteText = noSelection
        ? c('Action').t`Delete contact`
        : c('Action').ngettext(
              msgid`Delete ${selectedCount} contact`,
              `Delete ${selectedCount} contacts`,
              selectedCount
          );

    return (
        <div className="flex flex-items-align-center">
            <Tooltip title={allChecked ? c('Action').t`Deselect all` : c('Action').t`Select all`}>
                <span className="mr1 flex">
                    <Checkbox
                        id="id_contact-widget-select-all"
                        className="ml0-5"
                        checked={allChecked}
                        onChange={handleCheck}
                    />
                    <label htmlFor="id_contact-widget-select-all" className="sr-only">
                        {allChecked ? c('Action').t`Deselect all` : c('Action').t`Select all`}
                    </label>
                </span>
            </Tooltip>
            {isMailApp ? (
                <>
                    <Tooltip title={c('Action').t`Compose`}>
                        <Button
                            icon
                            className="mr0-5 inline-flex pt0-5 pb0-5"
                            onClick={onCompose}
                            disabled={noSelection}
                            title={c('Action').t`Compose`}
                        >
                            <Icon name="email" />
                        </Button>
                    </Tooltip>
                    <Tooltip title={c('Action').t`Forward as attachment`}>
                        <Button
                            icon
                            className="mr0-5 inline-flex pt0-5 pb0-5"
                            onClick={onForward}
                            disabled={noSelection}
                            title={c('Action').t`Forward as attachment`}
                        >
                            <Icon name="forward" />
                        </Button>
                    </Tooltip>
                </>
            ) : null}
            <Tooltip title={c('Action').t`Merge contacts`}>
                <Button
                    icon
                    className="mr0-5 inline-flex pt0-5 pb0-5"
                    onClick={onMerge}
                    disabled={!canMerge}
                    title={c('Action').t`Merge contacts`}
                >
                    <Icon name="merge" />
                </Button>
            </Tooltip>
            <Tooltip title={deleteText}>
                <Button
                    icon
                    className="inline-flex pt0-5 pb0-5"
                    onClick={onDelete}
                    disabled={noSelection}
                    title={deleteText}
                >
                    <Icon name="trash" />
                </Button>
            </Tooltip>
            <Tooltip title={c('Action').t`Add new contact`}>
                <Button
                    icon
                    color="norm"
                    className="mlauto inline-flex pt0-5 pb0-5"
                    onClick={onCreate}
                    title={c('Action').t`Add new contact`}
                >
                    <Icon name="contact-add" />
                </Button>
            </Tooltip>
        </div>
    );
};

export default ContactsWidgetToolbar;
