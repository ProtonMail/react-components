import React, { useMemo } from 'react';
import { c } from 'ttag';

import { classnames, Icon } from 'react-components';

import { Folder } from 'proton-shared/lib/interfaces/Folder';
import { Label } from 'proton-shared/lib/interfaces/Label';

import { FilterModalModel } from './interfaces';
import { toMap } from 'proton-shared/lib/helpers/object';

interface Props {
    labels: Label[];
    folders: Folder[];
    isNarrow: boolean;
    model: FilterModalModel;
    toggleOpen: () => void;
    isOpen: boolean;
}

const LABELS_ACTION = {
    labelAs: c('Action').t`label emails as`,
    moveTo: c('Action').t`move emails to`,
    markAs: c('Action').t`mark emails as`,
    autoReply: c('Action').t`send auto-reply email`
};

const FilterPreviewActions = ({ isOpen, isNarrow, toggleOpen, labels, folders, model }: Props) => {
    const { actions } = model;
    const labelsMap = toMap(labels);

    const actionsRenderer = useMemo(() => {
        const actionsRows = [];

        if (actions.labelAs.labels.length) {
            const labelsElements = actions.labelAs.labels.map((l, i) => (
                <React.Fragment key={l}>
                    {i > 0 && c('Label').t` and `}
                    {isOpen ? (
                        <span
                            className="ml0-5 mr0-5 mb0-5 badgeLabel flex flex-row flex-items-center ellipsis"
                            role="listitem"
                            style={{
                                color: labelsMap[l].Color
                            }}
                        >
                            <span className="pm-badgeLabel-link color-white ellipsis nodecoration">
                                {labelsMap[l].Name}
                            </span>
                        </span>
                    ) : (
                        <strong>{labelsMap[l].Name}</strong>
                    )}
                </React.Fragment>
            ));

            actionsRows.push(
                <span className="pm-badgeLabel-container">
                    {LABELS_ACTION.labelAs}
                    {` `}
                    {labelsElements}
                </span>
            );
        }

        if (actions.moveTo.folder) {
            const selectedFolder = folders.find((f) => f.Path === actions.moveTo.folder);

            const folderElement = isOpen ? (
                <span className="inline-flex flex-row flex-items-center condition-token mb0-5" role="listitem">
                    <span className="ellipsis nodecoration">{selectedFolder?.Name}</span>
                </span>
            ) : (
                <strong>{selectedFolder?.Name}</strong>
            );

            actionsRows.push(
                <>
                    {LABELS_ACTION.moveTo}
                    {` `}
                    {folderElement}
                </>
            );
        }

        if (actions.markAs.read || actions.markAs.starred) {
            const readElement = isOpen ? (
                <span className="inline-flex flex-row flex-items-center condition-token mb0-5" role="listitem">
                    <span className="ellipsis nodecoration">{c('Filter preview').t`read`}</span>
                </span>
            ) : (
                <strong>{c('Filter preview').t`read`}</strong>
            );
            const starredElement = isOpen ? (
                <span className="inline-flex flex-row flex-items-center condition-token mb0-5" role="listitem">
                    <span className="ellipsis nodecoration">{c('Filter preview').t`starred`}</span>
                </span>
            ) : (
                <strong>{c('Filter preview').t`starred`}</strong>
            );

            actionsRows.push(
                <>
                    {LABELS_ACTION.markAs}
                    {` `}
                    {actions.markAs.read && readElement}
                    {actions.markAs.read && actions.markAs.starred && (
                        <>
                            {` `}
                            {c('Label').t`and`}
                            {` `}
                        </>
                    )}
                    {actions.markAs.starred && starredElement}
                </>
            );
        }

        if (actions.autoReply) {
            const label = isOpen ? (
                <span className="inline-flex flex-row flex-items-center condition-token mb0-5" role="listitem">
                    <span className="ellipsis nodecoration">{LABELS_ACTION.autoReply}</span>
                </span>
            ) : (
                <strong>{LABELS_ACTION.autoReply}</strong>
            );
            actionsRows.push(label);
        }

        return actionsRows.map((action, i) =>
            isOpen ? (
                <div key={`preview-action-${i}`}>
                    {i === 0 ? c('Label').t`Then` : c('Label').t`And`}
                    {` `}
                    {action}
                </div>
            ) : (
                <span key={`preview-action-${i}`}>
                    {i === 0 ? c('Label').t`Then` : ` ${c('Label').t`and`}`}
                    {` `}
                    {action}
                </span>
            )
        );
    }, [isOpen]);

    return (
        <div className="border-bottom mb2">
            <div className="flex flex-nowrap onmobile-flex-column align-items-center pt1 pb1">
                <div
                    className={classnames(['w25 cursor-pointer pt0-5', isNarrow && 'mb1'])}
                    onClick={toggleOpen}
                    onKeyDown={(e) => e.key === 'Enter' && toggleOpen()}
                    role="button"
                    tabIndex={0}
                >
                    <Icon name="caret" className={classnames([isOpen && 'rotateX-180'])} />
                    <span className="ml0-5">{c('Label').t`Actions`}</span>
                </div>
                <div className="flex flex-column flex-item-fluid">
                    <div className={classnames(['pl0-5 pt0-5', !isOpen && 'mw100 ellipsis'])}>{actionsRenderer}</div>
                </div>
            </div>
        </div>
    );
};

export default FilterPreviewActions;
