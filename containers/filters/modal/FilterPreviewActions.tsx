import React from 'react';
import { c } from 'ttag';

import { classnames, Icon } from 'react-components';

// import { getI18n as getI18nFilter } from 'proton-shared/lib/filters/factory';
import { Folder } from 'proton-shared/lib/interfaces/Folder';
import { Label } from 'proton-shared/lib/interfaces/Label';

import { FilterModalModel } from './interfaces';

interface Props {
    labels: Label[];
    folders: Folder[];
    isNarrow: boolean;
    model: FilterModalModel;
    toggleOpen: () => void;
    isOpen: boolean;
}

const FilterPreviewActions = ({ isOpen, isNarrow, toggleOpen /* labels, folders,  model*/ }: Props) => {
    // const { actions } = model;

    const renderActions = () => {
        return <div className="pl0-5 pt0-5">{isOpen ? <span>Open</span> : <span>Closed</span>}</div>;
    };

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
                <div className="flex flex-column flex-item-fluid">{renderActions()}</div>
            </div>
        </div>
    );
};

export default FilterPreviewActions;
