import React, { MouseEvent } from 'react';

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
}

const LabelStack = ({ labels, showDelete = false, isStacked = true, maxNumber }: Props) => (
    <div
        className="inline-flex mw100 flew-row flex-nowrap flex-items-center pm-badgeLabel-container stop-propagation pm-badgeLabel-container--collapsed"
        role="list"
    >
        {labels.slice(0, maxNumber).map((label: LabelDescription) => (
            <span
                className="badgeLabel flex flex-row flex-items-center"
                style={{
                    color: label.color,
                }}
                key={label.name}
                onClick={label.onClick}
                title={label.title}
            >
                <span className="pm-badgeLabel-link ellipsis mw100 color-white nodecoration">
                    {label.name}
                    {showDelete}
                    {isStacked}
                </span>
            </span>
        ))}
    </div>
);

export default LabelStack;
