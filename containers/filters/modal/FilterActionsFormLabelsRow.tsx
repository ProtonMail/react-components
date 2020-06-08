import React from 'react';
import { c } from 'ttag';

import { Checkbox, Button, Tooltip, classnames, Icon, useModals } from 'react-components';
import { Label } from 'proton-shared/lib/interfaces/Label';

import EditLabelModal from '../../labels/modals/Edit';

import { Actions } from './interfaces';

interface Props {
    labels: Label[];
    isNarrow: boolean;
    actions: Actions;
    handleUpdateActions: (onUpdateActions: Partial<Actions>) => void;
}

type ChangePayload = {
    labels: string[];
    isOpen: boolean;
};

const FilterActionsFormLabelsRow = ({ actions, isNarrow, handleUpdateActions, labels }: Props) => {
    const { createModal } = useModals();
    const { labelAs } = actions;
    const { isOpen } = labelAs;

    const handleChangeModel = (payload: Partial<ChangePayload>) => {
        handleUpdateActions({
            labelAs: {
                ...actions.labelAs,
                ...payload
            }
        });
    };

    const toggleSection = () => {
        handleChangeModel({ isOpen: !isOpen });
    };

    const handleClear = () => {
        handleChangeModel({ labels: [] });
    };

    const renderClosed = () => {
        if (!labelAs?.labels.length) {
            return <em className="ml0-5 color-global-altgrey">{c('Info').t`No label selected`}</em>;
        }

        return (
            <div className="pm-badgeLabel-container">
                {labelAs?.labels.map((labelID: string) => {
                    const label = labels?.find((l) => l.ID === labelID);

                    return (
                        <span
                            key={labelID}
                            className="ml0-5 mr0-5 mb0-5 badgeLabel flex flex-row flex-items-center ellipsis"
                            role="listitem"
                            style={{
                                color: label?.Color
                            }}
                        >
                            <span className="pm-badgeLabel-link color-white">{label?.Name}</span>
                        </span>
                    );
                })}
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
                    {c('Label').t`Label as`}
                </span>
            </div>
            <div className="ml0-5 flex-item-fluid">
                {isOpen ? (
                    <>
                        <div className="w100">
                            {labels.length ? (
                                labels.map((label: Label) => (
                                    <div className="mb0-5 inbl pm-badgeLabel-container ellipsis" key={label.ID}>
                                        <Checkbox
                                            className="mr1 flex-nowrap"
                                            checked={labelAs.labels.includes(label.ID)}
                                            onChange={() => {
                                                const index = labelAs.labels.indexOf(label.ID);
                                                if (index >= 0) {
                                                    labelAs.labels.splice(index, 1);
                                                    handleChangeModel({ labels: [...labelAs.labels] });
                                                } else {
                                                    handleChangeModel({ labels: [...labelAs.labels, label.ID] });
                                                }
                                            }}
                                            labelOnClick={(e) => e.stopPropagation()}
                                        >
                                            <span
                                                className="ml0-5 badgeLabel flex flex-row flex-items-center"
                                                role="listitem"
                                                style={{
                                                    color: label.Color
                                                }}
                                                title={label.Name}
                                            >
                                                <span className="pm-badgeLabel-link color-white">{label.Name}</span>
                                            </span>
                                        </Checkbox>
                                    </div>
                                ))
                            ) : (
                                <div className="pt0-5 mb1">{c('Label').t`No label found`}</div>
                            )}
                        </div>
                        <Button className="mt0" onClick={() => createModal(<EditLabelModal type="label" />)}>
                            {c('Action').t`Create new label`}
                        </Button>
                    </>
                ) : (
                    <div className="mt0-5">{renderClosed()}</div>
                )}
            </div>
            <div>
                <Button
                    disabled={!labelAs?.labels.length}
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
export default FilterActionsFormLabelsRow;
