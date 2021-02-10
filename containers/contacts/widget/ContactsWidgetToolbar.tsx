import React, { ChangeEvent } from 'react';
import { c } from 'ttag';
import { Button, Checkbox, Tooltip } from '../../../components';

interface Props {
    allChecked: boolean;
    oneSelected: boolean;
    onCheckAll: (checked: boolean) => void;
    onCompose: () => void;
    onForward: () => void;
    onDelete: () => void;
    onCreate: () => void;
}

const ContactsWidgetToolbar = ({
    allChecked,
    oneSelected,
    onCheckAll,
    onCompose,
    onForward,
    onDelete,
    onCreate,
}: Props) => {
    const handleCheck = ({ target }: ChangeEvent<HTMLInputElement>) => onCheckAll(target.checked);

    return (
        <div>
            <Tooltip title={allChecked ? c('Action').t`Deselect all` : c('Action').t`Select all`}>
                <Checkbox checked={allChecked} onChange={handleCheck} />
            </Tooltip>
            <Tooltip title={c('Action').t`Compose`}>
                <Button icon="email" onClick={onCompose} disabled={!oneSelected} />
            </Tooltip>
            <Tooltip title={c('Action').t`Forward as attachment`}>
                <Button icon="forward" onClick={onForward} disabled={!oneSelected} />
            </Tooltip>
            <Tooltip title={c('Action').t`Delete`}>
                <Button icon="trash" onClick={onDelete} disabled={!oneSelected} />
            </Tooltip>
            <Tooltip title={c('Action').t`Add new contact`}>
                <Button icon="contact-add" className="button--primary" onClick={onCreate} />
            </Tooltip>
        </div>
    );
};

export default ContactsWidgetToolbar;
