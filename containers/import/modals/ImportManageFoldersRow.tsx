import React, { ChangeEvent, useState, useRef, useEffect, useMemo } from 'react';
import { c } from 'ttag';

import { Tooltip, Icon, Checkbox, InlineLinkButton, Input } from '../../../components';
import { classnames } from '../../../helpers';

import { DestinationFolder, ProviderFoldersMapItem } from '../interfaces';

interface Props extends ProviderFoldersMapItem {
    onRename: (providerName: string, destinationName: string) => void;
    onToggleCheck: (providerName: string, checked: boolean) => void;
    disabled: boolean;
}

const FOLDER_ICONS = {
    [DestinationFolder.INBOX]: 'inbox',
    [DestinationFolder.ALL_DRAFTS]: 'drafts',
    [DestinationFolder.ALL_SENT]: 'sent',
    [DestinationFolder.TRASH]: 'trash',
    [DestinationFolder.SPAM]: 'spam',
    [DestinationFolder.ARCHIVE]: 'archive',
    [DestinationFolder.SENT]: 'sent',
    [DestinationFolder.DRAFTS]: 'drafts',
    [DestinationFolder.STARRED]: 'star',
    [DestinationFolder.ALL_MAIL]: 'all-emails',
};

const DIMMED_OPACITY_CLASSNAME = 'opacity-30';

const ImportManageFoldersRow = ({
    providerName,
    recommendedFolder,
    checked,
    destinationName,
    disabled,
    onToggleCheck,
    onRename,
}: Props) => {
    const splittedSource = providerName.split('/');
    const levelSource = splittedSource.length - 1;
    const displayNameSource = splittedSource[levelSource];

    const splittedDestination = destinationName.split('/');
    const levelDestination = Math.min(splittedDestination.length - 1, 2);
    const displayNameDestination = splittedDestination.slice(levelDestination).join('/');

    const inputRef = useRef<HTMLInputElement>(null);
    const [editMode, setEditMode] = useState(false);
    const [inputValue, setInputValue] = useState(displayNameDestination);
    const initialValue = useRef<string>(inputValue);

    const toggleEditMode = (e: React.MouseEvent) => {
        if (disabled || editMode) {
            return;
        }
        if (!editMode) {
            initialValue.current = inputValue;
        }

        setEditMode(!editMode);
    };

    const handleSave = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();

        const trimmedValue = inputValue.trim();
        if (!trimmedValue) {
            console.log('empty value, should be handle onChange anyway...');
            return;
        }
        const newDestination = [...splittedDestination.slice(0, levelDestination), trimmedValue].join('/');
        onRename(providerName, newDestination);
        setEditMode(false);
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setEditMode(false);
        setInputValue(initialValue.current);
    };

    const preventDefault = (e: React.MouseEvent) => {
        if (disabled) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    useEffect(() => {
        if (editMode && inputRef && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editMode]);

    const emptyValueError: boolean = useMemo(() => !inputValue, [inputValue]);

    const renderInput = () => {
        let error;
        let item;

        if (emptyValueError) {
            error = c('Error').t`Field cannot be empty`;
        }

        if (error) {
            item = (
                <Tooltip title={error}>
                    <Icon
                        tabIndex={-1}
                        name="info"
                        className="color-global-warning inline-flex flex-self-vcenter flex-item-noshrink"
                    />
                </Tooltip>
            );
        }

        return (
            <Input
                autoFocus={true}
                required={true}
                isSubmitted={true}
                ref={inputRef}
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                onPressEnter={(e: React.KeyboardEvent) => {
                    e.preventDefault();
                    handleSave(e);
                }}
                icon={item}
                error={error}
                errorZoneClassName="hidden"
            />
        );
    };

    return (
        <li className="border-bottom">
            <label
                htmlFor={providerName}
                className={classnames([
                    'flex flex-nowrap flex-items-center pt1 pb1',
                    !checked && DIMMED_OPACITY_CLASSNAME,
                    disabled && 'cursor-default',
                ])}
                onClick={preventDefault}
            >
                <div className="flex w40 flex-nowrap flex-items-center flex-item-noshrink pr1">
                    <div style={recommendedFolder ? undefined : { marginLeft: `${levelSource}em` }}>
                        <Checkbox
                            onChange={({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
                                if (!checked && editMode) {
                                    setEditMode(false);
                                }
                                onToggleCheck(providerName, checked);
                            }}
                            id={providerName}
                            checked={checked}
                            disabled={disabled}
                        />
                    </div>
                    <div title={displayNameSource} className="ml0-5 flex-item-fluid-auto ellipsis">
                        {displayNameSource}
                    </div>
                </div>

                <div className="flex w40 pr1">
                    <div
                        className="flex flex-nowrap flex-items-center flex-item-fluid-auto"
                        style={recommendedFolder ? undefined : { marginLeft: `${levelDestination}em` }}
                    >
                        <Icon
                            name={recommendedFolder ? FOLDER_ICONS[recommendedFolder] : 'folder'}
                            className="flex-item-noshrink"
                        />
                        <div className="ml0-5 flex-item-fluid-auto ellipsis">
                            {editMode && !disabled ? renderInput() : <span>{displayNameDestination}</span>}
                        </div>
                    </div>
                </div>

                {!recommendedFolder && (
                    <div className="flex w20 flex-items-center" onClick={preventDefault}>
                        {editMode && !disabled ? (
                            <>
                                <InlineLinkButton
                                    onClick={handleSave}
                                    className={classnames(['p0-5', emptyValueError && DIMMED_OPACITY_CLASSNAME])}
                                    aria-disabled={emptyValueError}
                                    disabled={emptyValueError}
                                >
                                    {c('Action').t`Save`}
                                </InlineLinkButton>
                                <InlineLinkButton onClick={handleCancel} className="ml0-5 p0-5">
                                    {c('Action').t`Cancel`}
                                </InlineLinkButton>
                            </>
                        ) : (
                            <InlineLinkButton
                                aria-disabled={!checked}
                                disabled={!checked}
                                tabIndex={disabled ? -1 : 0}
                                onClick={toggleEditMode}
                                className="p0-5"
                            >
                                {c('Action').t`Rename`}
                            </InlineLinkButton>
                        )}
                    </div>
                )}
            </label>
        </li>
    );
};

export default ImportManageFoldersRow;
