import React from 'react';
import { c } from 'ttag';

import { Checkbox, Button, Tooltip, classnames, Icon } from 'react-components';

import { Actions } from 'proton-shared/lib/filters/interfaces';

interface Props {
    isNarrow: boolean;
    actions: Actions;
    handleUpdateActions: (onUpdateActions: Partial<Actions>) => void;
}

type ChangePayload = {
    read: boolean;
    starred: boolean;
    isOpen: boolean;
};

const FilterActionsFormMarkAsRow = ({ isNarrow, actions, handleUpdateActions }: Props) => {
    const { markAs } = actions;
    const { isOpen } = markAs;

    const handleChangeModel = (payload: Partial<ChangePayload>) => {
        handleUpdateActions({
            markAs: {
                ...actions.markAs,
                ...payload
            }
        });
    };

    const toggleSection = () => {
        handleChangeModel({ isOpen: !isOpen });
    };

    const handleClear = () => {
        handleChangeModel({ starred: false, read: false });
    };

    const renderClosed = () => {
        if (!markAs?.read && !markAs?.starred) {
            return <em className="ml0-5 pt0-5 color-global-altgrey">{c('Info').t`No action selected`}</em>;
        }

        return (
            <div className="ml0-5 pt0-5">
                {markAs?.read && (
                    <span className="inline-flex flex-items-center mr2">
                        <Icon name="read" className="mr0-5" />
                        {c('Label').t`Read`}
                    </span>
                )}
                {markAs?.starred && (
                    <span className="inline-flex flex-items-center">
                        <Icon name="star" className="mr0-5" />
                        {c('Label').t`Starred`}
                    </span>
                )}
            </div>
        );
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
                <span className={classnames(['ml0-5', actions.error && 'color-global-warning'])}>
                    {c('Label').t`Mark as`}
                </span>
            </div>
            <div className="ml0-5 flex flex-column flex-item-fluid">
                {isOpen ? (
                    <div className="w100 pt0-5 pb0-5">
                        <Checkbox
                            checked={markAs.read}
                            onChange={(e) => {
                                handleChangeModel({ read: e.target.checked });
                            }}
                            labelOnClick={(e) => e.stopPropagation()}
                        >
                            <span className="ml0-5">{c('Label').t`Read`}</span>
                        </Checkbox>
                        <Checkbox
                            className="ml2"
                            checked={markAs.starred}
                            onChange={(e) => {
                                handleChangeModel({ starred: e.target.checked });
                            }}
                            labelOnClick={(e) => e.stopPropagation()}
                        >
                            <span className="ml0-5">{c('Label').t`Starred`}</span>
                        </Checkbox>
                    </div>
                ) : (
                    renderClosed()
                )}
            </div>
            <div>
                <Button
                    disabled={!markAs?.read && !markAs?.starred}
                    onClick={handleClear}
                    className={classnames(['pm-button--for-icon', isNarrow ? 'mt1' : 'ml1'])}
                >
                    <Tooltip title={c('Action').t`Reset`} className="color-global-altgrey">
                        <Icon name="remove-text-formatting" />
                    </Tooltip>
                </Button>
            </div>
        </div>
    );
};
export default FilterActionsFormMarkAsRow;
