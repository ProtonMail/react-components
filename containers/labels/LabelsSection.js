import React from 'react';
import { c } from 'ttag';
import {
    Loader,
    SubTitle,
    Alert,
    PrimaryButton,
    useLabels,
    useFolders,
    useEventManager,
    useModals,
    useApi
} from 'react-components';
import { arrayMove } from 'react-sortable-hoc';
import { orderLabels } from 'proton-shared/lib/api/labels';

import LabelSortableList from './LabelSortableList';
import FolderTreeViewList from './FolderTreeViewList';
import EditLabelModal from './modals/Edit';

function LabelsSection() {
    const [labels, loadingLabels] = useLabels();
    const [folders, loadingFolders] = useFolders();
    const { call } = useEventManager();
    const api = useApi();
    const { createModal } = useModals();

    /**
     * Refresh the list + update API and call event, it can be slow.
     * We want a responsive UI, if it fails the item will go back to its previous index
     * @param  {Number} options.oldIndex cf https://github.com/clauderic/react-sortable-hoc#basic-example
     * @param  {Number} options.newIndex
     */
    const onSortEnd = async ({ oldIndex, newIndex }) => {
        const newLabels = arrayMove(labels, oldIndex, newIndex);
        await api(
            orderLabels({
                LabelIDs: newLabels.map(({ ID }) => ID)
            })
        );
        await call();
    };

    const getScrollContainer = () => document.querySelector('.main-area');

    if (loadingLabels || loadingFolders) {
        return (
            <>
                <SubTitle>{c('LabelSettings').t`Folders and labels`}</SubTitle>
                <Loader />
            </>
        );
    }

    return (
        <>
            <SubTitle>{c('LabelSettings').t`Folders`}</SubTitle>
            <Alert
                type="info"
                className="mt1 mb1"
                learnMore="https://protonmail.com/support/knowledge-base/creating-folders/"
            >
                {c('LabelSettings')
                    .t`Multiple labels can be applied to a single message, but a message can only be in a single folder.`}
            </Alert>
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
            <SubTitle>{c('LabelSettings').t`Labels`}</SubTitle>
            <div className="mb1">
                <PrimaryButton onClick={() => createModal(<EditLabelModal type="label" />)}>
                    {c('Action').t`Add label`}
                </PrimaryButton>
            </div>
            {labels.length ? (
                <LabelSortableList getContainer={getScrollContainer} items={labels} onSortEnd={onSortEnd} />
            ) : (
                <Alert>{c('LabelSettings').t`No labels available`}</Alert>
            )}
        </>
    );
}

export default LabelsSection;
