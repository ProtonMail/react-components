import React, { useState } from 'react';
import { c } from 'ttag';
import { Alert, GenericError, FormModal } from '../../../index';
import { algorithmInfo } from 'pmcrypto';
import { getAlgorithmExists } from 'proton-shared/lib/keys/keysAlgorithm';
import { DEFAULT_ENCRYPTION_CONFIG, ENCRYPTION_CONFIGS, ENCRYPTION_TYPES } from 'proton-shared/lib/constants';
import { EncryptionConfig } from 'proton-shared/lib/interfaces';

import SelectEncryption from './SelectEncryption';

enum STEPS {
    SELECT_ENCRYPTION = 1,
    WARNING = 2,
    GENERATE_KEY = 3,
    SUCCESS = 4,
    FAILURE = 5
}

interface Props {
    onClose?: () => void;
    existingAlgorithms: algorithmInfo[];
    onAdd: (config: EncryptionConfig) => Promise<string>;
}
const AddKeyModal = ({ onClose, existingAlgorithms, onAdd, ...rest }: Props) => {
    const [step, setStep] = useState(STEPS.SELECT_ENCRYPTION);
    const [encryptionType, setEncryptionType] = useState<ENCRYPTION_TYPES>(DEFAULT_ENCRYPTION_CONFIG);
    const [newKeyFingerprint, setNewKeyFingerprint] = useState();

    const handleProcess = () => {
        onAdd(ENCRYPTION_CONFIGS[encryptionType])
            .then((fingerprint) => {
                setNewKeyFingerprint(fingerprint);
                setStep(STEPS.SUCCESS);
            })
            .catch(() => {
                setStep(STEPS.FAILURE);
            });
    };

    const { children, ...stepProps } = (() => {
        if (step === STEPS.SELECT_ENCRYPTION) {
            return {
                onSubmit: () => {
                    const encryptionConfig = ENCRYPTION_CONFIGS[encryptionType];
                    const algorithmExists = getAlgorithmExists(existingAlgorithms, encryptionConfig);

                    const nextStep = algorithmExists ? STEPS.WARNING : STEPS.GENERATE_KEY;
                    setStep(nextStep);
                    if (nextStep === STEPS.GENERATE_KEY) {
                        handleProcess();
                    }
                },
                children: (
                    <>
                        <Alert>
                            {c('Info')
                                .t`You can generate a new encryption key if you think your previous key has been compromised.`}
                        </Alert>
                        <SelectEncryption encryptionType={encryptionType} setEncryptionType={setEncryptionType} />
                    </>
                )
            };
        }

        if (step === STEPS.WARNING) {
            return {
                onSubmit: () => {
                    setStep(STEPS.GENERATE_KEY);
                    handleProcess();
                },
                submit: c('Action').t`Yes`,
                children: (
                    <Alert type="warning">
                        {c('Info')
                            .t`A key with the same encryption algorithm is already active for this address. Generating another key will cause slower account loading and deletion of this key can cause issues. If you are generating a new key because your old key is compromised, please mark that key as compromised. Are you sure you want to continue?`}
                    </Alert>
                )
            };
        }

        if (step === STEPS.GENERATE_KEY) {
            return {
                submit: c('Action').t`Done`,
                loading: true,
                children: (
                    <Alert>
                        {c('alert')
                            .t`The encryption keys for your address are being generated. This may take several minutes and temporarily freeze your browser.`}
                    </Alert>
                )
            };
        }

        if (step === STEPS.SUCCESS) {
            const fp = <code key="0">{newKeyFingerprint}</code>;
            return {
                submit: c('Action').t`Done`,
                children: <Alert>{c('Info').jt`Key with fingerprint ${fp} successfully created`}</Alert>
            };
        }

        if (step === STEPS.FAILURE) {
            return {
                submit: c('Action').t`Ok`,
                children: <GenericError />
            };
        }

        throw new Error('Unsupported step');
    })();

    return (
        <FormModal
            title={c('Title').t`Create key`}
            close={c('Action').t`Close`}
            submit={c('Action').t`Submit`}
            onClose={onClose}
            onSubmit={onClose}
            {...stepProps}
            {...rest}
        >
            {children}
        </FormModal>
    );
};

export default AddKeyModal;
