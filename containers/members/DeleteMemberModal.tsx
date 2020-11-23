import React, { useState } from 'react';
import { c } from 'ttag';
import { Member } from 'proton-shared/lib/interfaces/Member';

import { FormModal, Alert, Input, Label, ErrorButton } from '../../components';

interface Props {
    member: Member;
    loading: boolean;
    onConfirm: () => Promise<void>;
}

const DeleteMemberModal = ({ member, loading, onConfirm }: Props) => {
    const [username, setUsername] = useState('');
    const title = c('Title').t`Delete "${member.Name}"?`;
    const isValid = username === member.Name;

    const handleSubmit = async () => {
        if (!isValid) {
            return;
        }
        await onConfirm();
    };

    return (
        <FormModal
            title={title}
            loading={loading}
            onSubmit={handleSubmit}
            confirm={<ErrorButton disabled={!isValid} type="submit">{c('Action').t`Delete`}</ErrorButton>}
        >
            <Alert>{c('Info')
                .t`This will permanently delete the data and all email addresses associated with this user.`}</Alert>
            <Alert type="warning">{c('Info')
                .t`To confirm, please enter the name of the user you wish to delete.`}</Alert>
            <Label htmlFor="username-member">{c('Label').t`Username member`}</Label>
            <Input
                id="username-member"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
                placeholder={c('Placeholder').t`Username`}
            />
        </FormModal>
    );
};

export default DeleteMemberModal;
