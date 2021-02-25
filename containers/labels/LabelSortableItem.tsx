import React from 'react';

import { noop } from 'proton-shared/lib/helpers/function';
import { Label } from 'proton-shared/lib/interfaces/Label';

import { OrderableTableRow, Icon } from '../../components';

import ActionsLabel from './ActionsLabel';

interface Props {
    label: Label;
    onEditLabel: Function;
    onRemoveLabel: Function;
    index: number;
}

function LabelItem({ label, onEditLabel = noop, onRemoveLabel = noop, ...rest }: Props) {
    const { Name, Color } = label;

    const handleChange = (type: 'update' | 'remove', label: Label) => {
        if (type === 'update') {
            onEditLabel(label);
        } else if (type === 'remove') {
            onRemoveLabel(label);
        }
    };

    return (
        <OrderableTableRow
            cells={[
                <div key="0" className="flex flex-nowrap">
                    <Icon
                        name="label"
                        style={{ fill: Color }}
                        className="icon-16p flex-item-noshrink mr1 mtauto mbauto"
                    />
                    <span className="text-ellipsis" title={Name} data-test-id="folders/labels:item-name">
                        {Name}
                    </span>
                </div>,
                <ActionsLabel key="2" label={label} onChange={handleChange} />,
            ]}
            {...rest}
        />
    );
}

export default LabelItem;
