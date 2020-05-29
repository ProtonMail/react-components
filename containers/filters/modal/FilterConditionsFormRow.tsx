import React, { useState, ChangeEvent } from 'react';
import { c } from 'ttag';

import { classnames, Input, Select, Radio, Tooltip, Icon, Button, useActiveBreakpoint } from 'react-components';
import { getI18n as getI18nFilter } from 'proton-shared/lib/filters/factory';

import { Condition, FilterStatement, FilterType, Comparator } from './interfaces';

interface Props {
    conditionIndex: number;
    statement: FilterStatement;
    condition: Condition;
    handleDelete: (index: number) => void;
    handleChangeType: (index: number, type: FilterType) => void;
    handleChangeComparator: (index: number, type: Comparator) => void;
    displayDelete: boolean;
}

const FilterConditionsRow = ({
    conditionIndex,
    statement,
    condition,
    handleDelete,
    handleChangeType,
    handleChangeComparator,
    displayDelete
}: Props) => {
    const { isNarrow } = useActiveBreakpoint();
    const { TYPES, COMPARATORS } = getI18nFilter();
    const typeOptions = TYPES.map(({ label: text, value }) => ({ text, value }));
    const comparatorOptions = COMPARATORS.map(({ label: text, value }) => ({ text, value }));
    const [isOpen, setIsOpen] = useState(true);
    const [withAttachment, setWithAttachment] = useState(true);
    const [tokens, setTokens] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    const { type, comparator } = condition;

    const statementLabel = statement === FilterStatement.ALL ? c('Label').t`AND` : c('Label').t`OR`;
    const label = conditionIndex === 0 ? c('Label').t`IF` : statementLabel;

    const toggleAttachment = () => setWithAttachment((state) => !state);

    const onAddNewToken = () => {
        setTokens((tokens) => [...tokens, inputValue.trim()]);
        setInputValue('');
    };

    const onRemoveToken = (i: number) => {
        setTokens((tokens) => {
            tokens.splice(i, 1);
            return [...tokens];
        });
    };

    const onChangeInputValue = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const renderAttachmentsCondition = () => {
        return (
            <div className="mt1 flex ">
                <Radio
                    id={`condition-${conditionIndex}-with-attachment`}
                    className="flex flex-nowrap pm-radio--onTop mr1"
                    checked={withAttachment}
                    onChange={toggleAttachment}
                >
                    {c('Label').t`With attachments`}
                </Radio>
                <Radio
                    id={`condition-${conditionIndex}-without-attachment`}
                    className="flex flex-nowrap pm-radio--onTop"
                    checked={!withAttachment}
                    onChange={toggleAttachment}
                >
                    {c('Label').t`Without attachments`}
                </Radio>
            </div>
        );
    };

    const renderToken = (token: string, i: number) => (
        <>
            {i > 0 && <span className="ml0-5 mr0-5">{c('Label').t`or`}</span>}
            <span
                key={`condition-${conditionIndex}-token-${i}`}
                className="badgeLabel-grey flex flex-row flex-items-center bg-global-altgrey"
                role="listitem"
            >
                <span className="ellipsis nodecoration">{token}</span>
                <button
                    type="button"
                    className="flex pm-badgeLabel-button flex-item-noshrink ml0-5"
                    onClick={() => onRemoveToken(i)}
                >
                    <Icon name="off" size={11} color="white" />
                    <span className="sr-only">{c('Action').t`Remove this label`}</span>
                </button>
            </span>
        </>
    );

    const renderGenericCondition = () => {
        return (
            <div className="mt1 flex-item-fluid">
                {tokens.length ? <div className="mb1">{tokens.map(renderToken)}</div> : null}
                <form onSubmit={onAddNewToken} className="flex flex-nowrap">
                    <span className="flex-item-fluid pr1">
                        <Input
                            onChange={onChangeInputValue}
                            type="text"
                            value={inputValue}
                            placeholder={c('Placeholder').t`Type text or keyword`}
                        />
                    </span>
                    <Button disabled={!inputValue} type="submit" className="pm-button-blue">{c('Action')
                        .t`Insert`}</Button>
                </form>
            </div>
        );
    };

    return (
        <div className="border-bottom">
            <div className="flex flex-nowrap onmobile-flex-column align-items-center pt1 pb1">
                <div
                    className={classnames(['w20 cursor-pointer', isNarrow && 'mb1'])}
                    onClick={() => setIsOpen((isOpen) => !isOpen)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen((isOpen) => !isOpen)}
                    role="button"
                    tabIndex={0}
                >
                    <Icon name="caret" className={classnames([isOpen && 'rotateX-180'])} />
                    <span className="ml0-5">{label}</span>
                </div>
                <div className="flex flex-column flex-item-fluid">
                    <div className="flex">
                        <span className="w50 pr1">
                            <Select
                                options={typeOptions}
                                value={type}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                    handleChangeType(conditionIndex, e.target.value as FilterType);
                                }}
                            />
                        </span>
                        {type && [FilterType.SUBJECT, FilterType.SENDER, FilterType.RECIPIENT].includes(type) && (
                            <span className="w50">
                                <Select
                                    options={comparatorOptions}
                                    value={comparator}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        handleChangeComparator(conditionIndex, e.target.value as Comparator);
                                    }}
                                />
                            </span>
                        )}
                    </div>

                    {isOpen && type && type !== FilterType.SELECT && (
                        <div className="flex">
                            {type === FilterType.ATTACHMENTS ? renderAttachmentsCondition() : renderGenericCondition()}
                        </div>
                    )}
                </div>
                {displayDelete && (
                    <div>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(conditionIndex);
                            }}
                            className="ml1 pm-button--for-icon"
                        >
                            <Tooltip title={c('Action').t`Delete`} className="color-global-warning">
                                <Icon name="trash" />
                            </Tooltip>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterConditionsRow;
