import React from 'react';
import { c } from 'ttag';
import {
    Block,
    SubTitle,
    Alert,
    PrimaryButton,
    Loader,
    Table,
    TableRow,
    TableHeader,
    TableBody,
    useMembers,
    useNotifications,
    useModals,
    useOrganization,
    useOrganizationKey
} from 'react-components';
import { USER_ROLES } from 'proton-shared/lib/constants';

import ChangeOrganizationPasswordModal from './ChangeOrganizationPasswordModal';
import ChangeOrganizationKeysModal from './ChangeOrganizationKeysModal';
import ReactivateOrganizationKeysModal from './ReactivateOrganizationKeysModal';
import { describe } from 'proton-shared/lib/keys/keysAlgorithm';

const OrganizationSection = () => {
    const [organization, loadingOrganization] = useOrganization();
    const [members, loadingMembers] = useMembers();
    const { createModal } = useModals();
    const { createNotification } = useNotifications();
    const [organizationKey, loadingOrganizationKey] = useOrganizationKey(organization);

    // Organization is not setup.
    if (!organization.HasKeys) {
        return null;
    }

    const title = <SubTitle>{c('Title').t`Password & key`}</SubTitle>;

    if (loadingOrganizationKey || loadingOrganization || loadingMembers) {
        return (
            <>
                {title}
                <Loader />
            </>
        );
    }

    // The member of an organization might not have setup the key for him.
    const hasKey = !!organizationKey;
    const isOrganizationKeyActive = hasKey && organizationKey.isDecrypted();
    const isOrganizationKeyInactive = hasKey && !organizationKey.isDecrypted();

    const hasOtherAdmins = members.some(({ Role, Self }) => Self !== 1 && Role === USER_ROLES.ADMIN_ROLE);

    const handleOpenOrganizationKeys = () => {
        const nonPrivateMembers = members.filter(({ Private }) => Private === 0);

        if (nonPrivateMembers.length > 0 && !isOrganizationKeyActive) {
            return createNotification(
                c('Error').t`You must privatize all sub-accounts before generating new organization keys`
            );
        }

        createModal(
            <ChangeOrganizationKeysModal
                hasOtherAdmins={hasOtherAdmins}
                organizationKey={organizationKey}
                nonPrivateMembers={nonPrivateMembers}
            />
        );
    };

    return (
        <>
            {title}
            <Alert learnMore="todo">{c('Info')
                .t`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium enim nec massa fringilla, ac ultrices tortor posuere. Fusce sed quam vitae arcu pharetra congue. Quisque in elementum nibh.`}</Alert>
            <Block>
                {isOrganizationKeyActive && (
                    <PrimaryButton
                        onClick={() =>
                            createModal(
                                <ChangeOrganizationPasswordModal
                                    hasOtherAdmins={hasOtherAdmins}
                                    organizationKey={organizationKey}
                                />
                            )
                        }
                        className="mr1"
                    >
                        {c('Action').t`Change password`}
                    </PrimaryButton>
                )}
                <PrimaryButton onClick={handleOpenOrganizationKeys} className="mr1">
                    {c('Action').t`Change organization keys`}
                </PrimaryButton>
                {isOrganizationKeyInactive && (
                    <PrimaryButton
                        onClick={() => createModal(<ReactivateOrganizationKeysModal mode="reactivate" />)}
                        className="mr1"
                    >
                        {c('Action').t`Reactivate organization key`}
                    </PrimaryButton>
                )}
                {!hasKey && (
                    <PrimaryButton
                        onClick={() => createModal(<ReactivateOrganizationKeysModal mode="activate" />)}
                        className="mr1"
                    >
                        {c('Action').t`Activate organization key`}
                    </PrimaryButton>
                )}
                {hasKey && (
                    <Table>
                        <TableHeader cells={[c('Header').t`Organization key fingerprint`, c('Header').t`Key type`]} />
                        <TableBody colSpan={2}>
                            <TableRow
                                cells={[
                                    <code key={1} className="mw100 inbl ellipsis">
                                        {organizationKey.getFingerprint()}
                                    </code>,
                                    describe(organizationKey.getAlgorithmInfo())
                                ]}
                            />
                        </TableBody>
                    </Table>
                )}
            </Block>
        </>
    );
};

export default OrganizationSection;
