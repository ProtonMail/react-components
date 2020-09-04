import React, { useState, useMemo, FormEvent } from 'react';
import { c } from 'ttag';

import {
    getAuthenticationMethod,
    createMailImport,
    createJobImport,
    getMailImportFolders,
    getMailImport,
} from 'proton-shared/lib/api/mailImport';
import { noop } from 'proton-shared/lib/helpers/function';

import { useLoading, useAddresses, useModals, useApi } from '../../../hooks';
import { ConfirmModal, FormModal, Button, PrimaryButton, Alert, ErrorButton } from '../../../components';
import ImportMailWizard from '../../../components/import/ImportMailWizard';

import { TIME_UNIT, IMAP_CONNECTION_ERROR_LABEL } from '../constants';
import { Step, ImportModalModel, IMPORT_ERROR, MailImportFolder, FolderMapping } from '../interfaces';

import ImportStartStep from './steps/ImportStartStep';
import ImportPrepareStep from './steps/ImportPrepareStep';
import ImportStartedStep from './steps/ImportStartedStep';

const DEFAULT_MODAL_MODEL: ImportModalModel = {
    step: Step.START,
    needIMAPDetails: false,
    importID: '',
    email: '',
    password: '',
    port: '',
    imap: '',
    errorCode: 0,
    errorLabel: '',
    providerFolders: [],
    selectedPeriod: TIME_UNIT.BIG_BANG,
    payload: {
        Mapping: [],
    },
    isPayloadValid: false,
};

interface Props {
    onClose?: () => void;
    onImportComplete: () => void;
}

const dateToTimestamp = (date: Date) => Math.floor(date.getTime() / 1000);

const destinationFoldersFirst = (a: MailImportFolder, b: MailImportFolder) => {
    if (a.DestinationFolder && b.DestinationFolder) {
        return 0;
    }
    if (a.DestinationFolder && !b.DestinationFolder) {
        return -1;
    }
    if (!a.DestinationFolder && b.DestinationFolder) {
        return 1;
    }
    if (a.Source < b.Source) {
        return -1;
    }
    if (a.Source > b.Source) {
        return 1;
    }
    return 0;
};

