import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'proton-shared/lib/helpers/function';
import { OrderableTableRow, Icon } from 'react-components';

import ActionsLabel from './ActionsLabel';

function LabelItem({ label, onEditLabel = noop, onRemoveLabel = noop, ...rest }) {
    const { Name, Color } = label;

    const handleChange = (type, label) => {
        type === 'update' && onEditLabel(label);
        type === 'remove' && onRemoveLabel(label);
    };

    return (
        <OrderableTableRow
            cells={[
                <div key="0" className="flex flex-spacebetween">
                    <div className="flex flex-nowrap">
                        <Icon
                            name="label"
                            style={{ fill: Color }}
                            className="icon-16p flex-item-noshrink mr1 mtauto mbauto"
                        />
                        <span className="ellipsis" data-test-id="folders/labels:item-name">
                            {Name}
                        </span>
                    </div>
                    <ActionsLabel label={label} onChange={handleChange} />
                </div>
            ]}
            {...rest}
        />
    );
}

LabelItem.propTypes = {
    label: PropTypes.object.isRequired,
    onEditLabel: PropTypes.func,
    onRemoveLabel: PropTypes.func,
    index: PropTypes.number.isRequired
};

export default LabelItem;
