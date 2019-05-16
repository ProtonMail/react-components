import React from 'react';
import { c } from 'ttag';
import { SortableContainer } from 'react-sortable-hoc';
import { Icon } from 'react-components';

import FilterItemRow from './FilterItemRow';

export default SortableContainer(({ items, onClickEdit, onRemoveFilter, onChangeStatus }) => {
    return (
        <table className="pm-simple-table noborder border-collapse mt1">
            <caption className="sr-only">{c('Settings/filters').t('Filters')}</caption>
            <thead>
                <tr>
                    <th scope="col" className="w5">
                        <Icon name="what-is-this" />
                    </th>
                    <th scope="col" className="w45">
                        {c('Settings/filters - table').t('Name')}
                    </th>
                    <th scope="col" className="w15">
                        {c('Settings/filters - table').t('Status')}
                    </th>
                    <th scope="col" className="w30">
                        {c('Settings/filters - table').t('Action')}
                    </th>
                </tr>
            </thead>
            <tbody>
                {items.map((filter, index) => (
                    <FilterItemRow
                        key={`item-${index}`}
                        index={index}
                        filter={filter}
                        onChangeStatus={onChangeStatus}
                        onClickEdit={onClickEdit}
                        onRemoveFilter={onRemoveFilter}
                    />
                ))}
            </tbody>
        </table>
    );
});
