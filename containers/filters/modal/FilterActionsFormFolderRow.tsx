import React from 'react';
import { c } from 'ttag';

import { classnames, Icon } from 'react-components';
import { Folder } from 'proton-shared/lib/interfaces/Folder';

import { Actions } from './interfaces';

interface Props {
    folders: Folder[];
    isNarrow: boolean;
    actions: Actions;
    handleUpdateActions: (onUpdateActions: Partial<Actions>) => void;
}

const FilterActionsFormFolderRow = ({ folders, isNarrow, actions, handleUpdateActions }: Props) => {
    const { moveTo } = actions;
    const { isOpen } = moveTo;

    const toggleSection = () => {
        handleUpdateActions({
            moveTo: {
                ...actions.moveTo,
                isOpen: !isOpen
            }
        });
    };

    const renderClosed = () => {
        if (!moveTo?.folder) {
            return <em className="ml0-5 pt0-5 color-global-altgrey">{c('Info').t`No folder selected`}</em>;
        }

        // @todo show selected
        return <span className="ml0-5 pt0-5">{`${folders?.length} folders available`}</span>;
    };

    return (
        <div className="border-bottom flex flex-nowrap onmobile-flex-column align-items-center pt1 pb1">
            <div
                className={classnames(['w25 cursor-pointer pt0-5', isNarrow && 'mb1'])}
                onClick={toggleSection}
                onKeyDown={(e) => e.key === 'Enter' && toggleSection()}
                role="button"
                tabIndex={0}
            >
                <Icon name="caret" className={classnames([isOpen && 'rotateX-180'])} />
                <span className={classnames(['ml0-5', actions.error && 'color-global-warning'])}>{c('Label')
                    .t`Move to`}</span>
            </div>
            <div className="ml0-5 flex flex-column flex-item-fluid">
                {isOpen ? (
                    <div
                        className="w100"
                        style={{
                            height: 100,
                            background: 'pink',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        Coucou
                    </div>
                ) : (
                    renderClosed()
                )}
            </div>
        </div>
    );
};

export default FilterActionsFormFolderRow;
