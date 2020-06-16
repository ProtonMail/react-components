import React, { useState } from 'react';
import { c } from 'ttag';

import { classnames } from 'react-components';

import { Folder } from 'proton-shared/lib/interfaces/Folder';
import { Label } from 'proton-shared/lib/interfaces/Label';
import { SimpleFilterModalModel } from 'proton-shared/lib/filters/interfaces';

import FilterPreviewActions from './FilterPreviewActions';
import FilterPreviewConditions from './FilterPreviewConditions';

interface Props {
    labels: Label[];
    folders: Folder[];
    isNarrow: boolean;
    model: SimpleFilterModalModel;
}

const FilterPreview = ({ isNarrow, labels, folders, model }: Props) => {
    const [conditionsOpen, setConditionsOpen] = useState(true);
    const [actionsOpen, setActionsOpen] = useState(true);

    return (
        <>
            <div className="border-bottom">
                <div className="flex flex-nowrap onmobile-flex-column align-items-center pb1">
                    <div className={classnames(['w25 pt0-5', isNarrow && 'mb1'])}>
                        <span className="ml0-5 mr0-5">{c('Label').t`Filter Name`}</span>
                    </div>
                    <div className="ml1 pt0-5 flex flex-column flex-item-fluid">{model.name}</div>
                </div>
            </div>
            <FilterPreviewConditions
                isNarrow={isNarrow}
                model={model}
                isOpen={conditionsOpen}
                toggleOpen={() => setConditionsOpen(!conditionsOpen)}
            />
            <FilterPreviewActions
                isNarrow={isNarrow}
                labels={labels}
                folders={folders}
                model={model}
                isOpen={actionsOpen}
                toggleOpen={() => setActionsOpen(!actionsOpen)}
            />
        </>
    );
};

export default FilterPreview;
