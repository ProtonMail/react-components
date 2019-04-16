import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    Modal,
    ContentModal,
    FooterModal,
    Button,
    ResetButton,
    PrimaryButton,
    Row,
    Label,
    Input,
    PasswordInput,
    Alert,
    Select,
    useStep,
    useUser,
    useOrganization,
    useApiWithoutResult,
    useMembers,
    useEventManager
} from 'react-components';
import { GIGA } from 'proton-shared/lib/constants';
import { range } from 'proton-shared/lib/helpers/array';
import humanSize from 'proton-shared/lib/helpers/humanSize';
import { updateOrganizationName } from 'proton-shared/lib/api/organization';
import { updateVPN, updateQuota } from 'proton-shared/lib/api/members';

const SetupOrganizationModal = ({ show, onClose }) => {
    const [members = []] = useMembers();
    const { call } = useEventManager();
    const { ID: currentMemberID } = members.find(({ Self }) => Self) || {};
    const { request: requestUpdateOrganizationName } = useApiWithoutResult(updateOrganizationName);
    const { request: requestUpdateVPN } = useApiWithoutResult(updateVPN);
    const { request: requestUpdateQuota } = useApiWithoutResult(updateQuota);
    const [{ MaxSpace, MaxVPN }] = useOrganization();
    const [{ hasPaidVpn }] = useUser();
    const [model, setModel] = useState({
        name: '',
        password: '',
        confirm: '',
        storage: 5 * GIGA,
        vpn: 3
    });
    const { step, next, previous } = useStep();
    const [loading, setLoading] = useState(false);
    const storageOptions = range(0, MaxSpace, GIGA).map((value) => ({ text: `${humanSize(value, 'GB')}`, value }));
    const vpnOptions = range(0, MaxVPN).map((value) => ({ text: value, value }));
    const handleChange = (key) => ({ target }) => setModel({ ...model, [key]: target.value });
    const STEPS = [
        {
            title: c('Title').t`Name your organization`,
            section: (
                <Row>
                    <Label>{c('Label').t`Organization name`}</Label>
                    <Input
                        placeholder={c('Placeholder').t`Pick a name`}
                        value={model.name}
                        onChange={handleChange('name')}
                        required
                    />
                </Row>
            ),
            async onSubmit() {
                try {
                    setLoading(true);
                    await requestUpdateOrganizationName(model.name);
                    setLoading(false);
                    next();
                } catch (err) {
                    setLoading(false);
                }
            }
        },
        {
            title: c('Title').t`Set organization keys`,
            section: (
                <>
                    <Alert>{c('Info')
                        .t`This will create an encryption key for your organization. 4096-bit keys only work on high performance computers, for most users, we recommend using 2048-bit keys.`}</Alert>
                    <Row>TODO: import component</Row>
                </>
            ),
            onSubmit() {
                // TODO
                next();
            }
        },
        {
            title: c('Title').t`Set organization password`,
            section: (
                <>
                    <Alert>{c('Info')
                        .t`Your organization password can be shared with other users you wish to give administrative privileges. It is also an emergency recovery code to gain access to your organization in case you lose access to your account. Please save this password and keep it safe.`}</Alert>
                    <Alert type="warning">
                        {c('Info')
                            .t`Do NOT forget this password. If you forget it, you will not be able to login or decrypt your messages.`}
                        <br />
                        {c('Info')
                            .t`Save your password somewhere safe. Click on icon to confirm you that have typed your password correctly.`}
                    </Alert>
                    <Row>
                        <Label htmlFor="orgPassword">{c('Label').t`Organization password`}</Label>
                        <PasswordInput
                            id="orgPassword"
                            placeholder={c('Placeholder').t`Password`}
                            value={model.password}
                            onChange={handleChange('password')}
                            required
                        />
                    </Row>
                    <Row>
                        <Label htmlFor="confirmPassword">{c('Label').t`Confirm password`}</Label>
                        <PasswordInput
                            id="confirmPassword"
                            placeholder={c('Placeholder').t`Confirm`}
                            value={model.confirm}
                            onChange={handleChange('confirm')}
                            required
                        />
                    </Row>
                </>
            ),
            onSubmit() {
                // TODO
                next();
            }
        },
        {
            title: c('Title').t`Allocate storage`,
            section: (
                <>
                    <Alert>{c('Info')
                        .t`Currently all available storage is allocated to the administrator account. Please reduce the admin account allocation to free up space for additional users. You can increase the total storage at any time by upgrading your account.`}</Alert>
                    <Row>
                        <Label htmlFor="storage">{c('Label').t`Account storage`}</Label>
                        <Select
                            id="storage"
                            options={storageOptions}
                            value={model.storage}
                            onChange={handleChange('storage')}
                            required
                        />
                    </Row>
                </>
            ),
            async onSubmit() {
                await requestUpdateQuota(currentMemberID, model.storage);
                if (hasPaidVpn) {
                    return next();
                }
                await call();
                onClose();
            }
        }
    ];

    if (hasPaidVpn) {
        STEPS.push({
            title: c('Title').t`Allocate VPN connections`,
            section: (
                <>
                    <Alert>{c('Info')
                        .t`Currently all available VPN connections are allocated to the administrator account. Please select the number of connections you want to reserve for additional users.`}</Alert>
                    <Row>
                        <Label htmlFor="vpn">{c('Label').t`VPN Connections`}</Label>
                        <Select
                            id="vpn"
                            options={vpnOptions}
                            value={model.vpn}
                            onChange={handleChange('vpn')}
                            required
                        />
                    </Row>
                </>
            ),
            async onSubmit() {
                await requestUpdateVPN(currentMemberID, model.vpn);
                await call();
                onClose();
            }
        });
    }

    return (
        <Modal show={show} onClose={onClose} title={STEPS[step].title}>
            <ContentModal onSubmit={STEPS[step].onSubmit} onReset={onClose} loading={loading}>
                {STEPS[step].section}
                <FooterModal>
                    {step ? (
                        <Button onClick={previous}>{c('Action').t`Back`}</Button>
                    ) : (
                        <ResetButton>{c('Action').t`Close`}</ResetButton>
                    )}
                    <PrimaryButton type="submit">
                        {STEPS.length - 1 === step ? c('Action').t`Activate` : c('Action').t`Next`}
                    </PrimaryButton>
                </FooterModal>
            </ContentModal>
        </Modal>
    );
};

SetupOrganizationModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default SetupOrganizationModal;
