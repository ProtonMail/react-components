import React from 'react';
import { c } from 'ttag';

import { classnames, Icon } from 'react-components';

import { Actions } from './interfaces';

interface Props {
    isNarrow: boolean;
    actions: Actions;
    handleUpdateActions: (onUpdateActions: Partial<Actions>) => void;
}

const FilterActionsFormMarkAsRow = ({ isNarrow, actions, handleUpdateActions }: Props) => {
    const { markAs } = actions;
    const { isOpen } = markAs;

    const toggleSection = () => {
        handleUpdateActions({
            markAs: {
                ...actions.markAs,
                isOpen: !isOpen
            }
        });
    };

    const renderClosed = () => {
        if (!markAs?.read && !markAs?.starred) {
            return <em className="ml0-5 pt0-5 color-global-altgrey">{c('Info').t`No action selected`}</em>;
        }

        // @todo show selected
        return <span className="ml0-5 pt0-5">{`whatever`}</span>;
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
export default FilterActionsFormMarkAsRow;
