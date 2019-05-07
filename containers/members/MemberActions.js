import React from 'react';
import PropTypes from 'prop-types';
import {
    ConfirmModal,
    useModal,
    Alert,
    useApiWithoutResult,
    DropdownActions,
    useNotifications,
    useEventManager
} from 'react-components';
import { c } from 'ttag';
import { removeMember, updateRole, privatizeMember } from 'proton-shared/lib/api/members';
import { MEMBER_PRIVATE, MEMBER_ROLE } from 'proton-shared/lib/constants';

import EditMemberModal from './EditMemberModal';

const MemberActions = ({ member, organization }) => {
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const { request: requestRemoveMember } = useApiWithoutResult(removeMember);
    const { request: requestUpdateRole } = useApiWithoutResult(updateRole);
    const { request: requestPrivatize } = useApiWithoutResult(privatizeMember);
    const { isOpen: showEdit, open: openEdit, close: closeEdit } = useModal();
    const { isOpen: showDelete, open: openDelete, close: closeDelete } = useModal();

    const handleConfirmDelete = async () => {
        await requestRemoveMember(member.ID);
        await call();
        closeDelete();
        createNotification({ text: c('Success message').t`User deleted` });
    };

    const login = () => {
        // TODO
    };

    const makeAdmin = async () => {
        await requestUpdateRole(member.ID, MEMBER_ROLE.ORGANIZATION_OWNER);
        await call();
        createNotification({ text: c('Success message').t`Role updated` });
    };

    const revokeAdmin = async () => {
        await requestUpdateRole(member.ID, MEMBER_ROLE.ORGANIZATION_MEMBER);
        await call();
        createNotification({ text: c('Success message').t`Role updated` });
    };

    const makePrivate = async () => {
        await requestPrivatize(member.ID);
        await call();
        createNotification({ text: c('Success message').t`Status updated` });
    };

    const list = [];

    if (organization.HasKeys) {
        list.push({
            text: c('Member action').t`Edit`,
            type: 'button',
            onClick: openEdit
        });
    }

    if (!member.Self) {
        list.push({
            text: c('Member action').t`Delete`,
            type: 'button',
            onClick: openDelete
        });
    }

    if (!member.Self && member.Role === MEMBER_ROLE.ORGANIZATION_MEMBER) {
        list.push({
            text: c('Member action').t`Make admin`,
            type: 'button',
            onClick: makeAdmin
        });
    }

    if (!member.Self && member.Role === MEMBER_ROLE.ORGANIZATION_OWNER) {
        list.push({
            text: c('Member action').t`Revoke admin`,
            type: 'button',
            onClick: revokeAdmin
        });
    }

    // TODO fill member.Keys.length
    if (!member.Self && member.Private === MEMBER_PRIVATE.READABLE && member.Keys.length && member.addresses.length) {
        list.push({
            text: c('Member action').t`Login`,
            type: 'button',
            onClick: login
        });
    }

    if (member.Private === MEMBER_PRIVATE.READABLE) {
        list.push({
            text: c('Member action').t`Make private`,
            type: 'button',
            onClick: makePrivate
        });
    }

    return (
        <>
            <DropdownActions list={list} className="pm-button--small" />
            {showEdit ? <EditMemberModal onClose={closeEdit} member={member} /> : null}
            {showDelete ? (
                <ConfirmModal onClose={closeDelete} onConfirm={handleConfirmDelete}>
                    <Alert>{c('Info')
                        .t`Are you sure you want to permanently delete this user? The inbox and all addresses associated with this user will be deleted.`}</Alert>
                </ConfirmModal>
            ) : null}
        </>
    );
};

MemberActions.propTypes = {
    member: PropTypes.object.isRequired,
    organization: PropTypes.object.isRequired
};

export default MemberActions;
