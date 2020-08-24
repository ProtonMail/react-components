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
import { ConfirmModal, FormModal, Button, PrimaryButton, Alert } from '../../../components';
import ImportMailWizard from '../../../components/import/ImportMailWizard';

import { TIME_UNIT, IMAP_CONNECTION_ERROR_LABEL } from '../constants';
import { Step, ImportModalModel, IMPORT_ERROR, MailImportFolder, FolderMapping } from '../interfaces';

import ImportStartStep from './steps/ImportStartStep';
import ImportPrepareStep from './steps/ImportPrepareStep';
import ImportStartedStep from './steps/ImportStartedStep';
import { format } from 'date-fns';

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
};

interface Props {
    onClose?: () => void;
}

const dateToTimestamp = (date: Date) => Math.floor(date.getTime() / 1000);

const destinationFoldersFirst = (a: MailImportFolder, b: MailImportFolder) => {
    if (a.DestinationFolder && b.DestinationFolder) {
        return 0;
    }

    return a.DestinationFolder ? -1 : 1;
};

const ImportMailModal = ({ onClose = noop, ...rest }: Props) => {
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
        createModal(
            <ConfirmModal onConfirm={onClose}>
                <Alert type="error">{c('Warning').t`Are you sure you want to cancel your import?`}</Alert>
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
                needIMAPDetails: Error === IMAP_CONNECTION_ERROR_LABEL,
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

        if (ImapHost) {
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
        const cleanMapping = modalModel.payload.Mapping.filter((m: FolderMapping) => m.Destinations.FolderName).map(
            (m: FolderMapping) => {
                const split = m.Destinations.FolderName.split('/');
                const level = split.length - 1;
                const maxLevel = Math.min(level, 2);

                return {
                    Source: m.Source,
                    Destinations: {
                        FolderName:
                            level <= 2
                                ? m.Destinations.FolderName
                                : `${split.slice(0, maxLevel).join('/')}/${split.slice(maxLevel).join('\\/')}`,
                    },
                };
            }
        );

        await api(
            createJobImport(modalModel.importID, {
                ...modalModel.payload,
                StartTime: modalModel.payload.StartTime ? dateToTimestamp(modalModel.payload.StartTime) : undefined,
                EndTime: modalModel.payload.EndTime ? dateToTimestamp(modalModel.payload.EndTime) : undefined,
                Mapping: cleanMapping,
                // update time in the label
                ImportLabel: {
                    Name: `${modalModel.email.split('@')[1]} - export ${format(new Date(), 'yyyy-MM-dd hh:mm')}`,
                },
            })
        );

        setModalModel({
            ...modalModel,
            step: Step.STARTED,
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setModalModel({ ...modalModel, errorCode: 0 });

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
        switch (modalModel.step) {
            case Step.START:
                const disabled = modalModel.needIMAPDetails
                    ? !modalModel.email || !modalModel.password || !modalModel.imap || !modalModel.port
                    : !modalModel.email || !modalModel.password;
                return (
                    <PrimaryButton type="submit" disabled={disabled} loading={loading}>
                        {c('Action').t`Next`}
                    </PrimaryButton>
                );
            case Step.PREPARE:
                return <PrimaryButton loading={loading} type="submit">{c('Action').t`Start import`}</PrimaryButton>;
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
