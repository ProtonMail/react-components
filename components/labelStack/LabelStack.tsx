import React, { MouseEvent } from 'react';
import { c } from 'ttag';
import { classnames } from '../../helpers/component';
import Icon from '../icon/Icon';

export interface LabelDescription {
    name: string;
    color?: string;
    title?: string;
    onClick?: (event: MouseEvent) => void;
    onDelete?: (event: MouseEvent) => void;
}

interface Props {
    labels: LabelDescription[];
    showDelete?: boolean;
    isStacked?: boolean;
    maxNumber?: number;
    className?: string;
}

const LabelStack = ({ labels, showDelete = true, isStacked = false, maxNumber, className }: Props) => (
    <ul
        className={classnames([
            'label-stack unstyled m0 inline-flex flew-row flex-items-center stop-propagation',
            isStacked && 'is-stacked',
            className,
        ])}
    >
        {labels.slice(0, maxNumber).map((label: LabelDescription) => (
            <li
                className="label-stack-item flex flex-row flex-items-center flex-justify-start flex-nowrap"
                style={{ '--color': label.color }}
                key={label.name}
            >
                <button
                    type="button"
                    className="label-stack-item-button ellipsis"
                    onClick={label.onClick}
                    title={label.title}
                >
                    {label.name}
                </button>

                {showDelete && (
                    <button
                        type="button"
                        className="label-stack-item-delete flex-item-noshrink"
                        onClick={label.onDelete}
                        title={`${c('Action').t`Remove`} ${label.title}`}
                    >
                        <Icon
                            name="close"
                            size={12}
                            className="label-stack-item-delete-icon"
                            alt={c('Action').t`Remove`}
                        />
                    </button>
                )}
            </li>
        ))}
    </ul>
);

export default LabelStack;
