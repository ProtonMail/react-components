import React from 'react';
import { c } from 'ttag';
import { SortableContainerProps } from 'react-sortable-hoc';

import { noop } from 'proton-shared/lib/helpers/function';
import { Label } from 'proton-shared/lib/interfaces/Label';

import { OrderableTable, OrderableTableBody, OrderableTableHeader, Icon } from '../../components';
import LabelSortableItem from './LabelSortableItem';

interface Props extends SortableContainerProps {
    items: Label[];
    onEditLabel: Function;
    onRemoveLabel: Function;
}

function LabelSortableList({ items, onEditLabel = noop, onRemoveLabel = noop, ...rest }: Props) {
    return (
        <OrderableTable className="no-border simple-table--has-actions border-collapse mt1" {...rest}>
            <caption className="sr-only">{c('Settings/labels').t`Labels/Folders`}</caption>
            <OrderableTableHeader>
                <tr>
                    <th scope="col" className="w5">
                        <Icon name="arrow-cross" />
                    </th>
                    <th scope="col" className="w70">
                        {c('Settings/labels - table').t`Name`}
                    </th>
                    <th scope="col">{c('Settings/labels - table').t`Actions`}</th>
                </tr>
            </OrderableTableHeader>
            <OrderableTableBody colSpan={0}>
                {items.map((label, index) => (
                    <LabelSortableItem
                        key={`item-${label.ID}`}
                        index={index}
                        label={label}
                        onEditLabel={onEditLabel}
                        onRemoveLabel={onRemoveLabel}
                        data-test-id="folders/labels:item-type:label"
                    />
                ))}
            </OrderableTableBody>
        </OrderableTable>
    );
}

export default LabelSortableList;
