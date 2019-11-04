import React from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { OrderableTable, OrderableTableHeader, OrderableTableBody } from 'react-components';

import FilterItemRow from './FilterItemRow';

const FilterSortableList = ({ items, ...rest }) => (
    <OrderableTable className="noborder border-collapse mt1" {...rest}>
        <caption className="sr-only">{c('Settings/filters').t`Filters`}</caption>
        <OrderableTableHeader>
            <tr>
                <th scope="col" className="w5" />
                <th scope="col" className="w45">
                    {c('Settings/filters - table').t`Name`}
                </th>
                <th scope="col" className="w15">
                    {c('Settings/filters - table').t`Status`}
                </th>
                <th scope="col" className="w30">
                    {c('Settings/filters - table').t`Action`}
                </th>
            </tr>
        </OrderableTableHeader>
        <OrderableTableBody>
            {items.map((filter, index) => (
                <FilterItemRow key={`item-${index}`} index={index} filter={filter} />
            ))}
        </OrderableTableBody>
    </OrderableTable>
);

FilterSortableList.propTypes = {
    items: PropTypes.array.isRequired
};

export default FilterSortableList;
