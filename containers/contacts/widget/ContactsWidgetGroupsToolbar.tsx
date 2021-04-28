import React, { ChangeEvent } from 'react';
import { c, msgid } from 'ttag';

import { Checkbox, Icon, Button, Tooltip } from '../../../components';

interface Props {
    allChecked: boolean;
    selectedCount: number;
    numberOfRecipients: number;
    onCheckAll: (checked: boolean) => void;
    onCompose?: () => void;
    onCreateEvent?: () => void;
    onCreate: () => void;
    onDelete: () => void;
}

const ContactsWidgetGroupsToolbar = ({
    allChecked,
    selectedCount,
    numberOfRecipients,
    onCheckAll,
    onCompose,
    onCreateEvent,
    onCreate,
    onDelete,
}: Props) => {
    const handleCheck = ({ target }: ChangeEvent<HTMLInputElement>) => onCheckAll(target.checked);
    const noContactInSelected = !selectedCount || !numberOfRecipients;
    const noSelection = !selectedCount;
    const deleteText = noSelection
        ? c('Action').t`Delete contact group`
        : // translator: the variable is a positive integer (written in digits) always greater or equal to 1
          c('Action').ngettext(
              msgid`Delete ${selectedCount} contact group`,
              `Delete ${selectedCount} contact groups`,
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
            {onCompose ? (
                <Tooltip title={c('Action').t`Compose`}>
                    <Button
                        icon
                        className="inline-flex mr0-5 pt0-5 pb0-5"
                        onClick={onCompose}
                        disabled={noContactInSelected}
                    >
                        <Icon name="email" alt={c('Action').t`Compose`} />
                    </Button>
                </Tooltip>
            ) : null}
            {onCreateEvent ? (
                <>
                    <Tooltip title={c('Action').t`Create event`}>
                        <Button
                            icon
                            className="mr0-5 inline-flex pt0-5 pb0-5"
                            onClick={onCreateEvent}
                            disabled={noSelection}
                            title={c('Action').t`Create event`}
                        >
                            <Icon name="calendar" />
                        </Button>
                    </Tooltip>
                </>
            ) : null}
            <Tooltip>
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
            <Tooltip title={c('Action').t`Add new group`}>
                <Button icon color="norm" className="mlauto inline-flex pt0-5 pb0-5" onClick={onCreate}>
                    <Icon name="contacts-group-add" alt={c('Action').t`Add new group`} />
                </Button>
            </Tooltip>
        </div>
    );
};

export default ContactsWidgetGroupsToolbar;
