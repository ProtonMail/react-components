import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { OrderableTable, OrderableTableBody } from 'react-components';
import { noop } from 'proton-shared/lib/helpers/function';

import LabelSortableItem from './LabelSortableItem';

function LabelSortableList({ items, onEditLabel = noop, onRemoveLabel = noop, ...rest }) {
    return (
        <OrderableTable className="noborder border-collapse mt1" {...rest}>
            <caption className="sr-only">{c('Settings/labels').t`Labels/Folders`}</caption>
            <OrderableTableBody>
                {items.map((label, index) => (
                    <LabelSortableItem
                        key={`item-${index}`}
                        index={index}
                        label={label}
                        onEditLabel={onEditLabel}
                        onRemoveLabel={onRemoveLabel}
                        data-test-id={`folders/labels:item-type:${label.Exclusive ? 'folder' : 'label'}`}
                    />
                ))}
            </OrderableTableBody>
        </OrderableTable>
    );
}

LabelSortableList.propTypes = {
    items: PropTypes.array.isRequired,
    onEditLabel: PropTypes.func,
    onRemoveLabel: PropTypes.func
};

export default LabelSortableList;
