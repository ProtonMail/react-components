import React from 'react';
import { c } from 'ttag';

import { classnames, Icon } from 'react-components';
import { Label } from 'proton-shared/lib/interfaces/Label';

import { Actions } from './interfaces';

interface Props {
    labels: Label[];
    isNarrow: boolean;
    actions: Actions;
    handleUpdateActions: (onUpdateActions: Partial<Actions>) => void;
}

const FilterActionsFormLabelsRow = ({ actions, isNarrow, handleUpdateActions, labels }: Props) => {
    const { labelAs } = actions;
    const { isOpen } = labelAs;

    const toggleSection = () => {
        handleUpdateActions({
            labelAs: {
                ...labelAs,
                isOpen: !isOpen
            }
        });
    };

    const renderClosed = () => {
        if (!labelAs?.labels.length) {
            return <em className="ml0-5 pt0-5 color-global-altgrey">{c('Info').t`No label selected`}</em>;
        }

        // @todo show selected
        return <span className="ml0-5 pt0-5">{`${labels?.length} labels`}</span>;
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
export default FilterActionsFormLabelsRow;
