import React, { useState, useMemo, FormEvent } from 'react';
import { c } from 'ttag';
import {
    Alert,
    FormModal,
    ConfirmModal,
    PrimaryButton,
    Button,
    useApi,
    useModals,
    useLoading,
    useAddresses,
} from '../../..';
import {
    getAuthenticationMethod,
    createMailImport,
    createJobImport,
    getMailImportFolders,
    getMailImport,
} from 'proton-shared/lib/api/mailImport';
import { noop } from 'proton-shared/lib/helpers/function';

import { Step, ImportModalModel, IMPORT_ERROR, MailImportFolder, FolderMapping } from '../interfaces';

import ImportMailWizard from '../../../components/import/ImportMailWizard';

import ImportStartStep from './steps/ImportStartStep';
import ImportPrepareStep from './steps/ImportPrepareStep';
import ImportStartedStep from './steps/ImportStartedStep';
import { TIME_UNIT } from '../constants';

const DEFAULT_MODAL_MODEL: ImportModalModel = {
    step: Step.START,
    needDetails: false,
    importID: '',
    email: 'mindaugas2020v@gmail.com', // '',
    password: 'wzwdtwptfzvsqoqt', // '',
    port: '',
    imap: '',
    errorCode: 0,
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
        c('Wizard step').t`Authentication`,
        c('Wizard step').t`Import strategy`,
        c('Wizard step').t`Confirmation`,
    ];

    const handleCancel = () => {
        createModal(
            <ConfirmModal onConfirm={onClose}>
                <Alert type="warning">{c('Warning').t`Are you sure you want to cancel your import?`}</Alert>
            </ConfirmModal>
        );
    };

    const submitStartStep = async (needDetails: boolean) => {
        if (needDetails) {
            try {
                const { Importer } = await api(
                    createMailImport({
                        Email: modalModel.email,
                        ImapHost: modalModel.imap,
                        ImapPort: parseInt(modalModel.port),
                        Sasl: 'PLAIN',
                        Code: modalModel.password,
                    })
                );
                const { Folders = [] } = await api(getMailImportFolders(Importer.ID));
                setModalModel({
                    ...modalModel,
                    providerFolders: Folders.sort(destinationFoldersFirst),
                    importID: Importer.ID,
                    step: Step.PREPARE,
                });
            } catch (error) {
                const { data: { Code } = { Code: 0 } } = error;

                if ([IMPORT_ERROR.AUTH_CREDENTIALS, IMPORT_ERROR.AUTH_IMAP].includes(Code)) {
                    setModalModel({
                        ...modalModel,
                        errorCode: Code,
                    });
                    return;
                }
                if (Code === IMPORT_ERROR.ALREADY_EXISTS) {
                    alert('oh no, import already exists');
                }
            }

            return;
        }

        const { Authentication } = await api(getAuthenticationMethod({ Email: modalModel.email }));
        const { ImapHost, ImapPort, ImporterID } = Authentication;

        /* @todo Refactor this, lot of repetition */
        /*       Same with the needDetails */
        if (ImporterID) {
            try {
                const { Importer } = await api(getMailImport(ImporterID));

                const { Folders = [] } = await api(getMailImportFolders(Importer.ID, { Code: modalModel.password }));

                setModalModel({
                    ...modalModel,
                    providerFolders: Folders.sort(destinationFoldersFirst),
                    importID: Importer.ID,
                    step: Step.PREPARE,
                });
            } catch (error) {
                const { data: { Code } = { Code: 0 } } = error;

                if ([IMPORT_ERROR.AUTH_CREDENTIALS, IMPORT_ERROR.AUTH_IMAP].includes(Code)) {
                    setModalModel({
                        ...modalModel,
                        errorCode: Code,
                    });
                    return;
                }
            }
        } else if (ImapHost) {
            try {
                const { Importer } = await api(
                    createMailImport({
                        Email: modalModel.email,
                        ImapHost,
                        ImapPort,
                        Sasl: 'PLAIN',
                        Code: modalModel.password,
                    })
                );
                const { Folders = [] } = await api(getMailImportFolders(Importer.ID, { Code: modalModel.password }));
                setModalModel({
                    ...modalModel,
                    providerFolders: Folders.sort(destinationFoldersFirst),
                    importID: Importer.ID,
                    step: Step.PREPARE,
                });
            } catch (error) {
                const { data: { Code } = { Code: 0 } } = error;

                if ([IMPORT_ERROR.AUTH_CREDENTIALS, IMPORT_ERROR.AUTH_IMAP].includes(Code)) {
                    setModalModel({
                        ...modalModel,
                        errorCode: Code,
                    });
                    return;
                }
            }
        } else {
            setModalModel({
                ...modalModel,
                imap: '',
                port: ImapPort,
                needDetails: true,
            });
        }
    };

    const submitPrepareStep = async () => {
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
                selectedPeriod: undefined,
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
                withLoading(submitStartStep(modalModel.needDetails));
                break;
            case Step.PREPARE:
                withLoading(submitPrepareStep());
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
                const disabled = modalModel.needDetails
                    ? !modalModel.email || !modalModel.password || !modalModel.imap || !modalModel.port
                    : !modalModel.email || !modalModel.password;
                return (
                    <PrimaryButton type="submit" disabled={disabled} loading={loading}>
                        {c('Action').t`Next`}
                    </PrimaryButton>
                );
            case Step.PREPARE:
                return <PrimaryButton type="submit">{c('Action').t`Start import`}</PrimaryButton>;
            case Step.STARTED:
                return <PrimaryButton type="submit">{c('Action').t`Close`}</PrimaryButton>;
            default:
                return null;
        }
    }, [
        modalModel.step,
        modalModel.email,
        modalModel.password,
        modalModel.needDetails,
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
