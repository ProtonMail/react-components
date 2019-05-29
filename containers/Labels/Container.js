import React, { useEffect, useState } from 'react';
import { c } from 'ttag';
import {
    Title,
    Loader,
    SubTitle,
    Alert,
    Paragraph,
    useLabels,
    useEventManager,
    useApiWithoutResult
} from 'react-components';
import { arrayMove } from 'react-sortable-hoc';
import { orderLabels } from 'proton-shared/lib/api/labels';

import LabelSortableList from '../../components/Labels/LabelSortableList';
import ActionsLabelToolbar from '../../components/Labels/ActionsLabelToolbar';

function LabelsContainer() {
    const [list = [], loading] = useLabels();
    const { call } = useEventManager();
    const orderRequest = useApiWithoutResult(orderLabels);

    const [labels, setLabels] = useState(list);

    useEffect(() => {
        setLabels(list);
    }, [list]);

    /**
     * Refresh the list + update API and call event, it can be slow.
     * We want a responsive UI, if it fails the item will go back to its previous index
     * @param  {Number} options.oldIndex cf https://github.com/clauderic/react-sortable-hoc#basic-example
     * @param  {Number} options.newIndex
     */
    const onSortEnd = async ({ oldIndex, newIndex }) => {
        const newList = arrayMove(list, oldIndex, newIndex);
        setLabels(newList);
        await orderRequest.request({
            LabelIDs: newList.map(({ ID }) => ID)
        });
        call();
    };

    const getScrollContainer = () => document.querySelector('.main-area');

    return (
        <>
            <Title>{c('LabelSettings').t`Manage your labels/folders`}</Title>
            <div className="p1">
                <SubTitle>{c('LabelSettings').t`Folders and labels`}</SubTitle>
                <Alert type="info" className="mt1 mb1" learnMore="https://protonmail.com">
                    {c('LabelSettings')
                        .t`Multiple Labels can be applied to a single message, but a message can only be in a single Folder.`}
                </Alert>
                <nav className="mb1f flex">
                    <ActionsLabelToolbar />
                </nav>

                {loading ? <Loader /> : null}

                {!loading && labels.length ? (
                    <LabelSortableList
                        getContainer={getScrollContainer}
                        pressDelay={200}
                        items={labels}
                        onSortEnd={onSortEnd}
                    />
                ) : (
                    <Paragraph>{c('LabelSettings').t`No labels/folders available`}</Paragraph>
                )}
            </div>
        </>
    );
}

export default LabelsContainer;
