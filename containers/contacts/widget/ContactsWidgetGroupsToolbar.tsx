import React, { ChangeEvent } from 'react';
import { c, msgid } from 'ttag';

import { Recipient, SimpleMap } from 'proton-shared/lib/interfaces';
import { ContactEmail } from 'proton-shared/lib/interfaces/contacts';
import { Checkbox, Icon, Button, Tooltip } from '../../../components';
import useContactList from '../useContactList';

enum CONTACT_WIDGET_TABS {
    CONTACTS,
    GROUPS,
}

interface CustomAction {
    render: ({
        contactList,
    }: {
        contactList?: ReturnType<typeof useContactList>;
        groupsEmailsMap?: SimpleMap<ContactEmail[]>;
        recipients?: Recipient[];
    }) => React.ReactNode;
    tabs: CONTACT_WIDGET_TABS[];
}

interface Props {
    allChecked: boolean;
    selectedCount: number;
    numberOfRecipients: number;
    onCheckAll: (checked: boolean) => void;
    onCompose?: () => void;
    onCreate: () => void;
    onDelete: () => void;
    customActions: CustomAction[];
    groupsEmailsMap: SimpleMap<ContactEmail[]>;
    recipients: Recipient[];
}

const ContactsWidgetGroupsToolbar = ({
    allChecked,
    selectedCount,
    numberOfRecipients,
    onCheckAll,
    onCompose,
    onCreate,
    onDelete,
    customActions,
    groupsEmailsMap,
    recipients,
}: Props) => {
    const handleCheck = ({ target }: ChangeEvent<HTMLInputElement>) => onCheckAll(target.checked);
    const noSelection = !selectedCount || !numberOfRecipients;
    const deleteText = noSelection
        ? c('Action').t`Delete contact group`
        : c('Action').ngettext(
              msgid`Delete ${selectedCount} contact group`,
              `Delete ${selectedCount} contacts groups`,
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
                    <Button icon className="inline-flex mr0-5 pt0-5 pb0-5" onClick={onCompose} disabled={noSelection}>
                        <Icon name="email" alt={c('Action').t`Compose`} />
                    </Button>
                </Tooltip>
            ) : null}
            {customActions.map((action) => action.render({ groupsEmailsMap, recipients }))}
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
