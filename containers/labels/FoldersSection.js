import React from 'react';
import { c } from 'ttag';

import { Loader, Alert, PrimaryButton, Label } from '../../components';
import { useFolders, useModals } from '../../hooks';
import FolderTreeViewList from './FolderTreeViewList';
import EditLabelModal from './modals/EditLabelModal';
import ToggleFolderColor from './ToggleFolderColor';
import ToggleInheritParentFolderColor from './ToggleInheritParentFolderColor';

function LabelsSection() {
    const [folders, loadingFolders] = useFolders();
    const { createModal } = useModals();

    if (loadingFolders) {
        return <Loader />;
    }

    return (
        <>
            <Alert
                type="info"
                className="mt1 mb1"
                learnMore="https://protonmail.com/support/knowledge-base/creating-folders/"
            >
                {c('LabelSettings').t`A message can only be filed in a single Folder at a time.`}
            </Alert>
            <div className="mb1 flex flex-items-align-center">
                <ToggleFolderColor id="folder-colors" className="mr1" />
                <Label htmlFor="folder-colors">{c('Label').t`Enable folder colors`}</Label>
            </div>
            <div className="mb1 flex flex-items-align-center">
                <ToggleInheritParentFolderColor id="parent-folder-color" className="mr1" />
                <Label htmlFor="parent-folder-color">{c('Label').t`Inherit parent folder's color`}</Label>
            </div>
            <div className="mb1">
                <PrimaryButton onClick={() => createModal(<EditLabelModal type="folder" />)}>
                    {c('Action').t`Add folder`}
                </PrimaryButton>
            </div>
            {folders.length ? (
                <FolderTreeViewList items={folders} />
            ) : (
                <Alert>{c('LabelSettings').t`No folders available`}</Alert>
            )}
        </>
    );
}

export default LabelsSection;
