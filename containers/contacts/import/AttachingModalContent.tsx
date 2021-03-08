import React, { ChangeEvent, DragEvent } from 'react';
import { c } from 'ttag';

import { MAX_IMPORT_FILE_SIZE_STRING, MAX_IMPORT_CONTACTS_STRING } from 'proton-shared/lib/contacts/constants';
import { ImportContactsModel } from 'proton-shared/lib/interfaces/contacts/Import';

import { Bordered, FileInput, Alert, AttachedFile, Dropzone } from '../../../components';
import { classnames } from '../../../helpers';

interface Props {
    model: ImportContactsModel;
    onAttach: (event: ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    isDropzoneHovered: boolean;
    onDrop: (event: DragEvent) => void;
    onDragEnter: (event: DragEvent) => void;
    onDragLeave: (event: DragEvent) => void;
}
const AttachingModalContent = ({
    model,
    onAttach,
    onClear,
    isDropzoneHovered,
    onDrop,
    onDragEnter,
    onDragLeave,
}: Props) => {
    const alert = model.failure ? (
        <Alert type="error">{model.failure?.message}</Alert>
    ) : (
        <Alert learnMore="https://protonmail.com/support/knowledge-base/adding-contacts/">
            {c('Description').t`The file should have a maximum size of ${MAX_IMPORT_FILE_SIZE_STRING} and have
                up to ${MAX_IMPORT_CONTACTS_STRING} contacts. If your file is bigger, please split it into smaller files.`}
        </Alert>
    );
    return (
        <>
            {alert}
            <Bordered className={classnames(['flex relative', !!model.failure && 'bordered-container--error'])}>
                {/* TODO: drag&drop component here. There seems to be no React component for this kind of behavior yet */}
                {model.fileAttached ? (
                    <AttachedFile file={model.fileAttached} iconName="contacts-groups" onClear={onClear} />
                ) : (
                    <Dropzone
                        isHovered={isDropzoneHovered}
                        onDrop={onDrop}
                        onDragEnter={onDragEnter}
                        onDragLeave={onDragLeave}
                        className="w100"
                    >
                        <FileInput className="text-center" accept=".csv, .vcf" id="import-contacts" onChange={onAttach}>
                            {c('Action').t`Choose a file or drag it here`}
                        </FileInput>
                    </Dropzone>
                )}
            </Bordered>
        </>
    );
};

export default AttachingModalContent;