const ImportMailModal = ({ onImportComplete, onClose = noop, ...rest }: Props) => {
    const [loading, withLoading] = useLoading();
    const { createModal } = useModals();
    const [addresses, loadingAddresses] = useAddresses();
    const [address] = addresses || [];
    const [modalModel, setModalModel] = useState<ImportModalModel>(DEFAULT_MODAL_MODEL);
    const api = useApi();

    const title = useMemo(() => {
        switch (modalModel.step) {
            case Step.START:
                return c('Title').t`Start a new import`;
            case Step.PREPARE:
                return c('Title').t`Start import process`;
            case Step.STARTED:
                return c('Title').t`Import in progress`;
            default:
                return '';
        }
    }, [modalModel.step]);

    const wizardSteps = [
        c('Wizard step').t`Authenticate`,
        c('Wizard step').t`Plan import`,
        c('Wizard step').t`Confirm`,
    ];

    const handleCancel = () => {
        if (!modalModel.email) {
            onClose();
            return;
        }

        createModal(
            <ConfirmModal
                onConfirm={onClose}
                title={c('Confirm modal title').t`Quit import?`}
                cancel={c('Action').t`Continue import`}
                confirm={<ErrorButton type="submit">{c('Action').t`Quit`}</ErrorButton>}
            >
                <Alert type="error">{c('Warning').t`You will lose all progress if you quit.`}</Alert>
            </ConfirmModal>
        );
    };

    const moveToPrepareStep = (importID: string, providerFolders: MailImportFolder[]) => {
        setModalModel({
            ...modalModel,
            providerFolders: providerFolders.sort(destinationFoldersFirst),
            importID,
            step: Step.PREPARE,
        });
    };

    const handleSubmitStartError = (error: Error & { data: { Code: number; Error: string } }) => {
        const { data: { Code, Error } = { Code: 0, Error: '' } } = error;

        if ([IMPORT_ERROR.AUTH_CREDENTIALS, IMPORT_ERROR.AUTH_IMAP].includes(Code)) {
            setModalModel({
                ...modalModel,
                errorCode: Code,
                errorLabel: Error,
                needIMAPDetails: modalModel.needIMAPDetails || Error === IMAP_CONNECTION_ERROR_LABEL,
            });
        }
    };

    const submitAuthentication = async (needIMAPDetails = false) => {
        const { Authentication } = await api(getAuthenticationMethod({ Email: modalModel.email }));
        const { ImapHost, ImapPort, ImporterID } = Authentication;

        /* If we already have an importID we can just fetch the folders and move on */
        if (ImporterID) {
            try {
                const { Importer } = await api(getMailImport(ImporterID));
                const { Folders = [] } = await api(getMailImportFolders(Importer.ID, { Code: modalModel.password }));
                moveToPrepareStep(Importer.ID, Folders);
            } catch (error) {
                handleSubmitStartError(error);
            }
            return;
        }

        if ((ImapHost && ImapPort) || needIMAPDetails) {
            try {
                const { Importer } = await api(
                    createMailImport({
                        Email: modalModel.email,
                        ImapHost: needIMAPDetails ? modalModel.imap : ImapHost,
                        ImapPort: needIMAPDetails ? parseInt(modalModel.port) : ImapPort,
                        Sasl: 'PLAIN',
                        Code: modalModel.password,
                    })
                );
                const { Folders = [] } = await api(getMailImportFolders(Importer.ID, { Code: modalModel.password }));
                moveToPrepareStep(Importer.ID, Folders);
            } catch (error) {
                handleSubmitStartError(error);
            }
            return;
        }

        setModalModel({
            ...modalModel,
            imap: '',
            port: ImapPort,
            needIMAPDetails: true,
        });
    };

    const launchImport = async () => {
        const { importID, payload } = modalModel;

        await api(
            createJobImport(importID, {
                ...payload,
                StartTime: payload.StartTime ? dateToTimestamp(payload.StartTime) : undefined,
                EndTime: payload.EndTime ? dateToTimestamp(payload.EndTime) : undefined,
                Mapping: modalModel.payload.Mapping.filter((m: FolderMapping) => m.checked),
            })
        );

        setModalModel({
            ...modalModel,
            step: Step.STARTED,
        });
        onImportComplete();
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        switch (modalModel.step) {
            case Step.START:
                withLoading(submitAuthentication(modalModel.needIMAPDetails));
                break;
            case Step.PREPARE:
                withLoading(launchImport());
                break;
            case Step.STARTED:
                onClose();
                break;
            default:
                break;
        }
    };

    const cancel = useMemo(() => {
        if (modalModel.step === Step.STARTED) {
            return null;
        }

        return <Button onClick={handleCancel}>{c('Action').t`Cancel`}</Button>;
    }, [modalModel.step, loading]);

    const submit = useMemo(() => {
        const { email, password, needIMAPDetails, imap, port, isPayloadValid, step } = modalModel;

        const disabledStartStep = needIMAPDetails ? !email || !password || !imap || !port : !email || !password;

        switch (step) {
            case Step.START:
                return (
                    <PrimaryButton type="submit" disabled={disabledStartStep} loading={loading}>
                        {c('Action').t`Next`}
                    </PrimaryButton>
                );
            case Step.PREPARE:
                return (
                    <PrimaryButton loading={loading} disabled={isPayloadValid} type="submit">
                        {c('Action').t`Start import`}
                    </PrimaryButton>
                );
            case Step.STARTED:
                return <PrimaryButton loading={loading} type="submit">{c('Action').t`Close`}</PrimaryButton>;
            default:
                return null;
        }
    }, [
        modalModel.step,
        modalModel.email,
        modalModel.password,
        modalModel.needIMAPDetails,
        modalModel.imap,
        modalModel.port,
        modalModel.isPayloadValid,
        loading,
    ]);

    return (
        <FormModal
            title={title}
            loading={loading}
            submit={submit}
            close={cancel}
            onSubmit={handleSubmit}
            onClose={handleCancel}
            {...rest}
        >
            <ImportMailWizard step={modalModel.step} steps={wizardSteps} />
            {modalModel.step === Step.START && (
                <ImportStartStep
                    modalModel={modalModel}
                    updateModalModel={(newModel: ImportModalModel) => setModalModel(newModel)}
                />
            )}
            {modalModel.step === Step.PREPARE && (
                <ImportPrepareStep
                    address={address}
                    modalModel={modalModel}
                    updateModalModel={(newModel: ImportModalModel) => setModalModel(newModel)}
                />
            )}
            {modalModel.step === Step.STARTED && !loadingAddresses && address && (
                <ImportStartedStep address={address} modalModel={modalModel} />
            )}
        </FormModal>
    );
};

export default ImportMailModal;
