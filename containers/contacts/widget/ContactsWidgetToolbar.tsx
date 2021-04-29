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
    noEmailsContactCount: number;
    onCheckAll: (checked: boolean) => void;
    onCompose?: () => void;
    onForward: () => void;
    onDelete: () => void;
    onCreate: () => void;
    onMerge: () => void;
    customActions: CustomAction[];
    contactList: any;
}

const ContactsWidgetToolbar = ({
    allChecked,
    selectedCount,
    noEmailsContactCount,
    onCheckAll,
    onCompose,
    onForward,
    onDelete,
    onCreate,
    onMerge,
    customActions,
    contactList,
}: Props) => {
    const handleCheck = ({ target }: ChangeEvent<HTMLInputElement>) => onCheckAll(target.checked);
    const noSelection = noEmailsContactCount === selectedCount;
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
            {onCompose ? (
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
            {customActions.map((action) => action.render({ contactList }))}
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
