import React, { ChangeEvent, useState, useRef, useEffect, useMemo } from 'react';
import { c } from 'ttag';

import { Tooltip, Icon, Checkbox, InlineLinkButton, Input } from '../../../components';
import { classnames } from '../../../helpers';

import { DestinationFolder, ProviderFolderMap, ProviderFoldersMapItem } from '../interfaces';

interface Props extends ProviderFoldersMapItem {
    providerFoldersMap: ProviderFolderMap;
    onRename: (providerName: string, destinationName: string) => void;
    onToggleCheck: (providerName: string, checked: boolean) => void;
    disabled: boolean;
    separator: string;
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

const ERRORS = {
    nameTooLongError: c('Error').t`Folder name is too long. Please use a different name.`,
    emptyValueError: c('Error').t`Folder name cannot be empty`,
};

const WARNINGS = {
    mergeWarning: c('Warning').t`This folder already exists. Mails will be imported in the existing folder`,
};

const DIMMED_OPACITY_CLASSNAME = 'opacity-30';

const ImportManageFoldersRow = ({
    providerFoldersMap,
    providerPath,
    recommendedFolder,
    checked,
    destinationPath,
    disabled,
    onToggleCheck,
    onRename,
    separator,
}: Props) => {
    const splittedSource = providerPath.split(separator);
    const levelSource = splittedSource.length - 1;
    const providerName = splittedSource[levelSource];

    const splittedDestination = destinationPath.split('/');
    const levelDestination = Math.min(splittedDestination.length - 1, 2);
    const destinationName = splittedDestination.slice(levelDestination).join('/');

    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState(destinationName);
    const initialValue = useRef<string>(inputValue);

    const emptyValueError = useMemo(() => !inputValue || !inputValue.trim(), [inputValue]);

    const nameTooLongError = useMemo(() => {
        const newPath = [...splittedDestination.slice(0, levelDestination), inputValue.trim()].join('/');
        return newPath.length > 100;
    }, [destinationPath, inputValue]);

    const mergeWarning = useMemo(() => {
        const newPath = [...splittedDestination.slice(0, levelDestination), inputValue.trim()].join('/');
        return Object.values(providerFoldersMap).some((f) => {
            return f.providerPath !== providerPath && f.destinationPath === newPath;
        });
    }, [providerFoldersMap, inputValue]);

    const hasError = emptyValueError || nameTooLongError;

    const [editMode, setEditMode] = useState(nameTooLongError);

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
        const newPath = [...splittedDestination.slice(0, levelDestination), inputValue.trim()].join('/');
        setEditMode(false);
        onRename(providerPath, newPath);
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

    const renderInput = () => {
        let error;
        let warning;
        let item;

        if (emptyValueError) {
            error = ERRORS.emptyValueError;
        }
        if (nameTooLongError) {
            error = ERRORS.nameTooLongError;
        }

        if (warning) {
            item = (
                <Tooltip title={WARNINGS.mergeWarning} className="tooltip--attention">
                    <Icon
                        tabIndex={-1}
                        name="info"
                        className="color-global-attention inline-flex flex-self-vcenter flex-item-noshrink"
                    />
                </Tooltip>
            );
        }

        if (error) {
            item = (
                <Tooltip title={error} className="tooltip--warning">
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
                autoFocus
                required
                isSubmitted
                ref={inputRef}
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                onPressEnter={(e: React.KeyboardEvent) => {
                    e.preventDefault();
                    if (emptyValueError || nameTooLongError) {
                        return;
                    }
                    handleSave(e);
                }}
                icon={item}
                error={error || warning}
                errorZoneClassName="hidden"
            />
        );
    };

    useEffect(() => {
        if (editMode && inputRef && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editMode]);

    return (
        <li className="border-bottom">
            <label
                htmlFor={providerPath}
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
                                onToggleCheck(providerPath, checked);
                            }}
                            id={providerPath}
                            checked={checked}
                            disabled={disabled}
                        />
                    </div>
                    <div title={providerName} className="ml0-5 flex-item-fluid-auto ellipsis">
                        {providerName}
                    </div>
                </div>

                <div className="flex w40 pr1">
                    <div
                        className="flex flex-nowrap flex-items-center flex-item-fluid-auto"
                        style={recommendedFolder ? undefined : { marginLeft: `${levelDestination}em` }}
                    >
                        <Icon
                            name={recommendedFolder ? FOLDER_ICONS[recommendedFolder] : 'folder'}
                            className={classnames([
                                'flex-item-noshrink',
                                nameTooLongError && 'color-global-warning',
                                mergeWarning && 'color-global-attention',
                            ])}
                        />
                        <div
                            className={classnames([
                                'ml0-5 w100 flex flex-nowrap',
                                nameTooLongError && 'color-global-warning',
                                mergeWarning && 'color-global-attention',
                            ])}
                        >
                            {editMode && !disabled ? (
                                renderInput()
                            ) : (
                                <>
                                    <span
                                        className={classnames([
                                            'flex-item-fluid-auto ellipsis',
                                            (nameTooLongError || mergeWarning) && 'bold',
                                        ])}
                                    >
                                        {destinationName}
                                    </span>
                                    {nameTooLongError && (
                                        <Tooltip
                                            title={ERRORS.nameTooLongError}
                                            className="flex-item-noshrink tooltip--warning"
                                        >
                                            <Icon
                                                tabIndex={-1}
                                                name="info"
                                                className="color-global-warning inline-flex flex-self-vcenter flex-item-noshrink"
                                            />
                                        </Tooltip>
                                    )}
                                    {mergeWarning && (
                                        <Tooltip
                                            title={WARNINGS.mergeWarning}
                                            className="flex-item-noshrink tooltip--attention"
                                        >
                                            <Icon
                                                tabIndex={-1}
                                                name="info"
                                                className="color-global-attention inline-flex flex-self-vcenter flex-item-noshrink"
                                            />
                                        </Tooltip>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {!recommendedFolder && (
                    <div className="flex w20 flex-items-center" onClick={preventDefault}>
                        {editMode && !disabled ? (
                            <>
                                <InlineLinkButton
                                    onClick={handleSave}
                                    className={classnames(['p0-5', hasError && DIMMED_OPACITY_CLASSNAME])}
                                    aria-disabled={hasError}
                                    disabled={hasError}
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
